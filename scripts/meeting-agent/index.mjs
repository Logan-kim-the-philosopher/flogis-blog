#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawn, spawnSync } from 'node:child_process';
import { createClient } from '@sanity/client';
import {
  CATEGORY_CONFIG,
  MeetingAgentResultSchema,
  buildSanityDocument,
  dateFromCreationTime,
  isAudioPath,
  isTextPath,
  normalizeName,
  normalizeTranscriptContent,
  parsePiEventStream,
  renderMeetingMarkdown,
  resolvePublishedDate,
  validateRenderedMarkdown
} from './lib.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '../..');
const runtimeRoot = resolve(projectRoot, '.meeting-agent');
const DEFAULT_MODEL = 'openai-codex/gpt-5.4-mini';

loadProjectEnv();

function loadProjectEnv() {
  try {
    process.loadEnvFile(resolve(projectRoot, '.env'));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function usage() {
  return `회의 원본 정리·발행 에이전트

사용법:
  npm run meeting:prepare -- <원본.txt|원본.md|오디오파일> [옵션]
  npm run meeting:resume -- <run-directory> [옵션]
  npm run meeting:publish -- <run-directory> --confirm <slug|document-id> [옵션]
  npm run meeting:doctor
  npm run meeting:setup -- [tiny|base|small|medium|large-v3|large-v3-turbo]

prepare 옵션:
  --date YYYY-MM-DD          발행일을 명시적으로 고정
  --title TEXT               Pi가 만든 제목을 덮어쓰기
  --slug ASCII-KEBAB         Pi가 만든 slug를 덮어쓰기
  --category CATEGORY        project_meeting | study_session | conversation | team_operations
  --people IDS               person 문서 ID를 쉼표로 지정
  --model MODEL              Pi 모델 (기본: ${DEFAULT_MODEL})
  --thinking LEVEL           Pi thinking 수준 (기본: medium)
  --whisper-model PATH       오디오 전사용 ggml 모델
  --transcript PATH          클로바 TXT/JSON 전사본 사용(오디오는 원본으로 보존)
  --language CODE            Whisper 언어 (기본: ko)
  --output DIRECTORY         run 결과 디렉터리 직접 지정
  --offline                  Sanity 사람 조회 없이 preview 생성
  --structured-input FILE    테스트용 Pi 구조화 JSON 입력

publish 옵션:
  --confirm VALUE            preview의 slug 또는 document ID와 정확히 같아야 함
  --people IDS               preview에서 해결하지 못한 person ID 지정
  --validate-only            참조·중복만 검사하고 Sanity에는 쓰지 않음

resume 옵션:
  --date YYYY-MM-DD          실패한 run의 날짜를 확정하고 재전사 없이 복구
  --people IDS               person 문서 ID를 쉼표로 지정
  --offline                  Sanity 사람 조회 없이 preview 복구
`;
}

function parseCli(argv) {
  const args = [...argv];
  const supportedCommands = new Set(['prepare', 'resume', 'publish', 'doctor']);
  const command = supportedCommands.has(args[0]) ? args.shift() : 'prepare';
  const parsed = parseArgs({
    args,
    allowPositionals: true,
    strict: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      date: { type: 'string' },
      title: { type: 'string' },
      slug: { type: 'string' },
      category: { type: 'string' },
      people: { type: 'string' },
      model: { type: 'string' },
      thinking: { type: 'string' },
      'whisper-model': { type: 'string' },
      transcript: { type: 'string' },
      language: { type: 'string' },
      output: { type: 'string' },
      offline: { type: 'boolean' },
      'structured-input': { type: 'string' },
      confirm: { type: 'string' },
      'validate-only': { type: 'boolean' }
    }
  });

  return { command, ...parsed };
}

function commandExists(command) {
  return spawnSync('/usr/bin/which', [command], { stdio: 'ignore' }).status === 0;
}

async function pathExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function absolutePath(filePath) {
  return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
}

function splitPeople(value) {
  return [...new Set(String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean))];
}

function timestampId() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function safeBaseName(filePath) {
  return basename(filePath, extname(filePath))
    .normalize('NFKC')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'meeting-source';
}

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function runProcess(command, args, options = {}) {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || projectRoot,
      env: { ...process.env, ...(options.env || {}) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const stdout = [];
    const stderr = [];

    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', (code, signal) => {
      const result = {
        code,
        signal,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8')
      };

      if (code !== 0) {
        const exitLabel = signal ? `signal ${signal}` : `exit ${code}`;
        const detail = result.stderr.trim() || result.stdout.trim() || exitLabel;
        reject(new Error(`${command} 실행 실패 (${exitLabel}): ${detail}`));
        return;
      }

      resolvePromise(result);
    });
  });
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJsonIfExists(filePath) {
  if (!await pathExists(filePath)) return null;
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeProgress(runDir, phase, message, extra = {}) {
  await writeJson(resolve(runDir, 'progress.json'), {
    version: 1,
    phase,
    message,
    updatedAt: new Date().toISOString(),
    ...extra
  });
}

async function patchManifest(runDir, patch) {
  const path = resolve(runDir, 'run.json');
  const current = await readJsonIfExists(path) || { version: 1, runDir };
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await writeJson(path, next);
  return next;
}

async function probeAudioMetadata(inputPath) {
  if (!commandExists('ffprobe')) return { available: false, creationTime: null, publishedDate: null, durationSeconds: null };
  try {
    const result = await runProcess('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration:format_tags=creation_time,date',
      '-of', 'json',
      inputPath
    ]);
    const parsed = JSON.parse(result.stdout);
    const tags = parsed?.format?.tags || {};
    const creationTime = tags.creation_time || tags.CREATION_TIME || tags.date || null;
    const duration = Number(parsed?.format?.duration);
    return {
      available: true,
      creationTime,
      publishedDate: dateFromCreationTime(creationTime),
      durationSeconds: Number.isFinite(duration) ? duration : null
    };
  } catch (error) {
    return {
      available: true,
      creationTime: null,
      publishedDate: null,
      durationSeconds: null,
      warning: `오디오 메타데이터 확인 실패: ${error.message}`
    };
  }
}

function isTranscriptPath(filePath) {
  return /\.(json|md|markdown|txt)$/i.test(filePath);
}

function findWhisperModel(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.MEETING_AGENT_WHISPER_MODEL,
    resolve(runtimeRoot, 'models/ggml-large-v3-turbo.bin'),
    resolve(runtimeRoot, 'models/ggml-large-v3.bin'),
    resolve(runtimeRoot, 'models/ggml-medium.bin'),
    resolve(homedir(), 'Library/Caches/whisper.cpp/ggml-large-v3-turbo.bin')
  ].filter(Boolean).map(absolutePath);

  return candidates;
}

async function transcribeAudio(inputPath, runDir, values) {
  if (!commandExists('ffmpeg') || !commandExists('whisper-cli')) {
    throw new Error('오디오 처리에는 ffmpeg와 whisper-cli가 필요합니다. `npm run meeting:doctor`로 확인하세요.');
  }

  const modelCandidates = findWhisperModel(values['whisper-model']);
  let modelPath = null;
  for (const candidate of modelCandidates) {
    if (await pathExists(candidate)) {
      modelPath = candidate;
      break;
    }
  }

  if (!modelPath) {
    throw new Error('Whisper ggml 모델을 찾지 못했습니다. `npm run meeting:setup -- large-v3-turbo`를 실행하거나 --whisper-model PATH를 지정하세요.');
  }

  const normalizedAudio = resolve(runDir, 'audio-16k-mono.wav');
  await writeProgress(runDir, 'normalizing_audio', '오디오를 16 kHz mono WAV로 변환하고 있습니다.');
  await runProcess('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', inputPath,
    '-ar', '16000',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    normalizedAudio
  ]);

  const outputBase = resolve(runDir, 'transcript');
  await writeProgress(runDir, 'transcribing', 'Whisper로 음성을 전사하고 있습니다.', {
    engine: 'whisper-cli',
    model: basename(modelPath)
  });
  const whisperResult = await runProcess('whisper-cli', [
    '-m', modelPath,
    '-f', normalizedAudio,
    '-l', values.language || 'ko',
    '-otxt',
    '-oj',
    '-of', outputBase,
    '-np'
  ]);
  await writeFile(resolve(runDir, 'whisper.log'), whisperResult.stderr, 'utf8');

  const transcriptPath = `${outputBase}.txt`;
  if (!await pathExists(transcriptPath)) {
    throw new Error('Whisper가 transcript.txt를 생성하지 못했습니다. whisper.log를 확인하세요.');
  }

  await writeProgress(runDir, 'transcribed', '음성 전사가 끝났습니다. Pi 구조화를 준비합니다.');

  return {
    transcript: await readFile(transcriptPath, 'utf8'),
    transcriptPath,
    modelPath,
    normalizedAudio
  };
}

async function createRunDirectory(inputPath, outputOption) {
  const runDir = outputOption
    ? absolutePath(outputOption)
    : resolve(process.env.MEETING_AGENT_OUTPUT_DIR || resolve(runtimeRoot, 'runs'), `${timestampId()}-${safeBaseName(inputPath)}`);
  await mkdir(runDir, { recursive: true });
  return runDir;
}

async function callPi(requestPath, runDir, values) {
  const piBin = process.env.MEETING_AGENT_PI_BIN || 'pi';
  if (!commandExists(piBin)) throw new Error(`Pi 실행 파일을 찾지 못했습니다: ${piBin}`);

  const systemPrompt = await readFile(resolve(scriptDir, 'system-prompt.md'), 'utf8');
  const model = values.model || process.env.MEETING_AGENT_PI_MODEL || DEFAULT_MODEL;
  const args = [
    '--model', model,
    '--thinking', values.thinking || 'medium',
    '--mode', 'json',
    '--print',
    '--no-session',
    '--no-tools',
    '--no-extensions',
    '--no-skills',
    '--no-prompt-templates',
    '--no-context-files',
    '--system-prompt', systemPrompt,
    `@${requestPath}`
  ];
  const result = await runProcess(piBin, args, { cwd: projectRoot });
  const eventPath = resolve(runDir, 'pi-events.jsonl');
  await writeFile(eventPath, result.stdout, 'utf8');
  if (result.stderr.trim()) await writeFile(resolve(runDir, 'pi-stderr.log'), result.stderr, 'utf8');
  return { raw: parsePiEventStream(result.stdout), model, eventPath };
}

function applyOverrides(raw, values) {
  const next = structuredClone(raw);
  next.metadata ||= {};
  next.classification ||= {};

  if (values.date) next.metadata.publishedAt = values.date;
  if (values.title) next.metadata.title = values.title;
  if (values.slug) next.metadata.slug = values.slug;
  if (values.category) next.classification.category = values.category;

  return next;
}

function sanityConfig({ requireToken = false } = {}) {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
  const apiVersion = process.env.SANITY_API_VERSION || '2025-08-22';
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId) throw new Error('SANITY_PROJECT_ID가 필요합니다. .env 또는 환경변수를 확인하세요.');
  if (requireToken && !token) throw new Error('발행에는 쓰기 권한이 있는 SANITY_API_TOKEN이 필요합니다.');
  return { projectId, dataset, apiVersion, token };
}

function sanityClient(options = {}) {
  const config = sanityConfig(options);
  return createClient({
    ...config,
    token: config.token || undefined,
    useCdn: false,
    perspective: 'raw'
  });
}

async function fetchPeople(client) {
  return await client.fetch(`*[_type == "person" && !(_id in path("drafts.**"))]{_id,name,"slug":slug.current}`);
}

async function resolvePersonIds(result, explicitIds, client) {
  const people = await fetchPeople(client);
  const byId = new Map(people.map((person) => [person._id, person]));

  if (explicitIds.length) {
    const missing = explicitIds.filter((id) => !byId.has(id));
    if (missing.length) throw new Error(`Sanity person 문서를 찾지 못했습니다: ${missing.join(', ')}`);
    return { ids: explicitIds, unresolved: [] };
  }

  const ids = [];
  const unresolved = [];
  for (const requested of result.metadata.people) {
    if (requested.name === '발화자 미상' || requested.name === '미정') continue;
    const needle = normalizeName(requested.name);
    const matches = people.filter((person) => {
      return normalizeName(person.name) === needle || normalizeName(person.slug) === needle || normalizeName(person._id) === needle;
    });
    if (matches.length === 1) ids.push(matches[0]._id);
    else unresolved.push(requested.name);
  }

  return { ids: [...new Set(ids)], unresolved };
}

async function finalizePreview({ runDir, structured, markdown, values, sourceInfo, sourceMetadata, dateResolution, piResult, transcription, warnings = [] }) {
  const explicitPersonIds = splitPeople(values.people);
  let resolved = {
    ids: explicitPersonIds,
    unresolved: explicitPersonIds.length ? [] : structured.metadata.people.map((person) => person.name)
  };
  const finalWarnings = [...warnings];
  await writeProgress(runDir, 'resolving_people', 'Sanity 사람 문서 연결을 확인하고 있습니다.');
  if (!values.offline) {
    try {
      resolved = await resolvePersonIds(structured, explicitPersonIds, sanityClient());
    } catch (error) {
      if (explicitPersonIds.length) throw error;
      finalWarnings.push(`Sanity 사람 자동 연결 실패: ${error.message}`);
    }
  }
  if (resolved.unresolved.length) finalWarnings.push(`확인되지 않은 사람: ${resolved.unresolved.join(', ')}`);
  if (!resolved.ids.length) finalWarnings.push('발행 전 최소 1개의 person 문서 연결이 필요합니다. --people 옵션을 사용하세요.');

  const document = buildSanityDocument(structured, markdown, resolved.ids);
  const documentPath = resolve(runDir, 'sanity-document.json');
  await writeJson(documentPath, document);
  const manifest = await patchManifest(runDir, {
    status: 'preview',
    completedAt: new Date().toISOString(),
    source: sourceInfo,
    sourceMetadata,
    dateResolution,
    classification: structured.classification,
    pi: piResult,
    transcription,
    personIds: resolved.ids,
    unresolvedPeople: resolved.unresolved,
    publishable: resolved.ids.length > 0 && finalWarnings.length === 0,
    warnings: finalWarnings,
    lastError: null,
    recoverable: false,
    files: {
      structured: 'structured.json',
      markdown: 'post.md',
      sanityDocument: basename(documentPath)
    }
  });
  await writeProgress(runDir, 'preview_ready', '회의 preview가 준비됐습니다.', { documentId: document._id });
  return { document, manifest, warnings: finalWarnings };
}

async function prepare(inputValue, values) {
  if (!inputValue) throw new Error(`원본 파일 경로가 필요합니다.\n\n${usage()}`);
  const inputPath = absolutePath(inputValue);
  const inputStat = await stat(inputPath);
  if (!inputStat.isFile()) throw new Error(`원본 경로가 파일이 아닙니다: ${inputPath}`);
  if (!isTextPath(inputPath) && !isAudioPath(inputPath) && !/\.json$/i.test(inputPath)) {
    throw new Error('지원 형식은 txt, md, markdown, Clova JSON, aac, aif, aiff, flac, m4a, mp3, mp4, ogg, opus, wav, webm입니다.');
  }
  if (values.date && !dateFromCreationTime(values.date)) throw new Error('--date는 실제 달력에 존재하는 YYYY-MM-DD여야 합니다.');
  if (values.transcript && !isAudioPath(inputPath)) throw new Error('--transcript는 오디오 원본과 함께 지정하세요. 전사본만 있다면 그 TXT/JSON을 원본 경로로 사용하면 됩니다.');

  const runDir = await createRunDirectory(inputPath, values.output);
  const originalName = basename(inputPath);
  const preservedSource = resolve(runDir, `source${extname(inputPath).toLowerCase()}`);
  await copyFile(inputPath, preservedSource);
  const sourceMetadata = isAudioPath(inputPath) ? await probeAudioMetadata(inputPath) : {
    available: false,
    creationTime: null,
    publishedDate: null,
    durationSeconds: null
  };
  const initialDateResolution = resolvePublishedDate({
    explicitDate: values.date,
    sourceMetadataDate: sourceMetadata.publishedDate
  });
  let inputKind = isAudioPath(inputPath) ? 'audio' : (/\.json$/i.test(inputPath) ? 'external-transcript' : 'text');
  const sourceInfo = {
    originalName,
    inputKind,
    sourceSha256: await sha256(inputPath),
    preservedSource: basename(preservedSource)
  };
  await writeJson(resolve(runDir, 'run.json'), {
    version: 1,
    status: 'processing',
    createdAt: new Date().toISOString(),
    runDir,
    source: sourceInfo,
    sourceMetadata,
    dateResolution: initialDateResolution,
    publishable: false,
    warnings: sourceMetadata.warning ? [sourceMetadata.warning] : []
  });
  await writeProgress(runDir, 'preflight', initialDateResolution.date
    ? `회의 날짜 ${initialDateResolution.date}를 ${initialDateResolution.source === 'explicit' ? '명시값' : '오디오 메타데이터'}에서 확인했습니다.`
    : '원본과 날짜 메타데이터를 확인했습니다.');

  try {
    let transcript;
    let transcription;
    if (values.transcript) {
      const externalPath = absolutePath(values.transcript);
      const externalStat = await stat(externalPath);
      if (!externalStat.isFile() || !isTranscriptPath(externalPath)) throw new Error('--transcript는 Clova TXT, Markdown 또는 JSON 파일이어야 합니다.');
      await writeProgress(runDir, 'loading_transcript', '클로바 전사본을 정규화하고 있습니다.');
      const normalized = normalizeTranscriptContent(await readFile(externalPath, 'utf8'), externalPath);
      const preservedTranscript = resolve(runDir, `external-transcript${extname(externalPath).toLowerCase()}`);
      await copyFile(externalPath, preservedTranscript);
      transcript = normalized.text;
      inputKind = 'external-transcript';
      sourceInfo.inputKind = inputKind;
      transcription = {
        engine: 'external-transcript',
        provider: 'clova-or-user',
        originalTranscriptName: basename(externalPath),
        preservedTranscript: basename(preservedTranscript),
        format: normalized.format,
        segmentCount: normalized.segmentCount,
        transcriptFile: 'transcript.txt'
      };
      await writeFile(resolve(runDir, 'transcript.txt'), transcript, 'utf8');
    } else if (inputKind === 'audio') {
      const local = await transcribeAudio(inputPath, runDir, values);
      transcript = local.transcript;
      transcription = {
        engine: 'whisper-cli',
        modelPath: local.modelPath,
        transcriptFile: basename(local.transcriptPath)
      };
    } else {
      const normalized = normalizeTranscriptContent(await readFile(inputPath, 'utf8'), inputPath);
      transcript = normalized.text;
      transcription = {
        engine: inputKind === 'external-transcript' ? 'external-transcript' : 'direct-text',
        provider: inputKind === 'external-transcript' ? 'clova-or-user' : undefined,
        format: normalized.format,
        segmentCount: normalized.segmentCount,
        transcriptFile: 'transcript.txt'
      };
      await writeFile(resolve(runDir, 'transcript.txt'), transcript, 'utf8');
    }
    if (!transcript.trim()) throw new Error('원본 또는 전사문이 비어 있습니다.');

    const effectiveValues = { ...values, date: initialDateResolution.date || undefined };
    const requestPath = resolve(runDir, 'pi-request.md');
    const request = [
      '# 실행 메타데이터',
      '',
      `- 원본 파일명: ${originalName}`,
      `- 입력 방식: ${inputKind === 'audio' ? '오디오 Whisper 전사' : inputKind === 'external-transcript' ? '외부 전사본(클로바 등)' : '텍스트 직접 입력'}`,
      `- 날짜 확정값: ${effectiveValues.date || '없음'}`,
      `- 날짜 출처: ${initialDateResolution.source}`,
      `- 원본 creation_time: ${sourceMetadata.creationTime || '없음'}`,
      `- 제목 강제값: ${values.title || '없음'}`,
      `- slug 강제값: ${values.slug || '없음'}`,
      `- 분류 강제값: ${values.category || '없음'}`,
      '',
      '# 원본 또는 전사문',
      '',
      transcript
    ].join('\n');
    await writeFile(requestPath, request, 'utf8');

    await writeProgress(runDir, 'structuring', 'Pi가 안건·의견·결정·행동 항목을 구조화하고 있습니다.');
    let piResult;
    if (values['structured-input']) {
      const fixturePath = absolutePath(values['structured-input']);
      piResult = { raw: JSON.parse(await readFile(fixturePath, 'utf8')), model: 'structured-input', eventPath: null };
    } else {
      piResult = await callPi(requestPath, runDir, values);
    }

    const candidate = applyOverrides(piResult.raw, effectiveValues);
    const finalDateResolution = resolvePublishedDate({
      explicitDate: values.date,
      sourceMetadataDate: sourceMetadata.publishedDate,
      structuredDate: candidate.metadata?.publishedAt
    });
    if (finalDateResolution.date) candidate.metadata.publishedAt = finalDateResolution.date;
    const structured = MeetingAgentResultSchema.parse(candidate);
    await writeJson(resolve(runDir, 'structured.json'), structured);

    await writeProgress(runDir, 'rendering', '블로그용 회의 문서를 렌더링하고 있습니다.');
    const markdown = renderMeetingMarkdown(structured, sourceInfo);
    validateRenderedMarkdown(markdown);
    await writeFile(resolve(runDir, 'post.md'), markdown, 'utf8');

    const piManifest = { model: piResult.model, eventFile: piResult.eventPath ? basename(piResult.eventPath) : null };
    if (!structured.metadata.publishedAt) {
      const message = `발행일을 확정할 수 없습니다. 재전사 없이 \`npm run meeting:resume -- ${JSON.stringify(runDir)} --date YYYY-MM-DD\`로 이어가세요.`;
      await patchManifest(runDir, {
        status: 'needs_input',
        source: sourceInfo,
        sourceMetadata,
        dateResolution: finalDateResolution,
        classification: structured.classification,
        pi: piManifest,
        transcription,
        publishable: false,
        recoverable: true,
        lastError: message,
        files: { structured: 'structured.json', markdown: 'post.md', sanityDocument: null }
      });
      await writeProgress(runDir, 'needs_input', '날짜 입력이 필요합니다. 기존 전사·구조화 결과는 보존됐습니다.');
      throw new Error(message);
    }

    const finalized = await finalizePreview({
      runDir,
      structured,
      markdown,
      values,
      sourceInfo,
      sourceMetadata,
      dateResolution: finalDateResolution,
      piResult: piManifest,
      transcription,
      warnings: sourceMetadata.warning ? [sourceMetadata.warning] : []
    });

    console.log(`PREVIEW 생성 완료: ${runDir}`);
    console.log(`날짜: ${structured.metadata.publishedAt} (${finalDateResolution.source})`);
    console.log(`분류: ${CATEGORY_CONFIG[structured.classification.category].label}`);
    console.log(`문서: ${finalized.document._id}`);
    console.log(`검토 파일: ${resolve(runDir, 'post.md')}`);
    finalized.warnings.forEach((warning) => console.log(`주의: ${warning}`));
    console.log(`발행 명령: npm run meeting:publish -- ${JSON.stringify(runDir)} --confirm ${structured.metadata.slug}`);
  } catch (error) {
    const current = await readJsonIfExists(resolve(runDir, 'run.json'));
    if (current?.status !== 'needs_input') {
      await patchManifest(runDir, {
        status: 'error',
        publishable: false,
        recoverable: await pathExists(resolve(runDir, 'structured.json')),
        lastError: error.message
      });
      await writeProgress(runDir, 'error', error.message);
    }
    throw error;
  }
}

async function inferRunSource(runDir, manifest) {
  if (manifest?.source?.preservedSource) {
    const preservedPath = resolve(runDir, manifest.source.preservedSource);
    return { sourceInfo: manifest.source, preservedPath };
  }

  const entries = await readdir(runDir);
  const preservedName = entries.find((name) => /^source\./i.test(name));
  if (!preservedName) throw new Error('run 디렉터리에서 보존된 source.* 원본을 찾지 못했습니다.');
  const preservedPath = resolve(runDir, preservedName);
  let originalName = preservedName;
  try {
    const request = await readFile(resolve(runDir, 'pi-request.md'), 'utf8');
    originalName = request.match(/^- 원본 파일명:\s*(.+)$/m)?.[1]?.trim() || originalName;
  } catch {
    // 구버전 run에는 요청 파일이 없을 수 있다.
  }
  const inputKind = isAudioPath(preservedPath) ? 'audio' : (/\.json$/i.test(preservedPath) ? 'external-transcript' : 'text');
  return {
    preservedPath,
    sourceInfo: {
      originalName,
      inputKind,
      sourceSha256: await sha256(preservedPath),
      preservedSource: preservedName
    }
  };
}

async function resumePreview(runValue, values) {
  if (!runValue) throw new Error(`복구할 run 디렉터리가 필요합니다.\n\n${usage()}`);
  if (values.date && !dateFromCreationTime(values.date)) throw new Error('--date는 실제 달력에 존재하는 YYYY-MM-DD여야 합니다.');
  const runDir = absolutePath(runValue);
  const runStat = await stat(runDir);
  if (!runStat.isDirectory()) throw new Error(`run 경로가 디렉터리가 아닙니다: ${runDir}`);
  const previousManifest = await readJsonIfExists(resolve(runDir, 'run.json'));
  if (previousManifest?.status === 'published') throw new Error(`이미 발행된 run입니다: ${previousManifest.publishedDocumentId}`);
  const { sourceInfo, preservedPath } = await inferRunSource(runDir, previousManifest);
  const sourceMetadata = previousManifest?.sourceMetadata || (isAudioPath(preservedPath)
    ? await probeAudioMetadata(preservedPath)
    : { available: false, creationTime: null, publishedDate: null, durationSeconds: null });
  const candidate = applyOverrides(
    JSON.parse(await readFile(resolve(runDir, 'structured.json'), 'utf8')),
    values
  );
  const dateResolution = resolvePublishedDate({
    explicitDate: values.date,
    sourceMetadataDate: sourceMetadata.publishedDate,
    structuredDate: candidate.metadata?.publishedAt
  });
  if (!dateResolution.date) {
    throw new Error(`발행일을 확정할 수 없습니다. \`npm run meeting:resume -- ${JSON.stringify(runDir)} --date YYYY-MM-DD\`로 날짜를 지정하세요.`);
  }
  candidate.metadata.publishedAt = dateResolution.date;
  const structured = MeetingAgentResultSchema.parse(candidate);
  await writeProgress(runDir, 'resuming', '기존 전사·구조화 결과로 preview를 복구하고 있습니다.');
  await writeJson(resolve(runDir, 'structured.json'), structured);

  let markdown;
  if (await pathExists(resolve(runDir, 'post.md'))) {
    markdown = await readFile(resolve(runDir, 'post.md'), 'utf8');
    markdown = markdown.replace(/^- \*\*일자:\*\*.*$/m, `- **일자:** ${dateResolution.date}`);
  } else {
    markdown = renderMeetingMarkdown(structured, sourceInfo);
  }
  validateRenderedMarkdown(markdown);
  await writeFile(resolve(runDir, 'post.md'), markdown, 'utf8');

  const transcription = previousManifest?.transcription || {
    engine: await pathExists(resolve(runDir, 'whisper.log')) ? 'whisper-cli' : 'direct-text',
    transcriptFile: 'transcript.txt',
    recoveredFromLegacyRun: true
  };
  const piResult = previousManifest?.pi || {
    model: 'existing-structured-result',
    eventFile: await pathExists(resolve(runDir, 'pi-events.jsonl')) ? 'pi-events.jsonl' : null
  };
  const previousWarnings = (previousManifest?.warnings || []).filter((warning) => !/발행일|날짜/.test(warning));
  const finalized = await finalizePreview({
    runDir,
    structured,
    markdown,
    values,
    sourceInfo,
    sourceMetadata,
    dateResolution,
    piResult,
    transcription,
    warnings: previousWarnings
  });
  await patchManifest(runDir, {
    resumedAt: new Date().toISOString(),
    recoveredWithoutRetranscription: true
  });

  console.log(`PREVIEW 복구 완료(재전사 없음): ${runDir}`);
  console.log(`날짜: ${structured.metadata.publishedAt} (${dateResolution.source})`);
  console.log(`문서: ${finalized.document._id}`);
  finalized.warnings.forEach((warning) => console.log(`주의: ${warning}`));
  console.log(`발행 명령: npm run meeting:publish -- ${JSON.stringify(runDir)} --confirm ${structured.metadata.slug}`);
}

async function publish(runValue, values) {
  if (!runValue) throw new Error(`preview run 디렉터리가 필요합니다.\n\n${usage()}`);
  const runDir = absolutePath(runValue);
  const structured = MeetingAgentResultSchema.parse(JSON.parse(await readFile(resolve(runDir, 'structured.json'), 'utf8')));
  const markdown = await readFile(resolve(runDir, 'post.md'), 'utf8');
  validateRenderedMarkdown(markdown);
  const manifest = JSON.parse(await readFile(resolve(runDir, 'run.json'), 'utf8'));
  if (manifest.status === 'published') throw new Error(`이미 발행된 run입니다: ${manifest.publishedDocumentId}`);

  const config = CATEGORY_CONFIG[structured.classification.category];
  const documentId = `${config.sanityType}-${structured.metadata.slug}`;
  if (!values.confirm || ![structured.metadata.slug, documentId].includes(values.confirm)) {
    throw new Error(`발행 확인값이 필요합니다. --confirm ${structured.metadata.slug} 또는 --confirm ${documentId}를 지정하세요.`);
  }

  const client = sanityClient({ requireToken: true });
  const explicitPersonIds = splitPeople(values.people);
  const resolved = await resolvePersonIds(structured, explicitPersonIds.length ? explicitPersonIds : manifest.personIds || [], client);
  if (resolved.unresolved.length) throw new Error(`Sanity person 연결이 필요합니다: ${resolved.unresolved.join(', ')}`);
  if (!resolved.ids.length) throw new Error('발행할 문서에는 최소 1개의 person 참조가 필요합니다. --people person-...을 지정하세요.');

  const document = buildSanityDocument(structured, markdown, resolved.ids);
  if ('coverImage' in document) throw new Error('회의 에이전트는 임의 썸네일을 발행하지 않습니다.');

  const duplicates = await client.fetch(
    `*[_id == $id || (_type in ["study", "meeting", "work"] && slug.current == $slug)]{_id,_type,title,"slug":slug.current}`,
    { id: document._id, slug: document.slug.current }
  );
  if (duplicates.length) {
    throw new Error(`같은 ID 또는 slug 문서가 이미 있습니다. 기존 문서는 자동으로 덮어쓰지 않습니다: ${duplicates.map((item) => item._id).join(', ')}`);
  }

  if (values['validate-only']) {
    const validationResult = {
      validatedAt: new Date().toISOString(),
      documentId: document._id,
      type: document._type,
      slug: document.slug.current,
      personIds: resolved.ids,
      duplicateCount: 0,
      readyToPublish: true
    };
    await writeFile(resolve(runDir, 'publish-validation.json'), `${JSON.stringify(validationResult, null, 2)}\n`, 'utf8');
    console.log(`발행 검증 완료(쓰기 없음): ${document._id}`);
    return;
  }

  const created = await client.create(document, { visibility: 'sync' });
  const publishResult = {
    publishedAt: new Date().toISOString(),
    documentId: created._id,
    revision: created._rev,
    type: created._type,
    slug: created.slug?.current
  };
  await writeFile(resolve(runDir, 'publish-result.json'), `${JSON.stringify(publishResult, null, 2)}\n`, 'utf8');
  await writeFile(resolve(runDir, 'run.json'), `${JSON.stringify({
    ...manifest,
    status: 'published',
    publishedAt: publishResult.publishedAt,
    publishedDocumentId: created._id,
    personIds: resolved.ids,
    warnings: [],
    publishable: false
  }, null, 2)}\n`, 'utf8');

  console.log(`발행 완료: ${created._id}`);
  console.log(`경로: /${created._type === 'study' ? 'study' : 'meetings'}/${created.slug.current}`);
}

async function doctor() {
  const modelCandidates = findWhisperModel();
  let foundModel = null;
  for (const candidate of modelCandidates) {
    if (await pathExists(candidate)) {
      foundModel = candidate;
      break;
    }
  }

  const model = process.env.MEETING_AGENT_PI_MODEL || DEFAULT_MODEL;
  const provider = model.includes('/') ? model.split('/')[0] : 'openai-codex';
  let auth = { status: 'unknown', provider };
  if (commandExists('pi')) {
    try {
      const result = await runProcess('pi', ['auth', 'check', '--provider', provider, '--json', '--no-refresh']);
      auth = JSON.parse(result.stdout.trim());
    } catch (error) {
      auth = { status: 'error', provider, message: error.message };
    }
  }

  let sanity = { configured: false, writableToken: false };
  try {
    const config = sanityConfig();
    sanity = {
      configured: true,
      projectId: config.projectId,
      dataset: config.dataset,
      writableToken: Boolean(config.token)
    };
  } catch (error) {
    sanity = { configured: false, writableToken: false, message: error.message };
  }

  const report = {
    pi: { installed: commandExists('pi'), model, auth },
    transcription: {
      ffmpeg: commandExists('ffmpeg'),
      whisperCli: commandExists('whisper-cli'),
      model: foundModel,
      ready: commandExists('ffmpeg') && commandExists('whisper-cli') && Boolean(foundModel)
    },
    sanity
  };
  console.log(JSON.stringify(report, null, 2));

  if (!report.pi.installed || report.pi.auth.status !== 'ready' || !sanity.configured) process.exitCode = 1;
}

async function main() {
  const { command, values, positionals } = parseCli(process.argv.slice(2));
  if (values.help) {
    console.log(usage());
    return;
  }
  if (values.category && !CATEGORY_CONFIG[values.category]) {
    throw new Error(`지원하지 않는 category입니다: ${values.category}`);
  }

  if (command === 'prepare') await prepare(positionals[0], values);
  else if (command === 'resume') await resumePreview(positionals[0], values);
  else if (command === 'publish') await publish(positionals[0], values);
  else if (command === 'doctor') await doctor();
}

main().catch((error) => {
  if (error?.issues) {
    console.error('구조화 결과 검증 실패:');
    error.issues.forEach((issue) => console.error(`- ${issue.path.join('.')}: ${issue.message}`));
  } else {
    console.error(`오류: ${error.message}`);
  }
  process.exitCode = 1;
});

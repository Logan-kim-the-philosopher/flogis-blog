#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
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
  isAudioPath,
  isTextPath,
  normalizeName,
  parsePiEventStream,
  renderMeetingMarkdown,
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
  --language CODE            Whisper 언어 (기본: ko)
  --output DIRECTORY         run 결과 디렉터리 직접 지정
  --offline                  Sanity 사람 조회 없이 preview 생성
  --structured-input FILE    테스트용 Pi 구조화 JSON 입력

publish 옵션:
  --confirm VALUE            preview의 slug 또는 document ID와 정확히 같아야 함
  --people IDS               preview에서 해결하지 못한 person ID 지정
  --validate-only            참조·중복만 검사하고 Sanity에는 쓰지 않음
`;
}

function parseCli(argv) {
  const args = [...argv];
  const supportedCommands = new Set(['prepare', 'publish', 'doctor']);
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
  await runProcess('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', inputPath,
    '-ar', '16000',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    normalizedAudio
  ]);

  const outputBase = resolve(runDir, 'transcript');
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

async function prepare(inputValue, values) {
  if (!inputValue) throw new Error(`원본 파일 경로가 필요합니다.\n\n${usage()}`);
  const inputPath = absolutePath(inputValue);
  const inputStat = await stat(inputPath);
  if (!inputStat.isFile()) throw new Error(`원본 경로가 파일이 아닙니다: ${inputPath}`);
  if (!isTextPath(inputPath) && !isAudioPath(inputPath)) {
    throw new Error('지원 형식은 txt, md, markdown, aac, aif, aiff, flac, m4a, mp3, mp4, ogg, opus, wav, webm입니다.');
  }

  const runDir = await createRunDirectory(inputPath, values.output);
  const originalName = basename(inputPath);
  const preservedSource = resolve(runDir, `source${extname(inputPath).toLowerCase()}`);
  await copyFile(inputPath, preservedSource);

  const inputKind = isAudioPath(inputPath) ? 'audio' : 'text';
  let transcript;
  let transcription = null;
  if (inputKind === 'audio') {
    transcription = await transcribeAudio(inputPath, runDir, values);
    transcript = transcription.transcript;
  } else {
    transcript = await readFile(inputPath, 'utf8');
    await writeFile(resolve(runDir, 'transcript.txt'), transcript, 'utf8');
  }
  if (!transcript.trim()) throw new Error('원본 또는 전사문이 비어 있습니다.');

  const requestPath = resolve(runDir, 'pi-request.md');
  const request = [
    '# 실행 메타데이터',
    '',
    `- 원본 파일명: ${originalName}`,
    `- 입력 방식: ${inputKind === 'audio' ? '오디오 전사' : '텍스트 직접 입력'}`,
    `- 날짜 강제값: ${values.date || '없음'}`,
    `- 제목 강제값: ${values.title || '없음'}`,
    `- slug 강제값: ${values.slug || '없음'}`,
    `- 분류 강제값: ${values.category || '없음'}`,
    '',
    '# 원본 또는 전사문',
    '',
    transcript
  ].join('\n');
  await writeFile(requestPath, request, 'utf8');

  let piResult;
  if (values['structured-input']) {
    const fixturePath = absolutePath(values['structured-input']);
    piResult = {
      raw: JSON.parse(await readFile(fixturePath, 'utf8')),
      model: 'structured-input',
      eventPath: null
    };
  } else {
    piResult = await callPi(requestPath, runDir, values);
  }

  const structured = MeetingAgentResultSchema.parse(applyOverrides(piResult.raw, values));
  const structuredPath = resolve(runDir, 'structured.json');
  await writeFile(structuredPath, `${JSON.stringify(structured, null, 2)}\n`, 'utf8');

  const sourceInfo = {
    originalName,
    inputKind,
    sourceSha256: await sha256(inputPath),
    preservedSource: basename(preservedSource)
  };
  const markdown = renderMeetingMarkdown(structured, sourceInfo);
  validateRenderedMarkdown(markdown);
  const postPath = resolve(runDir, 'post.md');
  await writeFile(postPath, markdown, 'utf8');

  const explicitPersonIds = splitPeople(values.people);
  let resolved = {
    ids: explicitPersonIds,
    unresolved: explicitPersonIds.length ? [] : structured.metadata.people.map((person) => person.name)
  };
  const warnings = [];
  if (!values.offline) {
    try {
      resolved = await resolvePersonIds(structured, explicitPersonIds, sanityClient());
    } catch (error) {
      if (explicitPersonIds.length) throw error;
      warnings.push(`Sanity 사람 자동 연결 실패: ${error.message}`);
    }
  }
  if (resolved.unresolved.length) warnings.push(`확인되지 않은 사람: ${resolved.unresolved.join(', ')}`);
  if (!resolved.ids.length) warnings.push('발행 전 최소 1개의 person 문서 연결이 필요합니다. --people 옵션을 사용하세요.');

  const document = buildSanityDocument(structured, markdown, resolved.ids);
  const documentPath = resolve(runDir, 'sanity-document.json');
  await writeFile(documentPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  const manifest = {
    version: 1,
    status: 'preview',
    createdAt: new Date().toISOString(),
    runDir,
    source: sourceInfo,
    classification: structured.classification,
    pi: { model: piResult.model, eventFile: piResult.eventPath ? basename(piResult.eventPath) : null },
    transcription: transcription ? {
      engine: 'whisper-cli',
      modelPath: transcription.modelPath,
      transcriptFile: basename(transcription.transcriptPath)
    } : { engine: 'direct-text', transcriptFile: 'transcript.txt' },
    personIds: resolved.ids,
    unresolvedPeople: resolved.unresolved,
    publishable: resolved.ids.length > 0 && warnings.length === 0,
    warnings,
    files: {
      structured: basename(structuredPath),
      markdown: basename(postPath),
      sanityDocument: basename(documentPath)
    }
  };
  await writeFile(resolve(runDir, 'run.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`PREVIEW 생성 완료: ${runDir}`);
  console.log(`분류: ${CATEGORY_CONFIG[structured.classification.category].label}`);
  console.log(`문서: ${document._id}`);
  console.log(`검토 파일: ${postPath}`);
  warnings.forEach((warning) => console.log(`주의: ${warning}`));
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

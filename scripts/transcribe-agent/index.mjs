#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, link, mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawn, spawnSync } from 'node:child_process';
import {
  attachBenchResults,
  buildTranscriptionPlan,
  candidatesForWindow,
  chooseLocalCandidate,
  isSupportedAudioPath,
  normalizeForMatch,
  parsePiEventStream,
  renderTranscript,
  safeStem,
  validateReviewResult
} from './lib.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '../..');
const runtimeRoot = resolve(projectRoot, '.transcribe-agent');
const DEFAULT_MODEL = 'openai-codex/gpt-5.4-mini';
const DEFAULT_OPENSUPERWHISPER_BIN = '/Applications/OpenSuperWhisper.app/Contents/MacOS/OpenSuperWhisper';

loadProjectEnv();

function loadProjectEnv() {
  try {
    process.loadEnvFile(resolve(projectRoot, '.env'));
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function usage() {
  return `파일명 기반 음성 전사 에이전트

사용법:
  npm run transcribe -- <파일명|경로> [옵션]
  npm run transcribe:resume -- <run-directory> [옵션]
  npm run transcribe:doctor

옵션:
  --mode accurate|fast       기본값 accurate
  --root DIRECTORY           파일을 찾고 결과를 둘 위치 (기본: 바탕화면)
  --output FILE              결과 TXT 경로 직접 지정
  --run-dir DIRECTORY        중간 결과 디렉터리 직접 지정
  --model MODEL              Pi 검수 모델 (기본: ${DEFAULT_MODEL})
  --thinking LEVEL           Pi 검수 thinking (기본: high)
  --language CODE            음성 언어 (기본: ko)
  --opensuperwhisper-bin PATH
  --local-only               전사 텍스트를 Pi에 보내지 않고 로컬 후보만 사용
  --replace                  기존 결과 파일을 원자적으로 교체
`;
}

function parseCli(argv) {
  const args = [...argv];
  const commands = new Set(['run', 'resume', 'doctor']);
  const command = commands.has(args[0]) ? args.shift() : 'run';
  const parsed = parseArgs({
    args,
    allowPositionals: true,
    strict: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      mode: { type: 'string' },
      root: { type: 'string' },
      output: { type: 'string' },
      'run-dir': { type: 'string' },
      model: { type: 'string' },
      thinking: { type: 'string' },
      language: { type: 'string' },
      'opensuperwhisper-bin': { type: 'string' },
      'local-only': { type: 'boolean' },
      replace: { type: 'boolean' }
    }
  });
  return { command, ...parsed };
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

async function sha256(filePath) {
  const hash = createHash('sha256');
  await new Promise((resolvePromise, reject) => {
    const stream = createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', resolvePromise);
  });
  return hash.digest('hex');
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJson(filePath) {
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
  const manifestPath = resolve(runDir, 'run.json');
  let current = { version: 1, runDir };
  if (await pathExists(manifestPath)) current = await readJson(manifestPath);
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await writeJson(manifestPath, next);
  return next;
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
        const label = signal ? `signal ${signal}` : `exit ${code}`;
        reject(new Error(`${command} 실행 실패 (${label}): ${result.stderr.trim() || result.stdout.trim() || label}`));
        return;
      }
      resolvePromise(result);
    });
  });
}

function commandPath(command) {
  if (!command) return null;
  if (command.includes('/')) return command;
  const result = spawnSync('/usr/bin/which', [command], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim().split(/\r?\n/)[0] || null : null;
}

async function isExecutable(filePath) {
  if (!filePath) return false;
  try {
    await access(filePath, fsConstants.F_OK | fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function readMacDefault(key) {
  if (process.platform !== 'darwin' || process.env.TRANSCRIBE_AGENT_SKIP_APP_SETTINGS === '1') return null;
  const result = spawnSync('defaults', ['read', 'fr.my-monkey.opensuperwhisper', key], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() || null : null;
}

function readOpenSuperWhisperVersion(executable) {
  if (!executable || process.platform !== 'darwin') return null;
  const plist = resolve(dirname(executable), '../Info.plist');
  const result = spawnSync('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleShortVersionString', plist], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() || null : null;
}

async function inspectOpenSuperWhisper(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.TRANSCRIBE_AGENT_OPENSUPERWHISPER_BIN,
    DEFAULT_OPENSUPERWHISPER_BIN,
    commandPath('OpenSuperWhisper')
  ].filter(Boolean).map(absolutePath);
  let executable = null;
  for (const candidate of [...new Set(candidates)]) {
    if (await isExecutable(candidate)) {
      executable = candidate;
      break;
    }
  }
  const selectedEngine = readMacDefault('selectedEngine');
  const modelPath = readMacDefault('selectedWhisperModelPath');
  const language = readMacDefault('whisperLanguage');
  const modelReady = modelPath ? await pathExists(modelPath) : null;
  return {
    executable,
    version: readOpenSuperWhisperVersion(executable),
    selectedEngine,
    modelPath,
    modelReady,
    language,
    ready: Boolean(executable) && (!selectedEngine || selectedEngine === 'whisper') && modelReady !== false
  };
}

async function resolveAudioSource(input, rootDir) {
  if (!input?.trim()) throw new Error('전사할 오디오 파일명이 필요합니다.');
  const direct = absolutePath(input);
  if (await pathExists(direct)) return validateSource(direct);

  const root = absolutePath(rootDir);
  if (!await pathExists(root)) throw new Error(`검색 위치가 없습니다: ${root}`);
  const queryName = normalizeForMatch(basename(input));
  const queryStem = normalizeForMatch(basename(input, extname(input)));
  const queryHasExtension = Boolean(extname(input));
  const all = await walkAudioFiles(root, 3);
  const exact = all.filter((filePath) => {
    const name = normalizeForMatch(basename(filePath));
    const stem = normalizeForMatch(basename(filePath, extname(filePath)));
    return queryHasExtension ? name === queryName : stem === queryStem;
  }).sort((a, b) => relative(root, a).split('/').length - relative(root, b).split('/').length || a.localeCompare(b, 'ko'));

  if (exact.length === 1) return validateSource(exact[0]);
  if (exact.length > 1) {
    throw new Error(`같은 이름의 오디오가 여러 개입니다. 경로를 지정하세요:\n${exact.map((item) => `- ${item}`).join('\n')}`);
  }
  throw new Error(`바탕화면에서 오디오를 찾지 못했습니다: ${input}\n검색 위치: ${root}`);
}

async function walkAudioFiles(root, maxDepth, depth = 0) {
  const found = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = resolve(root, entry.name);
    if (entry.isFile() && isSupportedAudioPath(fullPath)) found.push(fullPath);
    else if (entry.isDirectory() && depth < maxDepth) found.push(...await walkAudioFiles(fullPath, maxDepth, depth + 1));
  }
  return found;
}

async function validateSource(filePath) {
  const metadata = await stat(filePath);
  if (!metadata.isFile()) throw new Error(`오디오 원본이 파일이 아닙니다: ${filePath}`);
  if (!isSupportedAudioPath(filePath)) throw new Error(`지원하지 않는 오디오 확장자입니다: ${extname(filePath) || '(없음)'}`);
  return resolve(filePath);
}

async function probeDuration(sourcePath) {
  const ffprobe = process.env.TRANSCRIBE_AGENT_FFPROBE_BIN || commandPath('ffprobe');
  if (!ffprobe || !await isExecutable(ffprobe)) throw new Error('오디오 길이 확인에 필요한 ffprobe를 찾지 못했습니다.');
  const result = await runProcess(ffprobe, [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', sourcePath
  ]);
  const duration = Number(JSON.parse(result.stdout)?.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('ffprobe가 유효한 오디오 길이를 반환하지 않았습니다.');
  return duration;
}

async function renderCandidateAudio(sourcePath, runDir, plan) {
  const ffmpeg = process.env.TRANSCRIBE_AGENT_FFMPEG_BIN || commandPath('ffmpeg');
  if (!ffmpeg || !await isExecutable(ffmpeg)) throw new Error('오디오 구간 생성에 필요한 ffmpeg를 찾지 못했습니다.');
  const candidateDir = resolve(runDir, 'candidates');
  await mkdir(candidateDir, { recursive: true });
  for (let index = 0; index < plan.candidates.length; index += 1) {
    const item = plan.candidates[index];
    const outputPath = resolve(candidateDir, item.fileName);
    const args = [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', sourcePath,
      '-ss', String(item.start), '-t', String(item.end - item.start),
      '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le'
    ];
    if (item.audioFilter) args.push('-af', item.audioFilter);
    args.push(outputPath);
    await runProcess(ffmpeg, args);
    await writeProgress(runDir, 'preparing_audio', `검증용 오디오 구간을 만들고 있습니다 (${index + 1}/${plan.candidates.length}).`, {
      current: index + 1,
      total: plan.candidates.length
    });
  }
  return candidateDir;
}

async function transcribeCandidates(runDir, candidateDir, plan, options) {
  const openSuperWhisper = await inspectOpenSuperWhisper(options.openSuperWhisperBin);
  if (!openSuperWhisper.executable) throw new Error('OpenSuperWhisper CLI를 찾지 못했습니다. --opensuperwhisper-bin PATH를 지정하세요.');
  if (openSuperWhisper.selectedEngine && openSuperWhisper.selectedEngine !== 'whisper') {
    throw new Error(`OpenSuperWhisper 선택 엔진이 whisper가 아닙니다: ${openSuperWhisper.selectedEngine}`);
  }
  if (openSuperWhisper.modelReady === false) throw new Error(`선택한 Whisper 모델 파일이 없습니다: ${openSuperWhisper.modelPath}`);
  if (options.language !== 'auto' && openSuperWhisper.language && options.language !== openSuperWhisper.language) {
    throw new Error(`요청 언어 ${options.language}와 OpenSuperWhisper 앱 언어 ${openSuperWhisper.language}가 다릅니다.`);
  }
  await writeProgress(runDir, 'transcribing', `OpenSuperWhisper가 ${plan.candidates.length}개 후보를 한 번에 전사하고 있습니다.`, {
    candidateCount: plan.candidates.length,
    model: openSuperWhisper.modelPath ? basename(openSuperWhisper.modelPath) : null
  });
  const result = await runProcess(openSuperWhisper.executable, ['bench', candidateDir], {
    cwd: runDir,
    env: { LLVM_PROFILE_FILE: '/dev/null' }
  });
  await writeFile(resolve(runDir, 'opensuperwhisper.stdout.json'), result.stdout, 'utf8');
  await writeFile(resolve(runDir, 'opensuperwhisper.stderr.log'), result.stderr, 'utf8');
  const withResults = attachBenchResults(plan, extractJsonArray(result.stdout));
  await writeJson(resolve(runDir, 'candidates.json'), withResults);
  return { plan: withResults, openSuperWhisper };
}

function extractJsonArray(output) {
  const text = String(output || '').trim();
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error('OpenSuperWhisper가 유효한 bench JSON을 반환하지 않았습니다.');
  }
}

async function reviewCandidates(runDir, sourceName, plan, options, openSuperWhisper) {
  if (options.localOnly) {
    const segments = plan.windows.map((window) => ({
      start: window.start,
      end: window.end,
      text: chooseLocalCandidate(candidatesForWindow(plan, window.id)),
      corrections: [],
      uncertainties: []
    }));
    if (segments.some((segment) => !segment.text)) throw new Error('로컬 전사 후보 중 비어 있는 구간이 있습니다.');
    await writeJson(resolve(runDir, 'review.json'), { version: 1, reviewedByPi: false, segments });
    return { segments, reviewedByPi: false, model: null, thinking: null };
  }

  const piBin = process.env.TRANSCRIBE_AGENT_PI_BIN || commandPath('pi') || 'pi';
  if (!await isExecutable(piBin)) throw new Error(`Pi 실행 파일을 찾지 못했습니다: ${piBin}`);
  const reviewDir = resolve(runDir, 'review');
  await mkdir(reviewDir, { recursive: true });
  const systemPrompt = await readFile(resolve(scriptDir, 'review-system-prompt.md'), 'utf8');
  const model = options.model || process.env.TRANSCRIBE_AGENT_PI_MODEL || DEFAULT_MODEL;
  const thinking = options.thinking || process.env.TRANSCRIBE_AGENT_PI_THINKING || 'high';
  const segments = [];

  for (let index = 0; index < plan.windows.length; index += 1) {
    const window = plan.windows[index];
    const candidates = candidatesForWindow(plan, window.id);
    const part = String(index + 1).padStart(4, '0');
    const requestPath = resolve(reviewDir, `part-${part}-request.json`);
    const reviewedPath = resolve(reviewDir, `part-${part}.json`);
    if (await pathExists(reviewedPath)) {
      segments.push(validateReviewResult(await readJson(reviewedPath), window));
      continue;
    }
    const request = {
      sourceName,
      engine: `OpenSuperWhisper${openSuperWhisper.version ? ` ${openSuperWhisper.version}` : ''}`,
      language: openSuperWhisper.language || options.language,
      target: { start: window.start, end: window.end },
      candidates: candidates.map(({ kind, start, end, text }) => ({ kind, start, end, text }))
    };
    await writeJson(requestPath, request);
    await writeProgress(runDir, 'reviewing', `Pi가 후보를 교차 검수하고 있습니다 (${index + 1}/${plan.windows.length}).`, {
      current: index + 1,
      total: plan.windows.length,
      model,
      thinking
    });
    const result = await runProcess(piBin, [
      '--model', model,
      '--thinking', thinking,
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
    ], { cwd: projectRoot });
    await writeFile(resolve(reviewDir, `part-${part}-events.jsonl`), result.stdout, 'utf8');
    if (result.stderr.trim()) await writeFile(resolve(reviewDir, `part-${part}-stderr.log`), result.stderr, 'utf8');
    const reviewed = validateReviewResult(parsePiEventStream(result.stdout), window);
    await writeJson(reviewedPath, reviewed);
    segments.push(reviewed);
  }
  await writeJson(resolve(runDir, 'review.json'), { version: 1, reviewedByPi: true, model, thinking, segments });
  return { segments, reviewedByPi: true, model, thinking };
}

async function atomicWrite(filePath, content, replaceExisting) {
  await mkdir(dirname(filePath), { recursive: true });
  if (!replaceExisting && await pathExists(filePath)) {
    throw new Error(`결과 파일이 이미 있습니다: ${filePath}\n덮어쓰려면 --replace를 명시하세요.`);
  }
  const tempPath = resolve(dirname(filePath), `.${basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  try {
    await writeFile(tempPath, content, { encoding: 'utf8', flag: 'wx' });
    if (replaceExisting) await rename(tempPath, filePath);
    else {
      await link(tempPath, filePath);
      await unlink(tempPath);
    }
  } catch (error) {
    try {
      if (await pathExists(tempPath)) await unlink(tempPath);
    } catch {
      // Preserve the original error.
    }
    throw error;
  }
}

function timestampId() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

async function runTranscription(input, cliValues, resumeRunDir = null) {
  const rootDir = absolutePath(cliValues.root || process.env.TRANSCRIBE_AGENT_DESKTOP || join(homedir(), 'Desktop'));
  const mode = cliValues.mode || 'accurate';
  if (!['accurate', 'fast'].includes(mode)) throw new Error(`지원하지 않는 mode입니다: ${mode}`);
  const sourcePath = await resolveAudioSource(input, rootDir);
  const sourceStem = basename(sourcePath, extname(sourcePath)).normalize('NFC');
  const outputPath = absolutePath(cliValues.output || join(rootDir, `${sourceStem}_전사.txt`));
  if (!resumeRunDir && !cliValues.replace && await pathExists(outputPath)) {
    throw new Error(`결과 파일이 이미 있습니다: ${outputPath}\n덮어쓰려면 --replace를 명시하세요.`);
  }
  const runDir = resumeRunDir || absolutePath(cliValues.runDir || resolve(runtimeRoot, 'runs', `${timestampId()}-${safeStem(sourcePath)}`));
  await mkdir(runDir, { recursive: true });
  const sourceStat = await stat(sourcePath);
  const sourceHashBefore = await sha256(sourcePath);
  const options = {
    mode,
    rootDir,
    outputPath,
    language: cliValues.language || 'ko',
    localOnly: cliValues.localOnly === true,
    replace: cliValues.replace === true,
    model: cliValues.model || null,
    thinking: cliValues.thinking || null,
    openSuperWhisperBin: cliValues.openSuperWhisperBin || null
  };
  await patchManifest(runDir, {
    status: 'running',
    sourcePath,
    sourceName: basename(sourcePath),
    sourceSize: sourceStat.size,
    sourceHash: sourceHashBefore,
    outputPath,
    options,
    startedAt: new Date().toISOString()
  });

  try {
    let plan;
    let openSuperWhisper;
    const candidatePath = resolve(runDir, 'candidates.json');
    if (await pathExists(candidatePath)) {
      plan = await readJson(candidatePath);
      openSuperWhisper = await inspectOpenSuperWhisper(options.openSuperWhisperBin);
      await writeProgress(runDir, 'resuming', '보존된 전사 후보에서 검수 작업을 재개합니다.');
    } else {
      await writeProgress(runDir, 'probing', '원본 길이와 무결성을 확인하고 있습니다.');
      const durationSeconds = await probeDuration(sourcePath);
      const planned = buildTranscriptionPlan(durationSeconds, mode);
      await writeJson(resolve(runDir, 'plan.json'), planned);
      const candidateDir = await renderCandidateAudio(sourcePath, runDir, planned);
      ({ plan, openSuperWhisper } = await transcribeCandidates(runDir, candidateDir, planned, options));
    }

    const reviewPath = resolve(runDir, 'review.json');
    const review = await pathExists(reviewPath)
      ? await readJson(reviewPath)
      : await reviewCandidates(runDir, basename(sourcePath), plan, options, openSuperWhisper);
    const engine = `OpenSuperWhisper${openSuperWhisper?.version ? ` ${openSuperWhisper.version}` : ''}`;
    const transcript = renderTranscript({
      sourceName: basename(sourcePath),
      sourceHash: sourceHashBefore,
      durationSeconds: plan.durationSeconds,
      mode,
      engine,
      language: openSuperWhisper?.language || options.language,
      reviewedByPi: review.reviewedByPi,
      segments: review.segments
    });
    const sourceHashAfter = await sha256(sourcePath);
    if (sourceHashAfter !== sourceHashBefore) throw new Error('처리 중 원본 오디오 해시가 바뀌어 결과 저장을 중단했습니다.');
    await writeProgress(runDir, 'writing', '검증된 전사 TXT를 원자적으로 저장하고 있습니다.');
    await atomicWrite(outputPath, transcript, options.replace);
    const outputStat = await stat(outputPath);
    const outputHash = await sha256(outputPath);
    const result = {
      version: 1,
      status: 'completed',
      sourcePath,
      sourceHash: sourceHashAfter,
      outputPath,
      outputSize: outputStat.size,
      outputHash,
      runDir,
      mode,
      reviewedByPi: review.reviewedByPi,
      uncertaintyCount: review.segments.reduce((sum, item) => sum + (item.uncertainties?.length || 0), 0),
      completedAt: new Date().toISOString()
    };
    await writeJson(resolve(runDir, 'result.json'), result);
    await patchManifest(runDir, result);
    await writeProgress(runDir, 'completed', '전사와 무결성 검증이 완료됐습니다.', { outputPath, outputHash });
    return result;
  } catch (error) {
    await patchManifest(runDir, { status: 'error', error: error.message });
    await writeProgress(runDir, 'error', error.message);
    throw new Error(`${error.message}\n재개 경로: ${runDir}`);
  }
}

async function resumeTranscription(runDirValue, cliValues) {
  const runDir = absolutePath(runDirValue);
  const manifest = await readJson(resolve(runDir, 'run.json'));
  if (manifest.status === 'completed' && await pathExists(resolve(runDir, 'result.json'))) {
    const result = await readJson(resolve(runDir, 'result.json'));
    if (!await pathExists(result.outputPath)) throw new Error(`완료 기록은 있지만 결과 파일이 없습니다: ${result.outputPath}`);
    return result;
  }
  const stored = manifest.options || {};
  const merged = {
    mode: cliValues.mode || stored.mode,
    root: cliValues.root || stored.rootDir,
    output: cliValues.output || stored.outputPath,
    language: cliValues.language || stored.language,
    localOnly: cliValues.localOnly || stored.localOnly,
    replace: cliValues.replace,
    model: cliValues.model || stored.model,
    thinking: cliValues.thinking || stored.thinking,
    openSuperWhisperBin: cliValues.openSuperWhisperBin || stored.openSuperWhisperBin
  };
  return runTranscription(manifest.sourcePath, merged, runDir);
}

async function doctor() {
  const ffmpeg = process.env.TRANSCRIBE_AGENT_FFMPEG_BIN || commandPath('ffmpeg');
  const ffprobe = process.env.TRANSCRIBE_AGENT_FFPROBE_BIN || commandPath('ffprobe');
  const pi = process.env.TRANSCRIBE_AGENT_PI_BIN || commandPath('pi');
  const openSuperWhisper = await inspectOpenSuperWhisper();
  const checks = {
    ffmpeg: Boolean(ffmpeg && await isExecutable(ffmpeg)),
    ffprobe: Boolean(ffprobe && await isExecutable(ffprobe)),
    pi: Boolean(pi && await isExecutable(pi)),
    openSuperWhisper: openSuperWhisper.ready,
    selectedEngine: openSuperWhisper.selectedEngine,
    modelPath: openSuperWhisper.modelPath,
    language: openSuperWhisper.language,
    desktop: absolutePath(process.env.TRANSCRIBE_AGENT_DESKTOP || join(homedir(), 'Desktop'))
  };
  console.log(JSON.stringify(checks, null, 2));
  if (!checks.ffmpeg || !checks.ffprobe || !checks.pi || !checks.openSuperWhisper) process.exitCode = 1;
}

async function main() {
  const { command, values, positionals } = parseCli(process.argv.slice(2));
  if (values.help) {
    console.log(usage());
    return;
  }
  const normalizedValues = {
    ...values,
    runDir: values['run-dir'],
    openSuperWhisperBin: values['opensuperwhisper-bin'],
    localOnly: values['local-only']
  };
  if (command === 'doctor') {
    await doctor();
    return;
  }
  if (positionals.length !== 1) throw new Error(command === 'resume' ? '재개할 run 디렉터리 하나가 필요합니다.' : '전사할 파일명 또는 경로 하나가 필요합니다.');
  const result = command === 'resume'
    ? await resumeTranscription(positionals[0], normalizedValues)
    : await runTranscription(positionals[0], normalizedValues);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

import { readFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

const BOOLEAN_OPTIONS = new Set(['local-only', 'replace']);
const VALUE_OPTIONS = new Set([
  'mode', 'root', 'output', 'model', 'thinking', 'language', 'opensuperwhisper-bin'
]);

const PROGRESS_LABELS = {
  probing: '원본 확인',
  preparing_audio: '검증용 구간 생성',
  transcribing: 'OpenSuperWhisper 전사',
  reviewing: 'Pi 문맥 검수',
  resuming: '중간 결과 복구',
  writing: '결과 저장',
  completed: '완료',
  error: '오류'
};

export function tokenizeTranscribeCommand(value) {
  const tokens = [];
  let token = '';
  let quote = null;
  let escaped = false;
  for (const character of String(value || '').trim()) {
    if (escaped) {
      token += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      else token += character;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (/\s/.test(character)) {
      if (token) tokens.push(token);
      token = '';
      continue;
    }
    token += character;
  }
  if (escaped) token += '\\';
  if (quote) throw new Error('따옴표가 닫히지 않았습니다. 공백이 있는 파일명은 큰따옴표로 감싸세요.');
  if (token) tokens.push(token);
  return tokens;
}

export function parseTranscribeCommand(value) {
  const tokens = tokenizeTranscribeCommand(value);
  const options = {};
  const positionals = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }
    const [name, inlineValue] = token.slice(2).split(/=(.*)/s, 2);
    if (BOOLEAN_OPTIONS.has(name)) {
      options[camelCase(name)] = inlineValue === undefined ? true : inlineValue !== 'false';
      continue;
    }
    if (!VALUE_OPTIONS.has(name)) throw new Error(`지원하지 않는 /transcribe 옵션입니다: --${name}`);
    const next = inlineValue ?? tokens[index + 1];
    if (!next || (inlineValue === undefined && next.startsWith('--'))) throw new Error(`--${name} 값이 필요합니다.`);
    options[camelCase(name)] = next;
    if (inlineValue === undefined) index += 1;
  }
  if (positionals.length > 1) throw new Error('파일명이 여러 개로 해석됐습니다. 공백이 있는 파일명은 큰따옴표로 감싸세요.');
  if (options.mode && !['accurate', 'fast'].includes(options.mode)) throw new Error(`지원하지 않는 mode입니다: ${options.mode}`);
  return { source: positionals[0] || null, ...options };
}

export function createTranscribeRunDir(projectRoot, source, now = new Date()) {
  const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const stem = basename(source || 'audio', extname(source || ''))
    .normalize('NFKC')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'audio';
  return resolve(projectRoot, '.transcribe-agent/runs', `pi-${timestamp}-${stem}`);
}

export function buildTranscribeArgs(projectRoot, options, runDir) {
  if (!options.source) throw new Error('전사할 파일명 또는 경로가 필요합니다.');
  const args = [
    resolve(projectRoot, 'scripts/transcribe-agent/index.mjs'),
    'run',
    options.source,
    '--run-dir',
    runDir
  ];
  appendOptions(args, options);
  return args;
}

export function buildTranscribeResumeArgs(projectRoot, runDir, options = {}) {
  const args = [resolve(projectRoot, 'scripts/transcribe-agent/index.mjs'), 'resume', runDir];
  appendOptions(args, options);
  return args;
}

function appendOptions(args, options) {
  const values = {
    mode: '--mode',
    root: '--root',
    output: '--output',
    model: '--model',
    thinking: '--thinking',
    language: '--language',
    openSuperWhisperBin: '--opensuperwhisper-bin'
  };
  for (const [key, flag] of Object.entries(values)) {
    if (options[key]) args.push(flag, String(options[key]));
  }
  if (options.localOnly) args.push('--local-only');
  if (options.replace) args.push('--replace');
}

export function formatTranscribeProgress(progress, elapsedSeconds = 0) {
  const total = Math.max(0, Math.floor(elapsedSeconds));
  const elapsed = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  const label = PROGRESS_LABELS[progress?.phase] || progress?.message || '처리 중';
  const count = progress?.total ? ` ${progress.current || 0}/${progress.total}` : '';
  return `전사: ${label}${count} · ${elapsed}`;
}

export async function readTranscribeResult(runDir) {
  return JSON.parse(await readFile(resolve(runDir, 'result.json'), 'utf8'));
}

function camelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

export const MEETING_CATEGORIES = [
  'project_meeting',
  'study_session',
  'conversation',
  'team_operations'
];

const PROGRESS_LABELS = {
  preparing: '준비 중',
  preflight: '원본·날짜 확인',
  loading_transcript: '클로바 전사본 읽는 중',
  normalizing_audio: '오디오 변환 중',
  transcribing: 'Whisper 전사 중',
  transcribed: '전사 완료',
  structuring: 'Pi 구조화 중',
  rendering: '본문 생성 중',
  resolving_people: '사람 연결 확인 중',
  resuming: '기존 결과 복구 중',
  preview_ready: 'preview 준비',
  needs_input: '날짜 입력 필요',
  error: '오류'
};

export function formatMeetingProgress(progress, elapsedSeconds = 0) {
  const seconds = Math.max(0, Math.floor(elapsedSeconds));
  const minutes = Math.floor(seconds / 60);
  const elapsed = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const label = PROGRESS_LABELS[progress?.phase] || progress?.message || '처리 중';
  return `회의: ${label} · ${elapsed}`;
}

const BOOLEAN_OPTIONS = new Set(['offline', 'no-publish']);
const VALUE_OPTIONS = new Set([
  'date',
  'title',
  'slug',
  'category',
  'people',
  'model',
  'thinking',
  'whisper-model',
  'transcript',
  'language',
  'structured-input'
]);

export function tokenizeCommandLine(value) {
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
  if (quote) throw new Error('따옴표가 닫히지 않았습니다. 공백이 있는 경로는 큰따옴표로 감싸세요.');
  if (token) tokens.push(token);
  return tokens;
}

export function parseMeetingCommand(value) {
  const tokens = tokenizeCommandLine(value);
  const options = {};
  const positionals = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    const [rawName, inlineValue] = token.slice(2).split(/=(.*)/s, 2);
    if (BOOLEAN_OPTIONS.has(rawName)) {
      options[camelCase(rawName)] = inlineValue === undefined ? true : inlineValue !== 'false';
      continue;
    }
    if (!VALUE_OPTIONS.has(rawName)) throw new Error(`지원하지 않는 /meeting 옵션입니다: --${rawName}`);

    const nextValue = inlineValue ?? tokens[index + 1];
    if (!nextValue || (inlineValue === undefined && nextValue.startsWith('--'))) {
      throw new Error(`--${rawName} 값이 필요합니다.`);
    }
    options[camelCase(rawName)] = nextValue;
    if (inlineValue === undefined) index += 1;
  }

  if (positionals.length > 1) {
    throw new Error('원본 파일 경로가 여러 개로 해석됐습니다. 공백이 있는 경로는 큰따옴표로 감싸세요.');
  }
  if (options.category && !MEETING_CATEGORIES.includes(options.category)) {
    throw new Error(`지원하지 않는 category입니다: ${options.category}`);
  }

  return { sourcePath: positionals[0] || null, ...options };
}

function camelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function safeName(filePath) {
  return basename(filePath)
    .normalize('NFKC')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'meeting';
}

export function createExtensionRunDir(projectRoot, sourcePath, now = new Date()) {
  const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return resolve(projectRoot, '.meeting-agent/runs', `pi-${timestamp}-${safeName(sourcePath)}`);
}

export function buildPrepareArgs(projectRoot, options, runDir) {
  if (!options.sourcePath) throw new Error('회의 원본 파일 경로가 필요합니다.');
  const args = [resolve(projectRoot, 'scripts/meeting-agent/index.mjs'), 'prepare', options.sourcePath, '--output', runDir];
  const optionMap = {
    date: '--date',
    title: '--title',
    slug: '--slug',
    category: '--category',
    people: '--people',
    model: '--model',
    thinking: '--thinking',
    whisperModel: '--whisper-model',
    transcript: '--transcript',
    language: '--language',
    structuredInput: '--structured-input'
  };

  for (const [key, flag] of Object.entries(optionMap)) {
    if (options[key]) args.push(flag, String(options[key]));
  }
  if (options.offline) args.push('--offline');
  return args;
}

export function buildResumeArgs(projectRoot, runDir, options = {}) {
  const args = [resolve(projectRoot, 'scripts/meeting-agent/index.mjs'), 'resume', runDir];
  const optionMap = {
    date: '--date',
    title: '--title',
    slug: '--slug',
    category: '--category',
    people: '--people'
  };
  for (const [key, flag] of Object.entries(optionMap)) {
    if (options[key]) args.push(flag, String(options[key]));
  }
  if (options.offline) args.push('--offline');
  return args;
}

export function buildPublishArgs(projectRoot, runDir, slug, { people, validateOnly = false } = {}) {
  const args = [
    resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
    'publish',
    runDir,
    '--confirm',
    slug
  ];
  if (people) args.push('--people', people);
  if (validateOnly) args.push('--validate-only');
  return args;
}

export async function readRunArtifacts(runDir) {
  const [manifest, structured, document, markdown] = await Promise.all([
    readJson(resolve(runDir, 'run.json')),
    readJson(resolve(runDir, 'structured.json')),
    readJson(resolve(runDir, 'sanity-document.json')),
    readFile(resolve(runDir, 'post.md'), 'utf8')
  ]);
  return { manifest, structured, document, markdown };
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

export function summarizeArtifacts(artifacts) {
  const { manifest, structured, document } = artifacts;
  const warningText = manifest.warnings?.length ? manifest.warnings.join('\n- ') : '없음';
  return [
    `제목: ${structured.metadata.title}`,
    `분류: ${structured.classification.category}`,
    `문서 ID: ${document._id}`,
    `slug: ${document.slug.current}`,
    `연결된 사람: ${(manifest.personIds || []).join(', ') || '없음'}`,
    `경고:\n- ${warningText}`
  ].join('\n');
}

export function routeForDocument(document) {
  if (!document?.slug?.current) throw new Error('Sanity 문서에 slug가 없습니다.');
  return `/${document._type === 'study' ? 'study' : 'meetings'}/${document.slug.current}`;
}

export function publicUrlForDocument(document, baseUrl) {
  if (!baseUrl) return null;
  return new URL(routeForDocument(document), `${String(baseUrl).replace(/\/+$/, '')}/`).toString();
}

export function mayWriteToSanity({ hasUI, confirmed }) {
  return hasUI === true && confirmed === true;
}

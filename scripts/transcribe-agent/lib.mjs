import { basename, extname } from 'node:path';

export const SUPPORTED_AUDIO_EXTENSIONS = new Set([
  '.aac', '.aif', '.aiff', '.caf', '.flac', '.m4a', '.m4b', '.mp3', '.mp4',
  '.oga', '.ogg', '.opus', '.wav', '.webm', '.wma'
]);

export function normalizeForMatch(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('ko-KR')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isSupportedAudioPath(filePath) {
  return SUPPORTED_AUDIO_EXTENSIONS.has(extname(String(filePath)).toLowerCase());
}

export function safeStem(filePath) {
  return basename(filePath, extname(filePath))
    .normalize('NFKC')
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'audio';
}

export function buildEqualSegments(durationSeconds, targetSeconds) {
  const duration = Number(durationSeconds);
  const target = Number(targetSeconds);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('오디오 길이는 0보다 커야 합니다.');
  if (!Number.isFinite(target) || target <= 0) throw new Error('구간 목표 길이는 0보다 커야 합니다.');
  const count = Math.max(1, Math.ceil(duration / target));
  const span = duration / count;
  return Array.from({ length: count }, (_, index) => ({
    index,
    start: roundSeconds(index * span),
    end: roundSeconds(index === count - 1 ? duration : (index + 1) * span)
  }));
}

export function buildTranscriptionPlan(durationSeconds, mode = 'accurate') {
  const duration = Number(durationSeconds);
  const target = mode === 'fast' ? 90 : 60;
  const windows = buildEqualSegments(duration, target).map((segment) => ({
    ...segment,
    id: `window-${String(segment.index + 1).padStart(4, '0')}`
  }));
  const candidates = [];

  for (const window of windows) {
    candidates.push(candidate(window, 'original', window.start, window.end));
    if (mode === 'fast') continue;

    candidates.push(candidate(window, 'enhanced', window.start, window.end, 'highpass=f=100,dynaudnorm=f=150:g=21'));
    const midpoint = roundSeconds((window.start + window.end) / 2);
    candidates.push(candidate(window, 'fine-a', window.start, midpoint));
    candidates.push(candidate(window, 'fine-b', midpoint, window.end));
    candidates.push(candidate(
      window,
      'context',
      Math.max(0, roundSeconds(window.start - 30)),
      Math.min(duration, roundSeconds(window.end + 30))
    ));
  }

  return { version: 1, mode, durationSeconds: duration, windows, candidates };
}

function candidate(window, kind, start, end, audioFilter = null) {
  return {
    id: `${window.id}-${kind}`,
    windowId: window.id,
    kind,
    start: roundSeconds(start),
    end: roundSeconds(end),
    audioFilter,
    fileName: `${window.id}-${kind}.wav`
  };
}

export function attachBenchResults(plan, benchPayload) {
  const rows = parseBenchPayload(benchPayload);
  const byName = new Map(rows.map((row) => [normalizeForMatch(basename(row.file)), row]));
  const candidates = plan.candidates.map((item) => {
    const row = byName.get(normalizeForMatch(item.fileName));
    if (!row?.text?.trim()) throw new Error(`OpenSuperWhisper 결과가 비어 있습니다: ${item.fileName}`);
    return { ...item, text: row.text.trim(), milliseconds: row.ms ?? null };
  });
  return { ...plan, candidates };
}

export function parseBenchPayload(value) {
  let payload = value;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload.trim());
    } catch (error) {
      throw new Error(`OpenSuperWhisper bench JSON을 읽을 수 없습니다: ${error.message}`);
    }
  }
  const rows = Array.isArray(payload) ? payload : payload?.results;
  if (!Array.isArray(rows)) throw new Error('OpenSuperWhisper bench 결과가 배열이 아닙니다.');
  return rows.map((row) => ({
    file: String(row?.file || row?.path || ''),
    ms: Number.isFinite(Number(row?.ms)) ? Number(row.ms) : null,
    text: String(row?.text || row?.transcript || '').trim()
  })).filter((row) => row.file);
}

export function candidatesForWindow(plan, windowId) {
  return plan.candidates.filter((candidate) => candidate.windowId === windowId);
}

export function chooseLocalCandidate(candidates) {
  const original = candidates.find((item) => item.kind === 'original' && item.text?.trim());
  const enhanced = candidates.find((item) => item.kind === 'enhanced' && item.text?.trim());
  return (original || enhanced || candidates.find((item) => item.text?.trim()))?.text?.trim() || '';
}

export function parsePiEventStream(output) {
  let assistantText = '';
  let assistantError = '';
  for (const line of String(output || '').split(/\r?\n/)) {
    if (!line.trim()) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.message?.role === 'assistant' && event.message.errorMessage) assistantError = event.message.errorMessage;
    if (event.type !== 'message_end' || event.message?.role !== 'assistant') continue;
    assistantText = (event.message.content || [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');
  }
  if (assistantError) throw new Error(assistantError);
  const cleaned = assistantText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  if (!cleaned) throw new Error('Pi가 검수 결과를 반환하지 않았습니다.');
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Pi 검수 JSON을 읽을 수 없습니다: ${error.message}`);
  }
}

export function validateReviewResult(raw, window) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Pi 검수 결과가 JSON 객체가 아닙니다.');
  if (raw.version !== 1) throw new Error('Pi 검수 결과 version은 1이어야 합니다.');
  const start = Number(raw.start);
  const end = Number(raw.end);
  const text = typeof raw.text === 'string' ? raw.text.trim() : '';
  if (!Number.isFinite(start) || start < 0 || !Number.isFinite(end) || end <= 0 || end <= start) {
    throw new Error('Pi 검수 결과의 시간 범위가 올바르지 않습니다.');
  }
  if (!text) throw new Error('Pi 검수 결과의 text가 비어 있습니다.');
  const corrections = validateCorrections(raw.corrections ?? []);
  const uncertainties = validateUncertainties(raw.uncertainties ?? []);
  const review = { version: 1, start, end, text, corrections, uncertainties };
  if (Math.abs(review.start - window.start) > 0.05 || Math.abs(review.end - window.end) > 0.05) {
    throw new Error(`Pi 검수 구간이 요청과 다릅니다: ${review.start}-${review.end}, 요청 ${window.start}-${window.end}`);
  }
  return review;
}

function validateCorrections(value) {
  if (!Array.isArray(value) || value.length > 50) throw new Error('Pi corrections는 최대 50개의 배열이어야 합니다.');
  return value.map((item) => {
    const before = typeof item?.before === 'string' ? item.before.trim() : '';
    const after = typeof item?.after === 'string' ? item.after.trim() : '';
    const reason = typeof item?.reason === 'string' ? item.reason.trim() : '';
    if (!before || !after || !reason) throw new Error('Pi correction의 before, after, reason이 필요합니다.');
    return { before, after, reason };
  });
}

function validateUncertainties(value) {
  if (!Array.isArray(value) || value.length > 50) throw new Error('Pi uncertainties는 최대 50개의 배열이어야 합니다.');
  return value.map((item) => {
    if (typeof item !== 'string' || !item.trim()) throw new Error('Pi uncertainty는 빈 문자열이 아니어야 합니다.');
    return item.trim();
  });
}

export function formatTimestamp(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, '0')).join(':');
}

export function renderTranscript({ sourceName, sourceHash, durationSeconds, mode, engine, language, reviewedByPi, segments }) {
  const uncertaintyCount = segments.reduce((count, segment) => count + (segment.uncertainties?.length || 0), 0);
  const lines = [
    '음성 전사',
    '',
    `원본: ${sourceName}`,
    `길이: ${formatTimestamp(durationSeconds)}`,
    `처리: ${engine}${reviewedByPi ? ' + Pi 문맥 검수' : ' (로컬 전사만)'}`,
    `모드: ${mode}`,
    `언어: ${language || '앱 설정'}`,
    `원본 SHA-256: ${sourceHash}`,
    `생성 시각: ${new Date().toISOString()}`,
    '',
    '---',
    ''
  ];

  for (const segment of segments) {
    lines.push(`[${formatTimestamp(segment.start)}–${formatTimestamp(segment.end)}]`);
    lines.push(segment.text.trim());
    if (segment.uncertainties?.length) {
      lines.push(`확인 필요: ${segment.uncertainties.join(' / ')}`);
    }
    lines.push('');
  }

  lines.push('---', '', `불확실 구간: ${uncertaintyCount}개`, '');
  return lines.join('\n');
}

function roundSeconds(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

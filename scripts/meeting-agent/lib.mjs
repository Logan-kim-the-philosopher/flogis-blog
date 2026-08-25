import { z } from 'zod';

export const CATEGORY_CONFIG = {
  project_meeting: {
    label: '프로젝트 회의',
    sanityType: 'meeting',
    peopleField: 'participants',
    tag: '프로젝트 회의'
  },
  study_session: {
    label: '스터디·세션',
    sanityType: 'study',
    peopleField: 'authors',
    tag: '스터디'
  },
  conversation: {
    label: '대화·인터뷰',
    sanityType: 'meeting',
    peopleField: 'participants',
    tag: '대화'
  },
  team_operations: {
    label: '조직·팀 운영',
    sanityType: 'meeting',
    peopleField: 'participants',
    tag: '팀 운영'
  }
};

const NullableText = z.string().trim().min(1).nullable();
const PublishedDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}, '실제 달력에 존재하는 YYYY-MM-DD 날짜여야 합니다.');

export const MeetingAgentResultSchema = z.object({
  version: z.literal(1),
  classification: z.object({
    category: z.enum(Object.keys(CATEGORY_CONFIG)),
    confidence: z.number().min(0).max(1),
    rationale: z.string().trim().min(1),
    secondaryCategories: z.array(z.enum(Object.keys(CATEGORY_CONFIG))).max(3).default([])
  }),
  metadata: z.object({
    title: z.string().trim().min(4).max(120),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    publishedAt: PublishedDate.nullable(),
    people: z.array(z.object({
      name: z.string().trim().min(1),
      role: z.string().trim().min(1).nullable().default(null)
    })).max(12),
    tags: z.array(z.string().trim().min(1).max(24)).max(8)
  }),
  overview: z.object({
    purpose: z.string().trim().min(1),
    summary: z.array(z.string().trim().min(1)).min(1).max(5),
    context: z.string().trim().min(1)
  }),
  agenda: z.array(z.object({
    title: z.string().trim().min(1),
    question: NullableText,
    discussion: z.array(z.object({
      speaker: z.string().trim().min(1),
      position: z.string().trim().min(1),
      rationale: NullableText
    })),
    options: z.array(z.string().trim().min(1)),
    conclusion: NullableText,
    status: z.enum(['decided', 'tentative', 'on_hold', 'open'])
  })).min(1),
  decisions: z.array(z.object({
    decision: z.string().trim().min(1),
    rationale: NullableText,
    status: z.enum(['decided', 'tentative', 'on_hold'])
  })),
  actions: z.array(z.object({
    owner: z.string().trim().min(1),
    task: z.string().trim().min(1),
    deliverable: NullableText,
    dueDate: z.string().trim().min(1).nullable(),
    status: z.enum(['planned', 'in_progress', 'done', 'unknown'])
  })),
  openQuestions: z.array(z.string().trim().min(1)),
  sourceNotes: z.object({
    uncertainties: z.array(z.string().trim().min(1)),
    omittedSmallTalk: z.array(z.string().trim().min(1))
  })
});

const STATUS_LABELS = {
  decided: '확정',
  tentative: '잠정 합의',
  on_hold: '보류',
  open: '미결정',
  planned: '예정',
  in_progress: '진행 중',
  done: '완료',
  unknown: '미정'
};

export function dateFromCreationTime(value, timeZone = 'Asia/Seoul') {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return PublishedDate.safeParse(raw).success ? raw : null;
  }

  const instant = new Date(raw);
  if (Number.isNaN(instant.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(instant);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  const date = `${part('year')}-${part('month')}-${part('day')}`;
  return PublishedDate.safeParse(date).success ? date : null;
}

export function resolvePublishedDate({ explicitDate, sourceMetadataDate, structuredDate } = {}) {
  const candidates = [
    ['explicit', explicitDate],
    ['source_metadata', sourceMetadataDate],
    ['structured', structuredDate]
  ];
  for (const [source, value] of candidates) {
    if (!value) continue;
    const date = dateFromCreationTime(value);
    if (date) return { date, source };
  }
  return { date: null, source: 'unresolved' };
}

function transcriptSpeaker(segment) {
  const speaker = segment?.speaker;
  if (typeof speaker === 'string' || typeof speaker === 'number') return String(speaker).trim();
  return String(
    speaker?.name || speaker?.label || speaker?.id ||
    segment?.speakerName || segment?.speakerLabel || segment?.label || ''
  ).trim();
}

function transcriptText(segment) {
  if (typeof segment === 'string') return segment.trim();
  return String(
    segment?.text || segment?.transcript || segment?.utterance ||
    segment?.content || segment?.recognizedText || ''
  ).trim();
}

function transcriptTimestamp(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return null;
  const seconds = Math.floor(numeric / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((item) => String(item).padStart(2, '0')).join(':');
}

function findTranscriptSegments(value) {
  if (!value || typeof value !== 'object') return null;
  for (const key of ['segments', 'utterances', 'transcripts', 'results']) {
    if (Array.isArray(value[key]) && value[key].some((item) => transcriptText(item))) return value[key];
  }
  for (const key of ['result', 'data', 'recognition', 'transcription']) {
    const nested = findTranscriptSegments(value[key]);
    if (nested) return nested;
  }
  return null;
}

export function normalizeTranscriptContent(raw, fileName = 'transcript.txt') {
  const input = String(raw || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!input) throw new Error('클로바 전사본이 비어 있습니다.');
  if (!/\.json$/i.test(fileName)) {
    return { text: `${input}\n`, format: 'text', segmentCount: null };
  }

  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new Error(`클로바 JSON을 읽을 수 없습니다: ${error.message}`);
  }

  const segments = findTranscriptSegments(parsed);
  if (segments) {
    const lines = segments.map((segment) => {
      const text = transcriptText(segment);
      if (!text) return null;
      const speaker = transcriptSpeaker(segment);
      const timestamp = transcriptTimestamp(segment?.start ?? segment?.startTime ?? segment?.startMs);
      return `${timestamp ? `[${timestamp}] ` : ''}${speaker ? `${speaker}: ` : ''}${text}`;
    }).filter(Boolean);
    if (lines.length) return { text: `${lines.join('\n')}\n`, format: 'clova-json', segmentCount: lines.length };
  }

  const fallbackText = transcriptText(parsed) || transcriptText(parsed?.result) || transcriptText(parsed?.data);
  if (fallbackText) return { text: `${fallbackText}\n`, format: 'clova-json-text', segmentCount: null };
  throw new Error('지원하는 발화 구간이나 text 필드를 클로바 JSON에서 찾지 못했습니다. TXT로 내보내 다시 시도하세요.');
}

export function normalizeName(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('ko-KR')
    .replace(/\s+/g, '')
    .replace(/(님|씨)$/u, '');
}

export function normalizeTags(tags, category) {
  const categoryTag = CATEGORY_CONFIG[category].tag;
  const normalized = [categoryTag, ...(tags || [])]
    .map((tag) => String(tag).trim())
    .filter(Boolean);

  return [...new Set(normalized)].slice(0, 8);
}

export function parsePiEventStream(output) {
  let assistantText = '';

  for (const line of String(output).split(/\r?\n/)) {
    if (!line.trim()) continue;

    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }

    if (event.type !== 'message_end' || event.message?.role !== 'assistant') continue;

    const text = (event.message.content || [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');

    if (text) assistantText = text;
  }

  if (!assistantText) {
    throw new Error('Pi 응답에서 assistant JSON 본문을 찾지 못했습니다. pi-events.jsonl을 확인하세요.');
  }

  return extractJsonObject(assistantText);
}

export function extractJsonObject(text) {
  const trimmed = String(text).trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const start = withoutFence.indexOf('{');
    const end = withoutFence.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(withoutFence.slice(start, end + 1));
    throw new Error('Pi 응답이 유효한 JSON 객체가 아닙니다.');
  }
}

function tableCell(value) {
  return String(value ?? '미정')
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|');
}

function textOrUnknown(value) {
  return value || '확인되지 않음';
}

export function renderMeetingMarkdown(result, source) {
  const category = CATEGORY_CONFIG[result.classification.category];
  const people = result.metadata.people.length
    ? result.metadata.people.map((person) => person.role ? `${person.name} (${person.role})` : person.name).join(', ')
    : '확인되지 않음';
  const lines = [
    '## 회의 기본 정보',
    '',
    `- **기록 유형:** ${category.label}`,
    `- **일자:** ${result.metadata.publishedAt || '확인 필요'}`,
    `- **참여자:** ${people}`,
    `- **목적:** ${result.overview.purpose}`,
    `- **원본:** ${source.originalName}`,
    '',
    '## 한눈에 보는 요약',
    '',
    ...result.overview.summary.map((item) => `- ${item}`),
    '',
    '## 논의 배경',
    '',
    result.overview.context,
    '',
    '## 안건별 상세 기록',
    ''
  ];

  result.agenda.forEach((agenda, index) => {
    lines.push(
      `### 안건 ${index + 1}. ${agenda.title}`,
      '',
      '**문제 또는 질문**',
      '',
      textOrUnknown(agenda.question),
      '',
      '**사람별 의견**',
      ''
    );

    if (agenda.discussion.length) {
      agenda.discussion.forEach((item) => {
        lines.push(
          `- **${item.speaker}:** ${item.position}${item.rationale ? ` — ${item.rationale}` : ''}`
        );
      });
    } else {
      lines.push('- 발화자와 의견이 원본에서 명확하게 확인되지 않음');
    }

    lines.push('', '**검토한 선택지**', '');
    lines.push(...(agenda.options.length ? agenda.options.map((item) => `- ${item}`) : ['- 원본에서 명시적인 선택지가 확인되지 않음']));
    lines.push(
      '',
      '**결론**',
      '',
      textOrUnknown(agenda.conclusion),
      '',
      `**상태:** ${STATUS_LABELS[agenda.status]}`,
      ''
    );
  });

  lines.push(
    '## 결정 사항',
    '',
    '| 상태 | 결정 내용 | 결정 이유 |',
    '|---|---|---|'
  );
  if (result.decisions.length) {
    result.decisions.forEach((item) => {
      lines.push(`| ${STATUS_LABELS[item.status]} | ${tableCell(item.decision)} | ${tableCell(item.rationale)} |`);
    });
  } else {
    lines.push('| 미결정 | 명시적으로 확정된 결정 사항 없음 | 원본에서 확인되지 않음 |');
  }

  lines.push(
    '',
    '## 행동 항목',
    '',
    '| 담당자 | 할 일 | 결과물 | 기한 | 상태 |',
    '|---|---|---|---|---|'
  );
  if (result.actions.length) {
    result.actions.forEach((item) => {
      lines.push(`| ${tableCell(item.owner)} | ${tableCell(item.task)} | ${tableCell(item.deliverable)} | ${tableCell(item.dueDate)} | ${STATUS_LABELS[item.status]} |`);
    });
  } else {
    lines.push('| 미정 | 원본에서 명시적인 행동 항목이 확인되지 않음 | 미정 | 미정 | 미정 |');
  }

  lines.push('', '## 미결 사항과 위험 요소', '');
  lines.push(...(result.openQuestions.length ? result.openQuestions.map((item) => `- ${item}`) : ['- 별도로 확인된 미결 사항 없음']));

  lines.push(
    '',
    '## 원본 및 검증 메모',
    '',
    `- 원본 파일: \`${source.originalName}\``,
    `- 입력 방식: ${source.inputKind === 'audio' ? '오디오 Whisper 전사 후 정리' : source.inputKind === 'external-transcript' ? '외부 전사본(클로바 등) 직접 정리' : '텍스트 원본 직접 정리'}`,
    `- 기록 분류 근거: ${result.classification.rationale}`,
    `- 분류 신뢰도: ${Math.round(result.classification.confidence * 100)}%`
  );

  if (result.sourceNotes.uncertainties.length) {
    lines.push('', '**확인이 필요한 내용**', '');
    lines.push(...result.sourceNotes.uncertainties.map((item) => `- ${item}`));
  }

  if (result.sourceNotes.omittedSmallTalk.length) {
    lines.push('', `- 본문에서 제외한 잡담·중복 내용: ${result.sourceNotes.omittedSmallTalk.length}건 (로컬 structured.json에서만 검토)`);
  }

  return `${lines.join('\n').trim()}\n`;
}

export function buildSanityDocument(result, body, personIds = []) {
  if (!result.metadata.publishedAt) {
    throw new Error('발행일을 확정할 수 없습니다. prepare 명령에 --date YYYY-MM-DD를 지정하세요.');
  }

  const config = CATEGORY_CONFIG[result.classification.category];
  const id = `${config.sanityType}-${result.metadata.slug}`;
  const references = personIds.map((personId, index) => ({
    _key: `${personId.replace(/[^a-zA-Z0-9_-]/g, '-')}-${index + 1}`,
    _type: 'reference',
    _ref: personId
  }));

  return {
    _id: id,
    _type: config.sanityType,
    title: result.metadata.title,
    slug: { _type: 'slug', current: result.metadata.slug },
    publishedAt: result.metadata.publishedAt,
    tags: normalizeTags(result.metadata.tags, result.classification.category),
    body,
    [config.peopleField]: references
  };
}

export function validateRenderedMarkdown(markdown) {
  const requiredHeadings = [
    '## 회의 기본 정보',
    '## 한눈에 보는 요약',
    '## 논의 배경',
    '## 안건별 상세 기록',
    '## 결정 사항',
    '## 행동 항목',
    '## 미결 사항과 위험 요소',
    '## 원본 및 검증 메모'
  ];
  const missing = requiredHeadings.filter((heading) => !markdown.includes(heading));
  if (missing.length) throw new Error(`회의 문서 필수 섹션 누락: ${missing.join(', ')}`);
  if (markdown.length < 400) throw new Error('회의 문서가 지나치게 짧습니다. 원본과 Pi 결과를 확인하세요.');
  return true;
}

export function isAudioPath(filePath) {
  return /\.(aac|aif|aiff|flac|m4a|mp3|mp4|ogg|opus|wav|webm)$/i.test(filePath);
}

export function isTextPath(filePath) {
  return /\.(md|markdown|txt)$/i.test(filePath);
}

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  MeetingAgentResultSchema,
  buildSanityDocument,
  dateFromCreationTime,
  isAudioPath,
  isTextPath,
  normalizeTranscriptContent,
  parsePiEventStream,
  renderMeetingMarkdown,
  renderReviewedTranscript,
  resolvePublishedDate,
  splitTranscriptForReview,
  validateTranscriptReview,
  validateRenderedMarkdown
} from '../scripts/meeting-agent/lib.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const fixtureSource = resolve(projectRoot, 'tests/fixtures/meeting-agent/project-meeting.txt');
const fixtureStructured = resolve(projectRoot, 'tests/fixtures/meeting-agent/project-meeting.structured.json');

async function loadFixture() {
  return MeetingAgentResultSchema.parse(JSON.parse(await readFile(fixtureStructured, 'utf8')));
}

test('구조화 결과를 표준 회의 Markdown으로 렌더링한다', async () => {
  const result = await loadFixture();
  const markdown = renderMeetingMarkdown(result, {
    originalName: 'project-meeting.txt',
    inputKind: 'text'
  });

  assert.equal(validateRenderedMarkdown(markdown), true);
  assert.match(markdown, /## 한눈에 보는 요약/);
  assert.match(markdown, /### 안건 1\. 발표의 중심 흐름/);
  assert.match(markdown, /\| 홍용재 \| 3분 데모 시나리오/);
});

test('분류에 따라 meeting 또는 study Sanity 문서를 만든다', async () => {
  const result = await loadFixture();
  const body = renderMeetingMarkdown(result, { originalName: 'source.txt', inputKind: 'text' });
  const meeting = buildSanityDocument(result, body, ['person-heesung-kim', 'person-yongjae-hong']);
  assert.equal(meeting._type, 'meeting');
  assert.equal(meeting.participants.length, 2);
  assert.equal('coverImage' in meeting, false);

  const studyResult = structuredClone(result);
  studyResult.classification.category = 'study_session';
  const study = buildSanityDocument(studyResult, body, ['person-heesung-kim']);
  assert.equal(study._type, 'study');
  assert.equal(study.authors.length, 1);
});

test('Pi JSONL 이벤트에서 마지막 assistant JSON을 추출한다', () => {
  const output = [
    JSON.stringify({ type: 'message_end', message: { role: 'user', content: [{ type: 'text', text: 'input' }] } }),
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: '{"ok":true}' }] } })
  ].join('\n');
  assert.deepEqual(parsePiEventStream(output), { ok: true });
});

test('Pi 인증 오류 이벤트를 일반 JSON 누락과 구분한다', () => {
  const output = JSON.stringify({
    type: 'message_end',
    message: {
      role: 'assistant',
      content: [],
      stopReason: 'error',
      errorMessage: 'OAuth refresh failed: refresh_token_invalidated'
    }
  });
  assert.throws(
    () => parsePiEventStream(output),
    /Pi 실행 실패: OAuth refresh failed: refresh_token_invalidated/
  );
});

test('텍스트와 오디오 확장자를 구분한다', () => {
  assert.equal(isTextPath('회의록.TXT'), true);
  assert.equal(isTextPath('회의록.pdf'), false);
  assert.equal(isAudioPath('회의.m4a'), true);
  assert.equal(isAudioPath('회의.webm'), true);
});

test('긴 원시 전사를 누락 없이 검수 가능한 크기로 나눈다', () => {
  const source = Array.from({ length: 180 }, (_, index) => `문장 ${index + 1}의 논의 내용을 그대로 보존합니다.`).join(' ');
  const chunks = splitTranscriptForReview(source, 1_000);
  assert.ok(chunks.length > 1);
  assert.equal(chunks.every((chunk) => chunk.length <= 1_000), true);
  assert.equal(chunks.join(' ').replace(/\s+/g, ' '), source.replace(/\s+/g, ' '));
});

test('Pi 검수 전사는 요약과 불명확 표시 누락을 거부한다', () => {
  const raw = '코디스텟과 룸 실행을 논의했고 담당자는 정연님으로 들렸습니다. '.repeat(12);
  const valid = validateTranscriptReview(raw, {
    version: 1,
    cleanedText: 'Cody Stat과 Loom 실행을 논의했고 담당자는 [불명확: 정연님?]으로 들렸습니다. '.repeat(12),
    corrections: [{ before: '코디스텟과 룸', after: 'Cody Stat과 Loom', reason: '프로젝트 고유명사 문맥' }],
    uncertainties: [{ excerpt: '[불명확: 정연님?]', reason: '이름을 원문만으로 확정할 수 없음' }]
  });
  assert.equal(valid.corrections.length, 1);
  assert.throws(() => validateTranscriptReview(raw, {
    version: 1,
    cleanedText: '짧은 요약입니다.',
    corrections: [],
    uncertainties: []
  }), /지나치게 짧습니다/);
  assert.throws(() => validateTranscriptReview(raw, {
    version: 1,
    cleanedText: raw,
    corrections: [],
    uncertainties: [{ excerpt: '정연님', reason: '이름 불명확' }]
  }), /\[불명확\] 표시/);
});

test('검수 전사 Markdown에 원시본 안내·교정·불확실성을 기록한다', () => {
  const markdown = renderReviewedTranscript({
    originalName: '회의.m4a',
    engine: 'OpenSuperWhisper 0.12.2 + Pi 문맥 검수',
    model: 'ggml-large-v3-turbo.bin',
    language: 'ko',
    cleanedText: 'Cody Stat 담당자는 [불명확: 정연님?]입니다.',
    corrections: [{ before: '코디스텟', after: 'Cody Stat', reason: '고유명사' }],
    uncertainties: [{ excerpt: '[불명확: 정연님?]', reason: '이름 확인 필요' }]
  });
  assert.match(markdown, /## 검수 전사/);
  assert.match(markdown, /transcript\.raw\.txt/);
  assert.match(markdown, /코디스텟.*Cody Stat/);
  assert.match(markdown, /\[불명확: 정연님\?\]/);
});

test('오디오 creation_time을 서울 날짜로 바꾸고 명시 날짜를 우선한다', () => {
  assert.equal(dateFromCreationTime('2026-08-18T15:30:42Z'), '2026-08-19');
  assert.deepEqual(resolvePublishedDate({
    explicitDate: '2026-08-20',
    sourceMetadataDate: '2026-08-19',
    structuredDate: '2026-08-18'
  }), { date: '2026-08-20', source: 'explicit' });
  assert.deepEqual(resolvePublishedDate({
    sourceMetadataDate: '2026-08-19',
    structuredDate: '2026-08-18'
  }), { date: '2026-08-19', source: 'source_metadata' });
});

test('클로바 JSON 발화 구간을 화자·시간이 보존된 텍스트로 정규화한다', () => {
  const normalized = normalizeTranscriptContent(JSON.stringify({
    result: {
      segments: [
        { start: 1_000, speaker: { name: '홍용재' }, text: '첫 번째 의견입니다.' },
        { start: 62_000, speaker: { label: '김희성' }, text: '결정하겠습니다.' }
      ]
    }
  }), 'clova.json');
  assert.equal(normalized.format, 'clova-json');
  assert.equal(normalized.segmentCount, 2);
  assert.match(normalized.text, /\[00:00:01\] 홍용재: 첫 번째 의견입니다\./);
  assert.match(normalized.text, /\[00:01:02\] 김희성: 결정하겠습니다\./);
});

test('존재하지 않는 발행일은 거부한다', async () => {
  const result = await loadFixture();
  result.metadata.publishedAt = '2026-02-30';
  assert.throws(() => MeetingAgentResultSchema.parse(result));
});

test('fixture로 prepare dry run을 완료한다', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'flogi-meeting-agent-'));
  try {
    execFileSync(process.execPath, [
      resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
      'prepare',
      fixtureSource,
      '--structured-input', fixtureStructured,
      '--offline',
      '--people', 'person-heesung-kim,person-yongjae-hong',
      '--output', outputDir
    ], { cwd: projectRoot, stdio: 'pipe' });

    const manifest = JSON.parse(await readFile(resolve(outputDir, 'run.json'), 'utf8'));
    const document = JSON.parse(await readFile(resolve(outputDir, 'sanity-document.json'), 'utf8'));
    assert.equal(manifest.status, 'preview');
    assert.equal(manifest.publishable, true);
    assert.equal(document._id, 'meeting-flogi-demo-planning-round-5-2026-08-25');
    assert.equal(document.participants.length, 2);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('오디오와 외부 전사본을 함께 주면 creation_time 날짜를 쓰고 Whisper를 건너뛴다', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'flogi-meeting-external-'));
  const binDir = resolve(outputDir, 'bin');
  const audioPath = resolve(outputDir, 'meeting.m4a');
  const transcriptPath = resolve(outputDir, 'clova.txt');
  try {
    await mkdir(binDir);
    await writeFile(audioPath, 'fake audio');
    await writeFile(transcriptPath, '홍용재: 발표자료를 단순화합시다.\n김희성: 동의합니다.\n');
    const ffprobePath = resolve(binDir, 'ffprobe');
    await writeFile(ffprobePath, '#!/bin/sh\nprintf \'%s\\n\' \'{"format":{"duration":"120","tags":{"creation_time":"2026-08-18T11:30:42Z"}}}\'\n');
    await chmod(ffprobePath, 0o755);
    execFileSync(process.execPath, [
      resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
      'prepare', audioPath,
      '--transcript', transcriptPath,
      '--structured-input', fixtureStructured,
      '--offline',
      '--people', 'person-heesung-kim',
      '--output', outputDir
    ], {
      cwd: projectRoot,
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH}` },
      stdio: 'pipe'
    });

    const manifest = JSON.parse(await readFile(resolve(outputDir, 'run.json'), 'utf8'));
    const structured = JSON.parse(await readFile(resolve(outputDir, 'structured.json'), 'utf8'));
    assert.equal(structured.metadata.publishedAt, '2026-08-18');
    assert.equal(manifest.dateResolution.source, 'source_metadata');
    assert.equal(manifest.transcription.engine, 'external-transcript');
    assert.equal(manifest.source.inputKind, 'external-transcript');
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('오디오는 OpenSuperWhisper 원시본과 Pi 검수 전사본을 모두 보존한다', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'flogi-meeting-opensuperwhisper-'));
  const binDir = resolve(outputDir, 'bin');
  const audioPath = resolve(outputDir, 'meeting.m4a');
  try {
    await mkdir(binDir);
    await writeFile(audioPath, 'fake audio');
    const ffprobePath = resolve(binDir, 'ffprobe');
    const ffmpegPath = resolve(binDir, 'ffmpeg');
    const openSuperWhisperPath = resolve(binDir, 'OpenSuperWhisper');
    const piPath = resolve(binDir, 'pi');
    await writeFile(ffprobePath, '#!/bin/sh\nprintf \'%s\\n\' \'{"format":{"duration":"20","tags":{"creation_time":"2026-09-08T01:00:00Z"}}}\'\n');
    await writeFile(ffmpegPath, '#!/bin/sh\nfor argument in "$@"; do output="$argument"; done\nprintf \'RIFF\' > "$output"\n');
    await writeFile(openSuperWhisperPath, `#!/usr/bin/env node
console.log(JSON.stringify({ file: process.argv[3], text: '코디스텟에서 룸 실행을 결정했습니다. 담당자는 정연님으로 들립니다.' }));
console.error('mock OpenSuperWhisper');
`);
    await writeFile(piPath, `#!/usr/bin/env node
const review = {
  version: 1,
  cleanedText: 'Cody Stat에서 Loom 실행을 결정했습니다. 담당자는 [불명확: 정연님?]으로 들립니다.',
  corrections: [
    { before: '코디스텟', after: 'Cody Stat', reason: '프로젝트 고유명사 문맥' },
    { before: '룸', after: 'Loom', reason: '프로젝트 도구 문맥' }
  ],
  uncertainties: [
    { excerpt: '[불명확: 정연님?]', reason: '이름을 원시 전사만으로 확정할 수 없음' }
  ]
};
console.log(JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: JSON.stringify(review) }] } }));
`);
    await Promise.all([ffprobePath, ffmpegPath, openSuperWhisperPath, piPath].map((path) => chmod(path, 0o755)));

    execFileSync(process.execPath, [
      resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
      'prepare', audioPath,
      '--date', '2026-09-08',
      '--structured-input', fixtureStructured,
      '--offline',
      '--people', 'person-heesung-kim',
      '--output', outputDir
    ], {
      cwd: projectRoot,
      env: {
        ...process.env,
        PATH: `${binDir}:${process.env.PATH}`,
        MEETING_AGENT_OPENSUPERWHISPER_BIN: openSuperWhisperPath
      },
      stdio: 'pipe'
    });

    const manifest = JSON.parse(await readFile(resolve(outputDir, 'run.json'), 'utf8'));
    const rawTranscript = await readFile(resolve(outputDir, 'transcript.raw.txt'), 'utf8');
    const reviewedTranscript = await readFile(resolve(outputDir, 'transcript.cleaned.md'), 'utf8');
    const structureRequest = await readFile(resolve(outputDir, 'pi-request.md'), 'utf8');
    const review = JSON.parse(await readFile(resolve(outputDir, 'transcript-review.json'), 'utf8'));
    assert.equal(manifest.status, 'preview');
    assert.equal(manifest.transcription.engine, 'opensuperwhisper');
    assert.equal(manifest.transcription.review.correctionCount, 2);
    assert.equal(manifest.files.rawTranscript, 'transcript.raw.txt');
    assert.equal(manifest.files.reviewedTranscript, 'transcript.cleaned.md');
    assert.match(rawTranscript, /코디스텟에서 룸 실행/);
    assert.match(reviewedTranscript, /Cody Stat에서 Loom 실행/);
    assert.match(reviewedTranscript, /\[불명확: 정연님\?\]/);
    assert.match(structureRequest, /오디오 OpenSuperWhisper 전사 \+ Pi 문맥 검수/);
    assert.match(structureRequest, /Cody Stat에서 Loom 실행/);
    assert.doesNotMatch(structureRequest, /코디스텟에서 룸 실행/);
    assert.equal(review.uncertaintyCount, 1);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('날짜 실패 run을 기존 전사·구조화 결과로 resume한다', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'flogi-meeting-resume-'));
  const noDateFixture = resolve(outputDir, 'no-date.json');
  try {
    const raw = JSON.parse(await readFile(fixtureStructured, 'utf8'));
    raw.metadata.publishedAt = null;
    await writeFile(noDateFixture, `${JSON.stringify(raw)}\n`);
    const failed = spawnSync(process.execPath, [
      resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
      'prepare', fixtureSource,
      '--structured-input', noDateFixture,
      '--offline',
      '--people', 'person-heesung-kim',
      '--output', outputDir
    ], { cwd: projectRoot, encoding: 'utf8' });
    assert.notEqual(failed.status, 0);
    const failedManifest = JSON.parse(await readFile(resolve(outputDir, 'run.json'), 'utf8'));
    assert.equal(failedManifest.status, 'needs_input');
    assert.equal(failedManifest.recoverable, true);

    execFileSync(process.execPath, [
      resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
      'resume', outputDir,
      '--date', '2026-08-25',
      '--offline',
      '--people', 'person-heesung-kim'
    ], { cwd: projectRoot, stdio: 'pipe' });
    const recovered = JSON.parse(await readFile(resolve(outputDir, 'run.json'), 'utf8'));
    const markdown = await readFile(resolve(outputDir, 'post.md'), 'utf8');
    assert.equal(recovered.status, 'preview');
    assert.equal(recovered.recoveredWithoutRetranscription, true);
    assert.match(markdown, /\*\*일자:\*\* 2026-08-25/);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

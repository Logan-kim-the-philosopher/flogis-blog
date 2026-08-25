import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  MeetingAgentResultSchema,
  buildSanityDocument,
  isAudioPath,
  isTextPath,
  parsePiEventStream,
  renderMeetingMarkdown,
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

test('텍스트와 오디오 확장자를 구분한다', () => {
  assert.equal(isTextPath('회의록.TXT'), true);
  assert.equal(isTextPath('회의록.pdf'), false);
  assert.equal(isAudioPath('회의.m4a'), true);
  assert.equal(isAudioPath('회의.webm'), true);
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
    assert.equal(document._id, 'meeting-flogy-demo-planning-round-5-2026-08-25');
    assert.equal(document.participants.length, 2);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

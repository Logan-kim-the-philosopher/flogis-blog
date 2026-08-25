import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  buildPrepareArgs,
  buildPublishArgs,
  createExtensionRunDir,
  mayWriteToSanity,
  parseMeetingCommand,
  publicUrlForDocument,
  routeForDocument,
  tokenizeCommandLine
} from '../.pi/lib/meeting-workflow.mjs';

const projectRoot = resolve(import.meta.dirname, '..');

test('/meeting 인자에서 공백 경로와 옵션을 안전하게 파싱한다', () => {
  assert.deepEqual(
    tokenizeCommandLine('"/tmp/회의 기록.txt" --date 2026-08-25 --no-publish'),
    ['/tmp/회의 기록.txt', '--date', '2026-08-25', '--no-publish']
  );
  assert.deepEqual(
    parseMeetingCommand('"/tmp/회의 기록.txt" --date 2026-08-25 --people=a,b --no-publish'),
    {
      sourcePath: '/tmp/회의 기록.txt',
      date: '2026-08-25',
      people: 'a,b',
      noPublish: true
    }
  );
});

test('/meeting은 잘못된 category와 여러 positional 경로를 거부한다', () => {
  assert.throws(() => parseMeetingCommand('/tmp/a.txt --category unknown'), /지원하지 않는 category/);
  assert.throws(() => parseMeetingCommand('/tmp/a file.txt'), /큰따옴표/);
});

test('extension prepare는 프로젝트 내부 run과 기존 엔진 인자를 만든다', () => {
  const runDir = createExtensionRunDir(projectRoot, '/tmp/회의 기록.txt', new Date('2026-08-25T04:00:00Z'));
  assert.equal(runDir, resolve(projectRoot, '.meeting-agent/runs/pi-20260825T040000Z-회의-기록'));
  assert.deepEqual(buildPrepareArgs(projectRoot, {
    sourcePath: '/tmp/회의 기록.txt',
    category: 'project_meeting',
    people: 'person-a,person-b',
    offline: true
  }, runDir), [
    resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
    'prepare',
    '/tmp/회의 기록.txt',
    '--output',
    runDir,
    '--category',
    'project_meeting',
    '--people',
    'person-a,person-b',
    '--offline'
  ]);
});

test('발행 인자는 validate-only와 실제 발행을 명확히 구분한다', () => {
  const validateArgs = buildPublishArgs(projectRoot, '/tmp/run', 'meeting-slug', {
    people: 'person-a',
    validateOnly: true
  });
  const publishArgs = buildPublishArgs(projectRoot, '/tmp/run', 'meeting-slug', {
    people: 'person-a',
    validateOnly: false
  });
  assert.equal(validateArgs.includes('--validate-only'), true);
  assert.equal(publishArgs.includes('--validate-only'), false);
  assert.deepEqual(validateArgs.slice(0, 5), [
    resolve(projectRoot, 'scripts/meeting-agent/index.mjs'),
    'publish',
    '/tmp/run',
    '--confirm',
    'meeting-slug'
  ]);
});

test('Sanity 쓰기는 UI와 명시 승인 두 조건이 모두 있어야 허용된다', () => {
  assert.equal(mayWriteToSanity({ hasUI: false, confirmed: true }), false);
  assert.equal(mayWriteToSanity({ hasUI: true, confirmed: false }), false);
  assert.equal(mayWriteToSanity({ hasUI: true, confirmed: true }), true);
});

test('문서 타입에 맞는 공개 상세 URL을 만든다', () => {
  const meeting = { _type: 'meeting', slug: { current: 'round-5' } };
  const study = { _type: 'study', slug: { current: 'linux-1' } };
  assert.equal(routeForDocument(meeting), '/meetings/round-5');
  assert.equal(routeForDocument(study), '/study/linux-1');
  assert.equal(publicUrlForDocument(meeting, 'https://blog.example.com/'), 'https://blog.example.com/meetings/round-5');
});

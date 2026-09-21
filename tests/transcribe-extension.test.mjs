import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  buildTranscribeArgs,
  buildTranscribeResumeArgs,
  createTranscribeRunDir,
  formatTranscribeProgress,
  parseTranscribeCommand,
  tokenizeTranscribeCommand
} from '../.pi/lib/transcribe-workflow.mjs';

const projectRoot = resolve(import.meta.dirname, '..');

test('/transcribe 인자에서 파일명과 안전 옵션을 파싱한다', () => {
  assert.deepEqual(
    tokenizeTranscribeCommand('"26-09-20 node 세션.m4a" --mode accurate --local-only'),
    ['26-09-20 node 세션.m4a', '--mode', 'accurate', '--local-only']
  );
  assert.deepEqual(
    parseTranscribeCommand('"26-09-20 node 세션.m4a" --mode=fast --root "/tmp/바탕 화면" --replace'),
    { source: '26-09-20 node 세션.m4a', mode: 'fast', root: '/tmp/바탕 화면', replace: true }
  );
});

test('/transcribe은 알 수 없는 옵션, mode, 여러 파일을 거부한다', () => {
  assert.throws(() => parseTranscribeCommand('audio.m4a --unknown'), /지원하지 않는/);
  assert.throws(() => parseTranscribeCommand('audio.m4a --mode slow'), /mode/);
  assert.throws(() => parseTranscribeCommand('audio one.m4a'), /큰따옴표/);
});

test('Pi extension 실행 인자와 run 디렉터리를 만든다', () => {
  const runDir = createTranscribeRunDir(projectRoot, '음성 회의.m4a', new Date('2026-09-21T01:02:03Z'));
  assert.equal(runDir, resolve(projectRoot, '.transcribe-agent/runs/pi-20260921T010203Z-음성-회의'));
  assert.deepEqual(buildTranscribeArgs(projectRoot, {
    source: '음성 회의',
    mode: 'accurate',
    root: '/tmp/Desktop',
    localOnly: true,
    replace: true
  }, runDir), [
    resolve(projectRoot, 'scripts/transcribe-agent/index.mjs'),
    'run',
    '음성 회의',
    '--run-dir',
    runDir,
    '--mode',
    'accurate',
    '--root',
    '/tmp/Desktop',
    '--local-only',
    '--replace'
  ]);
});

test('resume 인자와 진행률 표시가 일관된다', () => {
  assert.deepEqual(buildTranscribeResumeArgs(projectRoot, '/tmp/run', {
    model: 'provider/model',
    thinking: 'high'
  }), [
    resolve(projectRoot, 'scripts/transcribe-agent/index.mjs'),
    'resume',
    '/tmp/run',
    '--model',
    'provider/model',
    '--thinking',
    'high'
  ]);
  assert.equal(
    formatTranscribeProgress({ phase: 'reviewing', current: 2, total: 5 }, 125),
    '전사: Pi 문맥 검수 2/5 · 02:05'
  );
});

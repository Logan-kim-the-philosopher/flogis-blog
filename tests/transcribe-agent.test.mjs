import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chmod, mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import test from 'node:test';
import {
  attachBenchResults,
  buildEqualSegments,
  buildTranscriptionPlan,
  formatTimestamp,
  normalizeForMatch
} from '../scripts/transcribe-agent/lib.mjs';

const execFileAsync = promisify(execFile);
const projectRoot = resolve(import.meta.dirname, '..');
const cli = resolve(projectRoot, 'scripts/transcribe-agent/index.mjs');

test('유니코드 표기와 균등 구간을 안정적으로 정규화한다', () => {
  assert.equal(normalizeForMatch('연진.M4A'), normalizeForMatch('연진.m4a'));
  assert.deepEqual(buildEqualSegments(121, 60), [
    { index: 0, start: 0, end: 40.333 },
    { index: 1, start: 40.333, end: 80.667 },
    { index: 2, start: 80.667, end: 121 }
  ]);
  assert.equal(formatTimestamp(3661.8), '01:01:01');
});

test('정확 모드는 창마다 원본·향상·세부·문맥 후보를 만든다', () => {
  const plan = buildTranscriptionPlan(61, 'accurate');
  assert.equal(plan.windows.length, 2);
  assert.equal(plan.candidates.length, 10);
  assert.deepEqual(new Set(plan.candidates.map((item) => item.kind)), new Set(['original', 'enhanced', 'fine-a', 'fine-b', 'context']));
  const payload = plan.candidates.map((item) => ({ file: `/tmp/${item.fileName}`, ms: 3, text: item.kind }));
  const attached = attachBenchResults(plan, payload);
  assert.equal(attached.candidates[0].milliseconds, 3);
  assert.equal(attached.candidates[0].text, 'original');
});

test('파일명 검색, 고정밀 검수, 원본 해시, 충돌 방지를 통합 검증한다', async () => {
  const fixture = await makeFixture();
  const composed = '26-09-20_연진님_세션';
  const decomposedFile = `${composed.normalize('NFD')}.m4a`;
  const sourcePath = resolve(fixture.desktop, decomposedFile);
  await writeFile(sourcePath, 'immutable-audio-source');
  const beforeHash = hash(await readFile(sourcePath));

  const first = await invoke(['run', composed, '--root', fixture.desktop], fixture.env);
  const result = JSON.parse(first.stdout);
  assert.equal(result.status, 'completed');
  assert.equal(result.reviewedByPi, true);
  assert.equal(result.uncertaintyCount, 2);
  assert.equal(result.outputPath, resolve(fixture.desktop, `${composed}_전사.txt`));
  const output = await readFile(result.outputPath, 'utf8');
  assert.match(output, /\[00:00:00–00:00:30\]/);
  assert.match(output, /Pi 검수 전사 1/);
  assert.equal(hash(await readFile(sourcePath)), beforeHash);
  assert.equal((await stat(result.outputPath)).size, result.outputSize);

  await assert.rejects(
    invoke(['run', composed, '--root', fixture.desktop], fixture.env),
    /결과 파일이 이미 있습니다/
  );
});

test('실패한 run은 보존된 후보부터 재개한다', async () => {
  const fixture = await makeFixture();
  const sourcePath = resolve(fixture.desktop, 'resume-audio.wav');
  const runDir = resolve(fixture.root, 'saved-run');
  await writeFile(sourcePath, 'resume-source');
  await assert.rejects(
    invoke(['run', 'resume-audio', '--root', fixture.desktop, '--run-dir', runDir], { ...fixture.env, MOCK_PI_FAIL: '1' }),
    /mock Pi failure/
  );
  await stat(resolve(runDir, 'candidates.json'));
  const resumed = await invoke(['resume', runDir], fixture.env);
  const result = JSON.parse(resumed.stdout);
  assert.equal(result.status, 'completed');
  assert.equal(result.runDir, runDir);
  assert.match(await readFile(result.outputPath, 'utf8'), /Pi 검수 전사/);
});

async function makeFixture() {
  const root = await mkdtemp(resolve(tmpdir(), 'transcribe-agent-'));
  const desktop = resolve(root, 'Desktop');
  const bin = resolve(root, 'bin');
  await mkdir(desktop);
  await mkdir(bin);
  const ffprobe = await executable(bin, 'ffprobe', `
console.log(JSON.stringify({format:{duration:"61"}}));
`);
  const ffmpeg = await executable(bin, 'ffmpeg', `
const fs = await import('node:fs/promises');
await fs.writeFile(process.argv.at(-1), 'wav');
`);
  const osw = await executable(bin, 'OpenSuperWhisper', `
const fs = await import('node:fs/promises');
const path = await import('node:path');
const dir = process.argv[3];
const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.wav')).map((file) => path.resolve(dir, file));
console.log(JSON.stringify(files.map((file) => ({file, ms: 2, text: '후보 ' + path.basename(file)}))));
`);
  const pi = await executable(bin, 'pi', `
if (process.env.MOCK_PI_FAIL === '1') { console.error('mock Pi failure'); process.exit(2); }
const fs = await import('node:fs/promises');
const requestArg = process.argv.find((arg) => arg.startsWith('@'));
const request = JSON.parse(await fs.readFile(requestArg.slice(1), 'utf8'));
const index = Number(request.target.start > 0) + 1;
const payload = {version:1,start:request.target.start,end:request.target.end,text:'Pi 검수 전사 ' + index,corrections:[],uncertainties:['고유명사 확인']};
console.log(JSON.stringify({type:'message_end',message:{role:'assistant',content:[{type:'text',text:JSON.stringify(payload)}]}}));
`);
  return {
    root,
    desktop,
    env: {
      ...process.env,
      TRANSCRIBE_AGENT_FFPROBE_BIN: ffprobe,
      TRANSCRIBE_AGENT_FFMPEG_BIN: ffmpeg,
      TRANSCRIBE_AGENT_OPENSUPERWHISPER_BIN: osw,
      TRANSCRIBE_AGENT_PI_BIN: pi,
      TRANSCRIBE_AGENT_SKIP_APP_SETTINGS: '1'
    }
  };
}

async function executable(dir, name, body) {
  const filePath = resolve(dir, name);
  await writeFile(filePath, `#!/usr/bin/env node\n${body.trim()}\n`, 'utf8');
  await chmod(filePath, 0o755);
  return filePath;
}

async function invoke(args, env) {
  return execFileAsync(process.execPath, [cli, ...args], { cwd: projectRoot, env, maxBuffer: 10 * 1024 * 1024 });
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

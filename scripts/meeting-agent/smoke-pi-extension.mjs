#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { access, readdir } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '../..');
const extensionPath = resolve(projectRoot, '.pi/extensions/meeting-workflow.ts');
const fixtureSource = resolve(projectRoot, 'tests/fixtures/meeting-agent/project-meeting.txt');
const fixtureStructured = resolve(projectRoot, 'tests/fixtures/meeting-agent/project-meeting.structured.json');
const runsRoot = resolve(projectRoot, '.meeting-agent/runs');
const beforeRuns = new Set(await listRuns());
const slug = `pi-extension-cancel-smoke-${Date.now()}`;

const child = spawn('pi', [
  '--mode', 'rpc',
  '--no-session',
  '--no-skills',
  '--no-prompt-templates',
  '--no-context-files',
  '--no-builtin-tools',
  '--approve'
], {
  cwd: projectRoot,
  env: process.env,
  stdio: ['pipe', 'pipe', 'pipe']
});

let stderr = '';
let commandsLoaded = false;
let editorSeen = false;
let confirmationSeen = false;
let cancellationSeen = false;
let promptSent = false;
let settled = false;

child.stderr.on('data', (chunk) => {
  stderr += chunk.toString('utf8');
});

const timeout = setTimeout(() => finish(new Error('Pi extension smoke test가 5분 안에 끝나지 않았습니다.')), 5 * 60 * 1000);
const lines = createInterface({ input: child.stdout });

lines.on('line', async (line) => {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }

  if (message.type === 'response' && message.command === 'get_commands' && message.id === 'commands') {
    const allCommands = message.data?.commands || [];
    const extensionCommands = allCommands.filter((command) => command.sourceInfo?.path === extensionPath);
    const commandNames = extensionCommands.map((command) => command.name);
    commandsLoaded = commandNames.includes('meeting') && commandNames.includes('meeting-resume') && commandNames.includes('meeting-status');
    if (!commandsLoaded) {
      finish(new Error(`Pi에 meeting 명령이 등록되지 않았습니다: ${JSON.stringify(allCommands)}`));
      return;
    }
    if (!promptSent) {
      promptSent = true;
      send({
        id: 'meeting-cancel',
        type: 'prompt',
        message: `/meeting "${fixtureSource}" --structured-input "${fixtureStructured}" --people person-heesung-kim,person-yongjae-hong --slug ${slug}`
      });
    }
    return;
  }

  if (message.type === 'extension_ui_request') {
    if (message.method === 'editor') {
      editorSeen = true;
      send({ type: 'extension_ui_response', id: message.id, value: message.prefill });
    } else if (message.method === 'confirm') {
      confirmationSeen = true;
      send({ type: 'extension_ui_response', id: message.id, confirmed: false });
    } else if (message.method === 'notify' && String(message.message).includes('발행을 취소')) {
      cancellationSeen = true;
    }
    return;
  }

  if (message.type === 'response' && message.command === 'prompt' && message.id === 'meeting-cancel') {
    try {
      await verifyResult();
      finish();
    } catch (error) {
      finish(error);
    }
  }
});

child.on('error', finish);
child.on('exit', (code) => {
  if (!settled) finish(new Error(`Pi RPC가 예기치 않게 종료됐습니다 (exit ${code}). ${stderr.trim()}`));
});

send({ id: 'commands', type: 'get_commands' });

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

async function verifyResult() {
  const afterRuns = await listRuns();
  const createdRuns = afterRuns.filter((name) => !beforeRuns.has(name) && name.includes('project-meeting'));
  if (!commandsLoaded || !editorSeen || !confirmationSeen || !cancellationSeen) {
    throw new Error(`UI 흐름 누락: commands=${commandsLoaded}, editor=${editorSeen}, confirm=${confirmationSeen}, cancel=${cancellationSeen}`);
  }
  if (createdRuns.length !== 1) throw new Error(`새 Pi run을 하나 찾을 수 없습니다: ${createdRuns.join(', ')}`);

  const runDir = resolve(runsRoot, createdRuns[0]);
  try {
    await access(resolve(runDir, 'publish-result.json'));
    throw new Error('발행 취소 후 publish-result.json이 생성됐습니다.');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  console.log(JSON.stringify({
    ok: true,
    commands: ['meeting', 'meeting-resume', 'meeting-status'],
    previewEditor: true,
    publishConfirmation: 'cancelled',
    sanityWrite: false,
    runDir
  }, null, 2));
}

async function listRuns() {
  try {
    return await readdir(runsRoot);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

function finish(error) {
  if (settled) return;
  settled = true;
  clearTimeout(timeout);
  lines.close();
  child.stdin.end();
  child.kill('SIGTERM');
  if (error) {
    console.error(error.message);
    if (stderr.trim()) console.error(stderr.trim());
    process.exitCode = 1;
  }
}

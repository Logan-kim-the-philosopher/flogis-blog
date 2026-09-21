#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '../..');
const extensionPath = resolve(projectRoot, '.pi/extensions/transcribe-workflow.ts');
const child = spawn('pi', [
  '--mode', 'rpc',
  '--no-session',
  '--no-skills',
  '--no-prompt-templates',
  '--no-context-files',
  '--no-builtin-tools',
  '--approve'
], { cwd: projectRoot, env: process.env, stdio: ['pipe', 'pipe', 'pipe'] });

let stderr = '';
let settled = false;
child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf8'); });
const lines = createInterface({ input: child.stdout });
const timeout = setTimeout(() => finish(new Error('Pi 전사 extension smoke test가 30초 안에 끝나지 않았습니다.')), 30_000);

lines.on('line', (line) => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (message.type !== 'response' || message.command !== 'get_commands' || message.id !== 'commands') return;
  const names = (message.data?.commands || [])
    .filter((command) => command.sourceInfo?.path === extensionPath)
    .map((command) => command.name);
  const expected = ['transcribe', 'transcribe-resume', 'transcribe-status'];
  const missing = expected.filter((name) => !names.includes(name));
  if (missing.length) finish(new Error(`Pi에 전사 명령이 등록되지 않았습니다: ${missing.join(', ')}`));
  else {
    console.log(JSON.stringify({ ok: true, commands: expected, extensionPath }, null, 2));
    finish();
  }
});

child.on('error', finish);
child.on('exit', (code) => {
  if (!settled) finish(new Error(`Pi RPC가 예기치 않게 종료됐습니다 (exit ${code}). ${stderr.trim()}`));
});
child.stdin.write(`${JSON.stringify({ id: 'commands', type: 'get_commands' })}\n`);

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

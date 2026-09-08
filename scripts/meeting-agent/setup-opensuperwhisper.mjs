#!/usr/bin/env node

import { access, stat } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '../..');
const defaultExecutable = '/Applications/OpenSuperWhisper.app/Contents/MacOS/OpenSuperWhisper';

try {
  process.loadEnvFile(resolve(projectRoot, '.env'));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const executable = process.env.MEETING_AGENT_OPENSUPERWHISPER_BIN || defaultExecutable;

async function requireExecutable(filePath) {
  try {
    await access(filePath, fsConstants.F_OK | fsConstants.X_OK);
  } catch {
    throw new Error(`OpenSuperWhisper CLI를 찾거나 실행할 수 없습니다: ${filePath}`);
  }
}

function readDefault(key) {
  const result = spawnSync('defaults', ['read', 'fr.my-monkey.opensuperwhisper', key], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() || null : null;
}

function readVersion() {
  const infoPlist = resolve(dirname(executable), '../Info.plist');
  const result = spawnSync('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleShortVersionString', infoPlist], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() || null : null;
}

await requireExecutable(executable);
const help = spawnSync(executable, ['--help'], {
  cwd: projectRoot,
  encoding: 'utf8',
  env: { ...process.env, LLVM_PROFILE_FILE: '/dev/null' }
});
if (help.status !== 0 || !help.stdout.includes('transcribe')) {
  throw new Error(`OpenSuperWhisper CLI 확인 실패: ${help.stderr.trim() || `exit ${help.status}`}`);
}

const selectedEngine = readDefault('selectedEngine');
const modelPath = readDefault('selectedWhisperModelPath');
const language = readDefault('whisperLanguage');
if (selectedEngine !== 'whisper') {
  throw new Error(`OpenSuperWhisper 앱에서 Whisper 엔진을 선택해야 합니다. 현재 값: ${selectedEngine || '확인되지 않음'}`);
}
if (!modelPath) throw new Error('OpenSuperWhisper 앱에서 사용할 Whisper 모델을 먼저 선택하세요.');

let modelStat;
try {
  modelStat = await stat(modelPath);
} catch {
  throw new Error(`OpenSuperWhisper가 선택한 모델 파일을 찾지 못했습니다: ${modelPath}`);
}
if (!modelStat.isFile() || modelStat.size < 10 * 1024 * 1024) {
  throw new Error(`OpenSuperWhisper가 선택한 모델 파일이 유효하지 않습니다: ${modelPath}`);
}

console.log(JSON.stringify({
  ready: true,
  executable,
  appVersion: readVersion(),
  selectedEngine,
  modelPath,
  modelSizeBytes: modelStat.size,
  language
}, null, 2));

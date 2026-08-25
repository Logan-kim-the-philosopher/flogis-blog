#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { access, mkdir, rename, rm, stat } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '../..');
const supportedModels = new Set(['tiny', 'base', 'small', 'medium', 'large-v3', 'large-v3-turbo']);
const model = process.argv[2] || 'large-v3-turbo';

if (!supportedModels.has(model)) {
  console.error(`지원 모델: ${[...supportedModels].join(', ')}`);
  process.exit(1);
}

const targetDir = resolve(projectRoot, '.meeting-agent/models');
const target = resolve(targetDir, `ggml-${model}.bin`);
const partial = `${target}.part`;
const url = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin?download=true`;

try {
  await access(target, fsConstants.F_OK);
  const existing = await stat(target);
  console.log(`이미 설치됨: ${target} (${Math.round(existing.size / 1024 / 1024)} MiB)`);
  process.exit(0);
} catch {
  // Download below.
}

await mkdir(targetDir, { recursive: true });
await rm(partial, { force: true });

console.log(`Whisper ${model} 모델 다운로드 중...`);
console.log(url);
const response = await fetch(url);
if (!response.ok || !response.body) {
  throw new Error(`모델 다운로드 실패: HTTP ${response.status}`);
}

await pipeline(Readable.fromWeb(response.body), createWriteStream(partial, { flags: 'wx' }));
const downloaded = await stat(partial);
if (downloaded.size < 10 * 1024 * 1024) {
  await rm(partial, { force: true });
  throw new Error('다운로드된 모델 파일이 예상보다 작습니다. 네트워크 응답을 확인하세요.');
}
await rename(partial, target);
console.log(`설치 완료: ${target} (${Math.round(downloaded.size / 1024 / 1024)} MiB)`);

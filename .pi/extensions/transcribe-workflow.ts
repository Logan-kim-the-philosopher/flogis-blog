import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { StringEnum } from '@earendil-works/pi-ai';
import { Type } from 'typebox';
import { access, readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import {
  buildTranscribeArgs,
  buildTranscribeResumeArgs,
  createTranscribeRunDir,
  formatTranscribeProgress,
  parseTranscribeCommand,
  readTranscribeResult,
} from '../lib/transcribe-workflow.mjs';

type TranscribeState = {
  status: 'idle' | 'running' | 'completed' | 'error';
  runDir?: string;
  outputPath?: string;
  message?: string;
  updatedAt: string;
};

type TranscribeOptions = {
  source: string;
  mode?: 'accurate' | 'fast';
  root?: string;
  output?: string;
  model?: string;
  thinking?: string;
  language?: string;
  openSuperWhisperBin?: string;
  localOnly?: boolean;
  replace?: boolean;
};

const STATE_ENTRY = 'transcribe-workflow-state';
const STATUS_KEY = 'transcribe-workflow';
const PROCESS_TIMEOUT = 8 * 60 * 60 * 1000;

const TranscribeParams = Type.Object({
  source: Type.String({ description: '바탕화면에서 찾을 오디오 파일명 또는 파일 경로' }),
  mode: Type.Optional(StringEnum(['accurate', 'fast'] as const, { description: '기본값 accurate. fast는 후보 수를 줄임' })),
  root: Type.Optional(Type.String({ description: '검색·출력 기준 폴더. 기본값은 바탕화면' })),
  output: Type.Optional(Type.String({ description: '결과 TXT 경로. 기본값은 바탕화면의 <원본명>_전사.txt' })),
  model: Type.Optional(Type.String({ description: '문맥 검수에 사용할 Pi 모델' })),
  thinking: Type.Optional(Type.String({ description: 'Pi 검수 thinking 수준' })),
  language: Type.Optional(Type.String({ description: '음성 언어 코드. 기본값 ko' })),
  openSuperWhisperBin: Type.Optional(Type.String({ description: 'OpenSuperWhisper CLI 경로' })),
  localOnly: Type.Optional(Type.Boolean({ description: 'true이면 전사 텍스트를 Pi 모델에 보내지 않음' })),
  replace: Type.Optional(Type.Boolean({ description: 'true이면 기존 결과 TXT를 원자적으로 교체' })),
});

export default function transcribeWorkflow(pi: ExtensionAPI) {
  let state: TranscribeState = { status: 'idle', updatedAt: new Date().toISOString() };

  const setState = (next: Omit<TranscribeState, 'updatedAt'>, ctx?: ExtensionContext) => {
    state = { ...next, updatedAt: new Date().toISOString() };
    pi.appendEntry<TranscribeState>(STATE_ENTRY, state);
    if (ctx?.hasUI) ctx.ui.setStatus(STATUS_KEY, statusLabel(state));
  };

  const restoreState = (ctx: ExtensionContext) => {
    for (const entry of ctx.sessionManager.getBranch()) {
      if (entry.type === 'custom' && entry.customType === STATE_ENTRY && entry.data) state = entry.data as TranscribeState;
    }
    if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, statusLabel(state));
  };

  pi.on('session_start', async (_event, ctx) => restoreState(ctx));
  pi.on('session_tree', async (_event, ctx) => restoreState(ctx));

  async function execute(
    options: TranscribeOptions,
    ctx: ExtensionContext,
    signal?: AbortSignal,
    progress?: (message: string) => void,
  ) {
    const projectRoot = await findProjectRoot(ctx.cwd);
    const runDir = createTranscribeRunDir(projectRoot, options.source);
    setState({ status: 'running', runDir, message: '원본을 찾고 고정밀 전사를 준비합니다.' }, ctx);
    progress?.('바탕화면에서 원본을 찾고 OpenSuperWhisper 전사를 준비합니다…');
    const stop = watchProgress(runDir, ctx, progress);
    let execution;
    try {
      execution = await pi.exec(process.execPath, buildTranscribeArgs(projectRoot, options, runDir), {
        cwd: projectRoot,
        signal,
        timeout: PROCESS_TIMEOUT,
      });
    } finally {
      await stop();
    }
    if (execution.code !== 0) {
      const detail = execution.stderr.trim() || execution.stdout.trim() || `exit ${execution.code}`;
      setState({ status: 'error', runDir, message: detail }, ctx);
      throw new Error(`전사 실패: ${detail}`);
    }
    const result = await readTranscribeResult(runDir);
    setState({ status: 'completed', runDir, outputPath: result.outputPath, message: '전사와 무결성 검증 완료' }, ctx);
    progress?.(`전사가 완료됐습니다: ${result.outputPath}`);
    return result;
  }

  async function resume(
    runDirValue: string,
    options: Partial<TranscribeOptions>,
    ctx: ExtensionContext,
    signal?: AbortSignal,
    progress?: (message: string) => void,
  ) {
    const projectRoot = await findProjectRoot(ctx.cwd);
    const runDir = isAbsolute(runDirValue) ? runDirValue : resolve(ctx.cwd, runDirValue);
    setState({ status: 'running', runDir, message: '보존된 중간 결과를 확인합니다.' }, ctx);
    const stop = watchProgress(runDir, ctx, progress);
    let execution;
    try {
      execution = await pi.exec(process.execPath, buildTranscribeResumeArgs(projectRoot, runDir, options), {
        cwd: projectRoot,
        signal,
        timeout: PROCESS_TIMEOUT,
      });
    } finally {
      await stop();
    }
    if (execution.code !== 0) {
      const detail = execution.stderr.trim() || execution.stdout.trim() || `exit ${execution.code}`;
      setState({ status: 'error', runDir, message: detail }, ctx);
      throw new Error(`전사 재개 실패: ${detail}`);
    }
    const result = await readTranscribeResult(runDir);
    setState({ status: 'completed', runDir, outputPath: result.outputPath, message: '전사 재개 완료' }, ctx);
    return result;
  }

  pi.registerCommand('transcribe', {
    description: '파일명으로 바탕화면 오디오를 찾아 고정밀 전사 TXT 생성',
    handler: async (args, ctx) => {
      try {
        const parsed = parseTranscribeCommand(args) as TranscribeOptions;
        if (!parsed.source) {
          if (!ctx.hasUI) throw new Error('전사할 파일명이 필요합니다.');
          const entered = await ctx.ui.input('전사할 바탕화면 오디오 파일명', '26-09-20_node_js_세션_리허설');
          if (!entered) return;
          parsed.source = entered;
        }
        const result = await execute(parsed, ctx);
        if (ctx.hasUI) ctx.ui.notify(resultMessage(result), 'info');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setState({ status: 'error', runDir: state.runDir, outputPath: state.outputPath, message }, ctx);
        if (ctx.hasUI) ctx.ui.notify(message, 'error');
        else throw error;
      }
    },
  });

  pi.registerCommand('transcribe-status', {
    description: '현재 또는 마지막 전사 실행 상태 확인',
    handler: async (_args, ctx) => {
      const message = [
        `상태: ${state.status}`,
        `run: ${state.runDir || '없음'}`,
        `결과: ${state.outputPath || '없음'}`,
        `메시지: ${state.message || '없음'}`,
      ].join('\n');
      if (ctx.hasUI) ctx.ui.notify(message, state.status === 'error' ? 'error' : 'info');
    },
  });

  pi.registerCommand('transcribe-resume', {
    description: '실패한 전사 run을 보존된 후보부터 재개',
    handler: async (args, ctx) => {
      try {
        const parsed = parseTranscribeCommand(args) as TranscribeOptions;
        let runDir = parsed.source || state.runDir;
        if (!runDir && ctx.hasUI) runDir = await ctx.ui.input('재개할 전사 run 디렉터리', '.transcribe-agent/runs/...') || undefined;
        if (!runDir) throw new Error('재개할 run 디렉터리가 필요합니다.');
        const result = await resume(runDir, parsed, ctx);
        if (ctx.hasUI) ctx.ui.notify(resultMessage(result), 'info');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setState({ status: 'error', runDir: state.runDir, outputPath: state.outputPath, message }, ctx);
        if (ctx.hasUI) ctx.ui.notify(message, 'error');
        else throw error;
      }
    },
  });

  pi.registerTool({
    name: 'transcribe_audio',
    label: 'Transcribe Audio',
    description: '파일명 또는 경로로 오디오를 찾아 OpenSuperWhisper 다중 후보 전사와 Pi 문맥 검수를 수행하고 바탕화면에 검증된 TXT를 저장한다. 블로그/Sanity 발행은 하지 않는다.',
    promptSnippet: 'Find a named audio file, transcribe it accurately, and save the verified TXT on the Desktop.',
    promptGuidelines: [
      'Use this tool when the user gives an audio filename and asks to transcribe it or place the transcript on the Desktop.',
      'Use accurate mode unless the user explicitly asks for speed.',
      'Do not invoke meeting publication or Sanity workflows for a transcription-only request.',
      'Report the exact output path, source hash verification, and any uncertain segment count.',
    ],
    parameters: TranscribeParams,
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const result = await execute(params as TranscribeOptions, ctx, signal, (message) => {
        onUpdate?.({ content: [{ type: 'text', text: message }] });
      });
      return {
        content: [{ type: 'text', text: resultMessage(result) }],
        details: result,
      };
    },
  });
}

function watchProgress(runDir: string, ctx: ExtensionContext, progress?: (message: string) => void) {
  const startedAt = Date.now();
  let lastPhase = '';
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    try {
      const current = JSON.parse(await readFile(resolve(runDir, 'progress.json'), 'utf8'));
      const label = formatTranscribeProgress(current, (Date.now() - startedAt) / 1000);
      if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, label);
      if (current.phase !== lastPhase) {
        lastPhase = current.phase;
        progress?.(current.message);
      }
    } catch {
      if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, formatTranscribeProgress({ phase: 'probing' }, (Date.now() - startedAt) / 1000));
    }
  };
  const timer = setInterval(() => void tick(), 1_000);
  timer.unref?.();
  void tick();
  return async () => {
    await tick();
    stopped = true;
    clearInterval(timer);
  };
}

async function findProjectRoot(cwd: string) {
  let current = resolve(cwd);
  while (true) {
    try {
      await access(resolve(current, 'scripts/transcribe-agent/index.mjs'));
      return current;
    } catch {
      const parent = resolve(current, '..');
      if (parent === current) break;
      current = parent;
    }
  }
  throw new Error('scripts/transcribe-agent/index.mjs가 있는 flogis-blog 프로젝트를 찾지 못했습니다.');
}

function statusLabel(state: TranscribeState) {
  return {
    idle: '전사: 대기',
    running: '전사: 처리 중',
    completed: '전사: 완료',
    error: '전사: 오류',
  }[state.status];
}

function resultMessage(result: Record<string, any>) {
  return [
    '전사 완료',
    `결과: ${result.outputPath}`,
    `원본 무결성: SHA-256 ${result.sourceHash}`,
    `불확실 구간: ${result.uncertaintyCount || 0}개`,
    `재개 자료: ${result.runDir}`,
  ].join('\n');
}

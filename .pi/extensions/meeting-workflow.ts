import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { StringEnum } from '@earendil-works/pi-ai';
import { Type } from 'typebox';
import { access, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import {
  MEETING_CATEGORIES,
  buildPrepareArgs,
  buildPublishArgs,
  createExtensionRunDir,
  mayWriteToSanity,
  parseMeetingCommand,
  publicUrlForDocument,
  readRunArtifacts,
  routeForDocument,
  summarizeArtifacts,
} from '../lib/meeting-workflow.mjs';

type MeetingState = {
  status: 'idle' | 'preparing' | 'preview' | 'validating' | 'cancelled' | 'published' | 'error';
  runDir?: string;
  documentId?: string;
  slug?: string;
  message?: string;
  updatedAt: string;
};

type PrepareOptions = {
  sourcePath: string;
  date?: string;
  title?: string;
  slug?: string;
  category?: string;
  people?: string;
  model?: string;
  thinking?: string;
  whisperModel?: string;
  language?: string;
  offline?: boolean;
  noPublish?: boolean;
  structuredInput?: string;
};

const STATE_ENTRY = 'meeting-workflow-state';
const STATUS_KEY = 'meeting-workflow';
const PROCESS_TIMEOUT = 60 * 60 * 1000;
const DEFAULT_PUBLIC_URL = 'https://flogis-blog.tail2dac17.ts.net';

const PrepareParams = Type.Object({
  sourcePath: Type.String({ description: 'TXT, Markdown 또는 오디오 회의 원본의 파일 경로' }),
  date: Type.Optional(Type.String({ description: 'YYYY-MM-DD 회의 날짜' })),
  title: Type.Optional(Type.String({ description: '자동 생성 제목을 덮어쓸 제목' })),
  slug: Type.Optional(Type.String({ description: '자동 생성 slug를 덮어쓸 ASCII kebab-case 값' })),
  category: Type.Optional(StringEnum(MEETING_CATEGORIES as [string, ...string[]])),
  people: Type.Optional(Type.String({ description: '쉼표로 구분한 Sanity person 문서 ID' })),
  whisperModel: Type.Optional(Type.String({ description: '오디오 전사용 Whisper ggml 모델 경로' })),
  language: Type.Optional(Type.String({ description: 'Whisper 언어 코드, 기본값 ko' })),
  offline: Type.Optional(Type.Boolean({ description: 'Sanity 조회 없이 preview만 생성' })),
});

const PublishParams = Type.Object({
  runDir: Type.String({ description: 'meeting_prepare가 생성한 run 디렉터리' }),
  people: Type.Optional(Type.String({ description: '쉼표로 구분한 Sanity person 문서 ID' })),
  validateOnly: Type.Optional(Type.Boolean({ description: 'true이면 외부 쓰기 없이 발행 가능 여부만 확인. 기본값 true' })),
});

export default function meetingWorkflow(pi: ExtensionAPI) {
  let state: MeetingState = { status: 'idle', updatedAt: new Date().toISOString() };

  const setState = (next: Omit<MeetingState, 'updatedAt'>, ctx?: ExtensionContext) => {
    state = { ...next, updatedAt: new Date().toISOString() };
    pi.appendEntry<MeetingState>(STATE_ENTRY, state);
    if (ctx?.hasUI) ctx.ui.setStatus(STATUS_KEY, statusLabel(state));
  };

  const restoreState = (ctx: ExtensionContext) => {
    for (const entry of ctx.sessionManager.getBranch()) {
      if (entry.type === 'custom' && entry.customType === STATE_ENTRY && entry.data) {
        state = entry.data as MeetingState;
      }
    }
    if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, statusLabel(state));
  };

  pi.on('session_start', async (_event, ctx) => restoreState(ctx));
  pi.on('session_tree', async (_event, ctx) => restoreState(ctx));

  async function prepareMeeting(
    options: PrepareOptions,
    ctx: ExtensionContext,
    signal?: AbortSignal,
    progress?: (message: string) => void,
  ) {
    const projectRoot = await findProjectRoot(ctx.cwd);
    const sourcePath = isAbsolute(options.sourcePath) ? options.sourcePath : resolve(ctx.cwd, options.sourcePath);
    const normalized = { ...options, sourcePath };
    const runDir = createExtensionRunDir(projectRoot, sourcePath);
    setState({ status: 'preparing', runDir, message: '원본을 분석하고 있습니다.' }, ctx);
    progress?.('원본을 읽고, 필요한 경우 전사한 뒤 Pi로 구조화하고 있습니다…');

    const result = await pi.exec(process.execPath, buildPrepareArgs(projectRoot, normalized, runDir), {
      cwd: projectRoot,
      signal,
      timeout: PROCESS_TIMEOUT,
    });
    if (result.code !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
      setState({ status: 'error', runDir, message: detail }, ctx);
      throw new Error(`회의 preview 생성 실패: ${detail}`);
    }

    const artifacts = await readRunArtifacts(runDir);
    setState({
      status: 'preview',
      runDir,
      documentId: artifacts.document._id,
      slug: artifacts.document.slug.current,
      message: artifacts.manifest.warnings?.join('; ') || 'preview 준비 완료',
    }, ctx);
    progress?.('구조화와 preview 생성이 완료됐습니다.');
    return { projectRoot, runDir, artifacts };
  }

  async function validateMeeting(
    projectRoot: string,
    runDir: string,
    slug: string,
    people: string | undefined,
    ctx: ExtensionContext,
    signal?: AbortSignal,
    progress?: (message: string) => void,
  ) {
    setState({ status: 'validating', runDir, slug, message: '참조와 중복을 확인하고 있습니다.' }, ctx);
    progress?.('Sanity 사람 참조, 필수 본문, ID·slug 중복을 검사하고 있습니다…');
    const validation = await pi.exec(
      process.execPath,
      buildPublishArgs(projectRoot, runDir, slug, { people, validateOnly: true }),
      { cwd: projectRoot, signal, timeout: PROCESS_TIMEOUT },
    );
    if (validation.code !== 0) {
      const detail = validation.stderr.trim() || validation.stdout.trim() || `exit ${validation.code}`;
      setState({ status: 'error', runDir, slug, message: detail }, ctx);
      throw new Error(`발행 사전 검증 실패: ${detail}`);
    }
    const result = JSON.parse(await readFile(resolve(runDir, 'publish-validation.json'), 'utf8'));
    setState({ status: 'preview', runDir, documentId: result.documentId, slug, message: '발행 사전 검증 완료' }, ctx);
    return result;
  }

  async function publishMeeting(
    projectRoot: string,
    runDir: string,
    slug: string,
    people: string | undefined,
    ctx: ExtensionContext,
    signal?: AbortSignal,
    progress?: (message: string) => void,
  ) {
    progress?.('승인된 문서를 Sanity에 발행하고 있습니다…');
    const result = await pi.exec(
      process.execPath,
      buildPublishArgs(projectRoot, runDir, slug, { people, validateOnly: false }),
      { cwd: projectRoot, signal, timeout: PROCESS_TIMEOUT },
    );
    if (result.code !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
      setState({ status: 'error', runDir, slug, message: detail }, ctx);
      throw new Error(`Sanity 발행 실패: ${detail}`);
    }

    const published = JSON.parse(await readFile(resolve(runDir, 'publish-result.json'), 'utf8'));
    const artifacts = await readRunArtifacts(runDir);
    const verification = await verifyPublishedPage(projectRoot, artifacts.document);
    setState({
      status: 'published',
      runDir,
      documentId: published.documentId,
      slug: published.slug,
      message: verification.message,
    }, ctx);
    return { published, verification };
  }

  async function fullWorkflow(options: PrepareOptions, ctx: ExtensionContext, signal?: AbortSignal) {
    const prepared = await prepareMeeting(options, ctx, signal);
    const { projectRoot, runDir } = prepared;
    let { artifacts } = prepared;

    const edited = await ctx.ui.editor(
      `회의 preview 검토 · ${artifacts.structured.metadata.title}`,
      artifacts.markdown,
    );
    if (edited === undefined) {
      setState({ status: 'cancelled', runDir, slug: artifacts.document.slug.current, message: 'preview 검토에서 취소됨' }, ctx);
      ctx.ui.notify(`발행을 취소했습니다. preview는 ${runDir}에 보존됩니다.`, 'info');
      return;
    }
    if (!edited.trim()) throw new Error('빈 본문은 발행할 수 없습니다.');
    if (edited !== artifacts.markdown) {
      await writeFile(resolve(runDir, 'post.md'), edited, 'utf8');
      artifacts = await readRunArtifacts(runDir);
    }

    if (options.noPublish) {
      ctx.ui.notify(`preview를 준비했습니다.\n${runDir}`, 'info');
      return;
    }

    let people = options.people;
    try {
      await validateMeeting(projectRoot, runDir, artifacts.document.slug.current, people, ctx, signal);
    } catch (error) {
      if (!ctx.hasUI || !String((error as Error).message).includes('person')) throw error;
      const entered = await ctx.ui.input('Sanity person ID 입력', 'person-id-1,person-id-2');
      if (!entered) throw error;
      people = entered;
      await validateMeeting(projectRoot, runDir, artifacts.document.slug.current, people, ctx, signal);
    }

    const confirmed = await ctx.ui.confirm(
      'Sanity에 실제 발행할까요?',
      `${summarizeArtifacts(artifacts)}\n\n이 승인을 통과할 때만 Sanity 쓰기가 실행됩니다.`,
    );
    if (!mayWriteToSanity({ hasUI: ctx.hasUI, confirmed })) {
      setState({ status: 'cancelled', runDir, documentId: artifacts.document._id, slug: artifacts.document.slug.current, message: '사용자가 발행을 취소함' }, ctx);
      ctx.ui.notify(`Sanity 발행을 취소했습니다. preview는 ${runDir}에 보존됩니다.`, 'info');
      return;
    }

    const result = await publishMeeting(projectRoot, runDir, artifacts.document.slug.current, people, ctx, signal);
    ctx.ui.notify(
      `발행 완료: ${result.published.documentId}\n${result.verification.url || routeForDocument(artifacts.document)}\n${result.verification.message}`,
      result.verification.ok ? 'info' : 'warning',
    );
  }

  pi.registerCommand('meeting', {
    description: '회의 원본을 전사·정리하고 preview 승인 후 Sanity에 발행',
    handler: async (args, ctx) => {
      if (!ctx.hasUI) {
        throw new Error('/meeting은 preview와 발행 승인을 위해 TUI 또는 RPC UI가 필요합니다.');
      }
      try {
        const parsed = parseMeetingCommand(args) as PrepareOptions;
        if (!parsed.sourcePath) {
          const sourcePath = await ctx.ui.input('회의 원본 파일 경로', '/absolute/path/to/meeting.txt');
          if (!sourcePath) {
            ctx.ui.notify('회의 자동화를 취소했습니다.', 'info');
            return;
          }
          parsed.sourcePath = sourcePath;
        }
        await fullWorkflow(parsed, ctx);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        ctx.ui.notify(message, 'error');
        setState({ status: 'error', runDir: state.runDir, slug: state.slug, message }, ctx);
      }
    },
  });

  pi.registerCommand('meeting-status', {
    description: '현재 또는 마지막 회의 자동화 실행 상태 확인',
    handler: async (_args, ctx) => {
      ctx.ui.notify([
        `상태: ${state.status}`,
        `run: ${state.runDir || '없음'}`,
        `문서: ${state.documentId || '없음'}`,
        `메시지: ${state.message || '없음'}`,
      ].join('\n'), state.status === 'error' ? 'error' : 'info');
    },
  });

  pi.registerTool({
    name: 'meeting_prepare',
    label: 'Meeting Prepare',
    description: '회의 TXT/Markdown를 바로 읽거나 오디오를 Whisper로 전사한 뒤 구조화된 블로그 preview를 만든다. 외부 발행은 하지 않는다.',
    promptSnippet: 'Prepare a meeting source as a validated blog preview without publishing it.',
    promptGuidelines: [
      'Use this tool when the user asks to organize a meeting source or audio file.',
      'Always show the returned preview and warnings before considering publication.',
      'Never claim the post is published after this tool; it only creates local preview artifacts.',
    ],
    parameters: PrepareParams,
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const prepared = await prepareMeeting(params as PrepareOptions, ctx, signal, (message) => {
        onUpdate?.({ content: [{ type: 'text', text: message }] });
      });
      return {
        content: [{
          type: 'text',
          text: `${summarizeArtifacts(prepared.artifacts)}\n\nrun: ${prepared.runDir}\n\n${prepared.artifacts.markdown}`,
        }],
        details: {
          status: 'preview',
          runDir: prepared.runDir,
          manifest: prepared.artifacts.manifest,
          document: prepared.artifacts.document,
        },
      };
    },
  });

  pi.registerTool({
    name: 'meeting_publish',
    label: 'Meeting Publish',
    description: '회의 preview를 검증한다. validateOnly=false이면 Pi UI에서 사용자에게 다시 승인받은 경우에만 Sanity에 실제 발행한다.',
    promptSnippet: 'Validate a meeting preview and publish only after explicit interactive user confirmation.',
    promptGuidelines: [
      'Default to validateOnly=true.',
      'Use validateOnly=false only when the user explicitly asks to publish now.',
      'Real publication is refused without an interactive UI confirmation, even if the model calls the tool.',
    ],
    parameters: PublishParams,
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const projectRoot = await findProjectRoot(ctx.cwd);
      const runDir = isAbsolute(params.runDir) ? params.runDir : resolve(ctx.cwd, params.runDir);
      const artifacts = await readRunArtifacts(runDir);
      const slug = artifacts.document.slug.current;
      const validation = await validateMeeting(projectRoot, runDir, slug, params.people, ctx, signal, (message) => {
        onUpdate?.({ content: [{ type: 'text', text: message }] });
      });

      if (params.validateOnly !== false) {
        return {
          content: [{ type: 'text', text: `발행 검증 완료(외부 쓰기 없음)\n${JSON.stringify(validation, null, 2)}` }],
          details: { status: 'validated', validation, runDir },
        };
      }
      if (!ctx.hasUI) throw new Error('실제 발행은 TUI 또는 RPC UI에서 사용자 승인을 받아야 합니다.');

      const confirmed = await ctx.ui.confirm(
        'Sanity에 실제 발행할까요?',
        `${summarizeArtifacts(artifacts)}\n\n승인하면 즉시 외부 쓰기가 실행됩니다.`,
      );
      if (!mayWriteToSanity({ hasUI: ctx.hasUI, confirmed })) {
        setState({ status: 'cancelled', runDir, documentId: artifacts.document._id, slug, message: '사용자가 발행을 취소함' }, ctx);
        return {
          content: [{ type: 'text', text: `사용자가 발행을 취소했습니다. Sanity 쓰기는 실행되지 않았습니다.\nrun: ${runDir}` }],
          details: { status: 'cancelled', runDir, wroteToSanity: false },
        };
      }

      const result = await publishMeeting(projectRoot, runDir, slug, params.people, ctx, signal, (message) => {
        onUpdate?.({ content: [{ type: 'text', text: message }] });
      });
      return {
        content: [{ type: 'text', text: `발행 완료: ${result.published.documentId}\n${result.verification.url || routeForDocument(artifacts.document)}\n${result.verification.message}` }],
        details: { status: 'published', runDir, ...result },
      };
    },
  });
}

async function findProjectRoot(cwd: string) {
  let current = resolve(cwd);
  while (true) {
    try {
      await access(resolve(current, 'scripts/meeting-agent/index.mjs'));
      return current;
    } catch {
      const parent = resolve(current, '..');
      if (parent === current) break;
      current = parent;
    }
  }
  throw new Error('scripts/meeting-agent/index.mjs가 있는 프로젝트 루트를 찾지 못했습니다. flogis-blog 안에서 Pi를 실행하세요.');
}

function statusLabel(state: MeetingState) {
  const labels = {
    idle: '회의: 대기',
    preparing: '회의: 전사·정리 중',
    preview: '회의: preview 준비',
    validating: '회의: 발행 검증 중',
    cancelled: '회의: 발행 취소',
    published: '회의: 발행 완료',
    error: '회의: 오류',
  };
  return labels[state.status];
}

async function verifyPublishedPage(projectRoot: string, document: Record<string, any>) {
  const publicUrl = await readPublicUrl(projectRoot);
  const url = publicUrlForDocument(document, publicUrl);
  if (!url) return { ok: false, url: null, message: '공개 URL이 설정되지 않아 페이지 확인을 건너뛰었습니다.' };

  let lastStatus = 0;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10_000) });
      lastStatus = response.status;
      if (response.ok) return { ok: true, url, message: `공개 페이지 확인 완료(HTTP ${response.status})` };
    } catch {
      lastStatus = 0;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 1_500));
  }
  return { ok: false, url, message: `발행은 완료됐지만 공개 페이지 확인에 실패했습니다${lastStatus ? ` (HTTP ${lastStatus})` : ''}.` };
}

async function readPublicUrl(projectRoot: string) {
  if (process.env.MEETING_AGENT_PUBLIC_URL) return process.env.MEETING_AGENT_PUBLIC_URL;
  try {
    const env = await readFile(resolve(projectRoot, '.env'), 'utf8');
    const line = env.split(/\r?\n/).find((candidate) => candidate.startsWith('MEETING_AGENT_PUBLIC_URL='));
    if (line) return line.slice('MEETING_AGENT_PUBLIC_URL='.length).trim();
  } catch {
    // The production URL below is the repository's deployed site default.
  }
  return DEFAULT_PUBLIC_URL;
}

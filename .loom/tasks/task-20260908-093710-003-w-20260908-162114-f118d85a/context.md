# Context

## Loom 코드 계약

아래 항목은 Loom 코드에 고정된 runtime 동작 계약입니다. 관련 흐름을 바꾸기 전 `loom contract show <id>`로 확인합니다.

- `task-execution`: Task 실행 전 prompt/context/previous-results에 들어가는 입력 경계입니다. 명령: `loom contract show task-execution`. Source: `loom/application/context_pack.py`, `loom/application/team_policy.py`
- `done-guardrail`: Task를 DONE으로 인정하기 전에 필요한 산출물과 상태 전이를 검증하는 계약입니다. 명령: `loom contract show done-guardrail`. Source: `loom/application/services.py`

## Project Memory

# flogis-blog

Loom 프로젝트 메모리 루트입니다.

이 파일은 `loom init`으로 생성되며 `loom analyze-repo`로 보강할 수 있습니다.

## Workspace Policy

- Output language: `ko`
- Agent provider: `claude`
- Agent model: `adapter-default`
- Reasoning effort: `high`
- Required branch: `Haru2_dev`
- Dirty branch switch: `blocked`
- Commit policy: `manual`
- Include `.loom` metadata in Git: `yes`
- Read-only parallel execution: `allowed`
- Validation environment: `auto`
- Previous Task result limit: `2`
- Workspace required docs: -
- Loom fixed guardrails and verified Team required policies take precedence over this Workspace Policy.

## Job

- Title: 2026-09-08 음성 파일 정밀 전사
- Goal: 바탕화면의 003_W_20260908_162114 음성 파일을 가능한 한 정확하게 한국어로 전사하고 불확실 구간을 표시한 결과물을 바탕화면에 제공한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 003_W_20260908_162114 음성 정밀 전사
- Description: 바탕화면에서 대상 음성 파일을 찾아 포맷·길이·음질을 확인하고, 사용 가능한 로컬 음성 인식 도구로 한국어 전사를 생성한 뒤 재검토하여 문장부호와 고유명사를 보정하고 불확실 구간에 타임스탬프를 표시한다.
- Expected output: /Users/hongyongjae/Desktop에 원문 음성을 변경하지 않은 채 읽기 쉬운 전체 전사 Markdown과 필요 시 자막 파일이 생성된다.
- Done condition: 대상 파일이 정확히 식별되고 전체 길이를 빠짐없이 전사했으며, 타임스탬프 또는 구간 정보와 불확실 표기를 포함한 결과물을 바탕화면에서 열 수 있고 산출물 존재·크기·구조를 검증한다.
- In scope: 대상 음성 읽기, 로컬 오디오 메타데이터·음질 분석, 임시 변환·분할, 자동 전사, 문맥 기반 교정, 바탕화면 전사 파일 작성, Loom 기록과 로컬 커밋
- Out of scope: 원본 음성 변경·삭제, 외부 서비스 업로드, 내용의 사실 검증, 화자 신원 추정, 저장소 애플리케이션 코드 변경, 원격 push
- Validation hint: ffprobe로 원본 길이와 코덱을 확인하고 전사 마지막 타임스탬프가 원본 길이에 근접하는지, 빈 구간·반복·누락 의심 구간과 파일 인코딩을 점검한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: codex

## Advisor Source Prompt

No Advisor source prompt recorded for this Task.

## Inclusion Policy

- Mandatory execution files: `prompt.md`, `context.md`, and `previous-results.md`.
- Always included: project memory, current Job/Task metadata, and Job notes.
- Previous results: up to the latest 2 recorded results from earlier Tasks in this Job.
- Job context refs: explicit Job-scoped references selected by the controlling agent or user.
- Task required docs: mandatory Task-scoped documents; missing refs block validation and execution.
- Task memory refs: mandatory Task-scoped workflow memory references; missing or non-memory refs block validation and execution.
- Repository documents, validation documents, and skill rules: included only through explicit Job context refs, Task required docs, or Task memory refs.
- Verified Team Policy Snapshot: included before Active Memory; required policy cannot be overridden by lower-priority context.
- Active workflow memory with an `always` category is included automatically while its status is `ACTIVE`.
- `task_selected` and `reference_only` memory is included only through explicit Task memory refs.
- Consumed proposals, rejected proposals, resolved memory, superseded memory, and archived memory are excluded.
- Unreferenced repository files and results from other Jobs are not included.
- `AGENTS.md` and `CLAUDE.md` remain session-level controlling-agent entrypoints and are not treated as task context artifacts by default.

## Job Notes

# Notes

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

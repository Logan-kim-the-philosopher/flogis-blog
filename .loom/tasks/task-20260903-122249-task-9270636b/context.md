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

- Title: 2026-09-03 발표·Cody Stat 회의 자료 게시
- Goal: 다운로드 폴더의 26-09-03_최종_발표_준비 및 26-09-03_cody_stat_회의 자료를 기존 블로그 콘텐츠 구조에 맞게 게시하고 로컬 빌드와 콘텐츠 조회로 검증한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 두 회의·발표 자료를 블로그에 게시하고 검증
- Description: 저장소 상태와 기존 게시 구조를 조사하고 다운로드 폴더의 두 원본 파일을 판독하여 각각 적절한 블로그 게시물로 등록한다. 게시 후 형식·링크·빌드를 검증한다.
- Expected output: 기존 규칙에 맞춰 게시된 2026-09-03 날짜의 발표 준비 및 Cody Stat 회의 게시물 2건과 검증 결과
- Done condition: 두 원본의 핵심 내용이 누락 없이 블로그에 등록되고 중복·형식 오류가 없으며 프로젝트 검증 및 로컬 빌드가 통과한다.
- In scope: git 상태 점검, 다운로드 원본 2개 판독, 기존 Astro/Sanity 콘텐츠 규칙 조사, 게시물 2건 생성 또는 등록, 관련 검증, Loom 기록 및 커밋
- Out of scope: 원본 내용의 임의 확장, 기존 무관 콘텐츠 수정, 원격 push, 프로덕션 배포 설정 변경
- Validation hint: git diff와 콘텐츠 조회, 기존 콘텐츠 스키마 검사, 프로젝트 lint/typecheck/build 및 필요 시 로컬 페이지 렌더 확인
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: foreground

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

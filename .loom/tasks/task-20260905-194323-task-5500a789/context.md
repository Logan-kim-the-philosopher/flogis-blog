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

- Title: 팀원용 Pi 미팅 에이전트·Sanity CLI 게시 세팅 가이드
- Goal: Git 저장소 권한이 없는 팀원이 전달받은 최소 실행 번들로 Pi 미팅 에이전트와 production Sanity를 연결하고 CLI에서 안전하게 preview·검증·publish할 수 있도록 상세 온보딩 Markdown을 작성해 바탕화면에 제공한다.
- Branch: Haru2_dev
- Task count: `2`

## Task

- Title: 팀원용 미팅 퍼블리셔 최소 실행 폴더 구성
- Description: 작성된 가이드의 최소 실행 번들 설계에 따라 현재 저장소에서 필요한 Pi extension과 meeting agent 파일만 추려 안전한 package.json, lockfile, 빈 토큰 환경변수 예시, ignore 규칙, 무결성 목록과 함께 바탕화면 폴더로 구성한다.
- Expected output: /Users/hongyongjae/Desktop/Flogi_미팅_에이전트_팀원용 폴더에 저장소·비밀정보·node_modules 없이 즉시 npm ci 후 사용할 수 있는 최소 실행 번들이 존재한다.
- Done condition: 필수 파일 트리가 모두 존재하고 package-lock이 최소 package.json과 일치하며 npm ci 및 미팅 테스트/정적 검증이 통과하고, 실제 .env·token·회의 원본·run·.git·node_modules가 최종 폴더에 없으며 SHA-256 목록이 구성된다.
- In scope: 현재 저장소 파일 읽기, 임시 디렉터리에서 최소 번들 조립, package manifest와 안전한 설정 예시 작성, lockfile 생성, 의존성 설치 검증, 파일·비밀정보·구조 검증, 바탕화면 폴더 복사, Loom 기록과 로컬 커밋
- Out of scope: Sanity token 발급·삽입, 팀원 Pi 로그인, production 게시, 저장소 애플리케이션 코드 수정, 원격 push, 팀원 기기 변경
- Validation hint: 가이드의 파일 목록과 실제 저장소 경로를 대조하고 npm ci --ignore-scripts를 임시 복제에서 실행한다. package scripts와 환경변수 값을 검사하며 최종 폴더에 금지 파일이 없고 SHA256SUMS가 실제 파일과 일치하는지 확인한다.
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

팀원에게 저장소 대신 최소 실행 번들을 전달하고, 팀원·기기별 Sanity project robot token으로 게시 권한을 분리한다.

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

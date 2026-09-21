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

- Title: Pi 전사 전용 에이전트 구축
- Goal: Pi에서 파일명이나 경로만 지정하면 바탕화면의 음성 파일을 찾아 OpenSuperWhisper 다중 전사와 Pi 문맥 검수를 수행하고 원본 기준 타임스탬프가 있는 별도 TXT를 바탕화면에 안전하게 저장·검증하는 독립 전사 워크플로를 구축한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 파일명 기반 Pi 전사 에이전트 구현·검증
- Description: 독립 전사 CLI와 Pi extension을 추가해 파일명 또는 경로로 바탕화면 음성을 찾고, 원음·음량 보정·정밀 후보를 OpenSuperWhisper로 전사한 뒤 Pi가 문맥상 확실한 오류만 교정하여 타임스탬프 TXT를 바탕화면에 원자적으로 저장한다. 상태·재개·자연어 tool 호출, 충돌 방지와 원본·사본 검증을 포함한다.
- Expected output: scripts/transcribe-agent, .pi/extensions/transcribe-workflow.ts, .pi/lib/transcribe-workflow.mjs, tests, docs/transcribe-agent.md와 package scripts
- Done condition: /transcribe 파일명, /transcribe-status, /transcribe-resume와 transcribe_audio tool이 동작하고, 한글 NFC/NFD 파일 검색·다중 후보 전사·Pi 검수·불명확 표기·바탕화면 출력·기존 파일 보호·원본 해시 불변·재개를 자동 테스트와 extension smoke test로 검증하며 문서화하고 커밋한다.
- In scope: 전사 전용 CLI·Pi extension·순수 helper·검수 프롬프트·테스트·사용 문서·package scripts 구현, 기존 meeting agent의 안전한 helper 패턴 재사용
- Out of scope: Sanity 게시, 블로그 콘텐츠 생성, 기존 /meeting 동작 변경, OpenSuperWhisper 모델 설치·변경, 실제 사용자 음성 재전사, 외부 공유, 원격 push
- Validation hint: node unit tests, Pi extension smoke, npm run build, npm run transcribe:doctor, git diff --check, loom task validate와 loom validate --strict를 통과한다.
- Required docs: -
- Memory refs: -
- Document outputs: `docs/transcribe-agent.md`
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

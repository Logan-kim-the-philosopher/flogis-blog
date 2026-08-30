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

- Title: Flogy 발표 시연 실행 흐름
- Goal: 실제 발표 타이밍은 유지하면서 테스트 모드에서는 Loom 생성부터 전체 태스크 실행까지 5분 이내에 완료할 수 있도록 실행 시간 프로필을 분리하고 검증한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 전체 시연 흐름 5분 테스트 모드 추가
- Description: 현재 발표 시연의 단계와 태스크별 실행 시간을 확인하고, 기본 발표 프로필의 시간값은 바꾸지 않은 채 테스트 전용 프로필 또는 명시적 실행 옵션을 추가한다. 테스트 프로필은 Loom 생성부터 전체 태스크 종료까지 실제 경과 시간이 5분 이내가 되도록 구성한다.
- Expected output: 기존 발표 모드와 분리된 테스트 실행 방식, 300초 미만 총 시간 설정, 모드가 드러나는 실행 명령 또는 UI, 관련 검증과 사용 안내
- Done condition: 기존 발표 모드의 시간값이 그대로이며 테스트 모드의 이론상 최대 시간이 300초보다 작고, 실제 전체 테스트 흐름이 300초 안에 종료되며 테스트와 빌드가 통과한다.
- In scope: 시연 실행 시간 설정, 테스트 모드 선택 방식, 관련 실행 스크립트와 테스트 및 안내, Loom 메타데이터
- Out of scope: 기존 발표 모드 시간 단축, Sanity 콘텐츠 변경, 배포 및 원격 푸시, 무관한 UI 변경
- Validation hint: 발표/테스트 프로필 설정 비교, 테스트 스위트, 테스트 모드 전체 경과 시간 측정, npm 빌드
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: -

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

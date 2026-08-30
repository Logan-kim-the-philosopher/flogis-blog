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

- Title: Flogy 표기 Flogi 교정
- Goal: 블로그 저장소에서 잘못 사용된 Flogy 표기를 모두 찾아 Flogi로 일관되게 교정하고, 검색과 프로젝트 검증으로 누락 및 회귀가 없음을 확인한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 블로그 내 Flogy 표기를 Flogi로 전면 교정
- Description: 추적 파일과 블로그 소스·문서에서 대소문자를 포함한 Flogy 표기를 조사하고, 제품명 표기를 Flogi로 교정한다. 생성물·의존성·Git 내부 파일은 변경 대상에서 제외하고 문맥상 의도된 값인지 확인한다.
- Expected output: 블로그에서 사용자에게 노출되거나 저장소가 관리하는 Flogy/FLOGY/flogy 표기가 각각 Flogi/FLOGI/flogi로 교정된 변경과 검색·빌드 검증 결과
- Done condition: 관리 대상 파일에서 Flogy 계열 오표기가 남지 않고, 의도한 Flogi 표기로 교정되며 관련 테스트 또는 빌드가 통과한다.
- In scope: Git 관리 파일의 블로그 UI·콘텐츠·설정·문서에 포함된 Flogy 계열 표기, Loom 작업 기록, 검증
- Out of scope: 의존성·빌드 산출물·Git 내부 데이터, 원격 배포·푸시, 표기 교정과 무관한 코드 변경
- Validation hint: git grep/rg로 잔여 Flogy 계열 검색 후 프로젝트 테스트 및 npm 빌드
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

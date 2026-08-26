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

- Title: main 변경사항 안전 통합
- Goal: 원격 main의 신규 커밋을 기존 Haru2_dev 작업 이력과 사용자 로컬 변경을 보존하면서 병합하고 검증해 원격 Haru2_dev를 안전하게 갱신한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 원격 main을 Haru2_dev에 충돌 없이 병합
- Description: 원격 브랜치를 fetch한 뒤 main과 Haru2_dev의 분기·변경 파일을 비교하고, 사용자 로컬 변경을 보존한 상태로 origin/main을 Haru2_dev에 merge한다. 충돌 시 양쪽 의도를 파일 단위로 검토해 해결하고 검증 후 원격 Haru2_dev에 push한다.
- Expected output: origin/main의 최신 커밋이 Haru2_dev의 조상이 되고, 기존 Haru2_dev 기능과 사용자 미커밋 변경이 보존되며, 테스트·빌드가 통과한 merge 커밋이 원격 Haru2_dev에 반영된다.
- Done condition: fetch와 divergence 검토, 로컬 변경 보존, origin/main merge, 충돌 검증, origin/main ancestor 확인, 관련 테스트와 npm build 통과, 비강제 push 및 원격 Haru2_dev 확인을 완료한다.
- In scope: Git 원격 조회, main→Haru2_dev merge, 충돌 해결, 테스트·빌드, Loom 기록, 원격 Haru2_dev push
- Out of scope: Haru2_dev→main 병합, force push, rebase, 사용자 변경 삭제, main 직접 수정, Argo 수동 Sync, 무관한 기능 변경
- Validation hint: git status/log/diff와 git merge-base --is-ancestor origin/main Haru2_dev를 확인하고 npm run meeting:test 및 npm run build를 실행한다. push 후 ls-remote로 원격 Haru2_dev SHA를 확인한다.
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

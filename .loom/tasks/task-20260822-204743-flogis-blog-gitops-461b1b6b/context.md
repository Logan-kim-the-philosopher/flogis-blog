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

- Title: Flogis Blog GitOps 서버 배포
- Goal: Kubernetes 클러스터와 Jenkins·Argo CD·Tailscale 게이트웨이 상태를 확인하고 portfolio·flowops의 기존 배포 구조를 계승해 Haru2_dev 트리거 기반 GitOps 배포를 구성·검증한다.
- Branch: Haru2_dev
- Task count: `3`

## Task

- Title: Flogis Blog GitOps 배포 구성 구현
- Description: 조사 결과를 기준으로 portfolio·flowops의 표준을 계승한 컨테이너 빌드, Kubernetes 매니페스트, Jenkins Haru2_dev 트리거, Argo CD Application 및 Tailscale 노출 구성을 저장소에 구현한다.
- Expected output: Haru2_dev 변경이 Jenkins 이미지 빌드와 GitOps 리비전 갱신을 거쳐 Argo CD로 배포될 수 있는 재현 가능한 구성 파일이 준비된다.
- Done condition: 구성 파일 문법·참조·이미지 태그 전략·헬스체크·리소스 제한·Secret 참조가 검증되고 실제 비밀값은 저장소에 포함되지 않는다.
- In scope: Dockerfile/파이프라인/배포 매니페스트/Argo Application/필요 문서 구현
- Out of scope: 운영 비밀값 커밋, 기존 portfolio·flowops 리소스 변경, 운영 데이터 변경
- Validation hint: 기존 서비스와 구조를 diff하고 docker/manifest/Jenkins 구문 및 git diff 비밀값 검사를 수행한다.
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

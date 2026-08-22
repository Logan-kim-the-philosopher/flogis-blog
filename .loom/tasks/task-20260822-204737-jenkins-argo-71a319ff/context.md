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

- Title: 클러스터·Jenkins·Argo 및 선행 서비스 배포 구조 조사
- Description: 현재 kube context와 노드·네임스페이스·워크로드·스토리지·네트워크·이벤트를 읽기 전용으로 점검하고 Jenkins, Argo CD, Tailscale 및 portfolio·flowops 배포 리소스와 저장소 구성을 분석한다.
- Expected output: 클러스터 건강 상태, Jenkins·Argo CD·Tailscale 상태, portfolio·flowops의 GitOps 구조와 Flogis Blog가 계승해야 할 정확한 배포 규격이 기록된다.
- Done condition: 비밀값을 노출하지 않고 핵심 Kubernetes 리소스와 최근 경고 이벤트, Jenkins·Argo 애플리케이션, 기존 두 서비스의 이미지·네임스페이스·Ingress/Gateway·Git 소스 구조를 확인한다.
- In scope: 읽기 전용 Kubernetes·Git·저장소 조사와 배포 설계 근거 수집
- Out of scope: 클러스터 리소스 변경, 이미지 푸시, Jenkins 빌드 실행, Argo 동기화, DNS·Tailscale 변경
- Validation hint: kubectl get 기반 전수 조회와 저장소 rg/git 조회 결과를 교차 확인하며 Secret 데이터는 조회하지 않는다.
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

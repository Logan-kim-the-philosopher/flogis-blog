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

- Title: Astro SSR 운영 배포 전환
- Goal: 검증된 Astro Node SSR을 원본 저장소 기반 GitOps 운영 환경에서 서비스한다.
- Branch: Haru2_dev
- Task count: `2`

## Task

- Title: Node SSR 컨테이너·GitOps 및 원본 저장소 기준 구성
- Description: 정적 nginx web 이미지를 비루트 Astro Node standalone 런타임 이미지로 교체하고 Sanity 설정을 빌드 인자가 아닌 Kubernetes 런타임 환경으로 이동한다. Service·probe·Jenkins smoke test·배포 문서를 SSR 기준으로 갱신하고 Jenkins와 Argo의 저장소 정본을 원본 Logan-kim-the-philosopher/flogis-blog로 준비한다.
- Expected output: Node SSR 이미지가 8080에서 정적 자산과 동적 경로를 서빙하고, Kubernetes web Deployment·Service·health probe와 Jenkins 빌드/검증이 새 런타임에 맞으며, 소스·deploy 브랜치의 정본 URL이 원본 저장소로 일관되게 구성된다.
- Done condition: 로컬 Docker build/run과 /healthz·동적 slug smoke test, Kustomize 렌더링·server dry-run, Jenkins XML/파이프라인 검증, 저장소 URL 전수 검사, Secret·토큰 미포함 검사가 모두 통과하고 기존 Tailscale Funnel 경로와 리소스 제한이 유지된다.
- In scope: Dockerfile/runtime image, Jenkinsfile/job XML, Kubernetes Deployment·Service·probe·ConfigMap/env, Argo Application repoURL, 배포 검증 스크립트와 운영 문서
- Out of scope: 원격 브랜치 push, Jenkins 실제 Job 변경·실행, Argo Sync, 운영 Kubernetes 변경, Sanity 데이터 변경, 기존 타 서비스 변경
- Validation hint: SSR 이미지를 SANITY_PROJECT_ID/DATASET/API_VERSION/STRICT_CONTENT 런타임 env로 실행해 응답을 확인하고 bash infra/scripts/validate-deployment.sh, kubectl kustomize 및 client/server dry-run, rg 기반 fork URL·placeholder·Secret 검사를 수행한다.
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

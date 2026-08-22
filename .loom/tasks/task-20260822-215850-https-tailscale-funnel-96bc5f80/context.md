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
- Task count: `4`

## Task

- Title: HTTPS 경로 교정 및 Tailscale Funnel 공개 배포
- Description: 홈 이외 경로가 HTTP로 동작하는 원인을 실제 응답·리다이렉트·생성 링크에서 진단하고 HTTPS를 강제한 뒤, 기존 Tailscale gateway를 Funnel 기반 공개 HTTPS endpoint로 전환해 GitOps로 배포한다.
- Expected output: 모든 페이지와 내부 링크가 HTTPS를 유지하고 flogis-blog Tailscale 공개 도메인이 Funnel을 통해 비로그인 외부 요청에도 정상 응답한다.
- Done condition: HTTP 원인 수정, Jenkins build 성공, deploy 브랜치 갱신, Argo Synced/Healthy, Pod Ready, HTTP→HTTPS 정책 및 외부 비-tailnet HTTPS 200 응답을 확인한다.
- In scope: Astro URL/링크/프록시 헤더 수정, nginx HTTPS 강제, Tailscale Funnel 설정, GitOps 커밋·빌드·동기화·검증
- Out of scope: 별도 DNS 공급자 도메인 구매·변경, 기존 서비스 Funnel 변경, 전역 보안 정책 완화, 비밀값 커밋
- Validation hint: curl redirect/header/link scan, static output scan, Jenkins console, Argo status, rollout/endpoints, Tailscale funnel status와 비-tailnet 외부 HTTPS 요청을 교차 확인한다.
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

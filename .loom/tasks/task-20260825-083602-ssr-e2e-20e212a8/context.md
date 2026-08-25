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

- Title: 원본 저장소 전환·SSR 운영 배포 및 무재빌드 E2E 검증
- Description: Haru2_dev와 deploy 흐름을 원본 저장소로 전환하고 Jenkins SSR 이미지 빌드, Harbor push, Argo CD Sync, Kubernetes 롤아웃과 공개 Funnel을 검증한다. 배포 후 전용 Sanity 테스트 문서의 발행·수정·비공개/삭제를 수행해 이미지 재빌드 없이 목록·신규 slug·검색·RSS·SEO가 갱신되는지 확인하고 테스트 데이터를 정리한다.
- Expected output: 원본 저장소가 source of truth가 되고 Jenkins·Argo가 이를 추적하며 SSR Pod가 정상 서비스된다. 동일한 image tag와 deploy revision을 유지한 채 Sanity 테스트 문서의 생성·수정·제거가 다음 요청에 반영된 증거가 남는다.
- Done condition: 원본 Haru2_dev/deploy push, Jenkins SUCCESS, Harbor immutable image, Argo Synced/Healthy, web·gateway Ready, 비-tailnet HTTPS와 health 응답이 확인되고, 전용 신규 slug가 재빌드 없이 200·갱신 후 새 내용·정리 후 404를 반환하며 목록·검색·RSS·메타가 일관되고 테스트 문서가 남지 않는다.
- In scope: 원본 저장소 브랜치 push와 정본 전환, Jenkins Job 갱신·빌드, Harbor 이미지, Argo Application 적용·Sync, flogis-blog namespace 롤아웃, 전용 Sanity production 테스트 문서 lifecycle, 공개 HTTP 검증과 운영 문서 결과 기록
- Out of scope: 실제 운영 콘텐츠 변경, 기존 타 서비스·클러스터 전역 정책 변경, Sanity dataset 공개/비공개 정책 변경, 별도 도메인 변경, 비밀값 출력·커밋
- Validation hint: source SHA→Jenkins build→image digest→deploy commit→Argo revision을 연결해 기록하고, Sanity 테스트 전후 동일 image tag를 kubectl로 확인하면서 API와 공개 HTML의 목록·상세·검색·RSS·canonical/OG·404를 교차 검증한다.
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

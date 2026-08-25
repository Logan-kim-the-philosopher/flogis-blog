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

- Title: Sanity 런타임 콘텐츠 렌더링
- Goal: Sanity production의 published 콘텐츠를 재빌드 없이 요청 시점에 렌더링하는 Astro Node SSR 애플리케이션을 완성한다.
- Branch: Haru2_dev
- Task count: `2`

## Task

- Title: Sanity 런타임 SSR 설계 및 라우트 계약 고정
- Description: Sanity 의존 페이지·저장소·검색·RSS·동적 slug 경로와 현재 정적 Docker/GitOps 경계를 전수 조사하고, Astro Node standalone SSR·런타임 환경 변수·캐시·404·장애 처리·헬스체크·롤백 계약을 문서로 고정한다.
- Expected output: docs/runtime-content-architecture.md에 전체 콘텐츠 라우트 매트릭스, SSR 데이터 흐름, 단건 GROQ 전략, 런타임 환경/비밀값 경계, 캐시·오류·헬스체크 정책, 파일별 변경 목록과 검증 시나리오가 기록된다.
- Done condition: 정적+웹훅, 브라우저 직접 조회, Node SSR 대안을 비교해 Node SSR 선택 근거가 명시되고 홈·목록·상세·사람·태그·검색·RSS·404의 처리 방식과 무재빌드 반영 완료 기준이 빠짐없이 확정된다.
- In scope: 읽기 전용 저장소·배포 구조 조사, Astro 공식 라우팅/on-demand/Node adapter 및 Sanity published 조회 기준 검토, 설계 문서 작성
- Out of scope: 애플리케이션 코드 수정, 의존성 설치, 이미지 빌드, Git push, Jenkins·Argo·Kubernetes·Sanity 데이터 변경
- Validation hint: 현재 src/pages와 repository/query 호출 그래프를 전수 대조하고 Astro 공식 문서의 SSR 동적 라우트·Node standalone 동작, Sanity published perspective·CDN 선택을 설계 항목별로 확인한다.
- Required docs: -
- Memory refs: -
- Document outputs: `docs/runtime-content-architecture.md`
- Document output exceptions: -
- Source proposal: `-`
- Status: REVIEW_REQUIRED
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

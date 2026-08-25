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

- Title: Astro 콘텐츠 경로를 Sanity Node SSR로 전환
- Description: Astro Node standalone adapter와 server output을 적용하고, 모든 Sanity 의존 페이지가 요청 시 published 데이터를 조회하도록 repository·GROQ·동적 라우트를 전환한다. 신규 slug는 getStaticPaths 없이 처리하고 누락 콘텐츠는 404, CMS 장애는 운영 strict mode에서 명시적 오류로 처리한다.
- Expected output: 홈·study·meetings·work·people·tags·search·RSS가 Node SSR에서 최신 Sanity published 데이터를 렌더링하고, 상세 경로는 slug 단건 GROQ 조회와 올바른 404를 사용하며, 토큰 없는 런타임 설정과 /healthz가 제공된다.
- Done condition: @astrojs/node standalone 빌드가 성공하고 빌드 후 시작한 서버에서 기존 목록·상세·검색·RSS·404·health 경로가 통과하며, 빌드 산출물과 클라이언트 응답에 SANITY_API_TOKEN 또는 비밀값이 포함되지 않는다.
- In scope: package/astro config, Sanity client·queries·repositories, Sanity 의존 Astro pages/endpoints, 런타임 404·health·오류 처리, 필요한 자동 검증 코드
- Out of scope: Docker/Jenkins/Kubernetes/Argo 변경, 원격 push, 운영 배포, Sanity production 문서 변경, UI 재디자인
- Validation hint: npm run build 후 HOST/PORT와 운영 Sanity env로 dist/server/entry.mjs를 실행하고 홈·각 목록·기존 및 신규 slug·사람·태그·검색·RSS·404·health 응답과 서버 로그, 클라이언트 번들의 비밀값 부재를 확인한다.
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

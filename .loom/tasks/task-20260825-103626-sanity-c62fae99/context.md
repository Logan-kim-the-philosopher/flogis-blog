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
- Task count: `3`

## Task

- Title: 운영 Sanity 실시간 렌더링 확인 글 발행
- Description: 사용자가 브라우저에서 즉시 확인할 수 있도록 production Sanity에 고유 slug의 확인용 study 문서를 하나 발행하고, Astro SSR 공개 상세·홈·목록·검색·RSS·사이트맵·메타에서 재빌드 없이 렌더링되는지 검증한다. 확인용 문서는 사용자의 요청에 따라 삭제하지 않고 남긴다.
- Expected output: 확인용 study 문서가 production dataset에 published 상태로 존재하고 공개 permalink에서 200으로 렌더링되며 집계 경로와 SEO 메타에 즉시 반영된다.
- Done condition: 고유 ID/slug 사전 부재 확인 후 문서가 생성되고, Jenkins build와 Argo revision 및 web Pod image가 그대로인 상태에서 상세 200, 홈·study·검색·RSS·sitemap 노출, canonical·OG 일치가 확인되며 사용자에게 직접 URL을 전달한다.
- In scope: 전용 production Sanity study 문서 1건 생성, 기존 cover image·author 참조 재사용, 공개 HTTP와 배포 불변성 검증, Loom 결과 기록
- Out of scope: 기존 운영 문서 변경·삭제, 코드·배포 설정 변경, Jenkins 재빌드, Argo Sync, 확인 글 자동 삭제
- Validation hint: 생성 전 ID/slug 0건을 확인하고 생성 후 공개 상세·목록·검색·RSS·sitemap·canonical·OG를 조회하며 Jenkins/Argo/image 불변성을 비교한다.
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

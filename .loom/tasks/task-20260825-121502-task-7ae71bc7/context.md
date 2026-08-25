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

- Title: 콘텐츠 썸네일 표시 정리
- Goal: 객체의 역할과 책임 게시물을 제외한 모든 콘텐츠에서 부정확한 썸네일을 제거하고, 이미지가 없는 콘텐츠가 카드·상세·SEO에서 자연스럽게 렌더링되도록 Sanity 스키마·프론트엔드·운영 데이터를 일관되게 정리한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 객체의 역할과 책임 외 썸네일 제거
- Description: 운영 Sanity의 모든 study, work, meeting 문서를 조사하고 객체의 역할과 책임 게시물 계열만 coverImage를 유지한다. 나머지 문서의 coverImage를 제거하며, Astro 카드·미니카드·상세·SEO와 Sanity 스키마가 이미지 없는 콘텐츠를 올바르게 지원하도록 수정한다.
- Expected output: 객체의 역할과 책임 게시물 외에는 운영 데이터에 coverImage가 없고 공개 카드·상세에서 빈 이미지·대체 이미지·깨진 레이아웃이 나타나지 않는다. 유지 대상 게시물의 썸네일은 기존대로 보인다.
- Done condition: 유지 대상의 정확한 ID를 사전 조회로 고정하고, 그 외 콘텐츠 coverImage 제거 전후 목록을 기록한다. study/work/meeting 스키마에서 이미지를 선택 항목으로 바꾸고 모든 이미지 렌더링 지점을 조건부 처리한다. fallback 이미지 자동 주입을 제거하고 타입·쿼리·SEO가 optional image를 지원한다. 빌드와 공개 SSR에서 유지 대상 이미지만 표시되고 나머지는 img/og:image가 없으며 목록·상세·검색·RSS·sitemap과 기존 본문이 정상임을 검증한다.
- In scope: Sanity 콘텐츠 스키마, 콘텐츠 타입·정규화, 카드·미니카드·상세·SEO의 조건부 이미지 렌더링, production Sanity coverImage 정리, 빌드와 공개 검증, Loom 결과 기록
- Out of scope: 새 썸네일 생성, 객체의 역할과 책임 게시물의 이미지 변경, 본문·제목·slug·참여자·작성자 변경, 레이아웃 전면 재설계, Jenkins·Argo 변경
- Validation hint: Sanity에서 유지 ID와 coverImage 보유 목록을 전후 비교한다. rg로 모든 이미지 사용 지점을 확인하고 npm run build를 통과시킨다. 운영 상세·목록 HTML에서 유지 대상은 img/og:image가 있고 제거 대상은 콘텐츠 img/og:image가 없으며 HTTP 200·no-store·canonical과 집계 경로를 확인한다.
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

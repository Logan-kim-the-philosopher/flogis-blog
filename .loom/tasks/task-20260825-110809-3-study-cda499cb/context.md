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

- Title: 파이썬 심화 세션 콘텐츠 발행
- Goal: 바탕화면 파이썬심화_세션의 원본 자료 3개를 production Sanity의 독립된 study 콘텐츠로 정확하고 읽기 좋게 발행한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 파이썬 심화 자료 3개를 study로 발행
- Description: 파이썬심화_세션의 Markdown 2개와 PDF 1개를 각각 독립된 production Sanity study로 발행한다. Markdown은 원문 구조를 보존해 본문으로 사용하고, PDF는 원본 file asset 링크와 페이지별 이미지 asset을 함께 제공한다.
- Expected output: self/cls 문서, 객체·런타임 발표 슬라이드, 발표자 노트가 고유 ID/slug의 study 3건으로 발행되고 공개 상세·홈·목록·검색·RSS·sitemap에서 재빌드 없이 렌더링된다.
- Done condition: 원본 3개 파일과 PDF 전체 페이지를 검사하고 고유 ID/slug 사전 부재를 확인한 뒤, PDF 원본 링크와 모든 페이지 이미지 및 Markdown 원문을 포함한 study 3건을 생성한다. 세 상세가 200이고 제목·본문·이미지·원본 PDF 링크·집계 경로·SEO가 정상이며 기존 운영 study와 원본 파일이 보존된다.
- In scope: 원본 Markdown/PDF 읽기, PDF 전체 페이지 렌더링·시각 검증, Sanity file/image asset 업로드, 기존 author 참조 재사용, study 3건 production 발행, 공개 SSR 검증, Loom 결과 기록
- Out of scope: 원본 파일 수정·삭제, 기존 운영 문서 변경·삭제, 프론트엔드 코드·스키마·Jenkins·Argo 변경, PDF 내용 재저작
- Validation hint: PDF 페이지 수와 렌더 결과를 검사하고 source hash를 기록한다. Sanity asset/document transaction 후 각 permalink, Markdown 코드 블록, PDF 링크와 페이지 이미지 수, 홈·study·search·RSS·sitemap·canonical/OG를 확인한다.
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

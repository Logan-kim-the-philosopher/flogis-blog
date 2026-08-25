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
- Task count: `4`

## Task

- Title: 운영 Sanity 테스트 스터디 2건 제거
- Description: 사용자가 지정한 테스트 목적의 published study 2건을 production Sanity에서 정확한 ID·title·slug로 식별한 뒤 대응 draft와 함께 삭제하고, 공개 SSR 경로와 모든 집계 경로에서 제거됐는지 검증한다.
- Expected output: Sanity 연결 테스트 게시물과 Sanity 실시간 렌더링 확인 게시물이 production dataset에서 제거되고, 각 상세가 404이며 홈·study·검색·RSS·sitemap에 남지 않는다.
- Done condition: 삭제 전 두 대상만 정확히 조회되고 다른 study는 보존되며, published/draft 대상 삭제 후 Sanity 잔존 0건, 두 상세 404, 집계 경로 부재와 운영 health 정상 상태가 확인된다.
- In scope: study-sanity-connection-test-20260823 및 study-sanity-runtime-render-check-20260825와 대응 draft 삭제, 공개 HTTP 검증, Loom 결과 기록
- Out of scope: 다른 운영 study/work/meeting/person 문서 변경·삭제, asset 삭제, 코드·Git·Jenkins·Argo 변경
- Validation hint: 삭제 전 ID/title/slug/type을 출력해 정확히 2건인지 확인하고 transaction으로 해당 published/draft ID만 삭제한 뒤 Sanity count=0, 상세 404, 홈·목록·검색·RSS·sitemap 부재를 확인한다.
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

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

- Title: 아카이브 페이지 하단 여백 수정
- Goal: 스터디·회의·작업 목록 페이지의 과도한 하단 여백을 제거하고 콘텐츠가 적거나 비어 있어도 화면 하단 구성이 자연스럽도록 교정한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 스터디·회의·작업 페이지 하단 여백 교정
- Description: 세 목록 페이지의 실제 렌더링과 공통 레이아웃을 비교해 과도한 하단 여백 원인을 찾고 필요한 스타일만 최소 수정한다.
- Expected output: /study, /meetings, /work에서 불필요하게 큰 하단 공백이 제거되고 짧은 콘텐츠와 빈 상태에서도 푸터가 자연스럽게 배치된다.
- Done condition: 데스크톱과 모바일 브라우저에서 세 경로의 하단 배치를 확인하고 Astro 프로덕션 빌드가 통과한다.
- In scope: 스터디·회의·작업 목록 페이지 및 원인인 경우 공통 레이아웃 스타일
- Out of scope: 페이지 재디자인, 콘텐츠 변경, Sanity 데이터 변경, 백엔드 변경, 운영 배포
- Validation hint: 수정 전후 브라우저 스크린샷과 문서/뷰포트 높이를 비교하고 npm run build를 실행한다.
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

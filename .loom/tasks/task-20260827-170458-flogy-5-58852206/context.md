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

- Title: 회의 원본 자동 정리·발행 루프
- Goal: TXT 또는 오디오 회의 원본을 입력하면 원본을 보존하고, 오디오는 전사한 뒤 기록 목적에 따라 프로젝트 회의·스터디·대화·팀 운영으로 분류하며, 표준 회의 문서 구조로 정리·검증하고 명시적 승인 시 Sanity 블로그에 발행하는 로컬 Pi 에이전트 루프를 구축한다.
- Branch: Haru2_dev
- Task count: `7`

## Task

- Title: Flogy 5차 회의 게시물 전사본 기준 재발행
- Description: 운영 Sanity의 기존 Flogy 5차 회의 게시물을 정확히 식별해 삭제하고, /Users/hongyongjae/Desktop/Flogy/회의기록/5차회의 전사본 파일을 새 원본으로 Pi 구조화·검수한 뒤 동일 회차 meeting 게시물로 다시 발행한다.
- Expected output: 기존 5차 회의 문서가 제거되고 새 전사본의 안건·사람별 의견·결정·행동 항목을 반영한 Flogy 5차 meeting 문서가 production Sanity와 공개 상세 URL에 정상 반영된다.
- Done condition: 새 전사본 파일을 정확히 식별·보존하고 기존 문서 ID와 백업 내용을 확인한 뒤 기존 문서만 삭제한다. Pi preview 검수, person 참조·중복 검증, 신규 발행, publish-result, 공개 URL HTTP 200과 제목·본문 확인을 완료한다.
- In scope: 지정 전사본 탐색·읽기, 기존 Flogy 5차 Sanity 문서 백업·삭제, Pi 구조화, preview 보정, validate-only, production Sanity 재발행, 공개 검증, Loom 기록
- Out of scope: 다른 회의 게시물 삭제, 원본 전사본 수정·삭제, 임의 썸네일 추가, 코드 변경, Jenkins·Argo 배포, 다른 회차 내용 변경
- Validation hint: 삭제 전 Sanity ID/slug/title을 확인하고 로컬 JSON 백업을 남긴다. 새 문서는 person 참조와 duplicateCount 0을 validate-only로 확인한 뒤 create하고, Sanity 재조회와 공개 URL HTTP 200 및 새 본문 표식을 검증한다.
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

## 2026-08-26T11:09:50+00:00

Flogy 5차 전사본을 /Users/hongyongjae/Desktop/Flogy_5차회의_전사본_2026-08-26.txt로 복사했다. 원본과 복사본은 모두 76,737 bytes이며 SHA-256 62176c45d44982100fb239f19325572bf000056d4f12af9b873bfd1aaf17e95f, cmp exit 0으로 동일함을 검증했다. 원본과 다른 산출물은 변경하지 않았다.

- Task: `task-20260826-110820-flogy-5-89062e98`
- Tags: `결과`, `검증`, `전사본`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

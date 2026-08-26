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
- Task count: `5`

## Task

- Title: Flogy 5차 회의 기록 Pi 정리·발행
- Description: 사용자가 지정한 26/08/26_Flogy_5차회의 원본 파일을 찾아 Pi 회의 워크플로우로 구조화하고 preview를 검토한 뒤, 사람 참조·중복을 검증해 production Sanity 블로그에 실제 발행한다.
- Expected output: 원본의 안건, 사람별 의견, 결정 사항, 행동 항목과 불확실성이 정확히 정리된 독립 meeting 게시물이 production Sanity에 발행되고 공개 상세 URL에서 확인된다.
- Done condition: 정확한 원본 파일 식별과 보존, 날짜·참여자 확인, Pi preview 생성, post.md 내용 검토, person 참조 및 중복 사전 검증, 명시된 사용자 요청에 따른 Sanity 발행, publish-result와 공개 페이지 확인을 완료한다.
- In scope: 지정 파일 탐색·읽기, Pi 회의 자동화, 필요한 preview 보정, Sanity 검증·발행, 공개 페이지 확인, Loom 기록
- Out of scope: 다른 회의 파일 발행, 임의 썸네일 추가, 원본 삭제·변경, 동일 문서 덮어쓰기, 코드 기능 변경, Jenkins/Argo 배포
- Validation hint: meeting-agent 산출물과 구조화 스키마를 확인하고 publish validate-only 후 실제 create를 수행한다. Sanity 문서 ID/slug 중복이 없고 공개 URL이 HTTP 200이며 제목·날짜가 일치하는지 확인한다.
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

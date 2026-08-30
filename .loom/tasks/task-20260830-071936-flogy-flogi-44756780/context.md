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

- Title: Flogy 표기 Flogi 교정
- Goal: 블로그 저장소에서 잘못 사용된 Flogy 표기를 모두 찾아 Flogi로 일관되게 교정하고, 검색과 프로젝트 검증으로 누락 및 회귀가 없음을 확인한다.
- Branch: Haru2_dev
- Task count: `2`

## Task

- Title: 출판된 회의 게시물의 Flogy 표기를 Flogi로 교정
- Description: production Sanity에서 출판된 meeting 문서를 전수 조회하고 Flogy/FLOGY/flogy가 포함된 문서를 식별한다. 변경 전 문서 ID·revision·대상 필드를 기록한 뒤 사용자 콘텐츠의 표기를 Flogi/FLOGI/flogi로 수정하고 재조회로 검증한다.
- Expected output: production Sanity의 모든 출판 meeting 문서 조사 결과, 실제 변경 문서와 필드 내역, Flogy 계열 잔여 0건 검증
- Done condition: 모든 출판 meeting 문서를 조회했으며 사용자 콘텐츠 필드에 Flogy 계열 표기가 남지 않고, 변경 문서가 정상 출판 상태로 조회된다.
- In scope: Sanity production dataset의 출판된 meeting 문서 조회, title·slug·excerpt·body·tags 등 사용자 콘텐츠 필드의 표기 교정, 변경 전후 검증, Loom 기록
- Out of scope: Sanity 내부 _id 변경·문서 삭제, meeting 외 콘텐츠, 코드 기능 변경, 원격 Git 푸시·애플리케이션 배포
- Validation hint: 수정 전후 production GROQ 전수 조회와 문자열 재귀 검색, 변경 문서 revision 및 published 상태 확인
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

## 2026-08-30T07:16:32+00:00

제품 소스·문서·테스트·배포 설정은 교정하되, .loom의 과거 실행 ID와 감사 기록은 참조 무결성을 위해 변경하지 않는다.

- Task: `task-20260830-071358-flogy-flogi-773a6445`
- Tags: `decision`, `scope`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

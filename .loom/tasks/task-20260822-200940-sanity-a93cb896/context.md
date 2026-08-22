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

- Title: 로컬 개발 환경 확인
- Goal: 프로젝트 의존성을 준비하고 Astro 개발 서버를 백그라운드로 실행해 로컬 페이지가 정상 응답하는지 확인한다.
- Branch: main
- Task count: `2`

## Task

- Title: Sanity 인증 연결 및 로컬 동작 검증
- Description: 사용자가 제공한 Sanity API 토큰을 Git에서 제외되는 .env에 저장하고 서버 측 Sanity 클라이언트가 토큰을 사용하도록 구성한 뒤 개발 서버와 인증 조회를 검증한다.
- Expected output: .env가 Git에서 제외되고 토큰이 브라우저 번들에 노출되지 않은 채 Sanity published 데이터 조회와 로컬 페이지 렌더링이 성공한다.
- Done condition: git check-ignore로 .env 제외가 확인되고, 토큰 인증 GROQ 조회 및 localhost 페이지가 HTTP 200을 반환하며 Sanity siteSettings 데이터가 렌더링된다.
- In scope: .env 생성, 서버 측 Sanity client 토큰 설정, dev 서버 재시작, 인증 조회/화면/로그 검증
- Out of scope: Sanity 문서 생성·수정·삭제, 토큰 권한 변경, 운영 배포, 기존 사용자 변경 커밋
- Validation hint: 토큰 자체를 출력하지 말고 git check-ignore, 인증 API 응답 코드/문서 수, astro dev status, localhost HTML을 확인한다.
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

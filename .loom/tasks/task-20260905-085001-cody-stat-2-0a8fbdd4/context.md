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

- Title: 2026-09-04 Cody Stat 2차 회의 게시
- Goal: 다운로드 폴더의 26-09-04_코디스텟_2차_회의 원본을 기존 블로그 회의 콘텐츠 형식에 맞게 production Sanity에 게시하고 운영 페이지와 프로젝트 검증으로 확인한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: Cody Stat 2차 회의 원본을 블로그에 게시하고 검증
- Description: 저장소와 원본 파일을 점검하고 2026-09-04 Cody Stat 2차 회의 내용을 기존 meeting 형식으로 구조화한다. production Sanity 중복·참여자 검증 후 게시하고 운영 URL과 프로젝트 빌드를 확인한다.
- Expected output: 2026-09-04 Cody Stat 2차 회의 게시물 1건, production 문서와 운영 URL 검증 결과, Loom 완료 기록
- Done condition: 원본의 핵심 논의·결정·행동 항목이 과장 없이 게시되고 사람 참조와 slug가 유효하며 운영 페이지 HTTP 200, 회의 테스트, Astro build가 통과한다.
- In scope: git 상태 점검, 다운로드 원본 판독, 기존 Cody Stat 글과 포맷 조사, 로컬 preview 작성, production Sanity 게시, 운영 URL·테스트·빌드 검증, Loom 기록과 커밋
- Out of scope: 원본에 없는 내용 생성, 기존 게시물 수정·삭제, 앱 코드 기능 변경, 원격 push와 애플리케이션 배포 설정 변경
- Validation hint: 원문 대조, MeetingAgentResultSchema와 필수 Markdown 섹션 검사, meeting:publish validate-only, Sanity published 재조회, 운영 URL HTTP 200, meeting:test, astro build
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

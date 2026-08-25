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
- Task count: `2`

## Task

- Title: Pi extension으로 회의 전과정 자동화
- Description: 기존 meeting-agent prepare/publish 엔진을 Pi 0.84.2 프로젝트 extension에 연결한다. Pi 안에서 /meeting 명령 또는 등록 도구로 TXT/오디오 원본을 받아 전사·분류·표준 문서 preview·Sanity 사전 검증을 수행하고, 사용자 확인 UI를 거친 경우에만 발행한 뒤 공개 URL을 확인한다.
- Expected output: 사용자가 프로젝트 루트에서 Pi를 실행해 /meeting <파일>을 입력하면 전체 준비 과정과 preview가 Pi UI 안에서 진행되고, 발행 확인을 승인하면 동일 세션에서 Sanity 업로드와 공개 경로 확인까지 완료되는 프로젝트 로컬 extension과 문서·테스트가 제공된다.
- Done condition: Pi extension API에 맞는 project-local extension이 명령과 최소권한 도구를 등록한다. prepare 진행·결과 표시, run 상태 유지, 검토 파일 열람/요약, 발행 전 명시적 confirm UI, validate-only와 publish, 오류 복구 및 중복 방지가 동작한다. 실제 Pi에서 extension 로드와 /meeting TXT fixture 흐름을 검증하고 취소 시 쓰기가 없음을 확인하며 자동 테스트와 npm build, Loom strict validation을 통과한다.
- In scope: Pi project-local extension, /meeting 명령, extension tool schema, 기존 meeting-agent CLI의 재사용 가능한 process API 또는 subprocess 연결, UI 승인/상태 메시지, TXT/오디오 흐름, Sanity validate/publish 연결, 테스트·문서·Loom 기록
- Out of scope: 승인 없는 자동 발행, Whisper 대형 모델 자동 다운로드 실행, 실제 사용자 회의 게시물 발행, 썸네일 생성, 기존 콘텐츠 덮어쓰기, 웹 UI·백그라운드 큐, Pi 글로벌 설정이나 다른 프로젝트 extension 변경
- Validation hint: 로컬 Pi extension 문서와 TypeScript API를 확인한다. pi --extension <path>로 로드 및 등록 오류가 없는지 검증한다. fixture TXT에 대해 /meeting 또는 extension command handler가 prepare를 수행하고 preview/run 경로를 보여주는지 확인한다. confirm 거절 경로는 Sanity 쓰기를 호출하지 않아야 하며 validate-only는 운영 person/duplicate query만 수행한다. extension unit/integration test, meeting:test, npm build, Loom validation을 실행한다.
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

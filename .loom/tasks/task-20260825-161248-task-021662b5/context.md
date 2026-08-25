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
- Task count: `4`

## Task

- Title: 실사용 기반 회의 자동화 복구·입력 개선
- Description: 개포동 2 실제 음성 처리에서 확인된 날짜 후반 실패, 무진행 표시, 재전사 비용과 로컬 Whisper 화자 품질 문제를 개선한다. 오디오 메타데이터 날짜 자동 추출, Clova 전사본 우선 처리, 단계별 진행 상태, 실패 run 재개를 meeting-agent와 Pi extension에 추가한다.
- Expected output: 사용자가 오디오만 주면 메타데이터 날짜가 자동 적용되고, Clova TXT/JSON 전사본을 주면 재전사 없이 화자 정보를 보존해 정리하며, 처리 단계와 경과 시간이 보이고 실패 run을 재개할 수 있는 CLI/Pi 흐름과 문서·테스트가 제공된다.
- Done condition: 오디오 creation_time 날짜 추출, 명시 --date 우선순위, Clova TXT/JSON 정규화, 전사본 우선 경로, 실패 산출물 manifest와 resume, Pi 진행 표시가 자동 테스트로 검증되고 개포동 2 기존 run을 재전사 없이 날짜 보완해 preview 생성하며 npm build와 Loom strict validation을 통과한다.
- In scope: meeting-agent CLI/라이브러리, Pi project extension, ffprobe metadata preflight, Clova transcript parser, resume/reuse, progress status, 개포동 2 로컬 fixture성 검증, 문서와 테스트
- Out of scope: Clova API 호출·계정 연동, 실제 사용자 게시물 발행, 음성 화자 분리 모델 개발, 썸네일, Whisper 모델 변경, 웹 UI
- Validation hint: 단위 테스트로 날짜 우선순위와 Clova 포맷을 검증하고, 기존 개포동 2 run의 transcript/structured를 resume해 dated preview/run.json을 생성한다. 실제 Sanity 쓰기는 하지 않고 validate-only까지만 허용한다.
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

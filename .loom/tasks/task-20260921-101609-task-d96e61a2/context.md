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

- Title: 2026-09-21 연진님 사담 음성 전사
- Goal: 바탕화면의 26-09-21_연진님_사담 음성 파일 전체를 가능한 정확하게 한국어로 전사하고 원본 기준 시각과 불확실한 표현을 표시한 단일 UTF-8 TXT를 바탕화면에 저장한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 연진님 사담 음성 파일 정밀 전사·바탕화면 저장
- Description: 요청한 파일을 바탕화면에서 Unicode 정규화로 식별하고 설치된 전사 전용 에이전트의 accurate 모드로 전체 음성을 전사한다. 원본 의미를 보존하고 불확실한 표현을 표시해 같은 바탕화면에 TXT를 안전하게 저장한다.
- Expected output: 바탕화면의 26-09-21_연진님_사담_전사.txt 한 파일과 원본·결과 무결성 검증 기록
- Done condition: 정확한 오디오 한 건의 경로·길이·해시를 확인하고 전체 구간 OpenSuperWhisper 다중 후보와 Pi 검수를 거쳐 비어 있지 않은 전사 TXT를 바탕화면에 저장한다. 타임스탬프 범위와 결과 해시를 검증하고 기존 파일을 무단 덮어쓰거나 원본을 변경하지 않으며 Loom strict 검증과 로컬 커밋을 완료한다.
- In scope: 지정 바탕화면 오디오 한 건 검색·읽기, 로컬 오디오 전사·Pi 문맥 검수, TXT 생성·검증, Loom 기록·로컬 커밋
- Out of scope: 다른 파일 전사, Sanity 게시, 블로그 작성, 원본 음성 변경, 모델 설치·변경, 외부 공유, 원격 push
- Validation hint: ffprobe 길이 확인, 전사 run result.json·해시·타임스탬프·UTF-8 검사, 원본 SHA-256 전후 일치, loom task validate --strict 및 loom validate --strict
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: codex

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

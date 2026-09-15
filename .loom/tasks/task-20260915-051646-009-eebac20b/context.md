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

- Title: 2026-09-15 음성 009 전사
- Goal: 바탕화면의 음성 009_W_20260915_124101.m4a를 한국어로 전사하고 원본과 같은 경로에 읽기 쉬운 전사 파일을 저장한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 음성 009 전사본을 원본 옆에 저장
- Description: 지정 m4a를 로컬 한국어 모델로 구간별 전사하고 발화 순서를 보존하면서 명확한 문장부호·띄어쓰기만 보정한다. 불확실한 발화는 표시하고 바탕화면의 원본과 같은 기본 이름으로 텍스트 전사본을 제공한다.
- Expected output: 바탕화면의 음성 009_W_20260915_124101.txt 전사 파일
- Done condition: 전체 2501.8초 입력의 전사가 성공하고 본문이 비어 있지 않으며 원본과 동일 디렉터리에 저장됨을 검증한다. 원본은 변경하지 않으며 Loom 검증과 로컬 기록 커밋을 완료한다.
- In scope: 지정 음성 읽기, 설치된 OpenSuperWhisper 한국어 모델 사용, 임시 오디오 변환과 구간 전사, 내용 검수, 같은 경로 텍스트 저장, Loom 기록·검증·로컬 커밋
- Out of scope: 다른 음성 전사, 원본 변경, 모델 설치·변경, 외부 공유, 블로그 코드 수정·게시, 원격 push
- Validation hint: ffprobe 입력 길이와 구간 커버리지를 확인하고 출력의 비어 있지 않은 한국어 본문·경로·바이트 크기를 검증한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: REVIEW_REQUIRED
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

## 2026-09-15T05:26:45+00:00

음성 009 전체를 OpenSuperWhisper 한국어 large-v3-turbo로 전사하고 1분 단위 대조로 반복 오인식과 일부 누락을 보완했다. 원본 옆 TXT 40,502바이트를 저장했으며 9구간 커버리지, 결과 바이트 일치와 원본 SHA-256 불변을 검증했다.

- Task: `task-20260915-051646-009-eebac20b`
- Tags: `result`, `validation`, `decision`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

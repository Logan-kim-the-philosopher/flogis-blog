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

- Title: 2026-09 연진님 대화·Node.js 피드백 개별 전사
- Goal: 바탕화면의 26-09-2_연진님_팀_대화.m4a와 26-09-20_연진님_nodejs_세션_피드백.m4a를 각각 전체 길이만큼 가능한 정확하게 한국어로 전사하고 원본 기준 시각이 있는 별도 UTF-8 TXT 두 파일을 같은 바탕화면에 저장한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 연진님 팀 대화와 Node.js 세션 피드백 개별 전사
- Description: 지정된 두 AAC 음성 전체를 로컬 OpenSuperWhisper로 구간별 전사하고 원음과 음량 보정 결과를 비교해 누락·반복·문맥 오류를 줄인다. 확정할 수 없는 발화는 표시하고 각 원본 기준 타임스탬프가 있는 별도 TXT로 저장한다.
- Expected output: 바탕화면의 26-09-2_연진님_팀_대화_전사.txt와 26-09-20_연진님_nodejs_세션_피드백_전사.txt
- Done condition: 두 원본 전체 재생 시간을 빠짐없이 구간으로 다루고 각각 비어 있지 않은 UTF-8 TXT를 바탕화면에 저장한다. 각 파일의 첫·끝 구간, 출력 크기와 사본 바이트 일치, 원본 SHA-256 불변, Loom 검증과 로컬 작업 기록 커밋을 확인한다.
- In scope: 두 지정 음성 읽기, 로컬 모델 전사, 문제 구간 재전사·비교, 문맥상 명확한 오류 교정, 타임스탬프 포함 별도 TXT 두 파일 저장, Loom 기록·검증·커밋
- Out of scope: 원본 수정·삭제, 두 전사본 통합, 블로그 게시, Sanity 발행, 다른 음성 처리, 외부 공유, 원격 push
- Validation hint: ffprobe 전체 길이와 구간 범위, 첫·끝 발화, 최종 파일 비어 있지 않음, 임시본과 바탕화면 사본 SHA-256 일치, 원본 크기·SHA-256 불변, loom validate 통과를 확인한다.
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

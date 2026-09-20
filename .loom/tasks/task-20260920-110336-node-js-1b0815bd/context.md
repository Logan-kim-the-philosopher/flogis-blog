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

- Title: 2026-09-20 Node.js 세션 리허설 전사
- Goal: 바탕화면의 26-09-20_node_js_세션_리허설.m4a 전체를 가능한 정확하게 한국어로 전사하고 원본 기준 시각이 있는 단일 UTF-8 텍스트 파일을 같은 바탕화면에 저장한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: Node.js 세션 리허설 전체 전사본 저장
- Description: 바탕화면의 지정 녹음 전체를 로컬 한국어 음성 인식 모델로 전사한다. 인식이 희박하거나 반복·비문인 구간은 재분할 또는 음량 보정 결과와 비교하고 불확실한 발화는 표시한다. 원본 시작 기준 시각이 있는 단일 TXT를 바탕화면에 저장한다.
- Expected output: 바탕화면의 26-09-20_node_js_세션_리허설_전사.txt 한 파일
- Done condition: 원본 전체 길이를 누락 없이 구간별로 전사해 비어 있지 않은 단일 TXT로 같은 바탕화면에 저장한다. 구간 길이 합과 첫·끝 발화, 저장본 바이트 일치, 원본 SHA-256 불변, Loom 검증 및 로컬 작업 기록 커밋을 완료한다.
- In scope: 지정 녹음 읽기, 설치된 로컬 한국어 모델로 전 구간 및 문제 구간 전사·비교, 임시 오디오 변환, 바탕화면 단일 TXT 저장, Loom 기록·검증·로컬 커밋
- Out of scope: 원본 변경·삭제, 다른 녹음 전사, 모델 설치·변경, 외부 공유, 블로그 코드 변경·게시, 원격 push
- Validation hint: 결과의 ## 검증 구획에 원본 길이와 구간 합, 첫·끝 발화, 출력 크기·바이트 일치, 원본 SHA-256 불변, loom validate 통과를 기록한다.
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

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

- Title: 2026-10-02 지환님 커피챗 전사
- Goal: 바탕화면의 26-10-02_지환님_커피챗 녹음을 전체 길이만큼 정확하게 한국어로 전사하고 타임스탬프 UTF-8 TXT를 같은 바탕화면에 저장한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 지환님 커피챗 전체 전사
- Description: 바탕화면에서 지정 녹음을 Unicode 정규화를 고려해 정확히 찾고, accurate 모드의 다중 후보를 생성해 전체 발화를 별도 TXT로 전사한다.
- Expected output: 바탕화면의 26-10-02_지환님_커피챗_전사.txt
- Done condition: 정확한 원본의 길이와 SHA-256을 확인하고 녹음 전체를 타임스탬프 UTF-8 TXT로 저장한다. 불확실한 표현을 표시하며 원본 해시 불변, 결과 존재·크기·전체 구간, Loom 검증을 확인한다.
- In scope: 지정 오디오 검색, 로컬 다중 후보 전사, 후보 문맥 검수, 독립 TXT 저장, 원본 무결성 및 결과 검증, Loom 기록
- Out of scope: 기존 두 전사 재처리, 녹음 통합, 원본 변경, 블로그 작성, 외부 전송, 원격 push
- Validation hint: ffprobe 길이와 SHA-256 전후, result.json, TXT UTF-8·타임스탬프·크기·해시, loom task validate --strict와 loom validate --strict
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

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

- Title: OpenSuperWhisper 외 Whisper 모델 정리
- Goal: 로컬에 설치된 Whisper 모델을 전수 확인하고 OpenSuperWhisper 앱과 그 전용 모델·필수 리소스만 보존한 채 나머지 Whisper 모델 파일과 캐시를 제거한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: OpenSuperWhisper 제외 Whisper 모델 제거
- Description: 사용자 홈, 저장소, 일반 캐시 경로에서 Whisper 음성 인식 모델 파일을 읽기 전용으로 전수 조사한다. OpenSuperWhisper 앱 번들과 전용 Application Support 모델 경로는 보존 목록으로 고정하고, 나머지 식별된 Whisper 모델만 명시 경로로 제거한 뒤 보존 모델과 앱 설정을 검증한다.
- Expected output: OpenSuperWhisper 앱 및 /Users/hongyongjae/Library/Application Support/fr.my-monkey.opensuperwhisper 아래의 전용 모델은 남아 있고, 그 밖에 확인된 Whisper 모델 파일·캐시는 제거되어 회수 용량과 삭제 경로가 기록된다.
- Done condition: 삭제 전 정확한 대상 목록·크기·Git 추적 여부를 확인하고, OpenSuperWhisper 보존 경로를 삭제 명령에서 제외하며, 삭제 후 같은 검색으로 비보존 Whisper 모델이 0건인지 확인한다. OpenSuperWhisper 선택 모델 파일과 앱 CLI 도움말이 정상이고 Loom 검증과 로컬 커밋이 완료된다.
- In scope: 사용자 홈과 현재 저장소의 Whisper 모델 파일·관련 모델 캐시 읽기 전용 조사, OpenSuperWhisper 전용 경로를 제외한 명시 대상 삭제, 회수 용량 계산, 앱 설정·모델 존재 검증, Loom 기록과 로컬 커밋
- Out of scope: OpenSuperWhisper 앱 삭제·재설정, OpenSuperWhisper 전용 모델·VAD 리소스 삭제, 원본 음성·전사본 삭제, Whisper 실행 바이너리·Homebrew 패키지 제거, 관련 없는 AI 모델·캐시 삭제, 원격 push
- Validation hint: find와 du로 삭제 전후 후보를 비교하고, realpath 기준 보존 루트 밖만 삭제한다. defaults selectedWhisperModelPath가 존재하고 OpenSuperWhisper --help가 성공하는지 확인한다. Git 추적 모델 삭제는 git diff로 정확히 검토한다.
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

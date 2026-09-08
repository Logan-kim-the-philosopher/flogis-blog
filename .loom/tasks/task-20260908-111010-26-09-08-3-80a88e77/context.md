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

- Title: 2026-09-08 정현님 개인 대화 음성 전사
- Goal: 바탕화면의 26-09-08_정현님_개인_대화 음성 파일을 OpenSuperWhisper로 가능한 한 정확하게 한국어로 전사하고 정리본과 원시본을 바탕화면에 제공한다.
- Branch: Haru2_dev
- Task count: `2`

## Task

- Title: 26-09-08 정현님 개인 대화 3 음성 정밀 전사
- Description: 바탕화면에서 26-09-08_정현님_개인_대화_3 이름의 대상 음성을 정확히 식별하고 포맷·길이를 확인한 뒤 OpenSuperWhisper의 현재 로컬 large-v3-turbo 한국어 설정으로 전체를 전사한다. 긴 음성은 경계 중복 구간으로 처리하고 문맥상 확실한 표현만 보정한 정리본과 원시본을 바탕화면에 제공한다.
- Expected output: /Users/hongyongjae/Desktop에 26-09-08_정현님_개인_대화_3 이름의 OpenSuperWhisper 정리 전사 Markdown과 원시 전사 텍스트가 존재한다.
- Done condition: 대상 원본의 전체 길이를 빠짐없이 포함하고 출력 잘림·빈 구간·인코딩·파일 구조를 검증하며 바탕화면 산출물과 임시 완성본의 SHA-256이 일치한다. 원본은 변경하지 않는다.
- In scope: 대상 음성 읽기, 로컬 오디오 분석·임시 디코딩·필요 시 분할, OpenSuperWhisper 로컬 전사, 문맥상 확실한 교정, 바탕화면 파일 작성, Loom 기록과 로컬 커밋
- Out of scope: 원본 변경·삭제, 외부 서비스 업로드, 화자 신원 추정, 내용 사실 검증, 저장소 애플리케이션 코드 수정, 원격 push
- Validation hint: ffprobe로 원본 길이·코덱을 확인하고 원본 전체를 덮는 전사 구간 수와 JSON 텍스트를 검사한다. 출력 잘림 문자열과 빈 텍스트가 없고 바탕화면 복사본 SHA-256이 완성본과 일치해야 한다.
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

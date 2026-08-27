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
- Task count: `8`

## Task

- Title: Flogy 발표 진행 흐름·희성님 통화 회의록 발행
- Description: 2026-08-26 Flogy 발표 진행 흐름·희성님 통화 전사 원본을 찾아 Pi 회의 워크플로로 구조화하고, 원문에 근거해 안건·사람별 의견·결정·행동 항목을 검토한 뒤 별도 회의 게시물로 발행한다.
- Expected output: 통화 원본의 맥락을 정확히 반영한 회의록과 운영 Sanity meeting 문서, 검증된 공개 URL
- Done condition: 원본 파일과 해시를 확인하고 날짜·실제 참여자를 매핑하며, Pi preview를 원문과 대조하고 validate-only에서 중복 0건을 확인한 뒤 운영 발행 및 Sanity·공개 페이지 HTTP 200·제목·본문을 검증한다.
- In scope: 지정된 2026-08-26 통화 전사 파일, Pi 구조화·미리보기, 신규 meeting 게시물 1건, 발행 검증, Loom 기록
- Out of scope: 다른 게시물 수정·삭제, 임의 썸네일, 코드 변경, Jenkins·Argo 작업, 기존 문서 덮어쓰기
- Validation hint: 원본 SHA-256·날짜·참여자 ref·중복 조회·validate-only·publish 결과와 공개 URL의 HTTP 200 및 제목·본문을 확인한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: PENDING
- Assigned agent: -

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

## 2026-08-26T11:09:50+00:00

Flogy 5차 전사본을 /Users/hongyongjae/Desktop/Flogy_5차회의_전사본_2026-08-26.txt로 복사했다. 원본과 복사본은 모두 76,737 bytes이며 SHA-256 62176c45d44982100fb239f19325572bf000056d4f12af9b873bfd1aaf17e95f, cmp exit 0으로 동일함을 검증했다. 원본과 다른 산출물은 변경하지 않았다.

- Task: `task-20260826-110820-flogy-5-89062e98`
- Tags: `결과`, `검증`, `전사본`
## 2026-08-27T17:10:23+00:00

Flogy 5차 기존 문서 meeting-flogy-round-5-2026-08-26(rev SseX7szR4uwwNDZHqDdbge)를 .meeting-agent/runs/flogy-5-clova-republish-20260828/replaced-sanity-document.json으로 전체 백업한 뒤 삭제했다. 새 원본 /Users/hongyongjae/Desktop/Flogy/회의기록/26 08 26_Flogy_5차회의.txt(SHA-256 d6b39570a45b403628989ca317bd7d6841a884da5ccc9c970bb688add5d8ad74)을 Pi로 구조화했다. Clova 호명 근거로 참석자 1=김희성, 참석자 2=홍용재, 참석자 3=김정현으로 정규화하고 언급만 된 정희·은재·소연은 참가자에서 제외했다. validate-only에서 person 3개, duplicateCount 0, readyToPublish true를 확인하고 production Sanity에 같은 ID/slug로 새 문서(rev f3MyPefCUOcBjdI629lqC9)를 발행했다. 제목은 Flogy 5차 회의 — Pi·Loom 역할 정리와 OHAYO 시연 범위 확정이며 coverImage는 없다. 공개 URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-round-5-2026-08-26 는 HTTP 200이고 새 제목, 원본 파일명, 사업계획서/고객 타겟 정의 섹션을 확인했다. 첫 삭제 시도는 GROQ $id가 셸에서 확장되어 조회 단계에서 400 오류가 났고 삭제는 발생하지 않았다. 이후 고정 ID와 기존 revision을 재검증해 정확한 한 건만 삭제했다.

- Task: `task-20260827-170458-flogy-5-58852206`
- Tags: `결과`, `검증`, `삭제`, `재발행`, `Sanity`, `Pi`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

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
- Task count: `1`

## Task

- Title: Pi 회의 원본 정리·Sanity 발행 루프 구현
- Description: 로컬 Pi의 실제 CLI/extension 인터페이스와 설치된 전사 도구를 조사하고, TXT/Markdown은 직접 읽으며 오디오는 전사 후 처리하는 반복 가능한 에이전트 루프를 구현한다. 루프는 기록 목적 분류, 회의 기본 정보, 30초 요약, 배경, 안건별 사람 의견·선택지·결론·상태, 결정, 행동 항목, 미결 사항, 원본 근거를 생성하고 검증한 뒤 preview 또는 명시적 publish 모드로 Sanity에 업로드한다.
- Expected output: 단일 명령으로 TXT/오디오 원본을 처리해 구조화된 Markdown과 발행 payload를 생성할 수 있고, preview에서는 외부 변경이 없으며 publish에서는 중복·필수 필드·작성자 참조를 확인한 후 올바른 Sanity study/meeting 문서로 업로드하는 Pi 기반 로컬 루프와 사용 문서가 제공된다.
- Done condition: Pi 호출 프롬프트와 입력/출력 계약, 파일 형식 판별, 오디오 전사 adapter, 분류 규칙, 구조 검증, slug/날짜/사람 매핑, Sanity preview/publish, 실행 로그와 실패 복구가 구현된다. fixture TXT로 end-to-end dry run을 통과하고 오디오 경로는 설치 도구 탐지 또는 명확한 사전조건 오류로 검증하며 npm build와 Loom strict validation을 통과한다.
- In scope: 로컬 scripts 또는 agent 디렉터리, Pi CLI 연동, 텍스트/오디오 입력, 전사 adapter, 회의 유형 분류와 표준 문서화 프롬프트, 결과 검증, Sanity 업로드, dry-run fixture, README/운영 가이드, 빌드·정적 검증
- Out of scope: 실제 사용자 회의 원본의 무승인 자동 발행, 썸네일 자동 생성, 웹 업로더 UI, 클라우드 큐·스케줄러, 외부 계정 생성, Sanity 토큰 생성·회전, 대규모 기존 게시물 재가공
- Validation hint: pi --help/version과 전사 도구 탐지 결과를 기록한다. TXT fixture를 preview로 실행해 classification/required sections/payload를 검사한다. publish는 mock 또는 별도 검증 모드로 중복 및 참조 오류를 확인한다. 오디오 fixture가 없으면 unsupported/미설치 경로의 안전한 오류를 검사한다. npm run build, shell/Node syntax check, Loom task validate와 loom validate --strict를 실행한다.
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

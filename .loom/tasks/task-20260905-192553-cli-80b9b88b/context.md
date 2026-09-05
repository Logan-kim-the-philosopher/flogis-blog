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

- Title: 팀원용 Pi 미팅 에이전트·Sanity CLI 게시 세팅 가이드
- Goal: Git 저장소 권한이 없는 팀원이 전달받은 최소 실행 번들로 Pi 미팅 에이전트와 production Sanity를 연결하고 CLI에서 안전하게 preview·검증·publish할 수 있도록 상세 온보딩 Markdown을 작성해 바탕화면에 제공한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 저장소 권한 없는 팀원의 CLI 게시 온보딩 가이드 작성
- Description: 현재 저장소의 meeting agent, Pi extension, Sanity 스키마·환경변수·발행 안전장치와 필요한 런타임 파일을 조사한다. 팀원에게 Git 저장소를 주지 않는 조건에서 사용할 최소 번들 구성, 설치, 자격 증명, 사람 참조, prepare/preview/publish, 검증, 문제 해결, 회수 절차를 상세 Markdown으로 작성하고 동일본을 바탕화면에 제공한다.
- Expected output: docs의 정본과 바탕화면의 동일한 한국어 상세 Markdown 가이드. 팀원이 빈 디렉터리에서 최소 번들과 개별 자격 증명을 받아 Pi 미팅 에이전트로 preview·검증·Sanity publish를 수행할 수 있는 체크리스트와 명령을 포함한다.
- Done condition: 가이드가 실제 저장소 코드와 설정을 반영하고 비밀정보를 포함하지 않으며, 최소 번들 파일 목록·설치 전제·환경변수 템플릿·Sanity 토큰 권한·Pi 인증·TXT/오디오 흐름·사람 참조·validate-only·publish·운영 URL 확인·오류 해결·권한 회수 절차를 포함하고 Markdown 구조·명령 정확성과 두 사본 동일성을 검증한다.
- In scope: 저장소·현재 문서·스크립트·설정 읽기, 필요한 공식 문서 확인, 팀원용 운영 모델 설계, 상세 Markdown 작성과 바탕화면 복사, 문서 내용·링크·명령 검증, Loom 기록과 커밋
- Out of scope: 실제 팀원 계정 생성·초대, Sanity 토큰 생성 또는 공유, Pi 설치·로그인 실행, 팀원 장비 변경, 저장소 애플리케이션 코드 수정, production 게시, 원격 push
- Validation hint: 문서의 파일 목록을 실제 저장소와 대조하고 package scripts·CLI usage·환경변수·Sanity 스키마·승인 조건을 코드에서 검증하며 Markdown heading/code fence/link·비밀정보 부재와 바탕화면 사본 SHA-256 일치를 검사한다.
- Required docs: -
- Memory refs: -
- Document outputs: `docs/team-member-meeting-agent-sanity-cli-setup.md`
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

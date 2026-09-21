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

- Title: 개인 에이전트 블로그 Markdown 전환 설계
- Goal: 현재 Flogis 프런트엔드를 별도 개인 에이전트 블로그로 복제할 때 Sanity를 제거하고 Astro Content Collections, Markdown, 로컬 이미지, Git 자동 배포로 운영하는 목표 구조와 단계별 전환 계획을 docs 문서로 확정한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: 개인 에이전트 블로그 Markdown 운영 구조 문서화
- Description: 현재 Astro·Sanity 구조를 기준으로 별도 개인 에이전트 블로그가 Sanity 없이 로컬 Markdown 콘텐츠, 썸네일 파일, Git 이력과 자동 배포로 운영되도록 목표 구조, 콘텐츠 스키마, 에이전트 발행 흐름, 전환 단계와 검증 기준을 문서화한다.
- Expected output: docs/personal-agent-blog-markdown-architecture.md
- Done condition: 문서에 선택 근거, 디렉터리 구조, frontmatter 예시, Astro Content Collections 스키마 방향, 글 생성부터 배포까지의 승인 흐름, Sanity 제거 대상, 단계별 마이그레이션 및 검증·롤백 기준이 포함되고 저장소 문서 링크와 Markdown 형식을 검증한 뒤 커밋한다.
- In scope: 현재 저장소 구조 조사, Astro 공식 Content Collections 기준 반영, 개인 에이전트 블로그 목표 아키텍처와 마이그레이션 계획 문서 작성
- Out of scope: 실제 프런트 복제, Sanity 코드 제거, 콘텐츠 마이그레이션, 배포 설정 변경, 기존 운영 블로그 수정
- Validation hint: 문서 필수 구획과 내부 파일 경로를 확인하고 git diff --check 및 loom validate --strict를 통과한다.
- Required docs: -
- Memory refs: -
- Document outputs: `docs/personal-agent-blog-markdown-architecture.md`
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

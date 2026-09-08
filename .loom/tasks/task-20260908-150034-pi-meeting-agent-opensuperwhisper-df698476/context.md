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
- Task count: `6`

## Task

- Title: Pi meeting agent OpenSuperWhisper 전사·교정 적용
- Description: 현재 저장소와 Pi에 배포된 meeting agent의 오디오 입력·전사·정리·발행 흐름을 대조한다. 오디오 파일 입력 시 OpenSuperWhisper를 사용하도록 실행 경계를 구성하고, 원시 전사를 보존하면서 문맥 검토·확실한 오인식 교정·불명확 표시·가독성 있는 회의 문서 정리 단계를 적용해 Pi 배포와 검증까지 수행한다.
- Expected output: meeting agent가 TXT 입력은 기존 흐름을 유지하고 오디오 입력은 OpenSuperWhisper 기반 전사를 거쳐 원시 전사와 교정된 읽기용 문서를 생성한다. 변경 코드·설정·테스트·운영 가이드가 저장소에 반영되고 Pi 런타임에도 안전하게 배포된다.
- Done condition: 로컬 구현과 Pi 실제 구성을 모두 확인하고, OpenSuperWhisper 실행 경로 및 Mac/Pi 간 실행 위치 제약을 명시적으로 처리한다. 오디오·TXT 경로 테스트, 불명확 표시 및 원시본 보존 테스트, 실패 시 명확한 오류·재시도 경로, Pi 배포 후 서비스/명령 검증, Loom 검증과 로컬 커밋이 완료된다.
- In scope: 저장소 meeting-agent 코드·설정·테스트·문서 점검 및 수정, Pi 읽기 전용 상태 확인, 필요한 파일·환경 설정 배포, 서비스 재시작과 비파괴 검증, OpenSuperWhisper 로컬 실행 연동, 전사 후 문맥 교정 프롬프트·산출물 구조 개선
- Out of scope: 원본 음성 삭제·변경, OpenSuperWhisper 앱 또는 모델 재설치·삭제, 관련 없는 블로그 기능 수정, 자동 Sanity publish 승인 완화, 비밀값 노출, 원격 Git push
- Validation hint: 기존 테스트와 신규 단위/통합 테스트를 실행하고 대표 오디오 fixture 또는 검증용 짧은 WAV로 OpenSuperWhisper 호출·원시본 보존·교정본 생성·불명확 표시를 확인한다. Pi에서는 배포 파일 체크섬, 환경 설정 키, 서비스 상태·로그와 dry-run/help를 확인하며 기존 TXT 입력 회귀가 없어야 한다.
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

## 2026-08-26T11:09:50+00:00

Flogy 5차 전사본을 /Users/hongyongjae/Desktop/Flogy_5차회의_전사본_2026-08-26.txt로 복사했다. 원본과 복사본은 모두 76,737 bytes이며 SHA-256 62176c45d44982100fb239f19325572bf000056d4f12af9b873bfd1aaf17e95f, cmp exit 0으로 동일함을 검증했다. 원본과 다른 산출물은 변경하지 않았다.

- Task: `task-20260826-110820-flogy-5-89062e98`
- Tags: `결과`, `검증`, `전사본`
## 2026-08-27T17:10:23+00:00

Flogy 5차 기존 문서 meeting-flogy-round-5-2026-08-26(rev SseX7szR4uwwNDZHqDdbge)를 .meeting-agent/runs/flogy-5-clova-republish-20260828/replaced-sanity-document.json으로 전체 백업한 뒤 삭제했다. 새 원본 /Users/hongyongjae/Desktop/Flogy/회의기록/26 08 26_Flogy_5차회의.txt(SHA-256 d6b39570a45b403628989ca317bd7d6841a884da5ccc9c970bb688add5d8ad74)을 Pi로 구조화했다. Clova 호명 근거로 참석자 1=김희성, 참석자 2=홍용재, 참석자 3=김정현으로 정규화하고 언급만 된 정희·은재·소연은 참가자에서 제외했다. validate-only에서 person 3개, duplicateCount 0, readyToPublish true를 확인하고 production Sanity에 같은 ID/slug로 새 문서(rev f3MyPefCUOcBjdI629lqC9)를 발행했다. 제목은 Flogy 5차 회의 — Pi·Loom 역할 정리와 OHAYO 시연 범위 확정이며 coverImage는 없다. 공개 URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-round-5-2026-08-26 는 HTTP 200이고 새 제목, 원본 파일명, 사업계획서/고객 타겟 정의 섹션을 확인했다. 첫 삭제 시도는 GROQ $id가 셸에서 확장되어 조회 단계에서 400 오류가 났고 삭제는 발생하지 않았다. 이후 고정 ID와 기존 revision을 재검증해 정확한 한 건만 삭제했다.

- Task: `task-20260827-170458-flogy-5-58852206`
- Tags: `결과`, `검증`, `삭제`, `재발행`, `Sanity`, `Pi`
## 2026-08-27T17:23:44+00:00

원본 /Users/hongyongjae/Desktop/Flogy/회의기록/26:08:26_Flogy_발표_진행_흐름_희성님_통화.txt(27,624 bytes, SHA-256 b3b40d12592646443de3b01c39ed180757eb23ec4fb807f246a7a5d296d8f816)을 사용자 승인 후 Pi openai-codex/gpt-5.4-mini로 구조화했다. Clova 헤더의 실제 통화 시각 2026-08-27 00:42를 따라 발행일을 2026-08-27로 정했고, 대화 중 직접 호명으로 참석자 1=김희성(person-heesung-kim), 참석자 2=홍용재(person-yongjae-hong)를 확정했다. Pi 초안의 룸/오하요 음차를 Loom/OHAYO로 정규화하고, 발표 데모 의견의 잘못된 화자 귀속과 김희성 금요일 자료 전달→홍용재 주말 시연용 래퍼 구현 기한 관계를 원문에 맞춰 교정했다. validate-only에서 meeting-flogy-presentation-flow-call-2026-08-27, person 2개, duplicateCount 0, readyToPublish true를 확인했다. production Sanity에 Flogy 발표 진행 흐름 통화 — Loom 생성과 오토 플랜 시연 설계 문서를 revision zvTTs4C2GL7q2tLCLkc1SZ로 신규 발행했으며 coverImage는 없다. 공개 URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-presentation-flow-call-2026-08-27 는 HTTP 200이고 제목, 김희성/홍용재, Loom·루프·태스크·실행 안건, 금요일 자료 수령 후 주말 행동 항목을 확인했다. 산출물은 .meeting-agent/runs/flogy-presentation-flow-call-20260827에 보존했다. 표준 apply_patch가 이동된 저장소 경로를 열지 못해, 사용자 범위 파일인 structured.json의 명시한 JSON 필드만 경로별로 교정하고 jq 검증 후 preview를 재생성했다.

- Task: `task-20260827-171507-flogy-ad141fa3`
- Tags: `결과`, `검증`, `Sanity`, `Pi`, `회의록`
## 2026-08-28T18:46:10+00:00

사용자 승인 후 2026-08-28 연속 회의 원본 3건을 Pi openai-codex/gpt-5.4-mini로 각각 독립 구조화하고 모두 production Sanity meeting으로 발행했다. 1) 26-08-28_개념_발표_피드백.txt: 27,519 bytes, SHA-256 f0937bdd0fe838a0a331eca2012d74343ba555fdb8c49fb42835875df6e4e8f3, 참석자 홍용재·김희성, 제목 Flogy 개념 발표 피드백 — 발표 순서와 에이전트 설명 보완, ID meeting-flogy-concept-presentation-feedback-2026-08-28, revision vffm7lAPj6ZlYitxB41kIg, URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-concept-presentation-feedback-2026-08-28. 2) 26-08-28_발표_흐름_확정.txt: 31,769 bytes, SHA-256 fe5378e39e1f30f7d60b09a510b7250c90fb1eb2067e918799e18ae04b0dde3c, 참석자 홍용재·김희성, 제목 Flogy 발표 흐름 확정 — Mermaid·CLI 중심 시연안, ID meeting-flogy-presentation-flow-final-2026-08-28, revision zvTTs4C2GL7q2tLCLtckBj, URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-presentation-flow-final-2026-08-28. 3) 26-08-28_loom_설계_이해.txt: 31,621 bytes, SHA-256 390c9bf0201673d4df1d62ac10899d9813ef4ed7f244b1eecf10b821b6f69a8b, 참석자 김희성·홍용재·김정현, 제목 Flogy Loom 설계 논의 — 실행 바인딩과 완료 검증 계층, ID meeting-flogy-loom-execution-binding-design-2026-08-28, revision vffm7lAPj6ZlYitxB41kjW, URL https://flogis-blog.tail2dac17.ts.net/meetings/flogy-loom-execution-binding-design-2026-08-28. 세 원본은 처리 중 사용자가 하이픈 날짜 형식으로 이름을 정리했으며 Pi 보존본과 각각 cmp=0·SHA-256 일치했다. Pi 초안의 언급 인물 과포함, 화자 역매핑, 김희성의 Pi 환경 설명 담당 오귀속, 확정되지 않은 execution binding의 확정 처리, Loom/Pi/OHAYO 음차를 원문에 맞춰 교정했다. 각 validate-only 결과 duplicateCount 0, readyToPublish true였고, 세 운영 문서 모두 publishedAt 2026-08-28, coverImage 없음, 공개 HTTP 200과 고유 제목·안건 표식을 확인했다. 로컬 산출물은 .meeting-agent/runs/flogy-concept-presentation-feedback-20260828, .meeting-agent/runs/flogy-presentation-flow-final-20260828, .meeting-agent/runs/flogy-loom-design-understanding-20260828에 보존했다.

- Task: `task-20260828-183541-2026-08-28-flogy-3-aed1e5da`
- Tags: `결과`, `검증`, `Sanity`, `Pi`, `회의록`, `3건`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

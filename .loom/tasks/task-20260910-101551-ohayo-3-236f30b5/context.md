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

- Title: OHAYO 회의 음성 3건 정밀 전사
- Goal: 바탕화면에 있는 2026-09-09~10 OHAYO 방향성·구조 회의 음성 3건을 OpenSuperWhisper로 전사하고, 원문 의미를 보존하면서 문맥상 명확한 오류만 교정한 읽기 쉬운 Markdown 전사본을 각 원본과 같은 경로에 생성한다.
- Branch: Haru2_dev
- Task count: `1`

## Task

- Title: OHAYO 회의 음성 3건 전사·교정본 생성
- Description: 사용자가 지정한 세 파일을 사용자 바탕화면에서 정확히 식별한다. 각 오디오를 현재 설치된 OpenSuperWhisper의 Whisper large-v3-turbo 한국어 설정으로 전사하고, 원시 전사를 대조 가능한 상태로 보존하면서 전체 발화의 순서와 의미를 유지해 문장부호·띄어쓰기·문맥상 명백한 고유명사 오인식만 교정한다. 추측할 수 없는 표현은 불명확 표시를 남기고 원본과 같은 디렉터리에 같은 기본 이름의 Markdown을 생성한다.
- Expected output: 26-09-09_오하요_방향성_회의, 26-09-10_오하요_구조_정리, 26-09-10_오하요_방향성 회의에 대응하는 읽기 쉬운 .md 전사본 3개가 각 원본과 같은 경로에 존재하며, 제목·원본 정보·전사 본문·확인 필요 항목을 포함한다.
- Done condition: 정확히 세 원본의 실제 경로·확장자·오디오 길이를 확인하고, OpenSuperWhisper 전사가 세 건 모두 성공하며, 각 Markdown이 비어 있지 않고 원시 전사의 핵심 내용을 누락 없이 보존한다. 문맥 교정은 근거 있는 범위에 한정하고 불확실한 이름·숫자·전문용어를 표시한다. 원본은 변경하지 않고 결과 파일 3개를 같은 경로에 저장하며 Loom 검증과 로컬 커밋을 완료한다.
- In scope: 사용자 바탕화면의 지정 파일 3개 탐색·읽기, ffprobe/ffmpeg와 OpenSuperWhisper 로컬 전사, 전사 내용 문맥 검수, 동일 경로 Markdown 3개 생성, 비파괴 검증, Loom 기록과 로컬 커밋
- Out of scope: 원본 오디오 변경·삭제, 다른 음성 파일 전사, Sanity 게시, 외부 공유, 모델 설치·삭제·변경, 관련 없는 저장소 코드 수정, 원격 Git push
- Validation hint: Unicode 정규화 차이를 고려해 기본 이름을 매칭하고 ffprobe로 세 입력을 검증한다. 각 OpenSuperWhisper JSON/텍스트 결과와 최종 Markdown의 크기·제목·본문·불명확 표시를 확인하며 출력 파일이 원본과 같은 디렉터리에 있는지 검사한다.
- Required docs: -
- Memory refs: -
- Document outputs: -
- Document output exceptions: -
- Source proposal: `-`
- Status: REVIEW_REQUIRED
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

## 2026-09-10T11:00:20+00:00

결과: /Users/hongyongjae/Desktop/OAHYO_TEAM/회의기록에서 요청한 m4a 3건(07:25, 74:23, 14:35)을 식별해 같은 기본 이름의 Markdown 3개를 생성했다. 출력 크기는 각각 7,045 / 53,864 / 7,324바이트이며 임시 최종본과 cmp로 모두 동일함을 검증했다. 원본 음성은 변경하지 않았고 외부 모델·Sanity에는 전송하거나 게시하지 않았다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `result`, `transcription`, `validation`
## 2026-09-10T11:00:20+00:00

결정: OpenSuperWhisper 0.12.2의 Whisper large-v3-turbo 한국어 설정을 사용했다. 장시간 파일은 전체 단일 전사에서 무음부 반복 오인식이 보여 10분 단위 8구간으로 재전사했고, 겹침이 심한 방향성 회의는 2분 단위 추가 대조를 수행했다. OHAYO 구조·디버깅 기준 문서로 기술 용어만 교정하고 화자 이름은 추정하지 않았으며 확정할 수 없는 발화는 [불명확]으로 남겼다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `decision`, `opensuperwhisper`, `privacy`
## 2026-09-10T11:00:20+00:00

문제 해결: OpenSuperWhisper VAD의 구간 로그에는 실제 시각과 다른 음수 시작 시각이 표시되어 ffmpeg로 확인한 실제 구간 경계를 Markdown 제목에 사용했다. HTTP 메서드 불일치 코드 409→405, Loom·React·Django·Serializer·ORM·REST API 등의 명백한 오인식은 기준 문서와 문맥으로 교정했다. 다중 화자·주변 대화 구간은 추측 교정을 피했다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `troubleshooting`, `review`, `uncertainty`

## Context References

No explicit context references recorded for this job.

## Required Documents and Memory

No task-level required docs or memory refs recorded.

## Verified Team Policies

No verified Team Policy Snapshot is active.

## Active Workflow Memory

No active workflow memory recorded.

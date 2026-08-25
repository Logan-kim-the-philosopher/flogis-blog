# 작업 결과

## 제공한 Pi 자동화

- 프로젝트 로컬 `.pi/extensions/meeting-workflow.ts`를 추가했다. 저장소 루트에서 Pi를 실행하면 전역 설정 변경 없이 자동탐색된다.
- `/meeting <파일>` 명령 하나가 TXT/Markdown 직접 처리 또는 오디오 Whisper 전사, Pi 구조화, Markdown preview 편집, Sanity 사전 검증, 발행 확인, 발행 후 공개 URL 확인을 순서대로 수행한다.
- 경로를 생략하면 Pi 입력 UI가 열리고, `--no-publish`를 지정하면 preview까지만 만든다.
- `/meeting-status`가 같은 Pi 세션에 저장된 최근 run 상태·문서·오류를 보여준다.
- 자연어 요청을 위한 `meeting_prepare`, `meeting_publish` 도구를 등록했다. `meeting_publish`는 기본값이 validate-only이며 실제 발행은 TUI/RPC 사용자 확인이 있어야만 가능하다.
- prepare·publish는 검증된 기존 `scripts/meeting-agent/index.mjs` 엔진을 `pi.exec` subprocess로 호출한다. 따라서 전사, 구조 계약, person 참조, 필수 섹션, 중복 slug/ID, 썸네일 금지 규칙을 그대로 재사용한다.

## 안전 장치

- preview 편집을 취소하거나 마지막 확인창에서 거절하면 Sanity 쓰기를 실행하지 않고 run 산출물만 보존한다.
- print/JSON처럼 UI가 없는 모드에서는 실제 발행을 거부한다.
- 실제 발행 전에 항상 `--validate-only`를 먼저 실행해 person 참조와 중복을 검사한다.
- person 연결 실패는 Pi UI에서 ID를 입력받아 한 번 복구할 수 있고, 중복 문서는 기존 엔진이 자동 덮어쓰기 없이 중단한다.
- 실제 발행이 완료된 뒤 `MEETING_AGENT_PUBLIC_URL`의 상세 경로를 재시도하며 확인한다.

## 검증 결과

- `npm run meeting:test`: 12/12 통과
- `npm run build`: 통과
- `git diff --check`: 통과
- `npm run meeting:extension:smoke`: 프로젝트 자동탐색으로 `meeting`, `meeting-status` 명령 등록 확인
- 실제 Pi RPC `/meeting` TXT fixture 흐름에서 preview editor와 Sanity validate-only를 통과하고 confirm을 거절했다.
- smoke run에 `publish-result.json`이 생성되지 않아 실제 Sanity 쓰기가 없음을 확인했다.
- 실제 사용자 회의 문서는 발행하지 않았고 Whisper 대형 모델도 자동 다운로드하지 않았다.

## 사용 시작점

```bash
cd /Users/hongyongjae/Desktop/flogis-blog
pi
```

```text
/meeting "/absolute/path/to/회의 원본.txt" --date 2026-08-25
/meeting "/absolute/path/to/회의 녹음.m4a" --people person-id-1,person-id-2
/meeting-status
```

상세 옵션과 안전 동작은 `docs/meeting-agent.md`에 기록했다.

## 남은 위험과 다음 행동

- 실제 오디오 처리 전에는 `npm run meeting:setup -- large-v3-turbo`로 다국어 Whisper 모델을 한 번 설치해야 한다.
- 실제 발행 승인 경로는 사용자 콘텐츠를 생성하지 않는 범위를 지키기 위해 실행하지 않았다. 첫 실사용 때 preview 내용과 person 연결을 확인한 뒤 Pi 확인창에서 승인하고 공개 URL 확인 결과를 점검한다.

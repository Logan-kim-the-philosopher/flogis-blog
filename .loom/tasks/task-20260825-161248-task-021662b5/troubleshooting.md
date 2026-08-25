# 문제 해결 기록

## 기존 개포동 2 run에 manifest가 없음

이전 구현은 `buildSanityDocument`에서 날짜 오류가 발생한 뒤에야 `run.json`을 쓰도록 되어 있어 실패 run에 manifest가 없었다. 복구 시 `source.*`, `pi-request.md`, `whisper.log`, 기존 구조화 파일을 탐색하는 legacy fallback을 추가해 원본명·입력 방식·Pi 이벤트를 복원했다.

## Pi smoke 첫 실행 실패

샌드박스에서 `~/.pi/agent/settings.json.lock` 생성이 `EPERM`으로 막혔고 Sanity 조회도 `fetch failed`가 발생해 UI 흐름 전에 종료됐다. 동일 smoke를 승인된 사용자 환경에서 다시 실행해 extension 명령 로딩, preview editor, 발행 확인 취소와 무쓰기 결과를 확인했다.

## 날짜가 마지막 단계에서만 실패하던 문제

기존에는 Pi 결과가 `publishedAt=null`이어도 Markdown까지 만든 뒤 Sanity payload 작성에서 실패했다. 오디오 preflight를 처리 시작 전으로 옮겼고, 날짜가 여전히 없으면 recoverable manifest와 구체적인 `meeting:resume` 명령을 남기도록 변경했다.

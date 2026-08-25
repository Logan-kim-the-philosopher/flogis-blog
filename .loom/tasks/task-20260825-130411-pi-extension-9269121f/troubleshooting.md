# 문제 해결 기록

## Pi 자동탐색 smoke test의 명령 경로 판별

- 증상: 실제 Pi 응답에는 `/meeting`이 등록됐지만 최초 smoke test가 등록 실패로 판단했다.
- 원인: Pi 0.84.2 RPC `get_commands`는 문서 예시의 최상위 `path`가 아니라 `sourceInfo.path`에 extension 경로를 반환한다.
- 해결: smoke test가 `command.sourceInfo.path`로 프로젝트 extension을 식별하도록 수정했다.
- 재검증: 명시적 `--extension` 없이 프로젝트 자동탐색으로 `meeting`, `meeting-status`가 등록되고 전체 취소 흐름이 통과했다.

## 오디오 전사 모델

- 현재 시스템에는 실제 한국어 회의 전사에 사용할 production Whisper ggml 모델이 없다.
- 대형 모델은 Task 범위상 자동 다운로드하지 않았다.
- 실제 오디오를 처음 처리하기 전에 `npm run meeting:setup -- large-v3-turbo`를 실행해야 한다.

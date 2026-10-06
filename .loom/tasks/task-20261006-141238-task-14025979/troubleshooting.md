# 문제 해결

- 증상: 45개 로컬 후보 생성 뒤 `openai-codex` OAuth 갱신이 `401 invalid_refresh_token`으로 거절되어 Pi 자동 검수가 중단됐다.
- 영향: 원본, 구간 오디오, OpenSuperWhisper 후보는 정상적으로 보존됐고 자동 검수 단계만 실행되지 않았다.
- 복구: 기존 후보를 재사용하고 20초 보조 전사를 추가 생성해 직접 교차 검수한 `review.json`을 작성한 뒤 `transcribe:resume`으로 TXT를 저장했다.
- 다음 조치: Pi 자동 검수를 다시 사용하려면 별도로 `openai-codex` 로그인을 갱신해야 한다. 현재 결과 사용에는 필요하지 않다.

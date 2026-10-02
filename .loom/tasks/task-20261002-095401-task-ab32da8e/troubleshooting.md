# 문제 해결

## Pi 문맥 검수 OAuth 실패

- 증상: 355개 로컬 후보 생성 후 `openai-codex` refresh token이 `401 invalid_refresh_token`으로 거절됐다.
- 영향: 오디오 후보와 OpenSuperWhisper 전사 결과는 정상 보존됐고 Pi 검수만 시작하지 못했다.
- 복구: 후보 길이·유사도 비교로 저신뢰 구간을 선별하고 다섯 후보 유형을 직접 대조해 `review.json`을 작성한 후 `transcribe:resume`으로 결과를 저장했다.
- 후속: Pi 자동 검수를 다시 사용하려면 별도 세션에서 Pi의 OpenAI 로그인을 갱신해야 한다. 현재 결과 생성에는 추가 로그인이 필요하지 않았다.

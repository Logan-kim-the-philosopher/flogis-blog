# 문제 해결

## Pi 문맥 검수 OAuth 실패

- 증상: 45개 로컬 후보 생성 후 `openai-codex` refresh token이 `401 invalid_refresh_token`으로 거절됐다.
- 영향: 오디오 후보와 OpenSuperWhisper 전사 결과는 정상 보존됐고 Pi 검수만 시작하지 못했다.
- 복구: `candidates.json`의 다섯 후보 유형을 구간별로 직접 대조해 `review.json`을 작성한 후 `transcribe:resume`으로 결과를 원자적으로 저장했다.
- 후속: Pi 자동 검수를 다시 사용하려면 별도 세션에서 Pi의 OpenAI 로그인을 갱신해야 한다. 현재 결과 생성에는 추가 로그인이 필요하지 않았다.

## DONE Guardrail

아래 필수 작업 기록이 부족해 `DONE` 대신 `REVIEW_REQUIRED`로 전환했습니다.

- validation evidence

Next action: 완료 계약을 증명하는 기록이 부족하거나 미해결 요청이 있어 검토가 필요합니다. result/decision/troubleshooting/log/event/artifact와 검증 근거를 보강하거나 요청을 해결한 뒤 다시 완료 처리하세요.

# 문제 해결

- 증상: 140개 로컬 후보 생성 뒤 `openai-codex` OAuth 갱신이 `401 invalid_refresh_token`으로 거절되어 Pi 자동 검수가 중단됐다.
- 영향: 원본, 구간 오디오, OpenSuperWhisper 후보는 정상적으로 보존됐고 자동 검수 단계만 실행되지 않았다.
- 복구: 기존 후보를 재사용하고 저신뢰 구간의 20초 보조 전사 38개를 추가 생성해 직접 교차 검수한 `review.json`을 작성한 뒤 `transcribe:resume`으로 TXT를 저장했다.
- 추가 확인: 마지막 약 5분은 `silencedetect`에서 긴 무음이 반복되고 후보 문장이 서로 일치하지 않아, 반복된 “감사합니다”를 전사 모델의 무음 환각으로 제거했다.
- 다음 조치: Pi 자동 검수를 다시 사용하려면 별도로 `openai-codex` 로그인을 갱신해야 한다. 현재 결과 사용에는 필요하지 않다.

## DONE Guardrail

아래 필수 작업 기록이 부족해 `DONE` 대신 `REVIEW_REQUIRED`로 전환했습니다.

- validation evidence

Next action: 완료 계약을 증명하는 기록이 부족하거나 미해결 요청이 있어 검토가 필요합니다. result/decision/troubleshooting/log/event/artifact와 검증 근거를 보강하거나 요청을 해결한 뒤 다시 완료 처리하세요.

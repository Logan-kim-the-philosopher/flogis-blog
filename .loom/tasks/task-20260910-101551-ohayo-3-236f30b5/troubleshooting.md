# Troubleshooting

## DONE Guardrail

아래 필수 작업 기록이 부족해 `DONE` 대신 `REVIEW_REQUIRED`로 전환했습니다.

- result.md
- decision.md
- troubleshooting.md
- validation evidence

Next action: 완료 계약을 증명하는 기록이 부족하거나 미해결 요청이 있어 검토가 필요합니다. result/decision/troubleshooting/log/event/artifact와 검증 근거를 보강하거나 요청을 해결한 뒤 다시 완료 처리하세요.

## 해결 기록

- 최초 전체 전사에서 장시간 무음부가 반복 음절로 인식되는 현상을 발견했다. 실제 오디오를 10분 단위 PCM WAV로 나눠 다시 처리해 더 풍부하고 일관된 구간별 원시 전사를 얻었다.
- OpenSuperWhisper VAD 로그의 시작 시각이 음수로 표시되는 현상이 있어 로그 시각을 문서에 사용하지 않고, `ffmpeg`로 자른 실제 구간 경계를 사용했다.
- 다중 화자 대화는 짧은 구간으로 다시 전사해도 일부 표현이 일관되지 않았다. 근거 없는 복원 대신 `[불명확]`으로 표시하고 확인 필요 항목에 남겼다.
- 샌드박스에서 OpenSuperWhisper가 `SIGABRT`로 종료된 재확인 시도는 앱·Metal 모델 접근 권한을 허용한 로컬 실행으로 복구했다.
- 첫 완료 시도는 산출물 문제가 아니라 비어 있던 `result.md`와 `decision.md` 및 검증 근거 때문에 `REVIEW_REQUIRED`로 전환됐다. 본 실행에서 결과·결정·문제 해결·검증 근거를 보강했다.

현재 미해결 실행 장애는 없다. 사람 확인이 필요한 범위는 최종 Markdown의 `[불명확]` 표시로 한정된다.

# Troubleshooting

- OpenSuperWhisper `bench`는 약 20분 원본에서 후보 WAV 105개를 정상 전사했고 `candidates.json`을 보존했다.
- 첫 Pi CLI 문맥 검수 요청에서 `openai-codex` OAuth refresh가 HTTP 401 `invalid_refresh_token`으로 실패했다. 사용자의 인증 상태를 변경하거나 새 로그인을 시도하지 않았다.
- 동일 오디오를 재전사하지 않고 후보별 텍스트를 직접 대조했다. `review.json`에 21개 검수 구간을 보존한 뒤 `transcribe:resume --local-only`로 TXT를 생성했다.
- 모델별 후보가 달라 확정할 수 없는 12곳은 `확인 필요`로 표시했다. 더 높은 확실성이 필요하면 표시된 시각의 원음을 사람이 확인해야 한다.

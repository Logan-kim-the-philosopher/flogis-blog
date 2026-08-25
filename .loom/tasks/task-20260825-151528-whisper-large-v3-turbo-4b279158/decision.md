# 결정 기록

- 구현에 설정된 기본 production 모델인 `large-v3-turbo`만 설치했다.
- 모델은 공식 `ggerganov/whisper.cpp` Hugging Face 경로에서 기존 setup 스크립트로 다운로드했다.
- 약 1.5GB 바이너리는 저장소에 커밋하지 않고 `.meeting-agent/models/`의 로컬 런타임 자산으로 유지한다.
- 다운로드 성공 여부는 스크립트 종료만 보지 않고 실제 바이트 크기와 `meeting:doctor`의 `transcription.ready=true`로 확인했다.

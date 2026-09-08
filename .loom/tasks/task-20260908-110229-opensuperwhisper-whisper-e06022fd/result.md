# 작업 결과

OpenSuperWhisper 앱과 앱 전용 모델은 보존하고, 확인된 다른 Whisper 모델 1개를 삭제했다.

## 보존 항목

- `/Applications/OpenSuperWhisper.app`
- `/Users/hongyongjae/Library/Application Support/fr.my-monkey.opensuperwhisper/whisper-models/ggml-large-v3-turbo.bin`
  - 앱의 `selectedWhisperModelPath`가 이 파일을 가리키는 것을 확인했다.
  - 크기: 1,624,555,275바이트

## 삭제 항목

- `/Users/hongyongjae/Desktop/Flogi/flogis-blog/.meeting-agent/models/ggml-large-v3-turbo.bin`
  - OpenSuperWhisper 전용 모델과 바이트 단위로 동일한 프로젝트 내 중복 파일이었다.
  - 삭제 크기: 1,624,555,275바이트(약 1.51GiB)
  - 휴지통을 거치지 않았으며, 필요하면 다시 내려받을 수 있다.

## 검증

- 사용자 홈에서 10MiB를 넘고 경로나 파일명이 Whisper/ggml 모델에 해당하는 파일을 재검색한 결과, OpenSuperWhisper 전용 모델 1개만 남았다.
- `/opt/homebrew`에는 해당 조건의 Whisper 모델이 없었다.
- OpenSuperWhisper CLI의 `--help`가 정상 종료했다.
- 삭제 전후 가용 공간은 69,740,292KiB에서 71,324,668KiB로 증가했다.
- 점검 중 생성된 `default.profraw`는 제거했으며 저장소에는 사용자 파일 변경이 남지 않았다.

## 영향

프로젝트의 meeting-agent가 기본값으로 참조하던 로컬 모델 파일은 이제 없다. 해당 도구를 다시 사용할 때는 모델을 다시 내려받거나 OpenSuperWhisper 전용 모델의 절대 경로를 명시해야 한다.

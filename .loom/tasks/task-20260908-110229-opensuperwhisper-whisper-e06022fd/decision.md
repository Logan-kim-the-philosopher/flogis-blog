# 주요 결정

- OpenSuperWhisper 앱과 `fr.my-monkey.opensuperwhisper` Application Support 전체를 보존 범위로 두었다.
- 실제 음성 인식 모델 파일만 삭제 대상으로 삼고 `faster-whisper`의 uv wheel 캐시, Homebrew 패키지, 실행 바이너리, 녹음 파일과 전사 문서는 삭제하지 않았다.
- 두 모델 파일의 내용이 동일함을 `cmp`로 확인한 뒤 프로젝트의 무시된 중복 파일 하나만 정확한 절대 경로로 삭제했다.
- 프로젝트 설정과 문서는 사용자의 모델 정리 요청 범위를 벗어나므로 수정하지 않았다.

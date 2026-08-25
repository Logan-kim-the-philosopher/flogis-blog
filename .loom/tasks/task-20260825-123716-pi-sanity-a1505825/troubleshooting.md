# 문제 해결 기록

## Whisper 실행 모델 부재

- `ffmpeg`와 `whisper-cli`는 설치되어 있었지만 사용자 디렉터리에는 실제 전사용 ggml 모델이 없었다.
- Homebrew의 `for-tests-ggml-tiny.bin`은 562KB 테스트 자산이며 실제 음성에 실행하면 `SIGSEGV`로 종료되어 전사용 모델로 사용하지 않았다.
- 모델이 없을 때는 `meeting:setup -- large-v3-turbo` 또는 `--whisper-model PATH`를 안내하는 명확한 사전조건 오류를 반환한다.
- 공식 모델 URL은 HEAD 요청으로 HTTP 200과 `ggml-large-v3-turbo.bin` 1,624,555,275바이트 응답을 확인했지만, 큰 다운로드는 사용자의 명시적 실행을 위해 수행하지 않았다.

## Pi 설정 lock 경고

- 제한된 샌드박스에서 최초 `pi --help`가 홈 디렉터리 settings lock 생성 권한 경고를 냈다.
- 실제 사용자의 로컬 권한과 승인된 검증 실행에서는 Pi OAuth와 JSON 출력이 정상 동작했다. 프로젝트 안에 Pi 인증 정보를 복사하지 않았다.

## 안전한 Sanity 발행 검증

- 실제 문서를 만들어 테스트하면 운영 데이터가 오염될 수 있다.
- `publish --validate-only`를 추가해 운영 person 참조와 중복 query까지 실행하되 `client.create`는 호출하지 않는 검증 경로를 만들었다.

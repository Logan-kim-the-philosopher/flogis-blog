# 문제 해결 기록

## OpenSuperWhisper 외부 실행 실패

- 증상: 샌드박스 안에서 앱 CLI를 직접 실행했을 때 종료 코드 134로 중단됐다.
- 원인: OpenSuperWhisper 앱의 Metal GPU와 사용자 설정 영역 접근이 제한된 실행 환경 때문으로 판단했다.
- 해결: 사용자의 승인 아래 앱 CLI만 권한 확장 실행했다. Apple M2 GPU와 앱 설정 모델이 정상 로드됐다.

## whisper-cli 직접 실행의 GPU 메모리 오류

- 증상: Homebrew `whisper-cli`가 `ggml_metal_buffer_init: error: failed to allocate buffer`로 중단됐다.
- 원인: 해당 실행 표면에서 Metal 버퍼 할당이 실패했다.
- 해결: 사용자가 요청한 OpenSuperWhisper 자체 CLI로 전환했고, 같은 `large-v3-turbo` 모델이 정상 동작했다.

## 전체 패스 시간 로그와 출력 잘림

- 증상: 첫 전체 패스의 구간 로그가 45분에서 끝나 51분 29초 전체 포함 여부를 확정할 수 없었고, 첫 구간 일괄 실행 결과 중 한 텍스트에 도구 출력 제한의 잘림 표식이 들어갔다.
- 원인: OpenSuperWhisper CLI의 장시간 VAD 시간 표시와 도구 콘솔 출력 길이 제한.
- 해결: 원본 기준 10초씩 겹치는 6개 조각으로 재전사하고, 최종 JSON stdout을 임시 파일에 직접 저장했다. JSON 구조, 구간 수, 빈 텍스트, 잘림 문자열을 다시 검사한 뒤 정리본을 재생성했다.

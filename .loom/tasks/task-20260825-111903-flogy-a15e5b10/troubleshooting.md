# 문제 해결 기록

## 원본 경로 정규화

- 처음 예상한 NFC 경로 `/Users/hongyongjae/Desktop/Flogy/회의 기록`이 존재하지 않았다.
- 실제 macOS NFD 경로는 `/Users/hongyongjae/Desktop/Flogy/회의기록`이고 폴더명에는 공백이 없었다.
- `find`로 실제 디렉터리를 해석한 뒤 원본 11개를 조사했다.

## Loom 실행 옵션

- `loom task run ... --agent foreground`에서 `foreground`가 지원하지 않는 provider로 해석되어 거부됐다.
- 파일 작업 전 발생했으며, 옵션 없이 `loom task run task-20260825-111903-flogy-a15e5b10`으로 재실행해 정상 시작했다.

## 음성 변환 명령

- 첫 중첩 `find -exec` 변환 명령의 인자 구성이 실패했다.
- 원본 변경 전 실패했고, 디렉터리와 파일을 먼저 정확히 해석한 뒤 ffmpeg 변환을 다시 실행했다.

## Whisper Metal 실패와 성능

- whisper.cpp의 Metal backend가 `ggml_metal_buffer_init: failed to allocate`로 종료됐다.
- CPU backend로 전환했다.
- `large-v3-turbo-q5_0`의 병렬 CPU 전사가 너무 느려, 공식 `ggml-small-q5_1` 모델의 10분 샘플을 먼저 확인한 뒤 전체 12개 구간을 전사했다.
- 전체 전사 뒤 고유명사, 화자, 결정 문장을 원문 맥락과 대조했고 임시 모델·WAV·전사 파일은 삭제했다.

## Sanity 조회

- Sanity CLI는 로그인 세션이 없어 read query를 거부했다.
- 저장소의 환경 구성을 출력하지 않는 로컬 client로 전환했다.
- `.env` 전체를 shell source할 때 따옴표가 포함된 값 때문에 파싱 오류가 발생해, 필요한 key만 파일에서 안전하게 읽는 방식으로 바꿨다.
- sandbox DNS가 Sanity host를 해석하지 못한 호출은 승인된 외부 네트워크 실행으로 재시도했다.

## 최종 상태

- 복구되지 않은 오류나 사용자 조치가 필요한 blocker는 없다.

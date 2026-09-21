# 결과

## 완료 내용

- 전사 전용 CLI `scripts/transcribe-agent/index.mjs`와 Pi extension `.pi/extensions/transcribe-workflow.ts`를 추가했다.
- Pi에서 `/transcribe <파일명>`, `/transcribe-status`, `/transcribe-resume <run>` 명령을 사용할 수 있고, 자연어 요청에는 `transcribe_audio` tool이 연결된다.
- 파일명만 입력해도 기본적으로 바탕화면과 하위 3단계에서 오디오를 찾는다. 확장자 생략과 한국어 NFC/NFD 차이를 지원하며 동명 파일은 임의 선택하지 않는다.
- 정확 모드는 약 60초 창마다 원본, 음질 보정, 두 개의 세부 구간, 앞뒤 문맥 후보를 만든다. 실제 OpenSuperWhisper 0.12.2 CLI 계약에 따라 후보 WAV 폴더를 `bench` 한 번으로 처리한다.
- Pi 검수는 대상 창 바깥 문맥을 결과에 섞지 않고 확실한 오류만 교정하며, 확정할 수 없는 표현을 `확인 필요`로 남긴다.
- 결과는 바탕화면의 `<원본명>_전사.txt`에 타임스탬프와 함께 저장한다. 기존 결과는 `--replace` 없이는 보호하고, 임시 파일 완성 후 원자적으로 연결·교체한다.
- 처리 전후 원본 SHA-256을 비교하고 결과 크기·해시를 `result.json`에 기록한다. OpenSuperWhisper 후보와 완료된 Pi 검수 구간을 보존해 실패 지점부터 재개한다.
- `--local-only`에서 오디오와 전사 텍스트를 외부 Pi 모델에 전달하지 않는 로컬 전사 경로를 제공했다.
- 사용법과 개인정보 경계를 `docs/transcribe-agent.md`에 문서화했다.

## 검증 근거

- `npm run transcribe:test`: 8/8 통과. NFC/NFD 검색, 다중 후보 계획, Pi JSON 검수, 타임스탬프 출력, 원본 해시 불변, 기존 파일 충돌, 실패 후 후보 재사용을 임시 fixture와 mock 실행 파일로 통합 검증했다.
- `npm run transcribe:extension:smoke`: 통과. Pi RPC가 `transcribe`, `transcribe-resume`, `transcribe-status` 세 명령을 해당 extension에서 로드했다.
- `npm run transcribe:doctor`: 통과. ffmpeg, ffprobe, Pi, OpenSuperWhisper를 모두 찾았고 앱의 `whisper`, `ggml-large-v3-turbo.bin`, 언어 `ko` 설정을 확인했다.
- OpenSuperWhisper `--help`로 `bench <dir-of-wavs>`가 모델을 한 번 로드하고 JSON 배열을 반환하는 실제 CLI 계약을 확인해 호출 형식을 맞췄다.
- `npm run build`: Astro 서버 프로덕션 빌드 통과.
- `git diff --check`: 통과.

## 범위

- 실제 사용자 음성은 다시 전사하지 않았다.
- `/meeting`, Sanity 게시, 블로그 콘텐츠, OpenSuperWhisper 모델 설정은 변경하지 않았다.
- 원격 push는 수행하지 않았다.

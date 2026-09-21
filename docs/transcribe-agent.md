# Pi 전사 전용 에이전트

Pi에서 오디오 파일명만 지정하면 바탕화면에서 원본을 찾아 고정밀 전사 TXT를 생성한다. 이 흐름은 회의 글 구조화와 Sanity 발행을 수행하는 `/meeting`과 분리되어 있다.

## 빠른 사용

Pi에서 자연어로 요청한다.

```text
26-09-20_node_js_세션_리허설 전사 떠서 바탕화면에 놔줘
```

Pi는 `transcribe_audio` 도구를 선택한다. 명령으로 직접 실행할 수도 있다.

```text
/transcribe 26-09-20_node_js_세션_리허설
/transcribe-status
/transcribe-resume .transcribe-agent/runs/pi-...
```

터미널에서는 다음과 같다.

```bash
npm run transcribe -- "26-09-20_node_js_세션_리허설"
npm run transcribe:resume -- .transcribe-agent/runs/...
npm run transcribe:doctor
```

공백이 있는 파일명은 큰따옴표로 감싼다. 확장자는 생략할 수 있다. macOS의 NFC/NFD 한글 표기 차이는 자동으로 정규화한다. 같은 이름의 오디오가 여러 개면 임의로 고르지 않고 정확한 경로를 요청한다.

## 기본 동작

- 검색 위치: `~/Desktop`, 하위 3단계까지
- 결과 위치: `~/Desktop/<원본명>_전사.txt`
- 모드: `accurate`
- 언어: `ko`
- 기존 결과: 덮어쓰지 않고 중단
- 중간 자료: 프로젝트의 `.transcribe-agent/runs/<실행 ID>`

`accurate`는 각 약 60초 창마다 원본, 음질 보정본, 두 개의 세부 구간, 앞뒤 문맥 구간을 만든다. 후보 WAV 폴더는 OpenSuperWhisper `bench` 한 번으로 처리해 모델 재로딩을 줄인다. Pi는 후보끼리 비교하면서 대상 시간창의 발화만 보수적으로 확정하고 불확실한 단어를 별도로 표시한다.

`fast`는 약 90초 원본 후보만 사용한다. 정확도를 우선하는 일반 요청에서는 `accurate`를 유지한다.

## 안전성과 재개

에이전트는 처리 전후 원본 SHA-256을 비교한다. 결과는 임시 파일을 완성한 뒤 원자적으로 이름을 바꾸며, 기존 TXT가 있으면 `--replace` 없이는 중단한다. `run.json`, `progress.json`, `candidates.json`, 검수 이벤트와 `result.json`을 남긴다. Pi 검수에서 실패하면 `/transcribe-resume`이 보존된 OpenSuperWhisper 후보부터 이어서 처리한다.

```text
/transcribe "음성 파일.m4a" --replace
/transcribe "음성 파일.m4a" --mode fast
/transcribe "음성 파일.m4a" --root "/다른/폴더"
```

## 개인정보 처리

OpenSuperWhisper 음성 처리는 로컬에서 실행된다. 기본 정확 모드의 문맥 검수에서는 전사 후보 텍스트가 현재 Pi 모델 제공자에게 전달된다. 오디오 파일 자체는 Pi에 전달하지 않는다.

텍스트도 외부 모델에 보내지 않으려면 다음을 사용한다.

```text
/transcribe "음성 파일.m4a" --local-only
```

이 경우 Pi 문맥 검수를 생략하고 각 구간의 로컬 원본 후보를 사용하므로 고유명사와 오인식 교정 정확도가 낮아질 수 있다.

## 환경 변수

- `TRANSCRIBE_AGENT_DESKTOP`: 기본 검색·출력 폴더
- `TRANSCRIBE_AGENT_OPENSUPERWHISPER_BIN`: OpenSuperWhisper 실행 파일
- `TRANSCRIBE_AGENT_PI_BIN`: Pi 실행 파일
- `TRANSCRIBE_AGENT_PI_MODEL`: 검수 모델
- `TRANSCRIBE_AGENT_PI_THINKING`: 검수 thinking 수준
- `TRANSCRIBE_AGENT_FFMPEG_BIN`, `TRANSCRIBE_AGENT_FFPROBE_BIN`: 미디어 도구 경로

실행 전에 `npm run transcribe:doctor`로 ffmpeg, ffprobe, Pi, OpenSuperWhisper 설정을 점검한다. 기본 앱 경로는 `/Applications/OpenSuperWhisper.app/Contents/MacOS/OpenSuperWhisper`다.

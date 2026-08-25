# Pi 회의 원본 정리·발행 에이전트

TXT/Markdown 회의 원본은 바로 정리하고, 오디오 원본은 로컬 `whisper-cli`로 전사한 뒤 Pi가 분류·구조화한다. 결과를 사람이 검토한 후에만 Sanity에 발행한다.

## 처리 흐름

```text
원본 파일
  ├─ txt/md ──────────────┐
  └─ audio → ffmpeg → Whisper 전사
                          ↓
                    Pi 구조화 JSON
                          ↓
             스키마·필수 섹션·사람 참조 검증
                          ↓
             preview 산출물(post.md, payload)
                          ↓
                   사람이 내용 검토
                          ↓
             --confirm을 사용한 Sanity 발행
```

Pi는 `--no-tools`로 실행된다. 원본 복사, 전사, 결과 검증, 중복 확인과 Sanity 쓰기는 Node 오케스트레이터가 담당한다.

## 1. 준비 상태 확인

```bash
npm run meeting:doctor
```

확인 대상:

- Pi 설치 및 선택 모델 인증
- `ffmpeg`, `whisper-cli`, Whisper 모델
- Sanity project/dataset와 쓰기 token 존재 여부

텍스트 원본은 Whisper 모델 없이도 처리할 수 있다. 오디오 원본을 처리하려면 다국어 ggml 모델을 한 번 설치한다.

```bash
npm run meeting:setup -- large-v3-turbo
```

모델은 `.meeting-agent/models/`에 저장되고 Git에 포함되지 않는다. 다른 모델을 이미 가지고 있다면 `--whisper-model /absolute/path/ggml-model.bin`을 사용한다.

## 2. TXT/Markdown 원본 준비

```bash
npm run meeting:prepare -- "/path/to/회의 원본.txt"
```

날짜나 사람을 확정해서 실행하는 것을 권장한다.

```bash
npm run meeting:prepare -- "/path/to/회의 원본.txt" \
  --date 2026-08-25 \
  --people person-heesung-kim,person-yongjae-hong
```

## 3. 오디오 원본 준비

```bash
npm run meeting:prepare -- "/path/to/회의 녹음.m4a" \
  --date 2026-08-25 \
  --people person-heesung-kim,person-yongjae-hong
```

오디오는 16 kHz mono WAV로 정규화한 뒤 한국어로 전사한다. 다른 언어 또는 자동 감지는 `--language en`, `--language auto`로 지정한다.

일반적인 회의 녹음은 화자 분리가 보장되지 않는다. 전사문에서 사람을 확실하게 구분할 수 없으면 Pi는 `발화자 미상`으로 기록해야 하며, 사용자가 preview에서 확인해 수정한다.

## 4. 분류 기준

Pi는 기록의 주된 결과에 따라 하나를 선택한다.

| category | 블로그 타입 | 판단 기준 |
|---|---|---|
| `project_meeting` | Meeting | 제품·프로젝트 결정, 조율, 실행 계획 |
| `study_session` | Study | 지식 전달, 설명, 학습, 질의응답 |
| `conversation` | Meeting | 관점 탐색, 인터뷰, 자유 대화 |
| `team_operations` | Meeting | 역할, 협업 방식, 팀 구성, 조직 운영 |

같은 날짜라도 회차, 이름 또는 목적이 다르면 서로 다른 문서로 처리한다. 자동 분류가 적절하지 않으면 prepare 때 `--category study_session`처럼 덮어쓸 수 있다.

## 5. preview 검토

기본 출력 위치는 `.meeting-agent/runs/<timestamp>-<source>/`다.

| 파일 | 용도 |
|---|---|
| `source.*` | 변경하지 않고 보존한 원본 |
| `transcript.txt` | 직접 읽은 텍스트 또는 Whisper 전사문 |
| `pi-request.md` | Pi에 전달한 입력 |
| `pi-events.jsonl` | Pi의 원본 JSON 이벤트 |
| `structured.json` | 분류와 안건·결정·행동의 구조화 결과 |
| `post.md` | 실제 블로그 본문 preview |
| `sanity-document.json` | 발행 예정 Sanity 문서 |
| `run.json` | 실행 상태, 경고와 발행 가능 여부 |

`post.md`에서 반드시 확인한다.

- 참석하지 않은 사람도 이해할 수 있는 요약과 배경인지
- 안건별로 사람의 의견과 근거가 구분됐는지
- 제안·잠정 합의·확정·보류·미결정이 섞이지 않았는지
- 결정 이유가 원본에 존재하는지
- 행동 항목의 담당자와 기한을 임의로 만들지 않았는지
- 전사 오류와 불명확한 화자가 검증 메모에 남았는지

## 6. Sanity 발행

preview가 출력한 명령을 그대로 사용하되 `--confirm` 값은 slug 또는 document ID와 정확히 같아야 한다.

실제 쓰기 전에 사람 참조와 중복 여부만 확인할 수 있다.

```bash
npm run meeting:publish -- ".meeting-agent/runs/<run-directory>" \
  --confirm flogy-demo-planning-round-5-2026-08-25 \
  --validate-only
```

검증이 통과하면 `--validate-only`를 제거해 발행한다.

```bash
npm run meeting:publish -- ".meeting-agent/runs/<run-directory>" \
  --confirm flogy-demo-planning-round-5-2026-08-25
```

발행 단계에서 다시 확인하는 항목:

- 쓰기 권한이 있는 `SANITY_API_TOKEN`
- 최소 1명의 유효한 `person` 참조
- 필수 Markdown 섹션
- 같은 document ID 또는 slug의 기존 문서
- 임의 `coverImage` 부재

기존 문서와 충돌하면 자동으로 덮어쓰지 않고 중단한다. 발행 후 `publish-result.json`이 생성되며 같은 run을 다시 발행할 수 없다.

## 자주 쓰는 옵션

```text
--date YYYY-MM-DD
--title "제목"
--slug ascii-kebab-case
--category project_meeting|study_session|conversation|team_operations
--people person-id-1,person-id-2
--model openai-codex/gpt-5.4-mini
--thinking medium
--offline
```

`--offline`은 Sanity를 읽지 않는다. 이 경우에도 발행 가능한 payload를 만들려면 `--people`로 person ID를 명시해야 한다.

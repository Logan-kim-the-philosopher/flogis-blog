# Previous Results

## 1. Pi 회의 원본 정리·Sanity 발행 루프 구현

# 작업 결과

## 제공한 에이전트 루프

- `meeting:prepare`: TXT/Markdown은 직접 읽고, 오디오는 ffmpeg로 16 kHz mono WAV 변환 후 `whisper-cli`로 전사한다.
- Pi는 도구 없이 비대화식 JSON 모드로 실행되어 기록을 프로젝트 회의·스터디·대화·팀 운영 중 하나로 분류한다.
- Pi JSON은 Zod 계약으로 검증한 뒤 기본 정보, 30초 요약, 배경, 안건별 의견·선택지·결론·상태, 결정, 행동 항목, 미결 사항, 원본 메모를 포함한 Markdown으로 렌더링한다.
- 원본, 전사문, Pi 요청/이벤트, 구조화 JSON, Markdown, Sanity payload와 실행 manifest를 `.meeting-agent/runs/`에 보존한다.
- `meeting:publish`: preview를 사람이 검토한 뒤 정확한 `--confirm` 값이 있을 때만 person 참조와 중복을 다시 검사하고 Sanity에 새 문서를 생성한다.
- `--validate-only`: Sanity에 쓰지 않고 발행 전 참조·중복 검증만 수행한다.
- `meeting:doctor`: Pi 인증, 전사 도구·모델, Sanity 설정을 비밀값 없이 진단한다.
- `meeting:setup`: 공식 whisper.cpp Hugging Face 저장소에서 선택한 다국어 ggml 모델을 `.meeting-agent/models/`에 설치한다.

## 분류 및 발행 규칙

- `project_meeting` → Sanity `meeting`
- `study_session` → Sanity `study`
- `conversation` → Sanity `meeting`
- `team_operations` → Sanity `meeting`
- 같은 날짜라도 이름·회차·목적이 다르면 독립 문서로 처리한다.
- 제안·잠정 합의·확정·보류·미결정과 행동 담당자·기한을 구분하며, 원본에 없는 정보는 만들지 않도록 prompt와 schema에서 제한한다.
- 사람 이름은 Sanity `person` 문서에 연결하며 발행에는 최소 1개의 유효한 참조가 필요하다.
- 에이전트는 관련 없는 썸네일을 만들거나 payload에 `coverImage`를 넣지 않는다.
- 같은 ID 또는 slug가 있으면 기존 문서를 자동으로 덮어쓰지 않는다.

## 사용 시작점

```bash
npm run meeting:doctor
npm run meeting:prepare -- "/path/to/회의원본.txt" --date 2026-08-25 --people person-id-1,person-id-2
npm run meeting:publish -- ".meeting-agent/runs/<run>" --confirm <slug> --validate-only
npm run meeting:publish -- ".meeting-agent/runs/<run>" --confirm <slug>
```

오디오를 처음 처리할 때는 다음 명령으로 한국어용 다국어 모델을 설치한다.

```bash
npm run meeting:setup -- large-v3-turbo
```

## 검증

- 로컬 Pi `0.84.2`, `openai-codex/gpt-5.4-mini` OAuth 준비 상태를 확인했다.
- `ffmpeg`, `ffprobe`, `whisper-cli 1.9.2` 설치를 확인했다.
- 실제 Pi로 TXT fixture를 처리해 `project_meeting`, 발행일, 2명의 참석자, 안건 2개, 결정·행동·미결 사항과 불확실성을 생성했다.
- 실제 운영 Sanity를 읽어 person 참조와 ID/slug 중복을 `--validate-only`로 확인했으며 쓰기는 발생하지 않았다.
- 자동 테스트 6개가 구조 계약, Markdown 필수 섹션, meeting/study payload, 이미지 부재, Pi JSONL 파싱, 형식 판별, 날짜와 deterministic dry run을 검증한다.
- `npm run meeting:test`, Node syntax check, `npm run build`, `git diff --check`를 통과했다.
- 실제 사용자 회의 문서는 발행하지 않았다.

## 남은 준비 사항

- 현재 시스템에는 실행 가능한 한국어 Whisper 모델 파일이 없다. `meeting:setup`으로 모델을 한 번 다운로드해야 실제 오디오 전사가 가능하다.
- 화자 분리가 없는 일반 녹음은 화자 식별을 보장하지 않는다. 불명확한 발화자는 `발화자 미상`으로 남기고 preview에서 사람이 확인해야 한다.

# Previous Results

3 older recorded result(s) were omitted. Promote durable context to Job Notes or explicit Context References.

## 4. 실사용 기반 회의 자동화 복구·입력 개선

# 실행 결과

실사용에서 드러난 날짜 후반 실패, 무진행 표시, 불필요한 재전사 문제를 해결했다.

- 오디오를 처리하기 전에 `ffprobe`로 `creation_time`/`date`와 재생 시간을 읽고 서울 날짜로 변환한다.
- 날짜 우선순위를 `--date` > 오디오 메타데이터 > Pi 구조화 결과로 고정했다.
- 오디오와 `--transcript`로 클로바 TXT/JSON을 함께 주면 오디오는 원본·날짜 근거로 보존하고 Whisper는 실행하지 않는다.
- 클로바 JSON의 발화 구간, 화자명, 시작 시각을 표준 텍스트로 정규화한다.
- 모든 run에 처리 초기부터 `run.json`과 `progress.json`을 남긴다. Pi extension은 처리 단계와 경과 시간을 하단 상태에 표시한다.
- 날짜를 확정하지 못해도 `transcript.txt`, `structured.json`, `post.md`를 `needs_input` 상태로 보존한다.
- CLI `meeting:resume`과 Pi `/meeting-resume`으로 기존 결과를 재전사·재구조화 없이 복구한다. 편집된 `post.md`는 보존하고 날짜 줄만 갱신한다.

실제 `.meeting-agent/runs/pi-20260825T152305Z-개포동-2`를 재전사 없이 복구했다. M4A의 `creation_time=2026-08-18T11:30:42.000000Z`에서 발행일 `2026-08-18`을 확정했고 `run.json`은 `status=preview`, `recoveredWithoutRetranscription=true`가 됐다.

## 검증

- `npm run meeting:test`: 18개 통과
- `npm run build`: 통과
- `npm run meeting:extension:smoke`: `/meeting`, `/meeting-resume`, `/meeting-status` 로딩과 preview 편집·발행 취소 확인, Sanity 쓰기 없음
- 실제 개포동 2 run resume: 날짜 `2026-08-18`, 문서 ID `meeting-gaepodong-2-ppt-gihoekseo-joryul`

## 남은 위험과 다음 행동

- 클로바 내보내기 JSON 형식이 계정/버전에 따라 달라질 수 있다. 지원하지 않는 형식은 TXT로 내보내면 처리 가능하며, 실제 다른 JSON 샘플이 생기면 parser fixture를 추가한다.
- 개포동 2는 화자가 `발화자 미상`이므로 발행 전에 preview에서 참석자·사람별 의견을 확인하고 `--people`로 Sanity person ID를 연결해야 한다.
- 실제 Sanity 발행은 이 Task 범위에서 수행하지 않았다.

## 5. Flogy 5차 회의 기록 Pi 정리·발행

# 결과

`/Users/hongyongjae/Desktop/26:08:26_Flogy_5차회의.m4a`를 Flogy 5차 회의 원본으로 식별하고, 로컬 Whisper 전사와 Pi 구조화를 거쳐 production Sanity에 독립 meeting 문서로 발행했다.

## 처리 결과

- 원본: 85,234,008 bytes, 5,274.946757초(약 87분 55초), SHA-256 `6db8844d5e56d0bfc28c088b2b75de1091f1df9f7963aecde06fb257d2dff3b3`
- 날짜: 파일명과 M4A `creation_time`을 대조하고 `2026-08-26`으로 명시 고정
- 전사: 로컬 `whisper-cli`, `ggml-large-v3-turbo.bin`
- 구조화: Pi `openai-codex/gpt-5.4-mini`
- 분류: `project_meeting`, 신뢰도 96%
- 제목: `Flogy 5차 회의 — OHAYO 전체 시연과 블로그 자동화`
- 참가자: 김희성, 홍용재, 김정현
- 문서 ID: `meeting-flogy-round-5-2026-08-26`
- 슬러그: `flogy-round-5-2026-08-26`
- 썸네일: 없음

## 검수 및 발행

- Pi 초안의 안건, 사람별 의견, 결정, 행동 항목, 미결 사항을 전사 원문과 대조했다.
- Whisper가 만든 `정연/정현`, `용진/용재` 표기 차이를 기존 Flogy 회의와 Sanity person 문서로 정규화했다.
- 회의 중 언급만 된 소연님과 오인식된 이사님은 참가자에서 제외했다.
- validate-only 결과: person 참조 3개 유효, 중복 0개, `readyToPublish: true`.
- production Sanity 발행: 2026-08-26T06:18:59.725Z, revision `SseX7szR4uwwNDZHqDdbge`.
- 공개 확인: `https://flogis-blog.tail2dac17.ts.net/meetings/flogy-round-5-2026-08-26` HTTP 200, 제목과 본문 확인.

## 로컬 산출물

`.meeting-agent/runs/flogy-5-20260826/`에 원본 보존본, 16kHz WAV, transcript.txt/json, whisper.log, Pi 이벤트, structured.json, post.md, Sanity preview, validation과 publish-result를 보존했다.

## 검증

- `npm run meeting:publish -- .meeting-agent/runs/flogy-5-20260826 --confirm flogy-round-5-2026-08-26 --people person-heesung-kim,person-yongjae-hong,person-junghyun-kim --validate-only`: `meeting-flogy-round-5-2026-08-26` 발행 검증 통과, duplicateCount 0, readyToPublish true.
- production Sanity 재조회: 문서 ID·제목·날짜·슬러그·참가자 3명 일치, bodyLength 3,839, coverImage false.
- 공개 URL 재조회: HTTP 200, 제목과 `오하요 전체` 본문 표식 확인.
- `loom task validate task-20260826-054551-flogy-5-pi-bf203e5c --json`: status OK, issues 없음.
- `loom validate --strict`: Workspace metadata validation OK, consistency issue 없음.

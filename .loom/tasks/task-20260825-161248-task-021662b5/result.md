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

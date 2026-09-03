# 문제 해결 기록

## `meeting:prepare` 문서와 CLI 옵션 불일치

- `docs/meeting-agent.md` 예시에 따라 `meeting:prepare`에 `--no-publish`를 전달했으나 현재 CLI가 해당 옵션을 받지 않아 즉시 중단됐다.
- `prepare` 자체가 preview 전용이고 실제 쓰기는 별도 `meeting:publish`에서만 수행되므로 옵션을 제거했다.
- CLI가 오류 메시지를 출력했지만 프로세스 exit code는 0을 반환했다. 이번 Task에서는 출력 내용을 기준으로 실패를 감지했다.

## Pi 실행 권한 및 원문 외부 전송 제한

- 샌드박스 실행은 Pi가 `~/.pi/agent/*.lock` 파일을 만들 수 없어 `EPERM`으로 실패했다.
- 권한 상승 재실행은 회의 원문을 별도 OpenAI 기반 Pi 프로세스로 전송하는 데 대한 사용자 명시 승인이 없다는 검토 결과로 거절됐다.
- 해당 실행 경로를 중단하고, 원문을 현재 세션에서 직접 구간별 검토해 기존 스키마와 본문 형식에 맞는 preview를 수동 작성했다.

## 수동 preview JSON 교정

- Cody Stat `run.json` 작성 후 닫는 중괄호가 하나 중복되어 JSON 파싱이 실패했다.
- 중복 문자를 제거하고 두 `structured.json`, `run.json`, `post.md`를 모두 다시 파싱·검증했다.

## production 재조회 쿼리 셸 확장

- 첫 GROQ 재조회에서 `$ids`가 셸의 빈 환경 변수로 확장되어 query parse error가 발생했다.
- 고정된 두 문서 ID 배열을 GROQ에 직접 사용해 재조회했고 published 문서와 revision을 정상 확인했다.

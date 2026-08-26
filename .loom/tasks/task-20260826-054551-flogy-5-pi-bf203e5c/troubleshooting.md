# 문제 해결 기록

## 외부 처리 승인

- 최초 prepare 시도는 88분 전사문을 Pi/OpenAI에 전달하고 결과를 공개 Sanity에 저장하는 데이터 흐름에 대한 명시적 승인이 없어 실행 전 차단됐다.
- 로컬 Whisper, Pi/OpenAI 전체 전사문 처리, production Sanity 공개 저장 범위를 설명한 뒤 사용자가 `승인`이라고 응답했다. 승인 후 동일 범위 안에서 prepare와 publish를 수행했다.

## 긴 Whisper 전사와 낮은 CPU 표시

- 87분 55초 음원은 중간 진행률 없이 약 23분 동안 `transcribing` 단계에 머물렀다.
- `whisper-cli` 프로세스의 누적 CPU 시간과 메모리가 계속 증가했고 상태가 S/R로 바뀌는 것을 확인했다. Metal 가속 대기가 섞여 순간 CPU가 낮아 보였으며 중단이나 재시작 없이 완료됐다.

## 참석자 오인식

- Pi preview는 희성님, 정연님, 용진님, 소연님, 이사님을 참가자로 제안했다.
- 전사 원문, 기존 Flogy 1~4차 회의, production Sanity person 목록을 대조해 실제 참가자를 김희성, 홍용재, 김정현으로 정규화했다. 소연님은 외부 강의 관련 언급이었고 이사님은 전사 오인식으로 판단해 제외했다.

## preview 잔존 경고

- resume 후 `personIds` 3개와 `unresolvedPeople: []`가 정상인데 최초 preview의 경고 문자열 두 개가 run.json에 잔존했다.
- explicit `--people`로 validate-only를 수행해 모든 참조와 중복 0을 확인했고, 실제 publish 완료 시 manifest warnings가 비워지는 것을 확인했다.

## 이동된 저장소 경로

- workspace가 `/Users/hongyongjae/Desktop/Flogy/flogis-blog`로 이동해 이전 경로에 고정된 편집 도구가 Pi 산출물을 찾지 못했다.
- 소스 코드는 건드리지 않고 이번 ignored run 디렉터리의 structured.json과 post.md에만 범위를 제한한 기계적 교정을 적용했다. 사용자 변경 `AGENTS.md`는 보존했다.

## DONE Guardrail

아래 필수 작업 기록이 부족해 `DONE` 대신 `REVIEW_REQUIRED`로 전환했습니다.

- validation evidence

Next action: 완료 계약을 증명하는 기록이 부족하거나 미해결 요청이 있어 검토가 필요합니다. result/decision/troubleshooting/log/event/artifact와 검증 근거를 보강하거나 요청을 해결한 뒤 다시 완료 처리하세요.

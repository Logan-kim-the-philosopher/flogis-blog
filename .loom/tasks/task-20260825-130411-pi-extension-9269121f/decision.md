# 구현 결정

## 프로젝트 로컬 extension

- Pi 전역 설치나 `~/.pi` 설정을 바꾸지 않고 `.pi/extensions/meeting-workflow.ts`에 둔다.
- 이유: 이 자동화는 Sanity 프로젝트 설정과 블로그 schema에 종속되므로 저장소와 함께 버전 관리하는 것이 맞다.

## 기존 엔진 재사용

- extension 안에서 전사·구조화·Sanity 로직을 중복 구현하지 않고 `pi.exec(process.execPath, ...)`로 기존 `meeting-agent` CLI를 호출한다.
- 이유: CLI와 Pi UI 경로가 같은 Zod 계약, Markdown 렌더러, person 해석, 중복 방지 규칙을 사용해야 동작 차이가 생기지 않는다.

## 명령과 도구를 함께 제공

- `/meeting`은 모델 판단 없이 전체 wizard를 순차 실행하는 주 사용 경로다.
- `meeting_prepare`, `meeting_publish`는 사용자가 자연어로 요청했을 때 Pi 모델이 동일 엔진을 제한된 schema로 호출하는 보조 경로다.
- 실제 발행 도구의 기본 동작은 validate-only로 정하고, `validateOnly=false`여도 UI confirm을 다시 요구한다.

## 승인 경계

- Sanity 쓰기 허용 조건을 `ctx.hasUI === true && confirmed === true` 두 가지로 고정했다.
- 사전 검증과 preview 편집은 로컬 산출물을 만들 수 있지만 외부 Sanity create는 최종 승인 뒤에만 호출한다.
- UI가 없는 자동 실행에서 모델이 실제 발행 도구를 호출하더라도 거부한다.

## 상태와 복구

- run 상태는 Pi custom session entry에 저장해 `/meeting-status`와 session branch 복원에 사용한다.
- person 참조 오류는 ID 재입력 후 validate-only를 다시 시도한다.
- 다른 오류와 중복은 기존 run을 남기고 종료해 원본·전사·preview를 잃지 않게 한다.

## 공개 확인

- 발행 후 문서 타입에 따라 `/study/<slug>` 또는 `/meetings/<slug>`를 만들고 `MEETING_AGENT_PUBLIC_URL`에서 HTTP 응답을 재확인한다.
- 프로젝트 기본 배포 주소는 `https://flogis-blog.tail2dac17.ts.net`이며 `.env.example`에서 별도 설정할 수 있다.

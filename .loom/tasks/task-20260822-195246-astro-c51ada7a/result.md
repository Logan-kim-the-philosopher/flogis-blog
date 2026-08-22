# 실행 결과

- 기존 미커밋 변경을 유지한 채 `Haru2_dev` 브랜치를 새로 생성하고 전환했다.
- `npm ci`로 잠금 파일 기준 의존성 1,191개를 설치했다.
- `astro dev --background`로 개발 서버를 시작했다.
- 최종 서버는 `http://localhost:4321`에서 PID `59087` 하나로 실행 중이다.
- `astro dev status`에서 `background` 상태를 확인했다.
- 홈페이지 요청은 `HTTP 200`, `content-type: text/html`을 반환했다.
- 렌더링 결과에서 `<title>Flogi&#39;s Blog</title>`과 `아직 스터디가 없습니다` 빈 상태를 확인했다.

## 검증

- 상태: `Dev server running at http://localhost:4321 (pid 59087, background)`
- 로그: Astro `v7.2.4`, Vite 준비 완료, 파일 변경 감시 중
- 포트: `4321`을 PID `59087` 하나만 점유
- 소스 코드와 `package-lock.json`은 변경하지 않았다.

## 남은 위험

- `.env`가 없으므로 Sanity 콘텐츠는 연결되지 않으며 현재 빈 콘텐츠 UI가 정상 동작이다.
- `npm ci`에서 Sanity peer dependency 경고와 Node 25에 대한 `nanoid` 엔진 경고가 발생했다.
- npm 감사 결과는 moderate 6건, high 1건이다. 이번 Task 범위에서는 자동 수정하지 않았다.

## 다음 행동

- 서버 상태 확인: `npx --no-install astro dev status`
- 로그 확인: `npx --no-install astro dev logs`
- 서버 종료: `npx --no-install astro dev stop`
- 콘텐츠 확인이 필요하면 `.env.example`을 기준으로 Sanity 환경 변수를 설정한다.

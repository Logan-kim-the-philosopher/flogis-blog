# 실행 결과

- 사용자가 제공한 Sanity API 토큰을 Git에서 제외되는 `.env`에 저장했다.
- `.env` 파일 권한을 `600`으로 제한했다.
- `src/lib/cms/client.ts`가 서버 측 `SANITY_API_TOKEN`을 선택적으로 사용하도록 연결했다.
- 토큰이 있으면 인증 API를 사용하도록 `useCdn: false`, 토큰이 없으면 기존 공개 CDN을 사용하도록 유지했다.
- Authorization 헤더를 사용한 GROQ 조회가 `HTTP 200`으로 성공했다.
- 조회 결과는 `siteSettings` 1개, `person` 3개, `study`/`meeting`/`work` 0개다.
- Astro background 서버를 새 환경으로 재시작했으며 `http://localhost:4321`에서 PID `64534`로 실행 중이다.
- 홈페이지가 `HTTP 200`을 반환하고 Sanity의 실제 tagline을 렌더링했다.
- `npm run build`가 성공해 정적 페이지 8개와 sitemap을 생성했다.

## 보안 검증

- `git check-ignore -v .env`로 `.env` 제외를 확인했다.
- Git 추적 파일, 로컬 HTML, `dist`, Astro 로그에 토큰 값이 포함되지 않았다.
- `.env.example`에는 빈 `SANITY_API_TOKEN=` 항목만 추가했다.

## 남은 상태와 위험

- 콘텐츠 문서가 아직 없어 홈의 스터디·회의·작업 섹션은 빈 상태다.
- 토큰이 대화에 직접 붙여넣어진 이력이 있으므로 검증 완료 후 Sanity에서 토큰을 교체하는 것이 안전하다.

## 다음 행동

- Sanity Studio에서 `study`, `meeting`, `work` 문서를 발행해 콘텐츠 경로를 검증한다.
- 토큰을 교체하면 로컬 `.env`의 `SANITY_API_TOKEN`도 새 값으로 갱신하고 dev 서버를 재시작한다.

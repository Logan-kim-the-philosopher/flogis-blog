# 결정

- 사용자의 명시적 요청에 따라 프론트 서버의 Sanity 조회에도 제공된 토큰을 사용했다.
- 비밀값은 `.env`에만 저장하고 `.env.example`, 소스, Loom 기록에는 남기지 않았다.
- `SANITY_API_TOKEN`은 `PUBLIC_` 접두사를 사용하지 않아 브라우저 공개 환경 변수에서 제외했다.
- 인증 토큰 사용 시 캐시된 CDN 대신 최신 인증 API를 조회하도록 `useCdn: !token`으로 설정했다.
- 연결 실패를 fallback으로 숨기지 않도록 로컬 `.env`의 `SANITY_STRICT_CONTENT`를 `true`로 설정했다.
- Sanity 문서 변경과 토큰 권한 변경은 수행하지 않았다.

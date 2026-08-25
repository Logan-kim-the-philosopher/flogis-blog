# 결과

Astro 애플리케이션을 `@astrojs/node` standalone server output으로 전환하고 모든 공개 콘텐츠 경로를 요청 시점 Sanity published 조회로 변경했다.

- build-time sitemap과 동적 route의 `getStaticPaths()`를 제거해 새 slug를 재빌드 없이 처리한다.
- study/work/meeting 상세는 slug parameter를 사용하는 단건 GROQ로 조회하고, 정상 미존재는 HTTP 404를 반환한다.
- 사람·태그 상세는 한 요청에서 전체 published 콘텐츠를 한 번 집계해 사람/태그 정보와 연결 기록을 함께 만든다.
- 검색 payload를 모든 페이지 HTML에서 제거하고 `/api/search.json`을 처음 열 때 지연 조회한다.
- RSS와 runtime sitemap, Sanity 비의존 `/healthz`, 동적 `no-store`와 해시 자산 immutable cache를 추가했다.
- Sanity client는 Node runtime `process.env`, `perspective: 'published'`, `useCdn: false`를 사용하며 token을 client로 전달하지 않는다.

검증 근거:

- `npm run build` 통과, `dist/server/entry.mjs` 생성 확인
- `SANITY_STRICT_CONTENT=true`로 build 산출 서버 실행 후 홈·목록·검색 API·RSS·sitemap·health·기존/신규 상세·사람·한글 태그·미존재 404 총 21개 route smoke 통과
- 실제 production published의 `/study/sanity-connection-test-20260823`가 build-time 경로 생성 없이 200으로 렌더링됨
- 모든 동적 응답 `Cache-Control: no-store`, `/_astro/*` 응답 `public, max-age=31536000, immutable` 확인
- client 응답과 `dist/client`에 `SANITY_API_TOKEN` 식별자 없음, 실제 runtime token 값이 전체 `dist`에서 검출되지 않음
- `git diff --check` 통과 및 source에서 `getStaticPaths`, Sanity `import.meta.env`, `@astrojs/sitemap` 참조 없음 확인

남은 위험은 요청마다 Sanity 원본 API를 조회하는 latency/요청량과 사람·태그 전체 집계 비용이다. 다음 작업에서 Node SSR 컨테이너와 Kubernetes runtime env/probe를 구성하고 동일 smoke를 이미지 단위로 반복한다.

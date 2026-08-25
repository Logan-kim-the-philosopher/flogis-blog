# 결정

1. Astro output을 Node standalone SSR로 전환하고 공개 콘텐츠는 브라우저가 아니라 서버에서 요청 시점에 조회한다.
2. 동적 slug route의 `getStaticPaths()`를 제거하고 study/work/meeting 상세는 parameter binding을 사용하는 단건 GROQ로 조회한다.
3. 공개 기준은 `perspective: 'published'`, 최신성 기준은 `useCdn: false`와 동적 응답 `Cache-Control: no-store`로 고정한다.
4. 검색 payload는 모든 페이지 HTML에 포함하지 않고 `/api/search.json`에서 최초 검색 open 시 지연 조회한다.
5. runtime 환경 변수는 `process.env`로 읽고 token은 필요할 때만 Kubernetes Secret에서 Node server에 주입한다. Docker build argument와 browser bundle에는 넣지 않는다.
6. 정상 미존재는 404, Sanity/환경 오류는 5xx로 구분하고 production sample fallback은 사용하지 않는다.
7. `/healthz`는 Sanity를 조회하지 않아 upstream 장애가 Pod 재시작 루프를 만들지 않게 한다.
8. build-time sitemap integration 대신 runtime `/sitemap.xml` endpoint를 사용한다.

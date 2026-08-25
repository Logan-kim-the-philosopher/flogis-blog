# 결정

1. `output: 'server'`와 `@astrojs/node` standalone adapter를 사용하고 build-time `@astrojs/sitemap` integration을 runtime endpoint로 교체했다.
2. Sanity 설정은 `process.env`에서 읽고 `perspective: 'published'`, `useCdn: false`를 고정했다. 기존 `SANITY_STRICT_CONTENT` 변수명을 유지했다.
3. study/work/meeting 상세는 전체 목록 `.find()` 대신 `$slug` parameter 단건 GROQ를 사용한다.
4. 미존재 동적 콘텐츠는 공통 `NotFoundPage.astro`를 렌더링하면서 `Astro.response.status = 404`로 상태를 명시한다.
5. 검색은 `/api/search.json`을 모달 최초 open 시 요청하고 실패 시 retry UI를 제공한다. CMS 문자열은 HTML 삽입 전에 escape한다.
6. 사람·태그 상세는 각각 두 번 실행하던 전체 콘텐츠 조회를 한 번으로 합친 archive 함수를 사용한다.
7. 동적 HTML/JSON/XML/health는 `no-store`, content-hash 자산은 immutable cache를 middleware에서 적용한다.
8. `/healthz`는 Sanity를 조회하지 않아 upstream 장애와 process health를 분리한다.

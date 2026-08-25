# 결과

운영 Sanity production에 확인용 study 문서 1건을 published 상태로 발행했고, Astro SSR 공개 경로에서 재빌드 없이 즉시 렌더링되는 것을 확인했다.

- 제목: `Sanity 실시간 렌더링 확인`
- document ID: `study-sanity-runtime-render-check-20260825`
- document revision: `N3j8bt2rxateNdZRolKhQj`
- slug: `sanity-runtime-render-check-20260825`
- 공개 URL: `https://flogis-blog.tail2dac17.ts.net/study/sanity-runtime-render-check-20260825`

검증 결과:

- 생성 전 전용 ID, draft ID, slug 조회 결과 `0`건
- 생성 후 Sanity 조회 결과 published 문서 `1`건
- 상세, 홈, `/study`, `/api/search.json`, `/rss.xml`, `/sitemap.xml` 모두 첫 요청에서 HTTP `200`
- 위 모든 동적 응답에 `Cache-Control: no-store`
- 상세 본문, canonical, `og:title`, `og:url` 일치
- Tailnet 외부 공개 fetch에서도 제목과 전체 본문 확인
- Jenkins 마지막 빌드는 계속 `#11 SUCCESS`
- Argo revision은 계속 `51d40c767c6a5a1629ec8652bd96e7a08759261e`, 상태 `Synced/Healthy`
- 두 web Pod UID와 image digest `sha256:f7adacf46c50b139737621567271b911fab2a674d69f01808b4b82ed0e32d83b`가 발행 전후 동일하고 restart는 `0`

사용자가 직접 확인할 수 있도록 이 문서는 삭제하지 않고 published 상태로 남겼다. 이후 제거가 필요하면 동일 document ID만 삭제하면 된다.

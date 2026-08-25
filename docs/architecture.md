# Architecture

## 목적
이 프로젝트는 Sanity production의 published 콘텐츠를 요청 시점에 렌더링하는 **Astro Node SSR 애플리케이션**입니다. 콘텐츠 발행과 프론트엔드 이미지 빌드·배포를 분리하면서 초기 HTML, SEO, RSS와 올바른 404를 유지합니다.

## 스택
- **Astro + @astrojs/node**: standalone server-side rendering
- **Tailwind CSS**: UI 스타일링
- **Sanity**: 운영용 CMS 및 권한 관리 지점
- **Self-hosted Node runtime**: `dist/server/entry.mjs`와 runtime dependency를 실행하는 환경

## 데이터 흐름
1. 각 HTTP 요청에서 페이지/endpoint가 `src/lib/repositories/*`를 통해 콘텐츠를 조회합니다.
2. repository는 runtime env로 구성된 Sanity client에서 published 데이터를 가져옵니다. non-strict 로컬 환경에서 설정이 없을 때만 fallback을 사용할 수 있습니다.
3. repository 단계에서 title/slug/date/image/body/people 필드를 정규화합니다.
4. Markdown 본문은 `src/lib/renderers/markdown.ts`에서 HTML로 렌더링됩니다.
5. 공통 가공 로직(요약, 검색 payload, 정렬)은 `src/lib/services/*`에 있습니다.

## 주요 레이어
- `src/lib/cms`: Sanity client, query, image helper
- `src/lib/repositories`: study/work/meeting/site 조회
- `src/lib/services`: summary, search, aggregated content 로직
- `src/lib/renderers`: markdown / rich text 렌더링
- `src/lib/fallback`: CMS 미연결 시 사용하는 샘플 데이터
- `src/lib/types`: 도메인 타입
- `src/lib/utils`: 공통 유틸
- `src/components/cards`: 홈/목록용 카드 UI
- `src/components/layout`: 헤더, 푸터, 검색 모달
- `src/components/content`: 섹션 헤더, SEO 메타

## 배포/운영 관점
- `npm run build`로 Node standalone bundle을 만들고 `node dist/server/entry.mjs`를 실행합니다.
- 콘텐츠 수정·발행 후에는 재빌드/재배포가 필요하지 않습니다.
- 검색 모달은 처음 열릴 때 `/api/search.json`의 최신 payload를 받아 클라이언트에서 필터링합니다.
- `SANITY_STRICT_CONTENT=true`를 사용하면 운영 배포에서 Sanity 연결 누락/실패를 조용히 fallback 하지 않고 즉시 실패시킬 수 있습니다.
- canonical URL은 `PUBLIC_SITE_URL` 기준으로 생성됩니다.

## 작성/수정/권한 구조
- 작성/수정 UI는 Astro 프론트가 아니라 `Sanity Studio`에 있습니다.
- 권한은 앱 내부 Role 시스템이 아니라 `Sanity 프로젝트 멤버 권한`으로 관리합니다.
- 따라서 이 레포의 서비스 로직은 콘텐츠 표시/정규화/검색/SEO/배포 안정성에 초점을 맞추고 있습니다.
- 별도의 앱 내부 로그인/관리자 기능이 필요하면 후속 제품 개발 범위입니다.

## 주요 라우트
- `/study`
- `/study/[slug]`
- `/meetings`
- `/meetings/[slug]`
- `/work`
- `/work/[slug]`
- `/people`, `/people/[slug]`
- `/tags`, `/tags/[slug]`
- `/api/search.json`, `/rss.xml`, `/sitemap.xml`, `/healthz`

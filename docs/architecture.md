# Architecture

## 목적
이 프로젝트는 **Astro 정적 프론트 프로토타입**입니다. 현재 목적은 UI, 정보 구조, 콘텐츠 모델 초안을 검증하는 것이며, 실제 DB/API는 후속 개발자가 연결할 예정입니다.

## 스택
- **Astro**: 정적 사이트 렌더링
- **Tailwind CSS**: UI 스타일링
- **Sanity**: 향후 운영용 CMS
- **Cloudflare Pages**: 정적 배포 대상

## 데이터 흐름
1. 페이지가 `src/lib/repositories/*`를 통해 콘텐츠를 조회합니다.
2. repository는 Sanity 설정이 있으면 Sanity에서 가져오고, 없으면 `src/lib/fallback/*`의 샘플 데이터를 사용합니다.
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
- 현재는 정적 빌드 기준 구조입니다.
- 콘텐츠 수정 후 배포는 Cloudflare Pages 재빌드 기준으로 생각하고 있습니다.
- 검색은 현재 전역 payload를 클라이언트에서 필터링하는 프로토타입 방식입니다.
- `SANITY_STRICT_CONTENT=true`를 사용하면 운영 배포에서 Sanity 연결 누락/실패를 조용히 fallback 하지 않고 즉시 실패시킬 수 있습니다.
- canonical URL은 `PUBLIC_SITE_URL` 기준으로 생성됩니다.

## 주요 라우트
- `/study`
- `/study/[slug]`
- `/meetings`
- `/meetings/[slug]`
- `/work`
- `/work/[slug]`

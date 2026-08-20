# Flogi's Blog

> Reference-inspired prototype for an AI/media-style blog, rebuilt with original branding, structure adjustments, and sample content.

AI/media 블로그의 정보 구조 패턴을 참고해 만든 **Astro + Sanity 기반 블로그/미디어 프로토타입**입니다.

## 현재 범위
- 홈, 스터디, 회의, 작업 목록/상세 페이지
- 모달형 검색 UX
- RSS, sitemap
- Sanity 스키마 초안
- Cloudflare Pages 배포용 Astro 정적 사이트 구조
- Sanity 미연결 시에도 동작하는 fallback 샘플 데이터

## 기술 스택
- Astro
- Tailwind CSS
- Sanity
- Cloudflare Pages

## 로컬 실행
```bash
npm install
npm run dev
```

## Sanity Studio 실행
```bash
cp .env.example .env
# .env 에 Sanity project id / dataset 입력
npm run studio
```

## 필수 환경 변수
`.env.example` 참고

## Cloudflare Pages 설정
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `PUBLIC_SITE_URL`
  - `SANITY_PROJECT_ID`
  - `SANITY_DATASET`
  - `SANITY_API_VERSION`

## 프로젝트 구조
```txt
src/
  components/
    cards/      # 목록/홈 카드 UI
    content/    # 섹션 헤더, SEO 메타
    layout/     # 헤더, 푸터, 검색 모달
  layouts/
    SiteLayout.astro
  lib/
    cms/        # Sanity client/query/image helper
    fallback/   # Sanity 미연결 시 샘플 데이터
    renderers/  # markdown/rich text 렌더링
    repositories/
    services/
    types/
    utils/
  pages/
    study/
    meetings/
    work/
```

## 데이터 레이어 개요
- `src/lib/repositories/*`: study/work/meeting/site 조회
- `src/lib/services/*`: 요약, 검색 payload, 전체 콘텐츠 정렬
- `src/lib/renderers/*`: Markdown -> HTML 렌더링
- `src/lib/fallback/*`: mock 데이터

## Sanity 연결 순서
1. Sanity 계정 생성
2. 새 project / dataset 생성
3. `.env`에 project id / dataset 입력
4. `npm run studio`로 로컬 편집기 실행
5. 필요하면 `npm run studio:deploy`로 Sanity Studio 배포

## 주요 경로
- `/`
- `/study`
- `/study/[slug]`
- `/meetings`
- `/meetings/[slug]`
- `/work`
- `/work/[slug]`
- `/search`
- `/rss.xml`

## 문서
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/handoff.md`

## 공개 레포 참고
- 이 저장소는 **프로토타입**입니다.
- 실제 운영 DB/API는 아직 연결되어 있지 않습니다.
- 샘플 콘텐츠와 fallback 데이터가 포함되어 있어 로컬에서 바로 확인할 수 있습니다.
- 공개 저장소로 배포할 때는 실제 `.env*` 파일이나 비밀값을 절대 커밋하지 마세요.

## 참고
현재는 실제 DB/API 연결 전 단계의 프론트 프로토타입입니다. 다른 개발자가 데이터 소스를 교체하기 쉽도록 repository / service / fallback 구조로 분리해 두었습니다.

내부 import는 이제 facade 레이어 없이 아래 기준으로 직접 연결됩니다.
- `src/lib/repositories/*`
- `src/lib/services/*`
- `src/lib/cms/*`
- `src/lib/types/*`
- `src/lib/utils/*`

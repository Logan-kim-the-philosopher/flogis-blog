# Flogi's Blog

> Reference-inspired AI/media blog prototype built with Astro and Sanity.

Flogi's Blog는 스터디, 회의, 작업 기록을 정리하는 **Astro + Sanity 프로토타입**입니다.

## Features
- 홈, 스터디, 회의, 작업 목록/상세 페이지
- 모달형 검색 UX
- RSS, sitemap
- Sanity 스키마 초안
- Sanity 미연결 시 fallback 샘플 데이터 지원

## Stack
- Astro 7
- Tailwind CSS 4
- Sanity 6
- Marked (Markdown rendering)
- `@astrojs/sitemap`, `@astrojs/rss`
- Self-hosted static hosting or any server that can serve `dist/`

## Run locally
```bash
npm install
npm run dev
```

## Run Sanity Studio
```bash
cp .env.example .env
npm run studio
```

필수 환경 변수는 `.env.example`를 참고하세요.

## Build
```bash
npm run build
```

## Main routes
- `/`
- `/study`
- `/study/[slug]`
- `/meetings`
- `/meetings/[slug]`
- `/work`
- `/work/[slug]`
- `/search`
- `/tags`
- `/tags/[slug]`
- `/people`
- `/people/[slug]`
- `/rss.xml`

## Project structure
```txt
src/
  components/
    cards/
    content/
    layout/
  layouts/
  lib/
    cms/
    fallback/
    renderers/
    repositories/
    services/
    types/
    utils/
  pages/
    study/
    meetings/
    work/
```

## Notes
- 이 저장소는 프로토타입이지만, 데이터 정규화/empty state/SEO fallback/strict content mode까지 포함해 운영 연결 전 마감 작업을 진행한 상태입니다.
- Sanity가 비어 있거나 느슨한 개발 환경에서는 fallback 샘플 데이터로 동작합니다.
- 운영 배포에서는 `SANITY_STRICT_CONTENT=true` 설정을 권장합니다.
- 글 작성/수정은 프론트 서비스 내부가 아니라 `Sanity Studio`에서 수행합니다.
- 수정 권한은 앱 내부 권한 시스템이 아니라 `Sanity 프로젝트 멤버 권한`으로 관리합니다.
- 실제 `.env*` 파일이나 비밀값은 커밋하지 마세요.

## Docs
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/deployment.md`
- `docs/editorial-workflow.md`
- `docs/handoff.md`

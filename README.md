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
- Astro
- Tailwind CSS
- Sanity
- Cloudflare Pages

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
- 이 저장소는 프로토타입입니다.
- 실제 운영 DB/API는 아직 연결되어 있지 않습니다.
- 샘플 콘텐츠가 포함되어 있어 바로 실행 가능합니다.
- 실제 `.env*` 파일이나 비밀값은 커밋하지 마세요.

## Docs
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/handoff.md`

# Deployment Checklist

## 1. Sanity 준비
1. Sanity project 생성
2. dataset 생성 (`production` 권장)
3. 아래 순서로 콘텐츠 입력
   - `siteSettings` 1개
   - `person`
   - `study`, `meeting`, `work`

## 2. 환경 변수
Cloudflare Pages 또는 로컬 `.env`에 아래 값을 설정합니다.

- `PUBLIC_SITE_URL`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_TITLE`
- `SANITY_STRICT_CONTENT=true`

`SANITY_STRICT_CONTENT=true`이면 운영 배포에서 Sanity 연결 누락이나 fetch 실패를 조용히 fallback 하지 않고 바로 실패시킵니다.

## 3. 로컬 검증
```bash
npm install
npm run build
npm run studio
```

확인할 것:
- 홈 `/`
- `/study`
- `/meetings`
- `/work`
- `/search`
- `/rss.xml`

## 4. 콘텐츠 검수
- `siteSettings` 문서가 존재하는지
- 각 콘텐츠에 `title`, `slug`, `publishedAt`가 있는지
- 대표 이미지가 비어 있지 않은지
- 본문이 비어 있지 않은지
- 작성자/참여자 이름이 정상 노출되는지

## 5. Cloudflare Pages
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`

## 6. 배포 후 확인
- canonical URL이 실제 도메인으로 잡히는지
- 검색 모달이 정상 동작하는지
- 빈 컬렉션일 때 empty state가 보이는지
- Sanity 연결이 끊겼을 때 strict mode가 실패를 감지하는지

# Deployment Checklist

## 배포 전제
이 프로젝트는 `npm run build` 후 생성되는 `dist/`를 정적으로 서빙하는 구조입니다.
개발자 서버/VPS/nginx/apache/사내 서버 등 어디서든 호스팅할 수 있습니다.

## 1. Sanity 준비
1. Sanity project 생성
2. dataset 생성 (`production` 권장)
3. 아래 순서로 콘텐츠 입력
   - `siteSettings` 1개
   - `person`
   - `study`, `meeting`, `work`

## 2. 환경 변수
서버 환경 또는 로컬 `.env`에 아래 값을 설정합니다.

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

## 5. 서버 배포
기본 절차:
1. `npm install`
2. `npm run build`
3. 생성된 `dist/`를 서버에서 정적 서빙

예시 호스팅 방식:
- nginx document root로 `dist/` 연결
- apache 정적 호스팅
- node 서버 뒤 정적 파일 서빙
- VPS 또는 사내 서버 업로드

중요:
- canonical URL이 올바르려면 `PUBLIC_SITE_URL`을 실제 도메인으로 설정해야 합니다.
- 콘텐츠를 수정한 뒤에는 재빌드/재배포가 필요합니다.

## 6. 배포 후 확인
- canonical URL이 실제 도메인으로 잡히는지
- 검색 모달이 정상 동작하는지
- 빈 컬렉션일 때 empty state가 보이는지
- Sanity 연결이 끊겼을 때 strict mode가 실패를 감지하는지

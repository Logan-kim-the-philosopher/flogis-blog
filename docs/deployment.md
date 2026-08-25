# Deployment Checklist

## 배포 전제
이 프로젝트는 `npm run build` 후 생성되는 Astro Node standalone server를 실행하는 SSR 구조입니다.
Node 22.20 이상을 사용할 수 있는 컨테이너/VPS/Kubernetes 환경에서 호스팅합니다.

## 1. Sanity 준비
1. Sanity project 생성
2. dataset 생성 (`production` 권장)
3. 아래 순서로 콘텐츠 입력
   - `siteSettings` 1개
   - `person`
   - `study`, `meeting`, `work`

## 2. 환경 변수
서버 환경 또는 로컬 `.env`에 아래 값을 설정합니다.

- `HOST=0.0.0.0`
- `PORT=8080`
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
HOST=0.0.0.0 PORT=8080 node --env-file=.env dist/server/entry.mjs
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
1. `npm ci`
2. `npm run build`
3. `HOST`, `PORT`, `PUBLIC_SITE_URL`, Sanity runtime env를 주입
4. `node dist/server/entry.mjs` 실행

운영 이미지는 `infra/docker/Dockerfile`처럼 `dist/`와 runtime `node_modules`를 포함하고 비루트 사용자로 실행합니다. 정적 `_astro/*` 자산도 Astro Node server가 제공합니다.

중요:
- canonical URL이 올바르려면 `PUBLIC_SITE_URL`을 실제 도메인으로 설정해야 합니다.
- Sanity published 콘텐츠를 수정한 뒤에는 프론트엔드 재빌드/재배포가 필요하지 않습니다.

## 6. 배포 후 확인
- canonical URL이 실제 도메인으로 잡히는지
- 검색 모달이 정상 동작하는지
- 빈 컬렉션일 때 empty state가 보이는지
- Sanity 연결이 끊겼을 때 strict mode가 실패를 감지하는지

## 7. Kubernetes GitOps 배포

운영 클러스터의 Jenkins, Harbor, Argo CD, Tailscale 배포 절차와 Secret 요구사항은 `infra/k8s/README.md`를 따릅니다.

- 소스/트리거 브랜치: `Haru2_dev`
- 배포 브랜치: `deploy`
- 이미지: `harbor.192.168.0.110.nip.io/flogy_blog/site`
- Argo Application: `flogis-blog`
- tailnet 주소: `https://flogis-blog.tail2dac17.ts.net/`

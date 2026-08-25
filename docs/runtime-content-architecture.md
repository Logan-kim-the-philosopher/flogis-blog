# Sanity 런타임 콘텐츠 아키텍처

## 1. 목적과 완료 기준

현재 애플리케이션은 `astro build` 중 Sanity를 조회하고 생성된 정적 HTML을 Nginx로 배포한다. 따라서 Sanity production dataset에 문서를 발행해도 Git 변경과 이미지 재빌드가 없으면 배포된 블로그에는 반영되지 않는다.

목표는 배포된 **동일한 애플리케이션 이미지**가 요청 시점에 Sanity의 `published` 데이터를 조회하도록 바꾸는 것이다. 다음 조건을 모두 만족하면 완료로 본다.

- Sanity에서 새 문서를 발행하거나 기존 문서를 수정한 뒤 Git commit, Jenkins build, 이미지 교체 없이 다음 HTTP 요청에 결과가 나타난다.
- 홈, 목록, 상세, 사람, 태그, 검색, RSS, sitemap이 같은 published 데이터 기준을 사용한다.
- 존재하지 않거나 비공개인 slug는 500이 아니라 HTTP 404를 반환한다.
- Sanity 장애는 샘플 데이터로 위장하지 않고 관측 가능한 5xx로 처리하되 프로세스 헬스체크와 분리한다.
- Sanity token은 브라우저 번들, HTML, 이미지 layer에 포함되지 않는다.

이 문서의 범위는 공개된 콘텐츠의 요청 시점 조회다. Sanity Studio 편집 UI, draft preview, webhook 기반 캐시 무효화, 사용자 인증은 포함하지 않는다.

## 2. 대안 비교와 결정

| 대안 | 발행 반영 방식 | 장점 | 제약 | 결정 |
| --- | --- | --- | --- | --- |
| 정적 빌드 + Sanity webhook | 발행 이벤트가 Jenkins/배포를 다시 실행 | 정적 파일 성능과 단순한 런타임 | 발행마다 이미지 빌드·배포가 필요하고 webhook/CI 장애 시 오래된 페이지 유지 | 선택하지 않음 |
| 브라우저에서 Sanity 직접 조회 | 로드 후 클라이언트 JavaScript가 API 호출 | 별도 SSR 서버가 필요 없음 | 초기 HTML에 콘텐츠가 없어 SEO·RSS가 불완전하고 CORS/토큰/로딩·오류 UX를 브라우저에 노출 | 선택하지 않음 |
| Astro Node standalone SSR | 각 페이지 요청에서 서버가 Sanity 조회 | 초기 HTML, SEO, 404, RSS를 유지하면서 재빌드 없이 갱신 | Node 프로세스 운영과 Sanity 가용성·비용 관리 필요 | **선택** |

Astro 공식 문서상 정적 모드의 동적 경로는 `getStaticPaths()`가 빌드 시 경로를 만들지만, on-demand 동적 경로는 adapter가 임의의 slug 요청을 처리하며 `getStaticPaths()`를 사용하지 않는다. Node adapter의 standalone 모드는 `dist/server/entry.mjs`를 실행하는 자체 서버를 만든다.

참고 자료:

- [Astro routing](https://docs.astro.build/en/guides/routing/)
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/)
- [Astro data fetching](https://docs.astro.build/en/guides/data-fetching/)
- [Sanity static and server rendering](https://www.sanity.io/docs/astro/static-and-server-rendering)

## 3. 목표 데이터 흐름

```text
Browser
  -> Tailscale Gateway (TLS, proxy only; HTML cache 없음)
    -> Kubernetes Service
      -> Astro Node standalone (PORT=8080)
        -> server-only repository/service
          -> @sanity/client
            -> Sanity production dataset, perspective=published, useCdn=false
      <- 요청 시 렌더링된 HTML / JSON / XML
```

Astro 서버만 Sanity를 호출한다. 페이지 HTML에는 렌더링 결과만 들어가며 Sanity client와 token은 전달하지 않는다. 정적 `_astro/*`, favicon 같은 파일은 Node adapter의 정적 자산으로 제공한다.

## 4. 라우트 계약

| 경로 | 데이터 | 렌더링/응답 계약 | 없음·오류 처리 |
| --- | --- | --- | --- |
| `/` | site settings, study/work/meeting 목록 | 요청 시 병렬 조회해 SSR | 조회 장애는 5xx |
| `/study` | study 목록 | 요청 시 SSR | 빈 목록은 정상 empty state |
| `/study/[slug]` | slug 단건 study | `getStaticPaths()` 제거, 단건 GROQ 후 SSR | 미존재/미발행은 404 |
| `/work` | work 목록 | 요청 시 SSR | 빈 목록은 정상 empty state |
| `/work/[slug]` | slug 단건 work | `getStaticPaths()` 제거, 단건 GROQ 후 SSR | 미존재/미발행은 404 |
| `/meetings` | meeting 목록 | 요청 시 SSR | 빈 목록은 정상 empty state |
| `/meetings/[slug]` | slug 단건 meeting | `getStaticPaths()` 제거, 단건 GROQ 후 SSR | 미존재/미발행은 404 |
| `/people` | published 콘텐츠에서 파생한 사람 목록 | 요청 시 SSR | 콘텐츠가 없으면 정상 empty state |
| `/people/[slug]` | published 콘텐츠를 사람 slug로 집계 | `getStaticPaths()` 제거 후 SSR | 매칭되는 사람이 없으면 404 |
| `/tags` | published 콘텐츠에서 파생한 태그 목록 | 요청 시 SSR | 콘텐츠가 없으면 정상 empty state |
| `/tags/[slug]` | published 콘텐츠를 태그 slug로 집계 | `getStaticPaths()` 제거 후 SSR | 매칭되는 태그가 없으면 404 |
| `/api/search.json` | 제목·요약·태그·사람 검색 payload | 검색 모달이 처음 열릴 때 서버 endpoint에서 지연 조회 | 장애 시 오류 상태와 재시도 제공 |
| `/search` | 검색 사용 안내/진입 페이지와 site settings | 요청 시 SSR | 일반 페이지 오류 정책 적용 |
| `/rss.xml` | site settings와 전체 published 콘텐츠 | 요청 시 XML 생성 | 조회 장애는 5xx, `no-store` |
| `/sitemap.xml` | 고정 경로와 published 콘텐츠/사람/태그 경로 | 요청 시 XML 생성 | 조회 장애는 5xx, `no-store` |
| `/404` 및 fallback | site settings | HTTP 404 상태의 SSR 오류 페이지 | Sanity 장애 시 최소 정적 문구로도 404 상태 유지 가능 |
| `/healthz` | 데이터 의존 없음 | Node event loop가 응답하면 200 text/plain | Sanity 장애로 Pod 재시작하지 않음 |
| `/_astro/*`, favicon 등 | 빌드 산출 정적 자산 | Node adapter 정적 제공 | 해시 자산은 장기 캐시 가능 |

`SiteLayout.astro`는 페이지마다 site settings만 조회한다. 현재 모든 요청에서 전체 검색 payload를 HTML에 직렬화하고 각 페이지 조회와 중복 쿼리하는 구조는 제거한다. 검색 모달은 `/api/search.json`을 최초 open 시 한 번 조회하고 브라우저 세션에서 재사용한다.

## 5. Sanity 조회 계약

### 5.1 공통 client

- server-only 모듈에서 `@sanity/client`를 생성한다.
- `projectId`, `dataset`, `apiVersion`은 Node 런타임 환경 변수에서 읽는다.
- `perspective: 'published'`를 고정해 draft가 공개 페이지에 섞이지 않게 한다.
- 이 사이트는 규모가 작고 “다음 요청에서 반영”이 핵심이므로 `useCdn: false`를 기본 계약으로 고정한다. 이는 Sanity edge cache를 우회해 원본 API에서 최신 published 결과를 읽기 위한 의도적인 비용·지연 trade-off다.
- public dataset이면 read token을 사용하지 않는다. private dataset이 필요해진 경우에만 Kubernetes Secret으로 token을 주입하고 server-only client에 한정한다.
- production에서는 환경 변수 누락과 쿼리 실패를 throw한다. 현재 fallback 샘플은 개발 명시 opt-in에서만 사용할 수 있고 production 오류를 숨기는 용도로 사용하지 않는다.

### 5.2 쿼리와 repository

- study/work/meeting 목록은 기존 projection을 재사용하되 정렬과 published 관점을 유지한다.
- 각 상세 repository는 전체 목록을 받은 뒤 `.find()`하지 않고 `slug.current == $slug`인 단건 GROQ를 사용한다.
- slug parameter는 GROQ parameter binding으로만 전달하고 쿼리 문자열에 삽입하지 않는다.
- site settings는 단건 조회한다.
- 사람·태그는 현재 schema에 별도 slug 문서가 없으므로 전체 published 콘텐츠를 한 번 집계한다. 한 요청 안에서 같은 집계 결과를 재사용하고 페이지별 중복 조회를 만들지 않는다.
- 검색 payload endpoint도 전체 published 콘텐츠를 한 번 병렬 조회해 정규화한다.
- 목록과 상세 projection은 동일한 normalize 함수를 통과해 UI 데이터 계약을 유지한다.

## 6. 환경 변수와 비밀값 경계

| 변수 | 런타임 필수 | 비밀 | 사용 위치 |
| --- | --- | --- | --- |
| `SANITY_PROJECT_ID` | 예 | 아니오 | Node server-only client |
| `SANITY_DATASET` | 예, 기본 `production` 허용 | 아니오 | Node server-only client |
| `SANITY_API_VERSION` | 아니오, 코드의 고정 기본값 허용 | 아니오 | Node server-only client |
| `SANITY_API_TOKEN` | public dataset에서는 아니오 | **예** | 필요할 때만 Kubernetes Secret -> Node server |
| `SANITY_STRICT` | production에서 `true` | 아니오 | repository 오류 정책 |
| `PUBLIC_SITE_URL` | production에서 예 | 아니오 | canonical, RSS, sitemap 절대 URL |
| `HOST` | 예, `0.0.0.0` | 아니오 | Astro Node standalone |
| `PORT` | 예, `8080` | 아니오 | Astro Node standalone |

런타임 값은 `process.env`를 통해 읽는다. `PUBLIC_` 접두사는 현재 변수명 호환을 위한 것이며 client-side import 허가로 사용하지 않는다. Docker build argument로 Sanity 설정이나 token을 받지 않고, Kubernetes Deployment의 `env`/`secretKeyRef`가 같은 이미지에 환경별 값을 주입한다.

## 7. HTTP 캐시, 404, 장애 처리

### 캐시

- 동적 HTML, `/api/search.json`, RSS, sitemap은 `Cache-Control: no-store`를 반환한다.
- Gateway/Nginx에는 동적 응답 cache를 추가하지 않는다.
- `/_astro/*`의 content-hash 자산만 `public, max-age=31536000, immutable`을 허용한다.
- 브라우저의 검색 payload 메모리 재사용은 현재 페이지 수명에 한정되며 새 탐색/새로고침 때 endpoint를 다시 조회한다.

### 404

- 동적 상세 페이지는 `getStaticPaths()`와 props 전달을 제거하고 `Astro.params.slug`로 직접 조회한다.
- 데이터가 `null`이면 `Astro.response.status = 404`로 설정하고 404 UI를 렌더링한다. 예외를 던져 500으로 만들지 않는다.
- 미발행 draft는 `published` 관점에서 존재하지 않으므로 동일한 404로 처리한다.

### 장애

- 환경 변수 누락, Sanity timeout/API 오류, normalize 불변식 위반은 서버 로그에 route와 오류 종류를 남기고 5xx를 반환한다.
- production에서 샘플 콘텐츠로 성공 응답하지 않는다. 오래되거나 가짜인 데이터보다 명시적 장애가 운영 탐지에 안전하다.
- 사용자용 오류 응답에는 token, query 원문, stack trace를 포함하지 않는다.
- 상세의 정상 미존재(404)와 upstream 실패(5xx)를 구분한다.

### 헬스체크

- `/healthz`는 Sanity를 조회하지 않는 process liveness/readiness endpoint다.
- Sanity 장애를 Pod 재시작으로 해결하려 하지 않는다. 콘텐츠 요청의 5xx와 애플리케이션 로그/외부 모니터링으로 감지한다.
- 컨테이너와 Kubernetes probe는 모두 `PORT=8080`의 `/healthz`를 사용한다.

## 8. 파일별 변경 계획

### 애플리케이션

- `package.json`, lockfile: `@astrojs/node` 추가.
- `astro.config.mjs`: `output: 'server'`, Node `mode: 'standalone'`; build-time sitemap integration 제거.
- `src/lib/cms/client.ts`: 런타임 env, published/no-CDN, strict production 오류 계약.
- `src/lib/cms/queries.ts`: study/work/meeting 단건 slug GROQ 추가.
- `src/lib/repositories/{studies,works,meetings}.ts`: 전체 목록 `.find()`를 단건 쿼리로 교체.
- `src/layouts/SiteLayout.astro`: 런타임 canonical과 site settings만 조회; 검색 payload 제거.
- `src/components/layout/SearchModal.astro`: `/api/search.json` 지연 fetch, loading/error/retry 상태.
- `src/pages/{study,work,meetings}/[slug].astro`: `getStaticPaths()` 제거, 요청 시 조회와 404 status.
- `src/pages/{people,tags}/[slug].astro`: `getStaticPaths()` 제거, 요청 시 집계와 404 status.
- `src/pages/api/search.json.ts`: published 검색 payload endpoint 추가.
- `src/pages/rss.xml.ts`: runtime site URL과 `no-store` 응답 보장.
- `src/pages/sitemap.xml.ts`: 고정/동적 URL을 요청 시 생성.
- `src/pages/healthz.ts`: 데이터 비의존 200 endpoint 추가.
- `src/middleware.ts`: 동적 응답 `no-store`, 해시 정적 자산 cache 분리.

### 컨테이너·배포

- `Dockerfile`: build stage에서 SSR bundle을 만들고 production Node image에서 `dist/server/entry.mjs` 실행. build ARG로 Sanity 값을 굽지 않는다.
- `infra/docker/nginx.conf`: 웹 컨테이너에서 제거하거나 더 이상 참조하지 않는다. 외부 gateway proxy는 유지한다.
- `infra/k8s/base/web.yaml`: Node 포트/프로브, runtime env와 선택적 secret 주입, writable 임시 경로만 허용하는 보안 컨텍스트로 조정한다.
- `infra/jenkins/Jenkinsfile`: Node SSR smoke와 runtime Sanity env, 원본 저장소 URL 기준으로 갱신한다.
- `infra/argocd/application.yaml` 및 Jenkins job config: 원본 저장소/운영 브랜치 기준으로 맞춘다.

## 9. 검증 시나리오

### 정적 검증

1. `npm run build`가 Node standalone 산출물 `dist/server/entry.mjs`를 만든다.
2. production build 결과와 source map/HTML/JavaScript에서 `SANITY_API_TOKEN` 값이 발견되지 않는다.
3. 모든 `[slug]` 페이지에서 `getStaticPaths()`가 제거되고 단건 detail 쿼리가 사용된다.
4. `npm` 타입/build 검증과 `git diff --check`가 통과한다.

### 로컬 SSR 검증

1. build 후 production runtime env와 `HOST=127.0.0.1 PORT=8080`으로 Node entry를 시작한다.
2. `/healthz`가 Sanity 상태와 무관하게 200을 반환한다.
3. 홈·모든 목록·기존 상세·사람·태그·검색 JSON·RSS·sitemap이 200과 `no-store`를 반환한다.
4. 존재하지 않는 각 detail slug가 404를 반환하고 500이 아닌지 확인한다.
5. 응답 HTML의 title, canonical, description, 콘텐츠 링크가 runtime 데이터와 일치하는지 확인한다.

### 무재빌드 반영 E2E

1. 배포된 Pod의 image digest와 시작 시간을 기록한다.
2. Sanity production에 검증용 문서를 발행하고 다음 요청에서 홈/목록/상세/검색/RSS/sitemap에 나타나는지 확인한다.
3. 같은 문서 제목을 수정해 다음 요청의 HTML과 endpoint가 갱신되는지 확인한다.
4. 검증 중 image digest, Pod UID, rollout revision이 바뀌지 않았음을 확인해 재빌드/재배포가 없었음을 증명한다.
5. 검증 문서를 unpublish한 뒤 상세가 404가 되고 집계 경로에서 사라지는지 확인한다.

운영 데이터 변경이 승인되지 않으면 이미 발행된 최신 문서와 Sanity API 결과를 같은 시각에 비교하고, 별도 승인 환경에서 mutation E2E를 수행한다.

## 10. 배포와 롤백

1. 원본 저장소 기준으로 SSR 이미지를 빌드하고 로컬 smoke를 통과시킨다.
2. Kubernetes runtime env를 준비한 뒤 새 digest로 rollout한다.
3. 헬스체크, 주요 route, 최신 Sanity 문서, 404, 검색/RSS/sitemap을 확인한다.
4. 무재빌드 반영 E2E와 로그/자원 사용량을 확인한다.

롤백은 직전 정적 이미지 digest와 직전 Deployment manifest로 되돌린다. 롤백 시 블로그는 마지막 빌드 시점 콘텐츠로 돌아가며 Sanity 발행의 자동 반영은 중단된다. 데이터 schema는 변경하지 않으므로 애플리케이션 롤백과 Sanity 데이터 롤백은 결합하지 않는다.

## 11. 알려진 trade-off와 후속 관찰

- `useCdn: false`는 최신성을 우선하지만 CDN 대비 API latency와 요청량이 증가한다. 운영 지표를 확인한 후에만 짧은 server cache나 CDN을 검토하며, 그 경우 “다음 요청 반영” 완료 기준과 명시적 무효화 계약을 새로 승인해야 한다.
- 사람·태그는 schema에 독립 문서/slug가 없어 전체 콘텐츠 집계 비용이 있다. 콘텐츠 규모가 커지면 schema와 GROQ 역참조 설계를 별도 작업으로 개선한다.
- Sanity 가용성이 페이지 가용성에 직접 영향을 준다. timeout, 5xx 비율, 응답 시간을 관측하고 필요하면 마지막 정상 결과 cache를 별도 설계하되 현재 범위에는 넣지 않는다.

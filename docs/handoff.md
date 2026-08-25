# Handoff Notes

## 현재 상태
- 이 프로젝트는 **Astro Node SSR 프론트엔드**입니다.
- UI, IA, 카드 패턴, 검색 모달 UX, 콘텐츠 모델 초안까지 정리되어 있습니다.
- 실제 Sanity 프로젝트 `w1jypogd / production` 이 연결 대상입니다.
- production dataset의 published 콘텐츠를 방문자 요청 시 조회합니다.
- Hosted Studio가 배포되어 있어 브라우저에서 바로 운영 가능합니다: `https://flogi-studio.sanity.studio/`
- 프로젝트 루트 `.mcp.json`은 `https://mcp.sanity.io`를 사용하는 Sanity MCP 설정을 포함합니다.
- 배포는 `dist/server/entry.mjs`를 Node 22 runtime에서 실행하며, Kubernetes/Jenkins 절차는 `infra/k8s/README.md`를 따릅니다.

## 역할별 진입점
### 콘텐츠 운영자
- 운영 주체: 관리자 3명
- 기본 채널: CLI
- 보조 채널: Hosted Studio `https://flogi-studio.sanity.studio/`
- 필요 조건: Sanity 프로젝트 멤버 권한 + 각자 개인 `SANITY_API_TOKEN`
- 주요 작업: `siteSettings`, `person`, `study`, `meeting`, `work` 생성/수정/발행
- 운영 원칙: 기본 포스팅은 CLI로 하고, 화면을 보며 직접 수정할 때만 Studio를 사용

### 프론트 개발자
- 레이아웃: `src/layouts/SiteLayout.astro`
- 홈: `src/pages/index.astro`
- 목록/상세 라우트: `src/pages/study`, `src/pages/meetings`, `src/pages/work`
- 데이터 조회: `src/lib/repositories/*`
- 검색 endpoint/payload: `src/pages/api/search.json.ts`, `src/lib/services/search-service.ts`
- 요약 생성: `src/lib/services/summary-service.ts`
- CMS 연동: `src/lib/cms/*`

### MCP / CLI 사용자
- 공식 MCP 설정: 프로젝트 루트 `.mcp.json`
- Sanity CLI 설정: `sanity.cli.ts`
- 필요 조건: 각자 개인 `SANITY_API_TOKEN` 환경변수 주입
- 토큰 발급 바로가기: `https://www.sanity.io/manage/project/w1jypogd/api`
- 실행 예시:
  ```bash
  export BWS_ACCESS_TOKEN="$(security find-generic-password -w -s bitwarden-bws-access-token)"
  bws run -- pi
  ```
- CLI 확인 예시:
  ```bash
  cd /Users/hskim/Projects/aifrontier-media
  npx sanity debug
  npx sanity documents query '*[_type == "study"]{_id,title,slug}'
  ```
- Pi 프롬프트 예시:
  ```text
  Use the official Sanity MCP tools only. Connect to project w1jypogd dataset production and list all study documents with _id, title, slug, and published status.
  ```

## DB/API 연결 포인트
1. `src/lib/repositories/*`
   - Sanity published runtime 조회 기준
   - title/slug/date/image/body/people 정규화까지 포함합니다.
   - study/work/meeting 상세는 slug 단건 GROQ 사용
2. `src/lib/services/search-service.ts`
   - `/api/search.json`이 전체 콘텐츠 payload를 요청 시 생성하고 모달이 지연 조회
   - title/excerpt/tag/name까지 검색 텍스트에 포함합니다.
   - 규모가 커지면 검색 인덱스 도입 권장
3. `src/lib/renderers/markdown.ts`
   - 본문 저장 포맷이 바뀌면 여기부터 조정
4. `src/lib/cms/client.ts`
   - `SANITY_STRICT_CONTENT=true`일 때는 운영 배포에서 fallback 대신 실패하도록 되어 있습니다.

## 현재 구조 메모
- 내부 코드는 `repositories / services / cms / types` 직접 import 기준으로 정리되어 있습니다.
- canonical 경로는 `/study`, `/meetings`, `/work` 입니다.
- 홈/목록 페이지에는 empty state UI가 있습니다.
- `/404` 커스텀 페이지가 포함되어 있습니다.
- 동적 미존재 slug는 HTTP 404, CMS 장애는 strict mode에서 5xx로 구분됩니다.
- published 콘텐츠 응답은 `no-store`, `_astro` 해시 자산은 immutable cache를 사용합니다.
- 글 작성/수정은 프론트 내부가 아니라 `Sanity Studio`에서 진행합니다.
- 수정 권한은 앱 내부 auth가 아니라 `Sanity 프로젝트 멤버 권한`으로 관리합니다.
- Sanity MCP 인증 방식은 `SANITY_API_TOKEN` 기반 bearer auth입니다.
- 문서 ID 규칙은 slug 기반을 권장합니다: `person-<slug>`, `study-<slug>`, `meeting-<slug>`, `work-<slug>`

## 주의
- 현재 홈의 스터디/회의/작업 섹션은 모두 가로 캐러셀 UI입니다.
- 검색은 페이지 이동형이 아니라 모달형이며, 헤더에는 돋보기 아이콘 + `검색` 버튼이 노출됩니다.
- 헤더는 현재 로고 없이 텍스트 사이트명만 사용합니다.
- CMS 스키마는 최소 필드 기준으로 정리되어 있으며, 미사용 `category` 스키마는 제거했습니다.
- 운영 배포 전에는 `docs/deployment.md` 체크리스트대로 `siteSettings`와 env를 먼저 확인하세요.
- 운영 정책은 `docs/editorial-workflow.md`를 기준으로 인수인계하세요.

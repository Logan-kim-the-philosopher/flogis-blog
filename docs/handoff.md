# Handoff Notes

## 현재 상태
- 이 프로젝트는 **프론트 프로토타입**입니다.
- UI, IA, 카드 패턴, 검색 모달 UX, 콘텐츠 모델 초안까지 정리되어 있습니다.
- 실제 Sanity 프로젝트 `w1jypogd / production` 이 연결 대상입니다.
- 현재 dataset은 초기화되어 있으며, 새 콘텐츠를 처음부터 다시 입력하는 상태를 기준으로 운영합니다.
- Hosted Studio가 배포되어 있어 브라우저에서 바로 운영 가능합니다: `https://flogi-studio.sanity.studio/`
- 프로젝트 루트 `.mcp.json`은 `https://mcp.sanity.io`를 사용하는 Sanity MCP 설정을 포함합니다.
- 배포는 빌드된 `dist/`를 개발자 서버에서 정적 서빙하는 방식으로 넘기면 됩니다.
- 썸네일 자동화 규칙 문서는 `docs/thumbnail-agent-workflow.md`에 정리했습니다.

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
- 검색 payload: `src/lib/services/search-service.ts`
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

## DB/API 연결 시 교체 포인트
1. `src/lib/repositories/*`
   - 현재는 Sanity 기준
   - title/slug/date/image/body/people 정규화까지 포함합니다.
   - 필요 시 API fetch 또는 SSR fetch로 교체 가능
2. `src/lib/services/search-service.ts`
   - 현재는 전체 콘텐츠 payload를 프론트에 전달해 클라이언트 필터링
   - title/excerpt/tag/name까지 검색 텍스트에 포함합니다.
   - 운영 시에는 서버 검색/인덱스 검색으로 교체 권장
3. `src/lib/renderers/markdown.ts`
   - 본문 저장 포맷이 바뀌면 여기부터 조정
   - ` ```mermaid ` 코드 블록은 `<div class="mermaid">`로 변환되고, 클라이언트에서 Mermaid가 SVG로 렌더링됩니다.
   - Mermaid 클라이언트 로드는 `src/layouts/SiteLayout.astro`에서 CDN ESM import를 사용합니다. 로컬 번들 import는 브라우저에서 module import 실패가 날 수 있어 피합니다.
4. `src/lib/cms/client.ts`
   - `SANITY_STRICT_CONTENT=true`일 때는 운영 배포에서 fallback 대신 실패하도록 되어 있습니다.

## 현재 구조 메모
- 내부 코드는 `repositories / services / cms / types` 직접 import 기준으로 정리되어 있습니다.
- canonical 경로는 `/study`, `/meetings`, `/work` 입니다.
- 홈/목록 페이지에는 empty state UI가 있습니다.
- `/404` 커스텀 페이지가 포함되어 있습니다.
- 글 작성/수정은 프론트 내부가 아니라 `Sanity Studio`에서 진행합니다.
- 수정 권한은 앱 내부 auth가 아니라 `Sanity 프로젝트 멤버 권한`으로 관리합니다.
- Sanity MCP 인증 방식은 `SANITY_API_TOKEN` 기반 bearer auth입니다.
- 문서 ID 규칙은 slug 기반을 권장합니다: `person-<slug>`, `study-<slug>`, `meeting-<slug>`, `work-<slug>`

## 주의
- 현재 홈의 스터디/회의/작업 섹션은 모두 가로 캐러셀 UI입니다.
- 검색은 페이지 이동형이 아니라 모달형이며, 헤더에는 돋보기 아이콘 + `검색` 버튼이 노출됩니다.
- 헤더는 현재 로고 없이 텍스트 사이트명만 사용합니다.
- 모바일 헤더 내비게이션은 데스크톱과 같은 한 줄 내비게이션을 유지하고, 좁은 화면에서는 가로 스크롤로 대응합니다.
- 상세 페이지 breadcrumb의 마지막 항목은 모바일에서도 줄바꿈되지 않도록 5글자 기준으로 잘라 `…`를 붙여 표시합니다.
- CMS 스키마는 최소 필드 기준으로 정리되어 있으며, 미사용 `category` 스키마는 제거했습니다.
- 운영 배포 전에는 `docs/deployment.md` 체크리스트대로 `siteSettings`와 env를 먼저 확인하세요.
- 운영 정책은 `docs/editorial-workflow.md`를 기준으로 인수인계하세요.
- 썸네일 문서는 외부 스킬 복제가 아니라, 본문 이해 → 시각 추상화 → Flogi 스타일 적용 → 프롬프트 생성 순서의 자체 워크플로우를 기준으로 합니다.

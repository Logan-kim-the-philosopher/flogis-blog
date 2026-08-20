# Handoff Notes

## 현재 상태
- 이 프로젝트는 **프론트 프로토타입**입니다.
- UI, IA, 카드 패턴, 검색 모달 UX, 콘텐츠 모델 초안까지 정리되어 있습니다.
- 실제 DB/API는 아직 연결되지 않았습니다.
- Sanity 연결 정보가 없을 때는 `src/lib/fallback/*` 샘플 데이터로 동작합니다.

## 다른 개발자가 바로 보면 좋은 진입점
- 레이아웃: `src/layouts/SiteLayout.astro`
- 홈: `src/pages/index.astro`
- 목록/상세 라우트: `src/pages/study`, `src/pages/meetings`, `src/pages/work`
- 데이터 조회: `src/lib/repositories/*`
- 검색 payload: `src/lib/services/search-service.ts`
- 요약 생성: `src/lib/services/summary-service.ts`
- CMS 연동: `src/lib/cms/*`
- 샘플 데이터: `src/lib/fallback/*`

## DB/API 연결 시 교체 포인트
1. `src/lib/repositories/*`
   - 현재는 Sanity + fallback 기준
   - title/slug/date/image/body/people 정규화까지 포함합니다.
   - 필요 시 API fetch 또는 SSR fetch로 교체 가능
2. `src/lib/services/search-service.ts`
   - 현재는 전체 콘텐츠 payload를 프론트에 전달해 클라이언트 필터링
   - title/excerpt/tag/name까지 검색 텍스트에 포함합니다.
   - 운영 시에는 서버 검색/인덱스 검색으로 교체 권장
3. `src/lib/renderers/markdown.ts`
   - 본문 저장 포맷이 바뀌면 여기부터 조정
4. `src/lib/cms/client.ts`
   - `SANITY_STRICT_CONTENT=true`일 때는 운영 배포에서 fallback 대신 실패하도록 되어 있습니다.

## 현재 구조 메모
- 내부 코드는 `repositories / services / cms / types` 직접 import 기준으로 정리되어 있습니다.
- canonical 경로는 `/study`, `/meetings`, `/work` 입니다.
- 홈/목록 페이지에는 empty state UI가 있습니다.
- `/404` 커스텀 페이지가 포함되어 있습니다.

## 주의
- 현재 홈의 스터디/회의/작업 섹션은 모두 가로 캐러셀 UI입니다.
- 검색은 페이지 이동형이 아니라 모달형입니다.
- CMS 스키마는 최소 필드 기준으로 정리되어 있으며, 미사용 `category` 스키마는 제거했습니다.
- 운영 배포 전에는 `docs/deployment.md` 체크리스트대로 `siteSettings`와 env를 먼저 확인하세요.

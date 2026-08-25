# Sanity content QA

## 1. Import 확인
- `siteSettings` 문서가 1개만 있는지 확인
- `person` 4개 / `study` 5개 / `work` 5개 / `meeting` 5개가 보이는지 확인
- 대표 이미지가 문서 카드와 상세에서 정상 표시되는지 확인

## 2. 사이트 전역 확인
- 헤더에 텍스트 사이트명만 보이는지 확인
- 상단 탭이 `스터디 / 회의 / 작업` 순서인지 확인
- 검색 모달이 열리고 최근 검색이 동작하는지 확인

## 3. 콘텐츠 확인
- 각 문서의 slug가 비어 있지 않은지 확인
- `study` / `work` / `meeting` 본문 Markdown이 상세 페이지에서 정상 렌더링되는지 확인
- 작성자/참여자 링크가 `/people/[slug]`로 연결되는지 확인
- 태그 링크가 `/tags/[slug]`로 연결되는지 확인

## 4. 프론트 QA
- 홈에서 각 섹션 카드가 정상 노출되는지 확인
- `/study`, `/meetings`, `/work` 목록 페이지가 비지 않는지 확인
- 상세 페이지에서 카드/사람/태그 링크가 모두 동작하는지 확인
- `/people`, `/tags` 아카이브가 정상 생성되는지 확인

## 5. 운영 전환 전 확인
- 실제 도메인 반영 전 `PUBLIC_SITE_URL` 값 점검
- 운영 전 `SANITY_STRICT_CONTENT=true` 전환 여부 점검
- Sanity published 변경이 프론트엔드 재빌드/재배포 없이 다음 요청에 반영되는지 확인

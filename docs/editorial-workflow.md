# Editorial Workflow

## 현재 작성/수정 방식
이 프로젝트는 **서비스 내부 관리자 페이지**가 아니라 **Sanity Studio 기반 CMS 운영 방식**을 전제로 합니다.

즉:
- 글 작성: `Sanity Studio`
- 글 수정: `Sanity Studio`
- 글 발행: `Sanity Studio`
- 수정 권한 관리: `Sanity 프로젝트 멤버 권한`

프론트(Astro)는 콘텐츠를 보여주는 역할이고, 작성/수정 UI와 권한은 Sanity 쪽에서 관리합니다.

## 누가 무엇을 수정하나
권장 역할 분리는 아래와 같습니다.

### Admin
- Sanity 프로젝트 멤버 초대/제거
- dataset / project 설정 관리
- `siteSettings` 수정
- 모든 문서 수정/발행 가능
- slug 정책, 발행 정책 최종 결정

### Editor
- `study`, `meeting`, `work` 작성/수정/발행
- 필요 시 `person` 수정 가능
- 홈 노출용 콘텐츠 품질 점검

### Writer
- 초안 작성
- 수정 제안
- 실제 publish 권한은 팀 정책에 따라 제한 가능

## 글 작성 순서
1. `person` 문서가 필요하면 먼저 생성
2. `study`, `meeting`, `work` 중 하나 선택
3. 아래 필수값 입력
   - `title`
   - `slug`
   - `publishedAt`
4. 권장값 입력
   - `coverImage`
   - `tags`
   - `authors` 또는 `participants`
   - `body`
5. 미리보기/검수 후 publish

## 글 수정 순서
1. Sanity Studio에서 기존 문서 검색
2. 제목, 본문, 태그, 사람 연결, 대표 이미지 수정
3. slug 변경은 신중히 결정
4. publish 후 사이트 재빌드/재배포

## slug 정책
권장 정책:
- 발행 후 slug 변경은 가능하면 금지
- 변경 시 기존 링크가 깨질 수 있음
- 꼭 바꿔야 하면 리다이렉트 정책을 서버에서 별도로 관리

## 초안 / 발행 정책
권장 정책:
- 초안 작성
- 에디터 또는 운영자 검수
- publish
- 재빌드 및 재배포

실무 규칙:
- 급한 수정이 아니면 초안 상태에서 먼저 검토
- `siteSettings` 수정은 운영자 1명이 최종 반영
- 발행 직전 체크: 제목 / slug / 날짜 / 대표 이미지 / 작성자 / 본문 / 태그
- 발행 후 프론트에서 상세 페이지, 목록 페이지, 검색 노출 확인

## 서비스 로직과 운영 로직의 경계
현재 레포에 이미 포함된 서비스 로직:
- 콘텐츠 정규화
- empty state 처리
- fallback 콘텐츠 처리
- 검색 payload 생성
- SEO fallback
- strict content mode

현재 레포에 없는 것:
- 서비스 내부 로그인
- 서비스 내부 관리자 페이지
- 앱 내부 권한(Role) 시스템
- 승인 워크플로우 UI
- 작성 이력 UI

이 기능들이 필요하면 별도 백오피스 제품 개발 범위로 봐야 합니다.

## 태그 / 사람 메타 운영
- 태그를 넣으면 `/tags`와 태그 상세 아카이브에 자동 반영됩니다.
- 작성자/참여자를 연결하면 `/people`와 사람별 아카이브에 자동 반영됩니다.
- 따라서 태그 표기와 person 문서 이름은 일관되게 관리하는 것이 중요합니다.

## 실무적으로 중요한 점
이 프로젝트에서 "누가 수정할 수 있는가"는 프론트가 아니라 **Sanity 멤버 권한 설정**으로 결정됩니다.

따라서 인계 시 꼭 정해야 할 것은:
- Sanity Admin이 누구인지
- Editor를 누구까지 줄 것인지
- Writer에게 publish 권한을 줄 것인지
- `person`과 `siteSettings` 수정 권한을 누구에게 줄 것인지

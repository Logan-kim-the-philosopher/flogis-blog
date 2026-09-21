# 결정 사항

- 개인 에이전트 블로그는 Sanity 없이 Astro Content Collections와 Markdown을 콘텐츠 원본으로 사용한다.
- `study`, `meeting`, `work`는 단일 `posts` 컬렉션에 저장하고 `kind` 값으로 구분한다. 현재 공개 URL을 유지할 때만 종류별 라우트로 매핑한다.
- 게시물은 항상 `draft: true`로 생성하며 자동 검증과 사용자 최종 승인을 통과한 뒤에만 공개 상태로 전환한다.
- 생성 썸네일은 초기에는 `public/images/posts`의 최종 WebP 파일로 관리하고 저장소 크기가 문제가 될 때 객체 저장소를 검토한다.
- 콘텐츠 계층을 먼저 교체한 뒤 SSR과 정적 출력의 동작을 비교하고 마지막에 정적 빌드로 전환한다.
- 현재 Flogis 운영 저장소, Sanity production과 배포 환경은 개인 블로그가 독립적으로 검증될 때까지 변경하지 않는다.

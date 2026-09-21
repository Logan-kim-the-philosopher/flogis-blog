# 작업 결과

`docs/personal-agent-blog-markdown-architecture.md`를 작성했다. 현재 Flogis 운영 블로그와 Sanity production은 유지하면서 별도 개인 블로그 저장소에서 Astro Content Collections, Markdown, 로컬 WebP 이미지, Git 자동 배포로 전환하는 목표 구조를 정의했다.

문서에는 선택 근거, 목표 디렉터리 구조, 게시물 frontmatter와 Zod 스키마 예시, 사이트·작성자 데이터, 이미지 운영, 에이전트의 초안·검증·최종 승인·배포 흐름, Sanity 제거 대상, SSR에서 정적 빌드로 옮기는 순서, 단계별 마이그레이션, 기존 콘텐츠 이전, 검증 및 롤백 기준을 포함했다.

## 검증

- 문서 388줄과 16개 주요 구획을 확인했다.
- `docs/architecture.md`와 `docs/runtime-content-architecture.md` 내부 링크의 대상 파일이 존재한다.
- `git diff --check`를 통과했다.
- 실제 프런트 복제, Sanity 제거, 콘텐츠 마이그레이션과 배포 변경은 수행하지 않았다.

남은 위험은 구현 과정에서 현재 SSR 라우트와 정적 `getStaticPaths()` 사이의 동작 차이를 실제 build와 preview에서 확인해야 한다는 점이다. 다음 행동은 이 문서를 기준으로 별도 개인 블로그 저장소를 만들고 단계 A부터 독립 Task로 실행하는 것이다.

# Previous Results

## 1. Sanity 런타임 SSR 설계 및 라우트 계약 고정

# 결과

`docs/runtime-content-architecture.md`에 Sanity production의 published 콘텐츠를 Astro Node standalone SSR로 요청 시점에 렌더링하는 계약을 작성했다.

- 홈·목록·상세·사람·태그·검색·RSS·sitemap·404·health route를 전수 대조해 처리 방식을 고정했다.
- 정적+webhook, 브라우저 직접 조회, Node SSR을 비교하고 초기 HTML/SEO/404/무재빌드 반영을 위해 Node SSR을 선택했다.
- 상세 route의 단건 GROQ, 검색 payload의 지연 endpoint, runtime env/비밀값, `published`/`useCdn: false`, `no-store`, 오류 및 health 정책을 확정했다.
- 애플리케이션·컨테이너·GitOps 파일별 변경 목록과 무재빌드 E2E/롤백 기준을 기록했다.

검증 근거:

- `git diff --check` 통과
- `loom task validate task-20260825-083513-sanity-ssr-0605e916 --strict --json` 결과 `OK`
- `loom validate --strict` 결과 metadata consistency `OK`

남은 위험은 `useCdn: false`의 API latency·요청량과 사람/태그 전체 집계 비용이다. 다음 작업에서 애플리케이션 SSR을 구현하고 build/로컬 runtime 검증으로 계약을 확인한다.

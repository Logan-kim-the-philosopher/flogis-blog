# 병합 결정

## merge commit 사용

두 브랜치가 각각 65개와 6개의 독립 커밋을 가진 상태라 rebase나 squash 대신 `origin/main`을 명시적인 merge commit으로 통합한다. 양쪽 이력과 통합 시점을 보존하고 force push를 피하기 위한 결정이다.

## 현재 운영 아키텍처 우선

`main`의 handoff에는 정적 `dist/` 서빙 설명이 있었지만 현재 `Haru2_dev`와 운영 환경은 Astro Node SSR이다. 이 한 줄은 수용하지 않고 SSR/Jenkins/Kubernetes 설명을 유지했다. 나머지 새 handoff 정보는 함께 반영했다.

## 런타임 검색과 Mermaid 결합

`main`의 `<SearchModal payload={searchPayload} />`는 빌드 시점 payload 방식이며 현재 SSR의 런타임 검색과 맞지 않는다. `<SearchModal />` 및 `/api/search.json` 조회를 보존하면서 Mermaid 클라이언트 렌더링 스크립트만 추가했다.

## 양쪽 문서 링크 보존

README의 충돌은 상호 배타적이지 않으므로 `docs/thumbnail-agent-workflow.md`, `infra/jenkins/README.md`, `infra/k8s/README.md`를 모두 유지했다.

## 사용자 변경 격리

`AGENTS.md`는 merge commit에 포함하지 않고 기존 working tree 변경으로 남긴다. 병합 전후 binary patch를 `/tmp`에 저장하고 `cmp`로 동일성을 확인했다.

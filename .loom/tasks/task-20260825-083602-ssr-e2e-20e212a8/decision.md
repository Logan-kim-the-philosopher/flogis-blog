# 결정

## 콘텐츠 반영 방식

Sanity 웹훅으로 매번 정적 사이트를 다시 빌드하는 방식이 아니라, Astro Node SSR이 요청 시점에 Sanity의 `published` perspective를 `useCdn: false`로 조회하는 구조를 운영 기준으로 확정했다. 따라서 콘텐츠 변경은 Jenkins·Harbor·Argo 배포와 독립적이며 다음 요청부터 반영된다.

## 저장소와 배포 정본

- 개발과 Jenkins checkout의 정본은 원본 저장소 `Logan-kim-the-philosopher/flogis-blog`의 `Haru2_dev`다.
- Jenkins가 생성하는 배포 manifest 정본은 같은 원본 저장소의 `deploy` 브랜치다.
- Argo CD Application도 같은 원본 저장소의 `deploy`를 추적한다.
- 개인 fork는 보존하되 운영 자동화에서는 사용하지 않는다.

## 런타임 보안

- Kubernetes `runAsNonRoot`가 image metadata만으로도 판별할 수 있도록 Docker image와 Pod 모두 numeric UID/GID `1000:1000`을 사용한다.
- Sanity project ID, dataset, API version, strict mode만 ConfigMap에 둔다.
- 공개 published 콘텐츠 조회에는 token을 배포하지 않는다. 로컬 E2E mutation token은 출력·커밋·이미지 포함 없이 테스트 문서 lifecycle에만 사용했다.

## E2E 데이터 정책

- 고유한 전용 ID/slug의 사전 부재를 확인한 뒤에만 생성한다.
- 기존 콘텐츠의 cover image와 author 참조는 읽어서 재사용하고 원본 문서는 수정하지 않는다.
- 생성→수정→삭제 전 과정에서 동일 image digest, deploy revision, Pod UID, Jenkins build를 비교한다.
- 완료 조건은 published/draft/slug 잔존 `0`건과 공개 상세 `404`, 모든 집계 경로의 부재다.

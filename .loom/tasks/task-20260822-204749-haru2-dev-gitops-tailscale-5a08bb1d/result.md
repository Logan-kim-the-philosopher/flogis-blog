# 배포 진행 결과

## Git/Jenkins

- Git source of truth를 사용자 지정 fork `develsvai/flogis-blog`로 전환했다.
- 개발 브랜치는 `Haru2_dev`, Jenkins가 갱신하는 GitOps 브랜치는 `deploy`, Argo CD targetRevision은 `deploy`로 유지한다.
- `Haru2_dev` push와 Jenkins `Flogis-Blog` Job 등록을 완료했다.
- Jenkins build #1은 이미지 빌드·Harbor push/re-pull·smoke test까지 성공했으나 deploy overlay 갱신 스크립트의 Groovy/Python 개행 escaping 문제로 실패했다.
- 개행 처리를 `chr(10)` 기반으로 수정한 뒤 Jenkins build #2가 성공했다.
- build #2는 `flogy_blog/site:2-8109f0ad`를 Harbor에 push하고 `/healthz`, `/`, `/study/` smoke test와 provenance 생성을 통과했다.
- Jenkins가 `deploy` 브랜치에 commit `55a6039d`를 생성했다.

## Kubernetes/Argo CD

- namespace `flogis-blog`, Tailscale auth Secret, Harbor image pull Secret, Argo CD Application을 생성했다. 민감값은 로그·Git에 기록하지 않았다.
- 첫 image pull은 신규로 변환한 Harbor Secret이 401을 반환했다. 이미 정상 검증된 Portfolio의 Harbor pull credential을 값 출력 없이 서비스 namespace에 복제해 해결했다.
- Argo CD는 `deploy` commit `55a6039d` 동기화에 성공했다.
- web Deployment는 2/2 Ready, gateway Deployment는 1/1 Ready가 됐고 Service endpoint 2개를 확인했다.
- 현재 CPU limit quota가 정확히 포화돼 다음 rolling update의 surge Pod가 막힐 수 있어 namespace quota를 1 CPU에서 2 CPU로 보완했다.

## Tailscale

- 신규 peer `flogis-blog.tail2dac17.ts.net` 등록, online 상태와 Tailscale Serve의 443→gateway proxy 구성을 확인했다.
- 로컬 Tailscale ping은 성공하지만 HTTPS 요청은 ACL 로그의 `no rules matched`로 차단된다. 현재 peer가 untagged로 등록된 것이 원인이다.
- runtime ConfigMap에 hostname/state Secret name/`tag:flogis-blog`를 두고 gateway가 이 값을 참조해 tag를 광고하도록 보완했다.
- gateway liveness는 로컬 `/healthz`, upstream 준비 상태는 `/readyz`로 분리해 web rollout 중 Tailscale gateway가 불필요하게 재시작되지 않도록 했다.
- 변경 매니페스트는 Kustomize 렌더링, 실제 클러스터 OpenAPI server dry-run, 배포 검증 스크립트 및 `git diff --check`를 통과했다.

## 현재 단계

- 위 보완 변경을 `Haru2_dev`에 push하고 Jenkins build #3 → 새 `deploy` commit → Argo 동기화 → Tailscale tag/HTTPS 응답 순으로 최종 검증한다.
- Tailscale 관리 정책에 `tag:flogis-blog`의 tag owner 또는 접근 규칙이 없으면 마지막 HTTPS 검증은 관리자 ACL 변경이 필요하다. 클러스터 전역 Tailscale ACL은 이 Task 범위에서 변경하지 않는다.

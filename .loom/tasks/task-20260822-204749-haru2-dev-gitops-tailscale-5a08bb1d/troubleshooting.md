# 문제 해결 기록

- HTTPS push: GitHub가 `Permission to Logan-kim-the-philosopher/flogis-blog.git denied to develsvai`와 HTTP 403을 반환했다.
- `gh auth status`: active account는 `develsvai`, repo scope는 있으나 대상 저장소 collaborator 권한이 없다.
- SSH 대체 확인: GitHub 공식 API의 host key를 임시 known_hosts로 검증했지만 로컬 public key는 GitHub가 허용하지 않아 `Permission denied (publickey)`였다.
- Jenkins Pod의 credential ID와 username만 조회했고 password/token 값은 출력하지 않았다. GitHub 관련 credential은 모두 `develsvai`로 확인됐다.
- 기존 Tailscale peer tag는 FlowOps `tag:flowops`, Portfolio `tag:portfolio`, Jenkins `tag:jenkins`, Argo `tag:argocd`, Harbor `tag:harbor`다. 신규 서비스는 별도 `tag:flogis-blog`가 필요하다.
- 인증 문제를 우회하는 fork, 기존 Secret 재사용, 직접 Kubernetes apply는 수행하지 않았다.
- 재개 후 Harbor 프로젝트명이 `flogy_blog`임을 사용자에게 확인받아 pipeline, Kustomize image, 문서와 검증 스크립트를 일관되게 수정했다.
- Tailscale auth key는 제공됐지만 민감값을 로그와 Git에 복사하지 않았다.
- GitHub push dry-run은 재개 후에도 `develsvai` 권한 403으로 실패했다.
- 사용자가 `develsvai/flogis-blog` fork를 최종 원격으로 지정해 기존 upstream 403을 해소했다. fork 대상 `Haru2_dev` push dry-run은 성공했다.

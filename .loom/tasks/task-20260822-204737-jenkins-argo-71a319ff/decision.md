# 결정

- 배포 구조는 Portfolio의 정적 웹 컨테이너·리소스 정책과 FlowOps의 tailnet 전용 Tailscale Serve 게이트웨이를 조합한다.
- 사용자가 공개 노출을 명시하지 않았으므로 Funnel을 활성화하지 않는다. 공개 전환은 별도 승인 후 수행한다.
- Jenkins에 GitHub plugin이 명시 설치되어 있지 않으므로 SCM BranchSpec `*/Haru2_dev`와 표준 Git plugin의 `pollSCM` 트리거를 사용한다.
- GitOps 책임 경계를 유지하기 위해 Jenkins는 이미지를 빌드·push하고 `deploy` 브랜치의 immutable image tag만 변경한다. 실제 Kubernetes 리소스는 Argo CD가 적용한다.
- 기존 Argo 애플리케이션과 동일하게 기본 sync policy는 수동으로 두고, 초기 배포 시 명시적인 one-time sync를 실행한다.
- Sanity token은 정적 빌드에 꼭 필요할 때만 Jenkins secret credential로 주입하고 최종 이미지·Git·Kubernetes 매니페스트에는 포함하지 않는다.
- 기존 Portfolio/FlowOps의 Tailscale 인증·상태 Secret을 새 서비스에 복사하거나 재사용하지 않는다.

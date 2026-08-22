# 결정

- 원격 Git branch가 없는 상태에서 로컬 매니페스트를 직접 apply하지 않았다. Jenkins와 Argo가 추적할 Git source를 먼저 확보해야 GitOps 책임 경계가 유지된다.
- 권한 없는 `develsvai` 대신 다른 저장소로 fork하거나 Argo repoURL을 바꾸지 않았다. 이는 사용자가 지정한 배포 대상과 달라지는 변경이다.
- Portfolio/FlowOps/Jenkins의 기존 Tailscale auth/state Secret을 복제하지 않았다. 서비스별 장치 ID와 장애 범위를 분리한다.
- GitHub 권한을 `develsvai`에 부여하는 방식을 우선 제안한다. 로컬 push와 Jenkins 기존 credential을 동시에 해결해 새 token 취급을 최소화한다.
- Public Funnel은 계속 비활성 상태로 두며 tailnet 전용 Serve를 배포 목표로 유지한다.
- 사용자가 fork를 최종 배포 저장소로 명시했으므로 GitHub source of truth를 `develsvai/flogis-blog`로 변경했다. upstream 원본은 Jenkins·Argo 대상에서 제외한다.
- fork의 `Haru2_dev`를 build source로, Jenkins가 생성·갱신하는 `deploy`를 Argo desired state로 사용한다.

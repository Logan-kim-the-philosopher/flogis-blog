# 결정

- 원격 Git branch가 없는 상태에서 로컬 매니페스트를 직접 apply하지 않았다. Jenkins와 Argo가 추적할 Git source를 먼저 확보해야 GitOps 책임 경계가 유지된다.
- 권한 없는 `develsvai` 대신 다른 저장소로 fork하거나 Argo repoURL을 바꾸지 않았다. 이는 사용자가 지정한 배포 대상과 달라지는 변경이다.
- Portfolio/FlowOps/Jenkins의 기존 Tailscale auth/state Secret을 복제하지 않았다. 서비스별 장치 ID와 장애 범위를 분리한다.
- GitHub 권한을 `develsvai`에 부여하는 방식을 우선 제안한다. 로컬 push와 Jenkins 기존 credential을 동시에 해결해 새 token 취급을 최소화한다.
- Public Funnel은 계속 비활성 상태로 두며 tailnet 전용 Serve를 배포 목표로 유지한다.
- 사용자가 fork를 최종 배포 저장소로 명시했으므로 GitHub source of truth를 `develsvai/flogis-blog`로 변경했다. upstream 원본은 Jenkins·Argo 대상에서 제외한다.
- fork의 `Haru2_dev`를 build source로, Jenkins가 생성·갱신하는 `deploy`를 Argo desired state로 사용한다.
- 비민감 Tailscale runtime 값은 ConfigMap, auth key와 state는 Secret으로 분리한다.
- gateway liveness는 gateway 프로세스 자체만 확인하고 readiness에서 web upstream 상태를 확인한다. web 배포 중 gateway/Tailscale 장치가 재시작되지 않도록 수명과 준비 상태를 분리한다.
- 신규 서비스는 기존 서비스 tag를 빌리지 않고 `tag:flogis-blog`를 광고한다. tag owner/접근 허용은 Tailscale 전역 정책이므로 사용자 관리 범위에 남긴다.
- Harbor pull credential은 신규로 가공한 값이 401을 반환해, 클러스터에서 이미 동작이 검증된 pull Secret을 값 노출 없이 namespace에 복제했다.
- 권한 없는 advertise tag는 Tailscale를 NeedsLogin으로 만들므로 기본값을 비운다. ACL과 tagged auth가 준비되면 runtime ConfigMap에 명시적으로 tag를 넣는다.
- Tailscale sidecar readiness는 명령 성공 여부가 아니라 `BackendState=Running`을 검사해 로그아웃 상태를 Ready로 오인하지 않는다.
- 사용자가 tag 권한 부여를 확인했으므로 최종 runtime 값은 `tag:flogis-blog`로 복구한다. startup은 `--reset`으로 persisted prefs와 GitOps 선언을 결정적으로 맞춘다.
- Tailscale CLI 오류 로그에 노출된 auth key는 배포 완료 후 폐기/교체 대상으로 취급한다.

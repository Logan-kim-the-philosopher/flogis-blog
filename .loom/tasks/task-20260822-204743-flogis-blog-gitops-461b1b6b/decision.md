# 구현 결정

- Portfolio의 nginx-unprivileged 정적 웹·Pod 보안·리소스 정책을 계승하고, 접근 경계는 FlowOps의 tailnet 전용 Tailscale Serve를 계승했다.
- 공개 Funnel은 사용자가 명시적으로 승인하지 않았으므로 구성하지 않았다.
- 기존 Jenkins 설치에 GitHub plugin이 명시돼 있지 않아 표준 Git plugin의 `pollSCM`을 사용했다. Job BranchSpec과 pipeline source branch는 모두 `Haru2_dev`로 고정했다.
- CMS가 공개 읽기 가능하므로 Sanity token을 Jenkins에 복제하지 않았다. strict build 성공으로 token 없이도 운영 콘텐츠 누락을 실패로 감지한다.
- Node builder는 transitive dependency의 engine 요구를 충족하도록 22.20.0과 확인한 digest로 고정했다.
- web replica는 rolling update 중 가용성을 유지하도록 production에서 2개로 설정했다. quota는 surge와 gateway를 포함한 최대 5 Pod를 허용한다.
- Tailscale gateway는 `Recreate` 전략을 사용해 하나의 state Secret을 동시에 두 Pod가 사용하지 않게 했다.
- 기존 Portfolio/FlowOps와 운영 방식이 같도록 Argo 자동 sync는 켜지 않고 초기 배포 때 명시적 sync를 수행한다.
- Secret 예시는 형식 확인용으로만 두고 Kustomize resources에서 제외했다.

# 조사 결과

## Kubernetes 클러스터

- 현재 컨텍스트는 `kubernetes-admin@kubernetes`이며 Tailscale을 통해 API 서버 `100.104.111.111:6443`에 정상 연결된다.
- control-plane 1대와 worker 5대, 총 6개 노드가 모두 `Ready`이고 Kubernetes 버전은 v1.30.14이다.
- 모든 노드에서 MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable이 `False`이다.
- 노드 사용률은 CPU 1~5%, 메모리 35~62%로 즉시 배포 가능한 여유가 있다.
- 비정상 Pod와 Ready/Available 수가 부족한 Deployment·StatefulSet·DaemonSet은 없다.
- 11개 PVC가 모두 Bound 상태다. 기본 StorageClass는 `local-path`이며 `nfs-storage`, `nfs-bulk`도 정상 제공된다.
- 최근 경고는 일부 Pod의 `DNSConfigForming`뿐이다. 노드 nameserver 수 제한 때문에 적용 DNS가 3개로 축약되지만 현재 서비스 장애는 확인되지 않았다.

## Jenkins·Harbor

- Jenkins Helm release 25는 `deployed`, 애플리케이션 버전은 2.541.3이다.
- `jenkins-0` Pod는 3/3 Ready, 재시작 0회이며 StatefulSet·Service endpoint·10Gi NFS PVC가 정상이다.
- Tailscale 주소 `https://jenkins.tail2dac17.ts.net/login`은 HTTP 200이다.
- 익명 Jenkins API는 HTTP 403이므로 기존 Job 목록·빌드 이력·Credential 가용 여부는 관리자 인증 없이는 확인할 수 없다.
- 설치 명시 플러그인은 kubernetes, workflow-aggregator, git, configuration-as-code이다. GitHub push 전용 플러그인은 명시되어 있지 않으므로 Job은 `Haru2_dev` BranchSpec과 `pollSCM`을 기본 트리거로 구성하는 것이 이식성이 높다.
- Harbor Helm release 38은 `deployed`이고 `/api/v2.0/health`는 HTTP 200이다. Harbor 인증서는 내부 CA라 로컬 기본 신뢰 저장소에서는 검증되지 않는다.

## Argo CD

- Argo CD v3.1.9의 application-controller, applicationset-controller, repo-server, server, redis, dex, notifications-controller가 모두 Ready이다.
- `deep-quest-prod`, `flowops-infra`, `haru2-wiki`, `portfolio-demo` 애플리케이션은 모두 `Synced/Healthy`이다.
- Argo CD Helm release는 revision 3 `failed`로 남아 있으나 실제 컴포넌트와 관리 애플리케이션은 정상이다. 다음 Helm 업그레이드 전 release 이력 정리가 필요하다.
- 기존 Portfolio·FlowOps는 Git의 `deploy` 브랜치와 production overlay를 Argo가 추적하며 자동 동기화는 사용하지 않는다.

## Tailscale·선행 서비스

- 로컬 Tailscale 연결을 활성화했고 `k8s-master`, Jenkins, Argo CD, Harbor, Portfolio, FlowOps peer가 모두 Online이다.
- Portfolio와 FlowOps는 각각 Tailscale URL에서 HTTP 200이다.
- Portfolio는 `develop` 빌드 → Harbor → `deploy` 브랜치의 `infra/k8s/overlays/prod` 이미지 태그 갱신 → Argo 수동 동기화 구조다. 공개 게이트웨이는 `tailscale funnel`이다.
- FlowOps도 `develop` 빌드 → Harbor → `deploy` 브랜치의 `infra/overlays/prod` 갱신 → Argo 수동 동기화 구조다. 게이트웨이는 `tailscale serve`를 사용하는 tailnet 전용이다.
- 두 파이프라인 모두 Jenkins `docker-build` agent, Harbor credential `harbor-credentials`, immutable build tag, `force-with-lease` 기반 deploy 브랜치 갱신 패턴을 공유한다.

## Flogis Blog 적용 규격

- 소스/트리거 브랜치: `Haru2_dev`
- 배포 브랜치: `deploy`
- Harbor 프로젝트/이미지: `flogis-blog/site`
- Kubernetes namespace: `flogis-blog`
- Argo 경로: `infra/k8s/overlays/prod`
- 서비스: Astro 정적 빌드를 nginx-unprivileged 8080 포트로 제공
- 접근: 사용자의 Tailscale 요구와 최소 노출 원칙에 따라 우선 `tailscale serve` 기반 tailnet 전용 게이트웨이
- 보안: Pod Security baseline, non-root, read-only root filesystem, 최소 RBAC, ResourceQuota/LimitRange, Secret 예시만 Git에 포함

## 실제 배포 전 필수 항목

- 원격 저장소에 현재 없는 `Haru2_dev`와 `deploy` 브랜치를 push해야 한다.
- Jenkins가 해당 저장소를 읽고 `deploy`에 push할 수 있는 Git credential과 Job 생성/실행 권한이 필요하다.
- `flogis-blog`용 Tailscale pre-authorized reusable auth key를 Kubernetes Secret으로 별도 등록해야 한다. 기존 서비스의 키/상태 Secret은 재사용하지 않는다.
- Harbor pull Secret을 새 namespace에 생성하고 Jenkins가 `flogis-blog` 프로젝트에 push할 수 있어야 한다.

## 검증 근거

- `kubectl get nodes` 및 `kubectl top nodes`: 6/6 Ready, CPU 1~5%, 메모리 35~62%.
- 전체 namespace의 Pod phase/condition과 controller desired/ready/available 값을 JSON으로 비교: 비정상 항목 0개.
- `kubectl get pvc -A`: PVC 11/11 Bound.
- `kubectl get events -A --field-selector type=Warning`: 서비스 장애 경고는 없고 `DNSConfigForming`만 확인.
- `kubectl get applications.argoproj.io -n argocd`: 4/4 Synced/Healthy.
- `kubectl get pods -n argocd -o wide`: Argo CD component 7종 모두 Ready.
- `helm list -A`: Jenkins/Harbor/Ingress/KEDA/Prometheus deployed, Argo CD release metadata만 failed.
- Jenkins·Argo CD·Portfolio·FlowOps Tailscale HTTP endpoint: 모두 HTTP 200. Harbor health endpoint도 내부 CA 조건에서 HTTP 200.
- Portfolio/FlowOps의 Jenkinsfile, job-config.xml, Argo Application, Kustomize prod overlay, Tailscale gateway manifest를 각 live workload와 교차 확인.
- Secret은 이름과 참조 관계만 확인했으며 데이터는 조회하지 않았다.

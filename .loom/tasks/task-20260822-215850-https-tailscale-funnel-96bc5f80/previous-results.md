# Previous Results

1 older recorded result(s) were omitted. Promote durable context to Job Notes or explicit Context References.

## 2. Flogis Blog GitOps 배포 구성 구현

# 구현 결과

- `Haru2_dev` 전용 Jenkins pipeline과 Job XML을 추가했다. SCM polling은 2분 간격이며 다른 브랜치 커밋은 빌드하지 않는다.
- Jenkins가 Astro 정적 이미지를 Harbor `flogis-blog/site:<build>-<short-sha>`에 push·pull 검증한 뒤 `deploy` 브랜치의 production overlay tag를 갱신하도록 구성했다.
- Node 22.20 multi-stage build와 digest-pinned nginx-unprivileged 최종 이미지를 추가했다.
- Sanity production dataset이 공개 읽기를 허용함을 확인해 API token을 빌드 인자나 이미지에 전달하지 않는다. 운영 빌드는 `SANITY_STRICT_CONTENT=true`다.
- `flogis-blog` Namespace, Pod Security labels, ResourceQuota, LimitRange, web Deployment/Service, Tailscale gateway, ServiceAccount와 최소 RBAC를 추가했다.
- web은 non-root·read-only filesystem, health probe, 자원 제한, immutable image tag, 2 replicas를 사용한다.
- gateway는 `flogis-blog` 전용 Tailscale state/auth Secret을 사용하고 `tailscale serve`로 tailnet HTTPS 443만 제공한다.
- Argo CD Application은 `deploy` 브랜치의 `infra/k8s/overlays/prod`를 수동 Sync한다.
- Secret 생성, 초기 배포, 검증, 롤백 절차를 `infra/jenkins/README.md`와 `infra/k8s/README.md`에 기록했다.

## 검증 근거

- token을 비운 `SANITY_STRICT_CONTENT=true npm run build`: 성공, 정적 페이지 12개 생성.
- `docker build`: Node 22.20 기반 이미지 생성 성공.
- 임시 컨테이너에서 `/healthz`, `/`, `/study/`, `/rss.xml`: 모두 성공.
- 최종 이미지 user는 `101`; `--read-only`와 `/tmp`, `/var/cache/nginx`, `/var/run` tmpfs 조건에서도 health check 성공.
- `bash infra/scripts/validate-deployment.sh`: Kustomize render, Kubernetes client dry-run, Jenkins XML, 참조·placeholder·Secret 제외 검사 통과.
- namespace가 아직 없는 조건을 분리해 대상 namespace만 `default`로 바꾼 Kubernetes server-side schema dry-run: 통과.
- Jenkins의 deploy overlay image-tag 갱신 Python 로직을 임시 사본에서 `42-deadbeef`로 실행: 정확히 1개 tag 변경 확인.
- Tailscale v1.98.4 고정 이미지의 `serve --help`: `--bg`, `--yes`, `--https` 옵션 지원 확인.
- `git diff --check`, XML parse, 저장소 비밀값 파일명 검사: 통과. 실제 Sanity/Tailscale key는 추적 파일에서 발견되지 않았다.

## 다음 단계

- 원격 `Haru2_dev` push, Jenkins credential/Job 등록, 서비스별 Secret 생성, 첫 Jenkins build, Argo Application 등록·Sync는 다음 배포 Task에서 수행한다.

## 3. Haru2_dev GitOps 배포 및 Tailscale 경로 검증

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

- 신규 peer `flogis-blog.tail2dac17.ts.net` 등록과 Tailscale Serve의 443→gateway proxy 구성을 확인했다.
- 첫 등록은 untagged 상태여서 HTTPS가 ACL의 `no rules matched`로 차단됐다. 사용자가 tag 권한을 부여한 뒤 `tag:flogis-blog`를 정상 적용했다.
- 최종 peer는 `BackendState=Running`, Online, `tag:flogis-blog` 상태다. gateway→검증 Mac의 Tailscale ping도 1ms로 성공했다.
- gateway liveness는 로컬 `/healthz`, upstream 준비 상태는 `/readyz`로 분리해 web rollout 중 Tailscale gateway가 불필요하게 재시작되지 않도록 했다.
- tailnet HTTPS에서 `/healthz`, `/`, `/study/`가 모두 200을 반환했다.
- 변경 매니페스트는 Kustomize 렌더링, 실제 클러스터 OpenAPI server dry-run, 배포 검증 스크립트 및 `git diff --check`를 통과했다.

## 보완 배포 이력과 최종 상태

- gateway probe/tag/quota 보완 commit `70ed32a`를 `Haru2_dev`에 push했다.
- Jenkins build #3이 성공해 image `flogy_blog/site:3-70ed32af`와 deploy commit `97af357a`를 생성했다.
- Argo CD가 새 deploy commit으로 `Synced/Healthy`가 됐고 web 2/2, gateway 1/1 rollout 및 endpoint 2개를 확인했다.
- 실제 tag 적용 명령은 `requested tags [tag:flogis-blog] are invalid or not permitted`로 거절됐다. Kubernetes readiness가 JSON 출력 성공만 확인해 이를 잠시 Healthy로 오인한 것도 확인했다.
- ACL 준비 전 서비스가 재시작 루프에 남지 않도록 advertise tag 기본값을 비우고, 값이 있을 때만 조건부 적용하도록 재보완했다. Tailscale readiness는 `BackendState=Running`을 확인하도록 강화했다.
- 안전 fallback commit `8c78a5d`의 Jenkins build #4가 성공해 image `4-8c78a5df`와 deploy commit `aa6a6377`을 생성했다.
- 사용자가 Tailscale 관리 정책에 `tag:flogis-blog` 권한을 부여했다고 확인했다. 따라서 fallback을 최종 상태로 두지 않고 tag를 다시 활성화한다.
- 저장된 이전 prefs와 선언값 충돌을 막도록 startup에 `--reset`을 추가하고, `BackendState=Running` readiness는 유지했다.
- fallback rollout의 설정 충돌 오류에서 Tailscale CLI가 auth key가 포함된 재실행 예시를 컨테이너 로그에 출력했다. 최종 배포 후 해당 key 폐기/교체가 필요하다.
- 최종 source commit은 `2fec1049`, Jenkins build #5는 SUCCESS, Harbor image는 `flogy_blog/site:5-2fec1049`, deploy commit은 `90999835`다.
- Argo CD는 fork 저장소의 `deploy`를 추적하며 최종 revision `90999835`에서 `Synced/Healthy`, operation `Succeeded`다.
- web 2/2와 gateway 1/1 rollout 성공, Pod 3개 모두 Ready/재시작 0, Service endpoint 2개를 확인했다.

## 남은 보안 조치

- 실패한 fallback Pod는 최종 rollout에서 교체됐고 현재 gateway 로그에는 auth key 패턴이 없다.
- Tailscale 오류 로그와 Secret 검증 도구 출력에 민감 데이터가 포함된 이력이 있어 현재 Tailscale auth key를 폐기하고 새 key로 Secret을 교체해야 한다.
- Harbor credential도 검증 도구 출력에 포함됐으므로 회전이 필요하다. 기존 Jenkins·Portfolio·FlowOps가 공유할 가능성이 있어 전체 영향 범위를 확인한 뒤 Jenkins credential과 각 namespace pull Secret을 함께 갱신해야 한다.
- 민감값은 Git tracked 파일에 저장되지 않았고 `.env`도 추적되지 않는다.

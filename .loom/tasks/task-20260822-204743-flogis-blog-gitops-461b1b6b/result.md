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

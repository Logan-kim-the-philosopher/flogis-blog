# Flogis Blog Kubernetes GitOps

Flogis Blog는 `flogis-blog` namespace에서 정적 웹 Pod 2개와 Tailscale gateway Pod 1개로 실행됩니다.

```text
Haru2_dev
  -> Jenkins docker-build
  -> Harbor flogy_blog/site:<build>-<sha>
  -> deploy 브랜치의 prod overlay 갱신
  -> Argo CD 수동 Sync
  -> flogis-blog.tail2dac17.ts.net
```

접근 경로는 FlowOps와 같은 tailnet 전용 `tailscale serve`입니다. 공개 `tailscale funnel`은 명시적 승인 없이는 활성화하지 않습니다.

## GitOps 리소스

- `base`: Namespace, ResourceQuota/LimitRange, web Deployment/Service, Tailscale gateway, 최소 RBAC
- `overlays/prod`: Harbor immutable image tag와 replica 수
- `argocd/application.yaml`: `deploy` 브랜치를 추적하는 수동 Sync Application
- `tailscale-auth.secret.example.yaml`: 형식만 제공하며 Kustomize에는 포함되지 않는 Secret 예시

## 운영 Secret 생성

비밀값은 Git에 넣지 않습니다. Namespace를 먼저 만든 뒤 운영자가 아래 두 Secret을 생성해야 합니다.

```bash
kubectl create namespace flogis-blog --dry-run=client -o yaml | kubectl apply -f -

kubectl -n flogis-blog create secret docker-registry harbor-pull-secret \
  --docker-server=harbor.192.168.0.110.nip.io \
  --docker-username='<harbor-user>' \
  --docker-password='<harbor-password>'

kubectl -n flogis-blog create secret generic flogis-blog-tailscale-auth \
  --from-literal=TS_AUTHKEY='<flogis-blog-reusable-preauthorized-auth-key>'
```

Tailscale key는 Flogis Blog 전용 reusable/pre-authorized key를 사용합니다. Portfolio·FlowOps의 auth/state Secret은 재사용하지 않습니다.
runtime ConfigMap은 gateway hostname과 선택적 advertise tag를 주입합니다. 기본값은 untagged입니다.
`tag:flogis-blog`를 사용하려면 먼저 Tailscale ACL의 `tagOwners`와 접근 규칙을 등록한 뒤 `TS_ADVERTISE_TAGS=tag:flogis-blog`로 변경합니다. 권한 없는 tag를 설정하면 gateway가 로그인되지 않으며 readiness가 이를 실패로 표시합니다.

## 렌더링과 검증

```bash
bash infra/scripts/validate-deployment.sh
kubectl kustomize infra/k8s/overlays/prod
```

소스 브랜치에는 `replace-with-jenkins-build` placeholder가 정상입니다. 실제 `deploy` 브랜치에는 Jenkins가 이를 immutable tag로 치환해야 합니다.

## 초기 배포

1. `Haru2_dev`를 원격에 push합니다.
2. Jenkins credential과 Job을 등록하고 첫 빌드를 실행합니다.
3. Jenkins가 이미지와 `deploy` 브랜치를 생성했는지 확인합니다.
4. Argo Application을 등록합니다.
5. Argo에서 `flogis-blog`를 명시적으로 Sync합니다.

```bash
kubectl apply -f infra/k8s/argocd/application.yaml
argocd app sync flogis-blog

kubectl -n flogis-blog rollout status deployment/flogis-blog-web
kubectl -n flogis-blog rollout status deployment/flogis-blog-gateway
kubectl -n flogis-blog get pods,svc,resourcequota,limitrange
```

배포 후 tailnet에 로그인된 장치에서 `https://flogis-blog.tail2dac17.ts.net/`와 `/healthz`를 확인합니다.

## 롤백

이전 정상 image tag가 기록된 `deploy` 커밋으로 되돌린 뒤 Argo Sync를 다시 실행합니다. 급한 경우 web Deployment만 Kubernetes rollout undo할 수 있지만, 이후 Git의 원하는 상태와 다시 일치시켜야 합니다.

# Previous Results

## 1. Node SSR 컨테이너·GitOps 및 원본 저장소 기준 구성

# 결과

정적 Nginx web 이미지를 비루트 Astro Node standalone SSR 이미지로 교체하고, Jenkins·Kubernetes·Argo의 source of truth와 runtime 설정을 운영 계약에 맞게 전환했다.

- Docker build stage는 Sanity build argument 없이 server bundle을 만들고 runtime stage는 `USER node`로 `dist/server/entry.mjs`를 8080에서 실행한다.
- Astro session filesystem을 비활성화해 Kubernetes의 read-only root filesystem을 유지했고, Nginx 전용 config/volume을 제거했다.
- `flogis-blog-web-runtime` ConfigMap이 `HOST`, `PORT`, `PUBLIC_SITE_URL`, 공개 Sanity 설정과 strict mode를 web Pod에 주입한다. API token은 배포 구성에 없다.
- Jenkins image smoke는 read-only·비루트 컨테이너에서 published 동적 상세, 404, 검색, RSS, sitemap, health와 cache를 검사하도록 바꿨다.
- Jenkins job/push URL과 Argo Application repoURL을 `Logan-kim-the-philosopher/flogis-blog`로 통일했다.
- 기존 Tailscale Funnel, gateway proxy, 2 web replicas, Service/8080, CPU·memory 제한은 유지했다.
- README와 architecture/deployment/handoff/Jenkins/Kubernetes 문서를 SSR·무재빌드 발행 기준으로 갱신했다.

검증 근거:

- `npm run build` 통과, session filesystem 활성화 로그 없음
- `docker build -f infra/docker/Dockerfile` 통과, image user `node`, config size 약 223 MB
- `--read-only --tmpfs /tmp` 컨테이너에서 runtime Sanity env만 주입하고 `DOCKER_SSR_SMOKE_OK`; 실제 published detail 200, 미존재 404, canonical, `no-store`, immutable asset cache 확인
- 컨테이너 UID/GID 1000과 read-only root 확인
- 로컬 `.env`의 실제 token 값을 출력하지 않고 image filesystem 전체를 검사해 `IMAGE_SECRET_VALUE_NOT_FOUND` 확인
- `bash infra/scripts/validate-deployment.sh` 통과: Kustomize render, client/server dry-run, Jenkins XML, original URL, placeholder, Secret pattern, Funnel/resource 경계 확인
- `groovy:4.0-jdk21-alpine`의 `groovyc`로 Jenkinsfile 구문 검증 통과
- `git diff --check` 통과

남은 작업은 원본 저장소 push, Jenkins 실제 Job 갱신/실행, deploy 브랜치와 Argo Sync, 운영 무재빌드 E2E다. 이들은 다음 Task 범위다.

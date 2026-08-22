# 배포 시도 결과

## 배포 재개

- 사용자가 fork 저장소 `https://github.com/develsvai/flogis-blog.git`를 최종 배포 원격으로 지정했다.
- local origin, Jenkins SCM/push URL, Argo CD repoURL을 모두 fork 저장소로 전환했다.
- fork에는 현재 `main`만 있고 `Haru2_dev`와 `deploy`는 아직 없다. `Haru2_dev` push dry-run은 새 브랜치 생성으로 정상 통과했다.
- 개발 브랜치는 `Haru2_dev`, Jenkins가 갱신하는 GitOps 브랜치는 `deploy`, Argo CD targetRevision은 `deploy`로 유지한다.

- 로컬 `Haru2_dev`의 배포 구성은 commit `f79a2f02`까지 준비됐다.
- `git push --set-upstream origin Haru2_dev`를 실행했으나 GitHub가 현재 계정 `develsvai`에 `Logan-kim-the-philosopher/flogis-blog` 쓰기 권한이 없다고 HTTP 403을 반환했다.
- 로컬 GitHub CLI도 `develsvai` 계정이고 SSH agent/로컬 RSA key에는 GitHub 인증 권한이 없어 대체 push 경로가 없었다.
- Jenkins에는 `github-credentials`, `portfolio-github-credentials`, `loom-wiki-deploy-github-credentials`가 있으나 모두 username `develsvai`다. Flogis Blog 전용 credential과 Job은 아직 없다.
- Jenkins의 `harbor-credentials`와 `docker-build` 패턴은 사용할 수 있으므로 GitHub 권한이 해결되면 이미지 빌드·push 준비는 가능하다.
- 사용자가 Flogis Blog용 Tailscale auth key를 제공했다. 값은 결과·로그·Git에 기록하지 않고 Kubernetes Secret 생성 시에만 사용한다.
- 사용자가 생성한 Harbor 프로젝트명에 맞춰 이미지 경로를 `harbor.192.168.0.110.nip.io/flogy_blog/site`로 교정했다.
- Jenkins pipeline과 Job은 기존 Secret credential `github-credentials`를 참조하도록 맞췄다.
- 안전한 GitOps 순서를 지키기 위해 Git source branch와 인증이 없는 상태에서 Namespace, Secret, Argo Application 등 클러스터 리소스는 생성하지 않았다. 기존 서비스에도 변경이 없다.

## 계속 진행하려면 필요한 조치

1. GitHub 저장소 `Logan-kim-the-philosopher/flogis-blog`에 `develsvai` 계정의 Write 권한을 추가한다. 이 방법이면 기존 Jenkins `github-credentials`도 재사용할 수 있다.
2. GitHub 권한 확인 후 `Haru2_dev` push → Jenkins Job 등록/첫 build → Harbor image 확인 → Secret 생성 → Argo Application/Sync → Pod/endpoint/Tailscale HTTP 검증을 재개한다.

- 위 기존 권한 문제는 fork 저장소 전환으로 해결됐다. 다음 단계는 실제 `Haru2_dev` push와 Jenkins 첫 build다.

## 미충족 완료 조건

- Jenkins build 성공: 미실행
- Argo CD Synced/Healthy: Application 미생성
- Pod Ready/Service endpoint/rollout: 리소스 미생성
- Tailscale HTTP 응답: auth key는 제공됐으나 배포 전

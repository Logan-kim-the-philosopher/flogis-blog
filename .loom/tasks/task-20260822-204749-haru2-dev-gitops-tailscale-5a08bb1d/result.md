# 배포 시도 결과

- 로컬 `Haru2_dev`의 배포 구성은 commit `f79a2f02`까지 준비됐다.
- `git push --set-upstream origin Haru2_dev`를 실행했으나 GitHub가 현재 계정 `develsvai`에 `Logan-kim-the-philosopher/flogis-blog` 쓰기 권한이 없다고 HTTP 403을 반환했다.
- 로컬 GitHub CLI도 `develsvai` 계정이고 SSH agent/로컬 RSA key에는 GitHub 인증 권한이 없어 대체 push 경로가 없었다.
- Jenkins에는 `github-credentials`, `portfolio-github-credentials`, `loom-wiki-deploy-github-credentials`가 있으나 모두 username `develsvai`다. Flogis Blog 전용 credential과 Job은 아직 없다.
- Jenkins의 `harbor-credentials`와 `docker-build` 패턴은 사용할 수 있으므로 GitHub 권한이 해결되면 이미지 빌드·push 준비는 가능하다.
- 기존 Tailscale 서비스는 서비스별 tag를 사용한다. Flogis Blog에는 `tag:flogis-blog` 전용 reusable/pre-authorized auth key가 필요하다.
- 안전한 GitOps 순서를 지키기 위해 Git source branch와 인증이 없는 상태에서 Namespace, Secret, Argo Application 등 클러스터 리소스는 생성하지 않았다. 기존 서비스에도 변경이 없다.

## 계속 진행하려면 필요한 조치

1. GitHub 저장소 `Logan-kim-the-philosopher/flogis-blog`에 `develsvai` 계정의 Write 권한을 추가한다. 이 방법이면 기존 Jenkins `github-credentials`도 재사용할 수 있다.
2. Tailscale ACL의 tag owner에 `tag:flogis-blog`를 등록하고, 해당 tag가 포함된 reusable/pre-authorized auth key를 발급한다.
3. 위 두 조치가 끝나면 `Haru2_dev` push → Jenkins Job 등록/첫 build → Harbor image 확인 → Secret 생성 → Argo Application/Sync → Pod/endpoint/Tailscale HTTP 검증을 재개한다.

## 미충족 완료 조건

- Jenkins build 성공: 미실행
- Argo CD Synced/Healthy: Application 미생성
- Pod Ready/Service endpoint/rollout: 리소스 미생성
- Tailscale HTTP 응답: 전용 auth key 미제공

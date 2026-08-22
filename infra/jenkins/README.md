# Flogis Blog Jenkins pipeline

`Haru2_dev`의 변경을 2분 간격으로 확인하고 아래 GitOps 흐름을 실행합니다.

1. Astro를 strict content mode로 정적 빌드합니다.
2. `harbor.192.168.0.110.nip.io/flogy_blog/site:<build>-<sha>` 이미지를 생성합니다.
3. Harbor push 후 다시 pull하고 컨테이너 health와 주요 경로를 검사합니다.
4. `deploy` 브랜치를 최신 `Haru2_dev`에서 만들고 production overlay의 immutable image tag를 갱신합니다.
5. Argo CD는 `deploy` 브랜치만 추적합니다.

## Jenkins 선행 조건

- agent label: `docker-build`
- username/password credential: `harbor-credentials`
- GitHub username/token credential: `github-credentials`
- GitHub credential 권한: 저장소 read와 `Haru2_dev`/`deploy` push
- Job pipeline path: `infra/jenkins/Jenkinsfile`

Job은 `infra/jenkins/job-config.xml`로 생성합니다. SCM BranchSpec과 poll trigger가 모두 `Haru2_dev`를 기준으로 하므로 `deploy` 브랜치의 Jenkins 커밋은 새 빌드를 유발하지 않습니다.

Sanity `production` dataset은 현재 공개 읽기가 가능하므로 API token을 이미지 빌드에 전달하지 않습니다. 빌드는 `SANITY_STRICT_CONTENT=true`로 실행되어 CMS 연결 실패가 fallback으로 숨겨지지 않습니다.

## 안전 경계

- Harbor와 GitHub credential은 Jenkins credential store에서만 관리합니다.
- GitHub token은 Git이나 build artifact에 기록하지 않습니다.
- Pipeline은 `deploy` 브랜치만 `--force-with-lease`로 갱신합니다.
- 이미지는 mutable tag를 사용하지 않습니다.

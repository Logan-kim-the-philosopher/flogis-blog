# 문제 해결 기록

- 첫 Docker build는 Docker Desktop daemon이 꺼져 있어 연결에 실패했다. Docker Desktop을 시작한 뒤 동일 build가 통과했다.
- 최초 manual `kubectl apply --dry-run=client`는 sandbox에서 OpenAPI endpoint에 접근하지 못했다. client 검증에 `--validate=false`를 사용하고 별도의 승인된 `--dry-run=server`로 API schema 검증을 유지했다.
- 첫 deployment validation은 금지 패턴이 Jenkins smoke의 문자열 및 문서 설명에 있는 `SANITY_API_TOKEN`까지 잡아 실패했다. 실제 `ARG`/`ENV`/Kubernetes env 주입 패턴만 탐지하도록 범위를 좁힌 뒤 통과했다.
- Jenkins declarative linter endpoint는 인증이 없어 HTTP 403을 반환했다. 대안으로 `xmllint`와 공식 Groovy container의 `groovyc` 구문 검증을 통과했으며 실제 Jenkins semantic load는 다음 배포 Task에서 확인한다.
- server dry-run은 기존 Tailscale container가 root로 실행되어 restricted PodSecurity 경고를 남긴다. namespace enforcement는 baseline이고 기존 userspace Tailscale 경로를 깨지 않기 위해 `runAsNonRoot`를 강제하지 않았다. 새 web Pod 관련 warning은 `RuntimeDefault` seccomp로 해소했다.
- Docker build에서 기존 Sanity CLI의 `@sanity/client` peer 경고와 `uuid` deprecation이 출력됐지만 build/runtime smoke에는 영향이 없었다. 의존성 정리는 별도 후속 후보다.

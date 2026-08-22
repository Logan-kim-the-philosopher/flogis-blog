# 문제 해결 기록

- 최초 Kubernetes API 접근은 로컬 Tailscale backend가 중지되어 timeout이 발생했다. Tailscale을 활성화한 뒤 master peer가 Online/Active가 되었고 조회가 정상화됐다.
- Harbor는 서비스 장애가 아니라 내부 CA 미신뢰로 일반 `curl` 검증이 실패했다. 인증서 검증 경로 문제를 분리하기 위해 `curl -k`로 health endpoint의 HTTP 200을 확인했다.
- Jenkins login 페이지는 정상이나 익명 API는 403이다. 인증을 우회하지 않았으며 기존 Job·Credential 상세는 미확인 항목으로 남겼다.
- Argo CD Helm release는 `failed`지만 실제 모든 controller Pod와 Application이 정상이다. Helm 메타데이터 상태와 런타임 장애를 구분했다.
- FlowOps deploy 브랜치의 sparse clone 일부 객체 조회가 sandbox 네트워크 제한으로 실패했지만, Jenkinsfile·Argo spec·live workload의 revision과 이미지 태그를 교차 확인해 배포 패턴을 확정했다.

# 문제 해결

- 첫 `bash infra/scripts/validate-deployment.sh` 실행은 샌드박스가 Kubernetes API(`100.104.111.111:6443`) 연결을 차단해 실패했다.
- 승인된 네트워크 접근으로 동일 명령을 다시 실행했고 배포 설정 검증이 통과했다.
- PodSecurity의 `tailscale` 컨테이너 `runAsNonRoot` 경고가 있었지만 기존 설정에 대한 비차단 경고이며 이번 표기 변경과 무관하다.

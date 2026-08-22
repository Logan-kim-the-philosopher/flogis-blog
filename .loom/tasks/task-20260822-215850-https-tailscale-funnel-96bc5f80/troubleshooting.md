# 문제 해결 기록

- in-app Browser 연결 대상이 없어 클릭 기반 재현은 불가능했다. 응답 헤더, effective URL, 렌더링 HTML의 `href/src`와 소스를 교차 검사했다.
- 목록·검색 경로는 HTTPS 200이고 HTTP 참조가 없었지만 slash 없는 상세 경로만 upstream nginx의 HTTP/8080 절대 리다이렉트를 반환했다.
- 현재 Tailscale `funnel status`는 기존 Serve 구성을 `(tailnet only)`로 표시한다. tagged Kubernetes node의 공개 Funnel에는 tailnet policy `nodeAttrs`에서 `tag:flogis-blog` 대상 `funnel` attribute가 필요하다.
- Jenkins build #6은 smoke test awk 정규식의 백슬래시를 Groovy parser가 처리하지 못해 pipeline compile 단계에서 실패했다. slash escaping 대신 경로 필드 수로 detail index를 고르도록 변경했다.
- Jenkins build #7은 image build, 상대 redirect smoke test, Harbor push와 deploy branch 갱신까지 성공했다.
- 현재 gateway에서 `tailscale funnel --bg --yes --https=443`를 실행했으나 tailnet policy의 allowed nodes에 현재 tagged node가 없다는 오류로 거절됐다. Argo sync를 보류해 운영 gateway는 tailnet 전용 Healthy 상태를 유지했다.
- 사용자 권한 반영 후 동일 명령은 공개 Funnel 활성화에 성공했다. 다만 command 성공 출력은 `Available on the internet`, 후속 `funnel status` 출력은 `(Funnel on)`이라 readiness가 false negative였다.
- Docker bridge의 기본 DNS도 host Tailscale split DNS를 따라 100.x 주소를 반환했다. Google/Cloudflare public DNS의 Funnel relay 공인 IP를 강제해 실제 인터넷 공개 경로를 검증했다.

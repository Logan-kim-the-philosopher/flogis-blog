# 문제 해결 기록

- in-app Browser 연결 대상이 없어 클릭 기반 재현은 불가능했다. 응답 헤더, effective URL, 렌더링 HTML의 `href/src`와 소스를 교차 검사했다.
- 목록·검색 경로는 HTTPS 200이고 HTTP 참조가 없었지만 slash 없는 상세 경로만 upstream nginx의 HTTP/8080 절대 리다이렉트를 반환했다.
- 현재 Tailscale `funnel status`는 기존 Serve 구성을 `(tailnet only)`로 표시한다. tagged Kubernetes node의 공개 Funnel에는 tailnet policy `nodeAttrs`에서 `tag:flogis-blog` 대상 `funnel` attribute가 필요하다.

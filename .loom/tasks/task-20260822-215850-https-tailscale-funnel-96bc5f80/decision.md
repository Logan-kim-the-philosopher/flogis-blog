# 결정

- 원인은 Astro canonical 설정이 아니라 TLS 종료 뒤의 정적 web nginx가 자신의 HTTP/8080 기준으로 만든 directory slash 절대 리다이렉트다.
- 모든 상세 링크를 수동으로 slash 보정하지 않고 nginx redirect를 상대 경로로 만들어 현재 외부 scheme/host를 보존한다.
- 공개 경로는 별도 DNS 공급자 도메인이 아니라 사용자 요청 범위의 `flogis-blog.tail2dac17.ts.net` Funnel HTTPS를 사용한다.
- Funnel은 443을 공개하므로 gateway가 HSTS를 반환하고 Tailscale `Running`과 Funnel 공개 상태를 모두 readiness로 검증한다.

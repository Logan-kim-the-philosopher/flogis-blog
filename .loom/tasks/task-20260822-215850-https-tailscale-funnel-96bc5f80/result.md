# 진행 결과

- 현재 목록 페이지와 trailing slash가 있는 경로는 HTTPS 200이며 HTML에 `http://` 참조가 없다.
- 상세 링크 `/study/<slug>` 요청은 web nginx가 `Location: http://flogis-blog.tail2dac17.ts.net:8080/study/<slug>/` 절대 리다이렉트를 반환해 HTTPS를 이탈하는 현상을 재현했다.
- web nginx에 `absolute_redirect off`와 `port_in_redirect off`를 적용해 trailing slash 리다이렉트를 상대 경로로 변경했다.
- gateway에 HSTS와 forwarded host/port 헤더를 추가했다.
- Tailscale gateway 시작 명령을 tailnet 전용 Serve에서 공개 Funnel로 변경하고, readiness가 `Available on the internet` 상태까지 검사하도록 보완했다.
- 실제 Docker image 테스트에서 상세 경로의 insecure absolute redirect가 제거되고 상대 `Location`이 반환됨을 확인했다.
- Kustomize 렌더링, 실제 클러스터 OpenAPI server dry-run, 배포 검증 스크립트와 `git diff --check`를 통과했다.

다음 단계는 `Haru2_dev` push, Jenkins build, deploy branch 갱신, Argo sync, 비-tailnet 공개 HTTPS 검증이다.

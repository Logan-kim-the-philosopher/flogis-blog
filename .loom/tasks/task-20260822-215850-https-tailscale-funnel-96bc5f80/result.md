# 진행 결과

- 현재 목록 페이지와 trailing slash가 있는 경로는 HTTPS 200이며 HTML에 `http://` 참조가 없다.
- 상세 링크 `/study/<slug>` 요청은 web nginx가 `Location: http://flogis-blog.tail2dac17.ts.net:8080/study/<slug>/` 절대 리다이렉트를 반환해 HTTPS를 이탈하는 현상을 재현했다.
- web nginx에 `absolute_redirect off`와 `port_in_redirect off`를 적용해 trailing slash 리다이렉트를 상대 경로로 변경했다.
- gateway에 HSTS와 forwarded host/port 헤더를 추가했다.
- Tailscale gateway 시작 명령을 tailnet 전용 Serve에서 공개 Funnel로 변경하고, readiness가 `Available on the internet` 상태까지 검사하도록 보완했다.
- 실제 Docker image 테스트에서 상세 경로의 insecure absolute redirect가 제거되고 상대 `Location`이 반환됨을 확인했다.
- Kustomize 렌더링, 실제 클러스터 OpenAPI server dry-run, 배포 검증 스크립트와 `git diff --check`를 통과했다.

- source commit `7be05dec`가 `Haru2_dev`에 반영됐고 Jenkins build #7은 SUCCESS다. image `7-7be05dec`와 deploy commit `c91bffa6`가 생성됐다.
- Jenkins smoke test에서 상세 경로가 `Location: /study/<slug>/` 상대 redirect를 반환하고 insecure `Location: http://`가 없음을 확인했다.
- 실제 Funnel 활성화는 Tailscale 정책이 tagged node를 허용하지 않아 거절됐다. 현재 Argo revision `90999835`는 `Synced/Healthy`이며 기존 tailnet 전용 Serve를 유지한다.

다음 단계는 tailnet policy에 `tag:flogis-blog` 대상 `funnel` node attribute를 추가한 뒤 deploy commit `c91bffa6`를 Argo sync하고 비-tailnet 공개 HTTPS를 검증하는 것이다.

- 사용자가 Funnel node 허용을 완료했고 live command가 `Available on the internet`으로 성공했다.
- deploy commit `c91bffa6`은 Argo에 실제 적용됐고 web image `7-7be05dec`는 2/2 Ready다.
- Tailscale v1.98의 `funnel status` 출력은 `(Funnel on)`이므로 기존 readiness 문구 검사만 실패했다. 실제 출력에 맞춰 보정 후 최종 sync가 필요하다.

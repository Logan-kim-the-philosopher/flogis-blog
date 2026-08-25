# 트러블슈팅

## Jenkins 설정 API 403

Jenkins crumb만 Basic Auth와 함께 보내면 설정 변경이 `403`이었다. 같은 cookie jar로 로그인 세션과 crumb를 묶어 `config.xml`을 갱신해 해결했다. credential 값은 출력하지 않았다.

## Jenkins #9 deploy push 실패

Jenkins workspace에 개인 fork 시절의 `refs/remotes/origin/deploy`가 남아 있었고, 원본에는 아직 deploy branch가 없어 `--force-with-lease`가 stale info로 실패했다. pipeline에서 해당 remote-tracking ref를 먼저 삭제하고 원본 deploy를 선택적으로 fetch하도록 고쳤다. 원본에 deploy가 없을 때는 orphan 초기 branch를 안전하게 만들도록 했다.

## Jenkins #10 Pod 생성 실패

Node image의 `USER node`는 비루트 계정이지만 Kubernetes가 문자열 사용자 이름만으로 UID를 검증하지 못해 `CreateContainerConfigError`가 발생했다. Dockerfile을 `USER 1000:1000`, Pod securityContext를 `runAsUser/runAsGroup: 1000`으로 고정했다. #11과 Argo 재동기화 후 web 2/2가 Ready가 됐다. 기존 Pod가 계속 서비스해 사용자 중단은 없었다.

## 로컬 네트워크 sandbox

일반 sandbox에서 Kubernetes API와 Sanity DNS가 차단됐다. 승인된 네트워크 실행으로 같은 read-only 상태 조회와 전용 문서 lifecycle을 재실행했다.

## namespace 재확인

초기 기록의 짧은 이름 대신 Argo Application의 `spec.destination.namespace`를 다시 읽어 실제 대상 `flogis-blog`를 사용했다.

## 삭제 검증 false positive

전용 상세 URL의 404 페이지 canonical에는 요청 slug가 정상적으로 남는다. 최초 검증기가 이 문자열을 콘텐츠 잔존으로 오판했다. 404 페이지에서는 제목/본문 marker 부재를 확인하고, slug 부재는 홈·목록·검색·RSS·sitemap에서 확인하도록 조건을 수정했다. Sanity 잔존 수는 이미 `0`이었다.

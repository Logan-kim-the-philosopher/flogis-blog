# 문제 해결 기록

- 첫 strict build는 코드가 아니라 sandbox DNS 제한으로 Sanity CDN 조회가 실패했다. 네트워크 허용 환경에서 token 없이 다시 실행해 성공했다.
- 첫 Docker 검증은 Docker Desktop이 중지돼 daemon socket 연결이 실패했다. Docker Desktop을 기동한 뒤 build와 smoke test를 완료했다.
- Node 22.14 builder에서 일부 transitive dependency가 Node 22.19/22.20 이상을 요구한다는 warning이 발생했다. builder와 package engine을 22.20으로 올려 engine warning을 제거했다. Sanity import peer warning은 기존 dependency 조합에서 발생하지만 정적 빌드에는 영향을 주지 않았다.
- Secret scanner가 `package-lock.json`의 무작위 integrity 문자열을 API key로 오탐했다. 운영 입력 파일만 검사하고 key 경계를 강화해 실제 secret 탐지는 유지하면서 오탐을 제거했다.
- server dry-run은 `flogis-blog` namespace가 아직 실제 생성되지 않아 namespaced resource를 NotFound 처리했다. client dry-run은 원본을 검증하고, server schema 검증에서는 namespace 필드만 기존 `default`로 치환해 리소스 schema를 별도로 확인했다.

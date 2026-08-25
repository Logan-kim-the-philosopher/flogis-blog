# 문제 해결 기록

- 최초 production server 실행은 sandbox의 local port listen 제한으로 `EPERM`이 발생했다. 승인된 로컬 실행으로 재시도해 정상 기동했다.
- 승인된 smoke shell에서 제한된 `PATH` 때문에 `curl`, `sed`를 찾지 못했다. `/usr/bin/curl`, `/usr/bin/sed` 절대 경로로 재실행해 route 검증을 완료했다.
- `npm install --package-lock-only --ignore-scripts --offline`은 registry metadata cache가 없어 `ENOTCACHED`로 실패했다. 승인된 package-lock 동기화 명령으로 복구했다.
- npm은 기존 Sanity CLI dependency의 `@sanity/client` peer 충돌 경고와 로컬 Node 25에 대한 `nanoid` engine 경고를 출력했다. build/runtime 검증은 통과했고 운영 목표 Node 22는 해당 engine 범위에 포함된다.
- `npm audit`은 6 moderate, 1 high를 보고했다. 이번 SSR route 범위에서 `--force` 자동 수정은 하지 않았으며 별도 의존성 보안 점검이 필요하다.

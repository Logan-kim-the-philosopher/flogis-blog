# 문제 해결 기록

- 최초 파일 조사 셸에서 zsh 예약 배열 변수 `path`를 반복 변수로 사용해 해당 자식 셸의 명령 검색 경로가 덮어써졌다. `file_path`로 변수명을 바꿔 재실행했으며 부모 셸과 원본 파일에는 영향이 없었다.
- PDF 시각 검증 도구가 요구하는 artifact marker에 처음 `--output-format png`를 전달했으나 marker는 `pdf`만 허용해 종료 코드 2로 거절했다. 허용 형식 `pdf`로 정확히 한 번 성공 기록한 뒤 Poppler 렌더링과 시각 검수를 계속했다.
- 로컬에 Poppler가 없어 `brew install poppler`로 `pdftoppm`과 `pdfinfo`를 설치했다.
- 첫 Sanity 실행은 샌드박스 DNS 제한으로 `w1jypogd.api.sanity.io`를 해석하지 못해 문서·자산 생성 전에 종료됐다. 네트워크 승인을 받아 재실행했다.
- `.env` 10번째 줄은 셸 `source` 기준 짝이 맞지 않는 따옴표가 있어 zsh 경고가 발생했다. 토큰 값을 노출하거나 `.env`를 수정하지 않고 `node --env-file=.env`로 읽어 해결했다.
- 전체 공개 검증의 첫 실행에서 `/healthz`에 `Cache-Control`이 없다는 이유로 실패했다. `infra/k8s/base/files/gateway.conf`를 확인한 결과 공개 게이트웨이가 이 경로를 자체 `return 200 "ok\\n"`으로 처리하는 의도된 구성임을 확인했다. 콘텐츠 경로는 계속 `no-store`를 엄격히 검사하고 `/healthz`는 HTTP 200과 본문을 검사하도록 기준을 교정해 전체 통과했다.

현재 남은 blocker는 없다.

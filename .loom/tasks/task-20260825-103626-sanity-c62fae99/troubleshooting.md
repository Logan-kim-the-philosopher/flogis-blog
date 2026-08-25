# 트러블슈팅

실패나 복구 작업은 없었다. production mutation, 공개 HTTP 검증, 외부 공개 fetch가 모두 첫 시도에 성공했다.

남은 운영 주의사항은 확인용 글이 의도적으로 published 상태로 유지된다는 점이다. 삭제 요청이 들어오면 `study-sanity-runtime-render-check-20260825`와 대응 draft 존재 여부만 확인해 제거한다.

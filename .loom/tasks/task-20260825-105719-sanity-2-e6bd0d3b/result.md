# 결과

사용자가 지정한 production Sanity 테스트 study 2건을 정확한 published ID로 식별한 뒤 단일 transaction으로 삭제했다.

삭제한 문서:

- `study-sanity-connection-test-20260823` — `Sanity 연결 테스트 게시물` — slug `sanity-connection-test-20260823`
- `study-sanity-runtime-render-check-20260825` — `Sanity 실시간 렌더링 확인` — slug `sanity-runtime-render-check-20260825`

삭제 transaction ID는 `Gn5g06M7sPGcctRdTzdBNK`다. 삭제 전 두 published 문서만 존재했고 대응 draft는 없었다.

검증 결과:

- 두 published/draft ID의 Sanity 잔존 문서 `0`건
- 두 공개 상세 URL 모두 첫 요청에서 HTTP `404`
- 홈, `/study`, `/api/search.json`, `/rss.xml`, `/sitemap.xml` 모두 HTTP `200`
- 모든 집계 응답에서 두 제목과 두 slug 부재
- `/healthz` HTTP `200`, 본문 `ok`
- 보존 대상 `study-unix-linux-vm-container` — `인프라 입문 정리: Unix에서 Linux, 그리고 VM·컨테이너까지`가 유일한 study로 그대로 존재

문서만 삭제했으며 공유될 수 있는 image asset과 person 문서는 삭제하지 않았다. 삭제한 두 문서는 production Content Lake에서 더 이상 조회되지 않으며 일반적인 CLI 작업만으로 즉시 복구되지는 않는다.

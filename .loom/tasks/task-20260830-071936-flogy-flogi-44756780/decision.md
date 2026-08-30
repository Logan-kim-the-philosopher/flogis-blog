# 결정

- 사용자가 요청한 “출판된 회의 게시물”의 범위를 production dataset에서 현재 published perspective로 조회되는 `meeting` 문서 전체로 정했다.
- 사용자에게 노출되는 `title`, `slug.current`, `tags`, `body`만 교정하고, Sanity 내부 `_id`는 변경하지 않았다.
- 변경 전에 12개 원본 문서와 revision을 로컬 임시 백업으로 저장했다.
- 동시 편집을 덮어쓰지 않도록 문서별 기존 revision 조건을 걸고 12개 변경을 하나의 Sanity 트랜잭션으로 커밋했다.
- slug 변경 후 전체 회의 문서 사이의 중복이 없음을 mutation 전에 검증했다.
- 코드 기능 변경은 필요하지 않아 임시 점검 스크립트는 검증 후 저장소에서 제거했다.

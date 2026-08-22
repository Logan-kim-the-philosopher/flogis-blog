# 결정

- 동일 ID가 없는 것을 확인한 후 `create` mutation으로 새 published 문서만 생성했다.
- 기존 `siteSettings`와 사람 문서는 수정하지 않았다.
- 스키마의 필수 `coverImage`를 충족하기 위해 외부 이미지를 가져오지 않고 저장소의 Flogi favicon PNG 데이터를 테스트 자산으로 업로드했다.
- 작성자는 기존 `person-yongjae-hong` 문서를 참조해 사람 아카이브 경로까지 검증했다.
- 테스트임을 명확히 식별할 수 있도록 문서 ID와 slug에 `sanity-connection-test-20260823`을 사용했다.
- 사용자가 확인할 수 있도록 테스트 문서와 자산은 삭제하지 않고 유지했다.

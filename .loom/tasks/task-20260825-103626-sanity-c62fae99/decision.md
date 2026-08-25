# 결정

- 사용자가 즉시 브라우저로 확인할 수 있도록 확인 문서를 E2E 종료 후에도 삭제하지 않는다.
- 기존 운영 문서는 수정하지 않고, 새 고유 ID/slug의 study 문서만 생성한다.
- 스키마 필수값인 cover image와 authors는 기존 published study에서 읽은 참조를 그대로 재사용해 새 asset/person 문서를 만들지 않는다.
- 제목과 본문에 실시간 렌더링 확인 목적과 “Jenkins 재빌드·Argo 재배포 없음”을 명시한다.
- 성공 판단은 상세만 보지 않고 홈·목록·검색·RSS·sitemap·SEO 메타와 배포 불변성을 함께 확인한다.

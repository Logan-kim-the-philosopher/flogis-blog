# 결정

- 사용자 표현인 “테스트 게시물 두 개”를 이전 작업에서 생성·검증한 두 고유 ID로 한정했다.
- 삭제 직전에 production raw perspective로 ID, type, title, slug와 전체 study 목록을 확인하고 대상이 정확히 2건일 때만 진행했다.
- published 두 ID만 단일 Sanity transaction에서 삭제했다. 대응 draft는 조회 결과 존재하지 않았다.
- cover image asset과 author person 문서는 다른 콘텐츠가 참조할 수 있으므로 보존했다.
- 완료 판정은 Sanity 잔존 0건뿐 아니라 상세 404, 홈·목록·검색·RSS·sitemap 부재와 health 정상까지 포함했다.

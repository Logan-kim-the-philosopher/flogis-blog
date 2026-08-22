# 실행 결과

- Sanity `production` dataset에 테스트 이미지 자산 1개를 업로드했다.
  - Asset ID: `image-ff1f8557f563f5738b476dcfe937d5e16f48c7a9-32x32-png`
  - 원본: `public/favicon.ico`의 PNG 데이터
- 테스트 스터디 문서 1개를 published 상태로 생성했다.
  - Document ID: `study-sanity-connection-test-20260823`
  - Slug: `sanity-connection-test-20260823`
  - 제목: `Sanity 연결 테스트 게시물`
  - 작성자 참조: `person-yongjae-hong` (`홍용재`)
  - 태그: `테스트`, `Sanity`
- 생성 후 인증 GROQ 조회에서 이미지 URL과 작성자 참조가 정상 해석됐다.
- Sanity의 `study` 문서 수는 0개에서 1개로 증가했다.

## 프론트 검증

- `/`: HTTP 200, 테스트 제목 노출
- `/study`: HTTP 200, 테스트 제목 노출
- `/study/sanity-connection-test-20260823`: HTTP 200, 상세 제목·본문 노출
- `/search`: HTTP 200, 검색 payload에 테스트 제목 포함
- `npm run build`: 성공, 상세·작성자·태그 경로를 포함한 정적 페이지 12개 생성

## 현재 상태

- 개발 서버는 `http://localhost:4321`에서 계속 실행 중이다.
- 이 문서는 의도적으로 운영 dataset에 테스트 콘텐츠로 남겨 두었다.

## 정리 방법

- 테스트가 끝난 뒤 제거하려면 먼저 `study-sanity-connection-test-20260823` 문서를 삭제한다.
- 문서 참조가 제거된 다음 이미지 자산 `image-ff1f8557f563f5738b476dcfe937d5e16f48c7a9-32x32-png`을 삭제한다.

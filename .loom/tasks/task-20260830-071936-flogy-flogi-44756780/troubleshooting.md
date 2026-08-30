# 문제 해결

- 첫 Sanity 조회는 샌드박스 DNS가 `w1jypogd.api.sanity.io`를 해석하지 못해 실패했다. 승인된 네트워크 접근으로 재실행해 정상 조회·수정·검증했다.
- 첫 운영 페이지 확인은 `.env`의 로컬 개발용 `PUBLIC_SITE_URL=http://localhost:4321`을 따라가 연결이 거부됐다. 검증 대상 주소를 `https://flogis-blog.tail2dac17.ts.net`로 명시해 재실행했고 15개 페이지가 모두 통과했다.

# 실행 결과

- 바탕화면 `/Users/hongyongjae/Desktop/blog.png`를 원본 크기로 확인했다.
- 이미지에서 푸터가 화면 하단보다 약 200px 위에서 끝나고 그 아래가 빈 배경으로 남는 현상을 확인했다.
- `src/styles/global.css`의 `html, body { min-height: 100%; }`에서 `min-height`를 제거했다.
- 이제 `SiteLayout`의 Tailwind `min-h-screen`이 덮어써지지 않아 `body`가 실제 `100vh`를 확보하고, `main.flex-1`이 남은 높이를 채운다.

## 검증

- 개발 서버 CSS: `.min-h-screen { min-height: 100vh; }` 확인.
- 개발 서버 전역 `html, body` 규칙: 충돌하던 `min-height: 100%`가 제거된 것을 확인.
- `/study`, `/meetings`, `/work`: 모두 HTTP 200.
- 프로덕션 CSS: `min-h-screen`은 `100vh`, `html,body`에는 `min-height`가 없음을 확인.
- `npm run build`: 성공, 정적 페이지 12개 생성.
- 개발 서버는 `http://localhost:4321`에서 계속 실행 중이다.

## 다음 확인

- `/study`를 새로고침하면 푸터 아래의 빈 영역이 사라지고 푸터가 화면 하단에 맞아야 한다.

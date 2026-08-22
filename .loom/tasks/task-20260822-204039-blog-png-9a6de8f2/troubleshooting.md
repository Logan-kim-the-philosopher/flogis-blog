# 문제 해결 기록

- 첫 수정은 `body`와 `main`에 flex 유틸리티를 추가했지만 화면에서 효과가 없었다.
- 원인은 Tailwind `@layer utilities` 안의 `.min-h-screen`보다 레이어 밖에서 뒤에 선언된 `html, body { min-height: 100%; }`가 우선 적용된 것이었다.
- 개발 서버 HTML에 클래스가 존재한다는 확인만으로는 cascade 충돌을 발견할 수 없었다. 이번에는 사용자가 제공한 스크린샷과 실제 개발·프로덕션 CSS 값을 함께 확인했다.

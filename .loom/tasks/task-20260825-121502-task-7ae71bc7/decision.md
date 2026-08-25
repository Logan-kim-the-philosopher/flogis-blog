# 결정 기록

## 유지 대상

- `study-oop-runtime-session-slides`
- `study-oop-runtime-session-speaker-notes`
- `study-unix-linux-vm-container`

앞의 두 문서는 같은 `객체의 역할과 책임, 그리고 코드는 어떻게 실행되는가` 세션의 발표 슬라이드와 발표자 노트이며, 현재 썸네일이 실제 내용과 일치하므로 유지한다. 세 번째 문서는 사용자의 후속 정정에 따라 원래 썸네일을 복원한다.

## 제거 대상

- 운영 `study`, `work`, `meeting` 가운데 위 세 ID가 아닌 모든 문서
- 최초에는 meeting 9개와 study 2개에서 제거했지만, 후속 정정으로 `study-unix-linux-vm-container`의 이미지를 복원했다. 최종 이미지 미보유 문서는 10개다.

## 분류 및 작성자 정정

- `meeting-infrastructure-study-2026-08-24`는 회의가 아니라 스터디로 분류한다.
- Sanity 문서의 `_type`은 직접 패치하지 않고, 스터디 필드 구조로 새 문서를 만든 뒤 운영 페이지와 리다이렉트를 확인하고 기존 회의 문서를 제거한다.
- 이동 대상의 `participants` 참조는 스터디의 `authors`로 보존한다.
- `study-unix-linux-vm-container`는 사용자가 작성한 글이 아니므로 작성자에서 홍용재를 제거하고 김희성만 유지한다.
- 기존 회의 상세 URL은 외부 링크가 깨지지 않도록 새 스터디 상세 URL로 301 이동한다.

## 렌더링 원칙

- 관련 이미지가 없으면 대체 이미지나 빈 비율 박스를 만들지 않는다.
- 카드, 미니카드, 상세 상단, Open Graph와 Twitter image에서 이미지 요소 자체를 생략한다.
- 새 콘텐츠도 정확한 이미지가 있을 때만 `coverImage`를 입력할 수 있도록 Sanity validation을 선택 항목으로 바꾼다.
- 운영 데이터의 `coverImage`를 먼저 지우면 기존 배포본이 기본 Unsplash 이미지를 주입하므로, optional image 지원 코드를 배포한 뒤 데이터를 제거한다.
- 사이트 공통 SEO 이미지는 목록·홈에는 유지할 수 있지만, 이미지가 없는 콘텐츠 상세에는 대체 썸네일로 주입하지 않는다.

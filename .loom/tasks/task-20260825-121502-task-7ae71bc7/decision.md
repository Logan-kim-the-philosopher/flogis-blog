# 결정 기록

## 유지 대상

- `study-oop-runtime-session-slides`
- `study-oop-runtime-session-speaker-notes`

두 문서는 같은 `객체의 역할과 책임, 그리고 코드는 어떻게 실행되는가` 세션의 발표 슬라이드와 발표자 노트이며, 현재 썸네일이 실제 내용과 일치하므로 유지한다.

## 제거 대상

- 운영 `study`, `work`, `meeting` 가운데 위 두 ID가 아닌 모든 문서
- 사전 조회 기준 제거 대상은 meeting 9개와 study 2개로 총 11개다.

## 렌더링 원칙

- 관련 이미지가 없으면 대체 이미지나 빈 비율 박스를 만들지 않는다.
- 카드, 미니카드, 상세 상단, Open Graph와 Twitter image에서 이미지 요소 자체를 생략한다.
- 새 콘텐츠도 정확한 이미지가 있을 때만 `coverImage`를 입력할 수 있도록 Sanity validation을 선택 항목으로 바꾼다.
- 운영 데이터의 `coverImage`를 먼저 지우면 기존 배포본이 기본 Unsplash 이미지를 주입하므로, optional image 지원 코드를 배포한 뒤 데이터를 제거한다.

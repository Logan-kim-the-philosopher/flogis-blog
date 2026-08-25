# 작업 결과

## 구현

- `coverImage`를 콘텐츠 타입과 저장소 정규화에서 선택값으로 변경했다.
- Study, Work, Meeting의 일반 카드·미니 카드·상세 페이지는 이미지가 있을 때만 `<img>`를 렌더링한다.
- 대표 스터디 카드는 이미지가 없으면 단일 열을 사용해 빈 이미지 영역을 만들지 않는다.
- Sanity의 Study, Work, Meeting 스키마에서 커버 이미지 필수 검증을 제거했다.
- 이미지가 없는 상세 페이지는 사이트 기본 이미지를 Open Graph/Twitter 이미지로 대체하지 않도록 명시적인 `null` 이미지 처리를 추가했다.
- 회의에서 스터디로 이동한 `infrastructure-study-2026-08-24`의 기존 URL은 새 스터디 URL로 301 이동한다.

## 운영 데이터

- 썸네일 유지 문서는 최종적으로 다음 3개다.
  - `study-oop-runtime-session-slides`
  - `study-oop-runtime-session-speaker-notes`
  - `study-unix-linux-vm-container`
- `인프라 입문 정리: Unix에서 Linux, 그리고 VM·컨테이너까지`는 원래 이미지 자산을 복원하고 작성자를 김희성으로 바로잡았다.
- `희성님 인프라 스터디 1차 — Linux부터 Kubernetes까지`는 본문 3,279자, 날짜, 태그와 사람 참조를 보존해 `study-infrastructure-study-2026-08-24`로 이동했다.
- 이동 전 `meeting-infrastructure-study-2026-08-24` 문서는 새 페이지와 리다이렉트를 확인한 뒤 제거했다.
- 최종 Sanity 상태는 Study 5개, Meeting 8개, Work 0개이며 커버 이미지는 위 3개 문서에만 존재한다.

## 배포

- 소스 커밋: `68bb193`, `b36ee51`, `50b33b7`
- Jenkins 배포 커밋: `7156d20d4e78c77c8160420f40650f2b6aef741b`
- 운영 이미지: `harbor.192.168.0.110.nip.io/flogy_blog/site:15-50b33b77`
- Argo CD: `Synced / Healthy`, 웹 Deployment `2/2 ready`, `2/2 available`

## 검증

- `npm run build` 통과
- 모든 현행 상세 페이지가 200과 올바른 canonical을 반환한다.
- 커버 유지 3개 페이지는 상세 이미지와 `og:image`가 있고, 나머지 10개 페이지는 둘 다 없다.
- `/study`에는 이동한 인프라 스터디가 있고 `/meetings`에는 없으며, 회의 목록의 Sanity 이미지 참조는 0개다.
- 이전 회의 URL은 새 스터디 URL로 301을 반환한다.
- 홈, Study, Meetings, Work, 검색 JSON, RSS, sitemap이 모두 200을 반환한다.

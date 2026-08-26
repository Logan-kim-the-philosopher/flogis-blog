# 결정

- 사용자가 `승인`이라고 명시해 로컬 Whisper 전사, 전체 전사문의 Pi/OpenAI 처리, production Sanity 저장과 공개 발행을 허용한 뒤 외부 처리를 시작했다.
- 같은 이름의 Clova 전사본이 없어 원본 M4A를 보존하고 로컬 Whisper large-v3-turbo 경로를 사용했다.
- 발행일은 파일명 `26:08:26`과 M4A 메타데이터가 일치하므로 `2026-08-26`으로 확정했다.
- 내용 중심이 발표 시연 범위, 역할, 배포와 자동화 조율이므로 `project_meeting`으로 분류했다.
- 참석자는 기존 1~4차 Flogy 회의와 Sanity person 문서를 근거로 김희성, 홍용재, 김정현 3명으로 연결했다. 회의에서 언급만 된 인물은 참가자 참조에 넣지 않았다.
- 기존 회차의 제목·슬러그 규칙에 맞춰 `Flogy 5차 회의 — OHAYO 전체 시연과 블로그 자동화`와 `flogy-round-5-2026-08-26`을 사용했다.
- 같은 ID나 슬러그를 덮어쓰지 않고 validate-only의 duplicateCount 0을 확인한 뒤 신규 문서로 생성했다.
- 사용자 요구에 따라 임의 썸네일을 추가하지 않았고, 발행 문서에 `coverImage`가 없음을 재확인했다.
- Jenkins/ArgoCD 배포와 코드 변경은 수행하지 않았다. 현재 블로그가 runtime Sanity 데이터를 읽으므로 Sanity create만으로 공개 페이지에 반영됐다.

# 결정

## 실행 코드만 전달

Git 저장소나 사이트 소스는 배포하지 않고, 현재 미팅 workflow가 직접 요구하는 Pi extension 2개와 Node agent 파일 4개만 복사했다. 소스 파일은 원본 저장소와 `cmp`로 byte 단위 동일성을 확인했다.

## 의존성 고정과 lifecycle script 차단

최소 package에는 `@sanity/client@8.2.0`, `zod@4.4.3`만 넣고 package-lock을 생성했다. 팀원 설치 명령은 `npm ci --ignore-scripts`로 고정해 dependency lifecycle script가 실행되지 않도록 했다.

## Node LTS 범위 수정

검증 환경의 Node 25.9.0에서 `nanoid@6.0.1`이 지원하는 짝수 메이저 범위 밖이라는 `EBADENGINE` 경고를 발견했다. 번들의 engine과 가이드를 `^22.20.0 || ^24.0.0 || >=26.0.0`으로 수정하고, 현재 안정적인 선택으로 Node 24 LTS를 권장했다. 로컬 검증은 Node 25에서 경고와 함께 성공했지만 팀원 운영은 지원 범위에서 하도록 했다.

## 가이드와 체크섬을 폴더에 포함

팀원이 폴더 하나만 전달받아도 절차를 확인할 수 있도록 정본 가이드 사본을 `TEAM_SETUP.md`로 포함했다. 최종 파일 11개의 체크섬을 `SHA256SUMS`에 기록했으며 checksum 파일 자체는 재귀 문제를 피하기 위해 목록에서 제외했다.

## 자격 증명은 제외

`.env.example`에는 공개 연결값과 빈 `SANITY_API_TOKEN=`만 넣었다. 실제 token, Pi 인증, 기존 run과 회의 원본, `node_modules`를 최종 폴더에 넣지 않았다.

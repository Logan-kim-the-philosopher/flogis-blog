# 문제 해결 기록

## 샌드박스 npm 네트워크 실패

- 증상: 첫 `npm install --package-lock-only --ignore-scripts`가 출력 없이 대기해 중단했다. 검증용 `npm ci --ignore-scripts`는 `ENOTFOUND registry.npmjs.org`로 실패했다.
- 원인: 샌드박스의 외부 네트워크 제한.
- 해결: 같은 npm 명령만 승인된 네트워크 실행으로 다시 수행했다. lockfile 생성과 clean install이 모두 성공했고 audit 결과는 취약점 0개였다.

## Node 25 `EBADENGINE` 경고

- 증상: `nanoid@6.0.1`이 Node `^22 || ^24 || >=26`을 요구하지만 검증 머신은 Node `25.9.0`이라 npm 경고가 발생했다.
- 영향: 설치와 fixture preview는 성공했지만 Node 25는 dependency의 명시 지원 범위가 아니다.
- 해결: 번들과 가이드의 지원 engine을 `^22.20.0 || ^24.0.0 || >=26.0.0`으로 좁히고 Node 24 LTS를 권장했다.

## 존재하지 않는 workdir에서 검증 명령 시작 실패

- 증상: 새 검증 폴더 생성과 그 폴더를 workdir로 사용하는 명령을 한 번에 실행하자 `No such file or directory`가 발생했다.
- 원인: 프로세스 시작 전에 workdir가 존재해야 한다.
- 해결: `/private/tmp`에서 검증 폴더를 먼저 만든 후 별도 명령으로 `npm ci`를 실행했다.

## 실제 운영 연결은 미검증

- production token과 팀원 모델 인증은 범위 밖이라 `meeting:doctor`의 실제 write credential 및 게시 성공까지 검증하지 않았다.
- 다음 행동: 팀원 장비에서 `TEAM_SETUP.md`의 최초 무게시 테스트와 `meeting_publish validateOnly=true`까지 완료한 뒤에만 실제 게시 승인으로 진행한다.

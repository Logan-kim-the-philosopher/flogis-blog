# 문제 해결 기록

## 바탕화면 절대경로를 document output으로 지정할 수 없음

- 증상: Task 생성 시 바탕화면 절대경로를 document output으로 지정하자 Loom이 `Document output path must be workspace-relative`로 거절했다.
- 원인: Loom의 정본 문서 산출물은 workspace-relative 경로여야 한다.
- 해결: `docs/team-member-meeting-agent-sanity-cli-setup.md`를 정본으로 선언하고, 완성 후 사용자가 요청한 바탕화면 경로에 동일본을 복사했다. `cmp`와 SHA-256으로 두 사본의 동일성을 확인했다.

## 문서와 기존 안내의 token 운영 방식 차이

- 증상: 저장소 README에는 관리자별 개인 token 안내가 있지만, 최신 Sanity 공식 문서는 애플리케이션·제3자 서비스에 project robot token을 권장한다.
- 판단: 팀원 PC의 최소 실행 번들은 애플리케이션/제3자 서비스 성격이므로 최신 공식 권고를 우선했다.
- 해결: 팀원·기기별 project robot token, 별도 전달, 만료·폐기 절차를 문서화했다. 개인 token은 공유하지 않도록 했다.

## Pi와 터미널 옵션이 같지 않음

- 증상: `/meeting`에는 `--no-publish`가 있지만 Node CLI의 `meeting:prepare` parseArgs에는 해당 옵션이 없다.
- 해결: Pi TUI에서는 `/meeting ... --no-publish`를 사용하고, 터미널 prepare는 원래부터 preview-only이므로 `--no-publish`를 붙이지 않도록 예시와 오류 항목에 명시했다.

## 실제 권한 제한의 한계

- 증상: 팀원에게 저장소 권한을 주지 않아도 Sanity write token을 로컬에 두면 token 역할 범위에서는 직접 API 호출이 가능하다.
- 해결: Enterprise custom role 사용 가능 여부를 먼저 확인하고, 세밀한 역할이 없는 플랜에서 meeting/study 외 쓰기를 기술적으로 막아야 한다면 token을 배포하지 말고 제한 게시 API를 별도로 구축해야 한다고 명시했다.

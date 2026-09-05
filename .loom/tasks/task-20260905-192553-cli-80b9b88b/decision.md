# 결정

## 저장소 대신 최소 실행 번들 배포

현재 에이전트는 저장소의 `.pi/extensions/meeting-workflow.ts`와 `scripts/meeting-agent/`에 구현돼 있어 코드 전달 없이 실행할 수 없다. 저장소 전체나 Git 이력을 주지 않고 필요한 런타임 파일만 담은 날짜·버전 고정 ZIP을 배포하도록 했다. 별도 private registry나 게시 게이트웨이 구축은 이번 문서 범위를 넘으므로 후속 선택지로 남겼다.

## 개인 token 대신 project robot token

Sanity의 최신 공식 안내에 따라 소유자의 개인 token 공유를 금지하고, 팀원·기기·번들별 project robot token을 권장했다. token은 ZIP과 분리하고 만료일을 두며, Enterprise custom role이 가능하면 `meeting`/`study` 쓰기와 필요한 타입 읽기로 제한한다. 기본 role만 가능한 플랜에서는 Editor 계열 권한이 다른 문서까지 쓸 수 있음을 명시했다.

## Pi TUI 승인 경로를 기본 운영 절차로 채택

일반 운영은 `/meeting` 또는 `meeting_prepare` → `meeting_publish`로 하고, preview 편집과 validate-only 검증 뒤 마지막 UI 승인에서만 외부 쓰기가 일어나도록 안내했다. raw 터미널 `meeting:publish`는 정확한 `--confirm`만 있으면 UI 확인을 우회할 수 있어 관리자/비상 경로로 분리했다.

## 보안 경계를 명시

저장소 미공개가 Sanity 권한 제한을 의미하지 않으며, 로컬 Whisper를 쓰더라도 전사문 전체가 이후 Pi 모델 공급자에게 전송된다는 사실을 숨기지 않았다. `.meeting-agent/runs/`에는 원본·전사문·모델 요청이 남으므로 별도 보관/삭제 정책이 필요하다고 결정했다.

## 정본과 편의 사본 분리

Loom document output은 workspace-relative 경로만 허용하므로 저장소의 `docs/`를 감사 가능한 정본으로 두고, 사용자가 요청한 바탕화면에는 byte-identical 사본을 두었다. 두 파일은 SHA-256으로 동일성을 검증했다.

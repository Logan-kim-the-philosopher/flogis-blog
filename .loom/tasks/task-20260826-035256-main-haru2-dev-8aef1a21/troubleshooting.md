# 문제 해결 기록

## 저장소 이동으로 인한 workspace 경로 불일치

세션의 원래 경로 `/Users/hongyongjae/Desktop/flogis-blog`는 없어졌고 저장소가 `/Users/hongyongjae/Desktop/Flogy/flogis-blog`로 이동되어 있었다. 새 위치를 자동 탐색하고 이후 모든 Git/Loom 작업을 해당 경로로 한정했다.

## 새 경로의 쓰기 권한 제한

현재 세션의 기존 writable root가 이전 경로로 고정되어 Loom과 Git 쓰기가 처음에는 차단됐다. 새 저장소 경로로 한정한 승인된 실행을 사용했다.

## 내장 apply_patch의 이전 경로 고정

내장 `apply_patch`와 셸의 동일 실행 파일이 새 경로를 볼 수 없어 충돌 파일 수정에 실패했다. 검토한 unified diff를 `git apply --recount`로 적용하는 제한된 대안을 사용했고, 이후 conflict marker·unmerged index·diff check를 모두 검증했다.

## 의미 충돌

텍스트 충돌 3개 중 handoff의 정적 배포 문장과 SiteLayout의 빌드 시점 검색 payload는 현재 SSR 구조를 퇴행시킬 수 있었다. 자동으로 한쪽을 선택하지 않고 현재 코드와 운영 문서를 근거로 SSR·런타임 검색을 유지했다.

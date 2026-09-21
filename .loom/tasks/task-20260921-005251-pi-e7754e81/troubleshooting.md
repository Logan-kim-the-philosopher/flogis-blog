# Troubleshooting

## 해결 기록

- 최초 테스트는 프로젝트 `node_modules`가 없어 새 helper의 `zod` import에서 실패했다. 전사 CLI가 프로젝트 설치 상태에 덜 의존하도록 검수 결과를 명시적인 자체 스키마 검사로 바꿨고 테스트를 통과했다.
- `npm ci`의 첫 시도는 샌드박스 네트워크 DNS 제한으로 `registry.npmjs.org` 조회에 실패했다. 승인된 네트워크 실행으로 package-lock 기준 1,289개 패키지를 복원했다. 기존 Sanity peer dependency와 Node 25 engine 경고는 있었지만 설치와 Astro 빌드는 성공했다.
- 일반 `npx tsc --noEmit`은 기존 저장소의 Node 타입 설정, `astro:middleware`, Sanity 이미지 타입 오류로 실패했다. 새 Pi extension 자체는 Pi RPC smoke에서 실제 로드됐고 Astro 프로덕션 빌드는 통과했다. 이 기존 전역 타입 오류는 이번 전사 에이전트 범위에서 변경하지 않았다.
- OpenSuperWhisper를 처음에는 여러 WAV 경로와 `--json`으로 호출하도록 작성했지만, 설치된 0.12.2의 도움말을 확인한 결과 `bench <dir-of-wavs>`가 올바른 형식이었다. 실행기와 mock 통합 테스트를 실제 계약에 맞게 수정했다.
- OpenSuperWhisper 도움말 확인 과정에서 저장소 루트에 생성된 `default.profraw`는 `/tmp/flogis-transcribe-agent-help.profraw`로 옮겨 작업 트리에서 제거했다. 실제 전사 실행에는 `LLVM_PROFILE_FILE=/dev/null`이 설정되어 같은 파일이 생기지 않는다.

현재 기능을 막는 미해결 장애는 없다. `npm audit`은 저장소 기존 의존성에서 moderate 13건, high 6건, critical 1건을 보고했으며 이번 기능과 별도인 의존성 관리 작업으로 남긴다.

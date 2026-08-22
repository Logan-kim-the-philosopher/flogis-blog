# 결정

- 사용자의 요청에 따라 기존 `AGENTS.md` 및 `.loom/` 미커밋 변경을 버리지 않고 새 `Haru2_dev` 브랜치로 함께 이동했다.
- 재현 가능한 설치를 위해 `npm install` 대신 `package-lock.json`을 사용하는 `npm ci`를 선택했다.
- Sanity 키 발급과 `.env` 생성은 범위 밖으로 유지하고, 키가 없는 상태의 빈 콘텐츠 렌더링까지만 검증했다.
- npm 취약점 자동 수정은 의존성 및 잠금 파일을 바꿀 수 있어 실행하지 않았다.
- 호스트와 샌드박스의 localhost/PID 가시성 차이로 생성된 중복 서버는 정확한 PID를 확인한 뒤 종료하고, 공식 `astro dev --background` 인스턴스 하나만 남겼다.

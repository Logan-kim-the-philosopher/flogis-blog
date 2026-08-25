# 문제 해결 기록

이번 설치에서는 다운로드 중단, 부분 파일, 모델 인식 오류가 발생하지 않았다.

향후 파일 손상이나 중단이 의심되면 `.meeting-agent/models/ggml-large-v3-turbo.bin.part` 잔여 여부를 확인하고 setup 명령을 다시 실행한다. 완성된 target 파일이 이미 존재하면 setup 스크립트는 재다운로드하지 않는다.

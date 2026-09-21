# Previous Results

## 1. 연진님 Loom 피드백 음성 단독 전사

# 결과

- 원본 `/Users/hongyongjae/Desktop/26-09-21_연진님_Loom_피드백.m4a` 한 건을 확인했다. 길이 1023.542018초(17분 3초), 크기 16,784,415바이트다.
- OpenSuperWhisper의 한국어 `ggml-large-v3-turbo.bin` 모델로 18개 시간창에 대한 원본·보정·세부·문맥 후보 90개를 로컬 전사했다.
- 후보를 직접 대조해 인식이 갈린 발표 자료 제목·업무 용어·이름 등 10곳을 `확인 필요`로 표시했다. 외부 Pi 모델에는 전사 텍스트를 보내지 않았다.
- 바탕화면에 독립 결과 `/Users/hongyongjae/Desktop/26-09-21_연진님_Loom_피드백_전사.txt`를 저장했다. 현래님 파일은 이 Task에서 처리하지 않았다.
- 원본 SHA-256 `45af828f2831fc10fce6ff5be6730a33e6b3d90f58086cbe6974c8d9208ea256`이 처리 전후 동일하다. 결과는 12,593바이트, SHA-256 `b0f7c340d865ba978b6445becd7c1b7ec4272ada0f8476783cc759f31dfb47cd`다.

## 검증

- `ffprobe` 길이·크기 확인.
- TXT 18구간 및 최종 `[00:16:06–00:17:03]` 확인.
- 실제 원본·결과 해시와 `result.json` 기록 일치, 결과 크기 일치, UTF-8 대체 문자 없음.
- `loom task validate --strict`, `loom validate --strict`, `git diff --check` 통과.

## 한계

- 원음을 직접 청취한 검수는 아니며, 90개 로컬 전사 후보의 교차 대조를 바탕으로 정리했다. 확인 필요 10곳은 원음 최종 확인이 유용하다.

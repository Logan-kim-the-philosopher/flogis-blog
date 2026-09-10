# Notes

## 2026-09-10T11:00:20+00:00

결과: /Users/hongyongjae/Desktop/OAHYO_TEAM/회의기록에서 요청한 m4a 3건(07:25, 74:23, 14:35)을 식별해 같은 기본 이름의 Markdown 3개를 생성했다. 출력 크기는 각각 7,045 / 53,864 / 7,324바이트이며 임시 최종본과 cmp로 모두 동일함을 검증했다. 원본 음성은 변경하지 않았고 외부 모델·Sanity에는 전송하거나 게시하지 않았다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `result`, `transcription`, `validation`
## 2026-09-10T11:00:20+00:00

결정: OpenSuperWhisper 0.12.2의 Whisper large-v3-turbo 한국어 설정을 사용했다. 장시간 파일은 전체 단일 전사에서 무음부 반복 오인식이 보여 10분 단위 8구간으로 재전사했고, 겹침이 심한 방향성 회의는 2분 단위 추가 대조를 수행했다. OHAYO 구조·디버깅 기준 문서로 기술 용어만 교정하고 화자 이름은 추정하지 않았으며 확정할 수 없는 발화는 [불명확]으로 남겼다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `decision`, `opensuperwhisper`, `privacy`
## 2026-09-10T11:00:20+00:00

문제 해결: OpenSuperWhisper VAD의 구간 로그에는 실제 시각과 다른 음수 시작 시각이 표시되어 ffmpeg로 확인한 실제 구간 경계를 Markdown 제목에 사용했다. HTTP 메서드 불일치 코드 409→405, Loom·React·Django·Serializer·ORM·REST API 등의 명백한 오인식은 기준 문서와 문맥으로 교정했다. 다중 화자·주변 대화 구간은 추측 교정을 피했다.

- Task: `task-20260910-101551-ohayo-3-236f30b5`
- Tags: `troubleshooting`, `review`, `uncertainty`

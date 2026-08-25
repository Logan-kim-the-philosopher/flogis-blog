# 주요 결정

1. 사용자 요청대로 Markdown 2개와 PDF 1개를 합치지 않고 고유 ID/slug의 study 3건으로 분리했다.
2. 기존 study 스키마에 file 필드가 없으므로 스키마·프론트엔드를 변경하지 않고, PDF 원본은 Markdown 다운로드 링크로, 각 페이지는 Markdown 이미지로 제공했다. 현재 SSR Markdown 렌더러가 두 형식을 모두 지원한다.
3. PDF 메타데이터의 작성자가 `홍용재`이고 세 자료가 동일한 파이썬 심화 세션 폴더에 있으므로 기존 `person-yongjae-hong` 참조를 세 문서에 재사용했다.
4. 상세 페이지가 이미 문서 제목을 `<h1>`으로 렌더링하므로 Markdown 두 파일의 첫 번째 `#` 제목만 제거했다. 그 외 본문 구조와 내용은 원문 그대로 유지했다.
5. PDF 첫 페이지가 세션 전체를 대표하는 16:9 타이틀 슬라이드이므로 30개 이미지 중 첫 페이지 asset을 세 문서의 공통 cover로 재사용했다.
6. asset 업로드 후 세 문서 생성은 단일 Sanity transaction으로 실행해 문서가 일부만 생성되는 상태를 피했다.
7. 콘텐츠는 Astro Node SSR이 매 요청 Sanity를 조회하므로 코드 커밋·Jenkins 재빌드·Argo 배포 없이 production 사이트에 즉시 반영했다.

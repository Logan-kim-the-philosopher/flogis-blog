# Content Model

## 공통 원칙
세 콘텐츠 타입은 모두 Markdown 본문 기반입니다.

공통 필드:
- `title`: 제목 (**필수**)
- `slug`: URL slug (**필수**)
- `publishedAt`: 발행일 (**필수**)
- `coverImage`: 실제 내용과 맞는 대표 이미지가 있을 때만 입력하는 선택값
- `tags`: 태그 배열 (선택)
- `body`: Markdown 본문 (**필수**)

프론트 동작 규칙:
- `title` 또는 `slug`가 없는 문서는 목록에서 제외됩니다.
- 잘못된 날짜는 기본값으로 정규화되며 최신순 정렬에서 뒤로 밀립니다.
- `coverImage`가 비어 있으면 카드·상세·콘텐츠 OG 이미지에서 이미지 요소 자체를 생략합니다.
- `authors` / `participants`는 최소 1명의 `person` 참조가 필요합니다.

## study
스터디/학습 기록용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage?: string`
- `authors: Person[]`
- `tags?: string[]`
- `body: string`

## work
실행 로그/작업 결과용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage?: string`
- `authors: Person[]`
- `tags?: string[]`
- `body: string`

## meeting
회의/인터뷰/대화 기록용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage?: string`
- `participants: Person[]`
- `tags?: string[]`
- `body: string`

## person
사람 문서입니다.

필드:
- `name: string`
- `slug: string`
- `role: string`
- `bio?: string`
- `avatar?: string`
- `links?: { label: string; href: string }[]`

## siteSettings
사이트 메타 설정입니다.

필드:
- `title: string` (**필수**)
- `description: string` (**필수**)
- `tagline: string` (**필수**)
- `heroText: string` (**필수**)
- `nav: { label: string; href: string }[]`
- `socialLinks: { label: string; href: string }[]`
- `seo.title: string`
- `seo.description: string`
- `seo.image: string`

운영 규칙:
- `siteSettings`는 운영 배포 전 반드시 1개 있어야 합니다.
- `SANITY_STRICT_CONTENT=true`일 때 `siteSettings`가 없으면 해당 런타임 요청을 명시적 오류로 처리합니다.

## 권장 입력 순서
1. `siteSettings`
2. `person`
3. `study`
4. `meeting`
5. `work`

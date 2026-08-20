# Content Model

## 공통 원칙
세 콘텐츠 타입은 모두 Markdown 본문 기반입니다.

공통 필드:
- `title`: 제목
- `slug`: URL slug
- `publishedAt`: 발행일
- `coverImage`: 대표 이미지 URL
- `tags`: 태그 배열
- `body`: Markdown 본문

## study
스터디/학습 기록용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage: string`
- `authors: Person[]`
- `tags?: string[]`
- `body: string`

## work
실행 로그/작업 결과용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage: string`
- `authors: Person[]`
- `tags?: string[]`
- `body: string`

## meeting
회의/인터뷰/대화 기록용 타입입니다.

필드:
- `title: string`
- `slug: string`
- `publishedAt: string`
- `coverImage: string`
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
- `title: string`
- `description: string`
- `tagline: string`
- `heroText: string`
- `nav: { label: string; href: string }[]`
- `socialLinks: { label: string; href: string }[]`
- `seo.title: string`
- `seo.description: string`
- `seo.image: string`

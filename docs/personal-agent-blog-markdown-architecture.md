# 개인 에이전트 블로그 Markdown 운영 구조

## 1. 문서 목적

현재 Flogis 블로그 프런트엔드의 디자인과 라우팅을 별도 저장소로 복제한 뒤, 개인 에이전트가 글·메타데이터·썸네일을 로컬 파일로 만들고 Git 배포 흐름으로 발행하는 목표 구조를 정의한다.

이 문서는 새 개인 블로그의 설계 기준이다. 현재 운영 중인 Flogis 블로그와 Sanity production 데이터는 변경하지 않는다.

## 2. 결정

개인 에이전트 블로그는 Sanity 대신 다음 구성을 사용한다.

- 콘텐츠: Astro Content Collections와 Markdown 또는 MDX
- 콘텐츠 메타데이터: 각 글의 frontmatter
- 썸네일: 저장소의 로컬 WebP 이미지
- 사이트 설정: 버전 관리되는 JSON 또는 TypeScript 파일
- 초안과 공개 상태: `draft` frontmatter
- 변경 이력과 복구: Git
- 발행: 검증된 커밋을 배포 브랜치에 반영한 뒤 자동 빌드·배포

Sanity를 제거하는 주된 이유는 편집 주체가 브라우저 CMS를 사용하는 여러 사람이 아니라 저장소에 접근할 수 있는 개인 에이전트이기 때문이다. 글 하나를 발행하기 위해 Sanity 프로젝트, 데이터셋, 토큰, CORS, MCP와 별도 스키마를 함께 운영할 필요가 없다.

Sanity가 필요한 아래 요구가 생기면 다시 도입을 검토한다.

- 비개발자가 브라우저나 휴대전화에서 직접 편집해야 한다.
- 여러 편집자가 역할과 권한을 나누어 콘텐츠를 관리한다.
- 프런트엔드 재배포 없이 콘텐츠를 즉시 바꿔야 한다.
- 예약 발행, 실시간 미리보기 또는 복잡한 편집 승인 절차가 필요하다.
- 동일한 콘텐츠를 여러 애플리케이션에서 API로 소비한다.

## 3. 현재 구조와 목표 구조

### 현재 Flogis 블로그

```text
작성자/에이전트
  -> Sanity Studio 또는 API
  -> Sanity production dataset
  -> Astro Node SSR이 요청마다 GROQ 조회
  -> 방문자
```

현재 구조의 세부 내용은 [`docs/architecture.md`](./architecture.md)와 [`docs/runtime-content-architecture.md`](./runtime-content-architecture.md)를 기준으로 한다.

### 개인 에이전트 블로그

```text
개인 에이전트
  -> Markdown 초안 + 로컬 썸네일
  -> 스키마/링크/빌드 검증
  -> 사용자 최종 검토
  -> Git 커밋 및 배포 브랜치 반영
  -> Astro 정적 빌드
  -> 방문자
```

게시물 변경에는 재빌드가 필요하다. Git 기반 자동 배포가 이를 담당하므로 사용자는 서버나 CMS를 직접 조작하지 않는다.

## 4. 목표 디렉터리 구조

```text
personal-agent-blog/
├── public/
│   └── images/
│       └── posts/
│           └── 2026-09-21-first-post.webp
├── src/
│   ├── content/
│   │   └── posts/
│   │       └── 2026-09-21-first-post.md
│   ├── data/
│   │   ├── authors.json
│   │   └── site.json
│   ├── pages/
│   └── content.config.ts
├── docs/
└── package.json
```

초기에는 `study`, `meeting`, `work`를 서로 다른 폴더나 컬렉션으로 나누지 않는다. 하나의 `posts` 컬렉션에 저장하고 `kind` 값으로 구분한다. 현재 URL을 유지해야 한다면 `kind`에 따라 `/study`, `/meetings`, `/work` 라우트로 연결한다.

## 5. 게시물 파일 규칙

### 파일명

```text
YYYY-MM-DD-영문-kebab-slug.md
```

예:

```text
2026-09-21-nodejs-session-review.md
```

파일명은 정렬과 탐색을 위한 값이며 공개 URL은 `slug`를 기준으로 한다. 이미 발행한 `slug`는 링크 보존을 위해 바꾸지 않는다.

### frontmatter 예시

```md
---
title: "Node.js 세션을 준비하며 확인한 것"
description: "세션 리허설과 피드백에서 확인한 실행 흐름을 정리한다."
slug: "nodejs-session-review"
kind: "study"
publishedAt: 2026-09-21
updatedAt: 2026-09-21
authors:
  - "hongyongjae"
tags:
  - "nodejs"
  - "session"
coverImage: "/images/posts/2026-09-21-nodejs-session-review.webp"
draft: true
---

## 배경

본문을 Markdown으로 작성한다.
```

필드 규칙은 다음과 같다.

| 필드 | 필수 | 규칙 |
| --- | --- | --- |
| `title` | 예 | 공개 제목, 4~120자 |
| `description` | 예 | 목록·검색·SEO에 사용할 한두 문장 |
| `slug` | 예 | 소문자 ASCII kebab-case, 전체 글에서 고유 |
| `kind` | 예 | `study`, `meeting`, `work` 중 하나 |
| `publishedAt` | 예 | `YYYY-MM-DD` |
| `updatedAt` | 아니요 | 의미 있는 본문 수정일 |
| `authors` | 예 | `authors.json`의 ID 배열 |
| `participants` | 회의만 | 회의 참여자 ID 배열 |
| `tags` | 아니요 | 중복 없는 소문자 kebab-case, 최대 8개 |
| `coverImage` | 아니요 | `public` 기준 절대 경로 |
| `draft` | 예 | 검토 전 `true`, 발행 승인 뒤 `false` |

개인정보, 인증 정보, 내부 주소, 고객 데이터와 공개할 수 없는 대화는 frontmatter와 본문 모두에 저장하지 않는다.

## 6. Astro Content Collections

Astro 공식 Content Collections의 `glob()` loader로 로컬 Markdown을 읽고 Zod 스키마로 frontmatter를 검증한다. 공식 기준은 [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)를 따른다.

목표 설정 예시는 다음과 같다.

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}'
  }),
  schema: z.object({
    title: z.string().min(4).max(120),
    description: z.string().min(10).max(240),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(['study', 'meeting', 'work']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    authors: z.array(z.string()).min(1),
    participants: z.array(z.string()).optional(),
    tags: z.array(z.string()).max(8).default([]),
    coverImage: z.string().startsWith('/images/posts/').optional(),
    draft: z.boolean().default(true)
  }).superRefine((post, ctx) => {
    if (post.kind === 'meeting' && !post.participants?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['participants'],
        message: 'meeting 글에는 participants가 필요합니다.'
      });
    }
  })
});

export const collections = { posts };
```

구현 시 목록과 상세 페이지는 `getCollection('posts')`와 `getEntry('posts', id)`를 사용한다. 운영 빌드에서는 `draft: false`인 글만 라우트, 검색, RSS와 사이트맵에 포함한다.

## 7. 사이트 설정과 작성자

사이트 전체에서 한 번만 쓰는 값은 게시물 frontmatter에 반복하지 않는다.

`src/data/site.json`에는 다음 값을 둔다.

- 사이트 이름과 설명
- 기본 SEO 이미지
- 내비게이션
- 소셜 링크

`src/data/authors.json`에는 다음 값을 둔다.

- 변경하지 않는 작성자 ID
- 표시 이름
- 소개
- 프로필 이미지 경로
- 공개 소셜 링크

빌드 시 게시물이 참조한 작성자·참여자 ID가 실제 데이터에 존재하는지 검증한다.

## 8. 이미지 운영

에이전트가 생성한 대표 이미지는 기본적으로 `public/images/posts`에 WebP로 저장한다.

- 파일명은 게시물 날짜와 slug를 사용한다.
- 동일 slug의 이미지를 덮어쓸 때 브라우저 캐시 문제가 있으면 파일명에 짧은 콘텐츠 해시를 추가한다.
- 게시물 한 건당 대표 이미지 한 장을 기본으로 한다.
- 원본 생성 파일이 크면 Git에 넣지 않고 최종 압축본만 저장한다.
- 저장소 크기가 운영에 부담이 되는 시점에만 S3/R2 같은 객체 저장소를 검토한다.

이미지가 없는 게시물도 현재 카드와 상세 화면이 자연스럽게 표시되어야 한다.

## 9. 개인 에이전트 발행 흐름

### 1단계: 입력 수집

에이전트는 TXT, Markdown, 전사본 또는 현재 세션 요약을 읽는다. 읽을 수 없는 자료와 공개 범위를 확인한다.

### 2단계: 초안 생성

본문과 frontmatter를 작성하되 항상 `draft: true`로 저장한다. 기존 slug와 이미지 파일명의 충돌을 검사한다.

### 3단계: 썸네일 생성

게시물의 핵심 시각 요소를 하나 정하고 실제 WebP 파일을 생성한다. frontmatter의 `coverImage`가 저장된 파일과 일치하는지 확인한다.

### 4단계: 자동 검증

다음 검사를 통과해야 한다.

- frontmatter 스키마 검증
- 중복 slug 검사
- 작성자·참여자 참조 검사
- 이미지 경로와 파일 존재 검사
- 내부 링크 검사
- 비밀값과 명백한 개인정보 검사
- `npm run build`

`astro check`를 검증 명령으로 추가한다면 `@astrojs/check` 의존성과 프로젝트 스크립트도 함께 관리한다.

### 5단계: 사용자 검토

에이전트는 다음 항목을 한 화면 또는 하나의 preview 문서로 제시한다.

- 제목, 설명, slug와 공개 경로
- 작성자·참여자와 태그
- 최종 본문
- 썸네일
- 변경 파일 목록
- 빌드·링크 검사 결과

사용자는 이 단계에서 수정하거나 취소할 수 있다.

### 6단계: 발행 승인

명시적인 최종 승인 뒤에만 `draft: false`로 바꾼다. 승인되지 않은 초안은 커밋할 수 있지만 운영 배포 대상에는 포함하지 않는다.

### 7단계: Git 반영과 배포

에이전트는 게시물, 이미지와 필요한 인덱스 변경을 하나의 커밋으로 만든다. 원격 push 또는 배포 브랜치 병합은 사용자에게 승인된 범위에서만 수행한다. CI가 빌드에 성공한 커밋만 운영에 배포한다.

## 10. Sanity 제거 범위

새 개인 블로그 저장소에서 다음 항목을 단계적으로 교체하거나 제거한다.

| 현재 항목 | 목표 처리 |
| --- | --- |
| `sanity.config.ts`, `sanity.cli.ts` | 제거 |
| `sanity/` 스키마와 seed | Content Collections 스키마와 Markdown으로 교체 |
| `src/lib/cms/client.ts` | 제거 |
| `src/lib/cms/queries.ts` | 제거 |
| `src/lib/cms/images.ts` | 로컬 이미지 경로 처리로 교체 |
| `src/lib/repositories/*` | `astro:content` 조회 adapter로 교체 |
| `SANITY_*` 환경 변수 | 제거 |
| `sanity`, `@sanity/client`, `@sanity/image-url`, `groq` | 사용처 제거 후 의존성 삭제 |
| Studio 실행·배포 스크립트 | 제거 |
| Sanity 발행 에이전트 | Markdown 파일 생성·검증 에이전트로 교체 |

카드, 레이아웃, 상세 화면, 태그·사람 집계, 검색, RSS와 사이트맵은 기존 코드를 가능한 한 재사용한다.

## 11. SSR에서 정적 빌드로의 전환

Sanity를 제거한 직후에는 기존 Node SSR을 유지해 콘텐츠 계층 교체를 먼저 검증할 수 있다. 기능이 같다는 것을 확인한 뒤 Astro 기본 정적 출력으로 전환한다.

정적 전환 시 확인할 항목은 다음과 같다.

- 동적 `[slug]` 라우트가 `getStaticPaths()`로 공개 글 경로를 생성한다.
- `/api/search.json`, RSS와 사이트맵이 빌드 시 같은 공개 글 집합을 사용한다.
- `draft: true` 글은 어떤 공개 endpoint에도 나타나지 않는다.
- 기존 404 동작과 canonical URL을 유지한다.
- Node adapter와 standalone 서버가 필요하지 않다면 제거한다.

## 12. 단계별 마이그레이션

### 단계 A: 안전한 복제

1. 현재 저장소를 새로운 개인 블로그 저장소로 복제한다.
2. 운영 Flogis 원격 저장소와 배포 대상을 분리한다.
3. 새 사이트 이름, 도메인과 배포 브랜치를 확정한다.

완료 기준: 개인 저장소의 변경이 기존 운영 블로그 CI/CD를 실행하지 않는다.

### 단계 B: 로컬 콘텐츠 계층 추가

1. `src/content.config.ts`와 `posts` 컬렉션을 추가한다.
2. 사이트·작성자 데이터를 로컬 파일로 옮긴다.
3. 대표 Markdown 게시물 세 종류를 각각 한 건씩 만든다.
4. repository 인터페이스 뒤의 데이터 원본을 Content Collections로 교체한다.

완료 기준: study, meeting, work의 목록·상세·태그·사람·검색·RSS·사이트맵이 로컬 파일만으로 표시된다.

### 단계 C: Sanity 분리

1. 모든 Sanity import와 환경 변수 사용처를 검색한다.
2. CMS client, GROQ query, Studio와 관련 의존성을 제거한다.
3. Sanity 설정 없이 빌드와 실행이 가능한지 확인한다.

완료 기준: `rg -n "sanity|SANITY_|groq"` 결과에 의도적으로 남긴 마이그레이션 문서 외 런타임 사용처가 없다.

### 단계 D: 정적 배포 전환

1. 정적 출력과 `getStaticPaths()`를 적용한다.
2. CI가 콘텐츠 검증과 production build를 수행하게 한다.
3. preview 배포에서 전체 라우트를 확인한다.

완료 기준: 새 글 커밋 후 자동 배포가 완료되고, 공개 URL에서 글·이미지·SEO·검색·RSS가 확인된다.

### 단계 E: 개인 에이전트 연결

1. 블로그 작성 확장이 새 frontmatter 스키마를 사용하게 한다.
2. 초안과 썸네일을 실제 파일로 생성한다.
3. 검증 실패 시 발행을 막고 수정 가능한 preview를 보존한다.
4. 최종 승인 뒤에만 공개 상태와 Git 반영을 진행한다.

완료 기준: 입력 자료 한 건으로 초안 생성부터 preview, 승인, 커밋과 배포까지 재현 가능하다.

## 13. 기존 콘텐츠를 가져오는 경우

개인 블로그를 새 글로 시작하면 Sanity 콘텐츠 이전은 생략한다. 기존 글 일부를 가져와야 하면 다음 순서를 사용한다.

1. Sanity dataset을 읽기 전용으로 export한다.
2. `study`, `meeting`, `work`, `person`, `siteSettings`만 변환 대상으로 고른다.
3. 각 문서를 Markdown과 로컬 메타데이터로 변환한다.
4. Sanity 이미지 자산을 내려받아 로컬 WebP로 저장하고 경로를 교체한다.
5. 문서 수, slug, 본문 해시와 이미지 존재 여부를 원본과 비교한다.

변환이 끝나도 기존 Sanity 프로젝트나 운영 데이터를 즉시 삭제하지 않는다.

## 14. 검증 기준

구현 완료 판단에는 다음 검사가 필요하다.

- 모든 Markdown이 Content Collections 스키마를 통과한다.
- 공개 slug가 중복되지 않는다.
- 회의 글에는 최소 한 명의 참여자가 있다.
- 참조된 작성자·참여자와 이미지 파일이 존재한다.
- 초안이 홈, 목록, 상세 경로, 검색, RSS와 사이트맵에 노출되지 않는다.
- 홈과 모든 주요 목록·상세 경로가 production build에서 생성된다.
- 없는 slug가 404를 반환한다.
- canonical URL과 Open Graph 이미지가 새 도메인을 가리킨다.
- Sanity 자격 증명 없이 빌드와 배포가 성공한다.
- 새 저장소의 배포가 기존 Flogis 운영 환경을 변경하지 않는다.

## 15. 롤백 기준

각 전환 단계는 독립 커밋으로 남긴다. 검증이 실패하면 해당 단계의 커밋을 되돌리고 마지막 성공 상태로 배포한다.

- 콘텐츠 계층 전환 중에는 기존 Sanity repository 구현을 삭제하기 전에 비교 가능한 상태로 유지한다.
- 새 개인 블로그 배포가 검증될 때까지 기존 Flogis 블로그와 Sanity production은 변경하지 않는다.
- 이전한 콘텐츠는 문서 수, slug, 본문과 이미지 검증이 끝날 때까지 원본 Sanity export와 함께 보존한다.
- 배포 실패 시 마지막 성공 이미지나 마지막 성공 정적 산출물을 다시 배포할 수 있어야 한다.

## 16. 구현 작업 경계

이 문서 다음의 실제 구현은 별도 작업으로 진행한다.

1. 개인 블로그 저장소와 독립 배포 대상 생성
2. Content Collections와 샘플 콘텐츠 구현
3. repository와 라우트의 로컬 콘텐츠 전환
4. Sanity 런타임과 의존성 제거
5. 정적 빌드·CI/CD 전환
6. 개인 에이전트의 Markdown·썸네일 발행 흐름 연결

현재 Flogis 운영 저장소에서 위 변경을 직접 시작하지 않는다.

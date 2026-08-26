# Thumbnail Agent Workflow

## Goal
블로그 본문을 읽고 내용을 이해한 뒤, 핵심을 **추상화/단순화한 썸네일 이미지 프롬프트**를 만들고, 항상 비슷한 톤의 결과가 나오도록 **일관된 스타일 규칙**을 적용한 다음, 그 프롬프트로 이미지를 생성한다.

이 문서는 특정 제품 전용이 아니라, 어떤 **로컬 CLI 에이전트**에도 옮겨 쓸 수 있는 작업 규칙이다.

---

## What the agent must do
1. **Read and understand the article**
2. **Abstract the article into one visual idea**
3. **Apply Flogi thumbnail style rules**
4. **Write a production-ready image prompt**
5. **Generate the image**

---

## Success criteria
- 본문 요약 카드처럼 보이지 않는다.
- 텍스트 설명보다 **핵심 개념 1개**가 먼저 보인다.
- 썸네일끼리 색감/구도/밀도가 크게 흔들리지 않는다.
- 글마다 다른 내용을 담되, 같은 시리즈처럼 보인다.

---

## Input
- article title
- article body
- category/tags if available
- optional author intent

---

## Output
에이전트는 최소한 아래 4개를 만든다.

### 1) Understanding summary
- article thesis
- audience
- 3 key concepts
- what should **not** be shown literally

### 2) Visual abstraction
- chosen hook
- chosen metaphor
- composition direction

### 3) Final style-applied prompt
- 바로 이미지 모델에 넣을 수 있는 최종 프롬프트

### 4) Generation metadata
- aspect ratio
- negative prompt
- seed/style preset if supported

---

## Procedure

### Step 1. Understand the article
에이전트는 먼저 아래를 짧게 정리한다.
- 이 글이 실제로 설명하는 한 문장
- 독자가 읽고 얻는 가장 큰 구분 1개
- 썸네일에서 밀어야 할 대비 1개

### Step 2. Pick exactly one hook
한 썸네일에 훅은 하나만 쓴다.

허용되는 훅 유형:
- **contrast**: 예) VM vs Container
- **flow**: 예) Unix → Linux → Distribution
- **layer**: 예) app → syscall → kernel → hardware
- **metaphor**: 예) shared engine vs separate machine

금지:
- 글의 모든 소제목을 다 넣는 것
- 요약 카드처럼 bullet을 여러 개 늘어놓는 것
- 설명 텍스트를 과하게 올리는 것

### Step 3. Abstract before rendering
본문 용어를 그대로 나열하지 말고, 먼저 시각 구조로 바꾼다.

예시:
- VM vs Container → **two isolated stacks vs one shared core**
- Unix to Linux → **lineage / branching path**
- kernel concept → **hidden central engine**

질문 체크:
- 이 이미지는 글을 읽지 않은 사람도 한눈에 구분을 느낄 수 있는가?
- 텍스트 없이도 어느 정도 의미가 전달되는가?

### Step 4. Apply Flogi house style

## Flogi visual style
- mood: calm, intelligent, minimal, technical
- avoid: hype, meme, loud YouTube aesthetics, clickbait face thumbnails
- palette:
  - background: deep navy / charcoal / muted ivory 중 하나
  - accent: electric blue or cyan 하나만 사용
  - support colors: grayscale 위주
- composition:
  - 중심 개념 1개 크게
  - 보조 요소 2~4개 이하
  - 넓은 여백 유지
  - 텍스트는 없거나 아주 짧게
- typography if text is used:
  - 최대 2~5단어
  - 제목 전체를 그대로 넣지 말 것
  - 설명문/불릿/긴 문장 금지
- texture:
  - flat or lightly editorial
  - subtle glow or diagrammatic precision allowed
  - noisy 3D, glossy marketing render, photobash 느낌 금지

### Step 5. Prompt structure
최종 프롬프트는 아래 순서를 따른다.
1. subject
2. abstraction/metaphor
3. composition
4. mood
5. palette
6. rendering style
7. constraints

Prompt skeleton:

```text
Create a blog thumbnail image about: {core concept}.
Show it as: {chosen visual metaphor}.
Composition: {layout and focal structure}.
Mood: calm, intelligent, minimal, technical.
Style: consistent editorial technology thumbnail, clean shapes, restrained detail, generous negative space.
Color palette: {background} with a single {accent} accent and neutral supporting tones.
Text: {none | very short phrase only}.
Avoid: infographic card layout, excessive labels, meme aesthetics, stock-photo look, glossy marketing art, clutter.
Aspect ratio: 16:9.
```

### Step 6. Negative prompt
```text
busy infographic, bullet list card, too much text, ui screenshot, stock photo, photoreal office scene, youtube clickbait, reaction face, neon overload, messy composition, cheap 3d render, random icons, watermark, logo clutter
```

---

## Recommended output schema
```json
{
  "title": "",
  "thesis": "",
  "hook": "",
  "metaphor": "",
  "composition": "",
  "stylePreset": "flogi-minimal-tech",
  "prompt": "",
  "negativePrompt": "",
  "size": "1536x864"
}
```

---

## Example: Unix / Linux / VM / Container article

### Good hook choices
- `VM vs Container`
- `Who owns the kernel?`
- `Unix → Linux → Container`

### Best single-image direction
이 글은 정보량이 많아서 전체 계보를 다 담기보다,
**"VM은 자기 커널 / Container는 호스트 커널 공유"**를 메인 훅으로 잡는 편이 썸네일성이 높다.

### Example prompt
```text
Create a blog thumbnail image about the difference between virtual machines and containers in Linux infrastructure.
Show it as two contrasting system structures: on the left, separate isolated stacks with their own kernels; on the right, multiple lightweight containers sharing one central host kernel.
Composition: split-screen comparison with a strong central dividing line, simple layered blocks, one clearly visible shared core on the container side, and heavier separated stacks on the VM side.
Mood: calm, intelligent, minimal, technical.
Style: consistent editorial technology thumbnail, clean geometric forms, subtle diagrammatic feel, restrained detail, generous negative space.
Color palette: dark navy background with a single cyan accent and neutral gray supporting tones.
Text: none.
Avoid: infographic card layout, long labels, excessive arrows, stock illustration style, glossy 3D marketing visuals, clutter.
Aspect ratio: 16:9.
```

---

## Hard rules
- 한 이미지에 **핵심 개념 하나만** 넣는다.
- 본문을 "요약 카드"로 바꾸지 않는다.
- 텍스트로 설명하지 말고 구조/은유로 보여준다.
- 항상 같은 팔레트 계열과 밀도를 유지한다.
- 출력 전에 "이게 Flogi 썸네일 시리즈처럼 보이는가"를 자가 점검한다.

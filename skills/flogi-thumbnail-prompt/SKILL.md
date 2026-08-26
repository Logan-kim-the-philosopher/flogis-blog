---
name: flogi-thumbnail-prompt
description: Read a blog post, reduce it to one strong visual hook, apply Flogi thumbnail style rules, and produce a generation-ready thumbnail prompt. Use for article thumbnails or social images in Codex or other local CLI agents.
license: MIT
compatibility: Works as a document-first local agent skill. Image generation is optional; use any connected image model or image-generation tool.
---

# Flogi Thumbnail Prompt Skill

## When to Use
Use this when you have a blog post, study note, meeting note, or work log and want an agent to:
1. understand the article,
2. choose one thumbnail-worthy hook,
3. convert it into a simple visual concept,
4. write a strong final image prompt,
5. optionally generate image variants.

This skill is for local-agent workflows, not server-side OG generation.

## Inputs
Provide as much of this as you have:
- article title
- article body
- tags/category
- optional author intent
- optional preferred thumbnail direction

## Required Behavior
The agent must:
1. read the post before proposing visuals,
2. summarize the thesis and audience,
3. choose exactly one hook,
4. avoid summary-card and infographic aesthetics,
5. apply the Flogi style rules,
6. output a generation-ready prompt plus a negative prompt.

## Procedure

### Step 1. Understand the article
Summarize:
- the article thesis in one sentence,
- the main reader takeaway,
- the one contrast or structure that should drive the image.

### Step 2. Pick exactly one hook
Allowed hook types:
- contrast
- flow
- layer
- metaphor

Examples:
- VM vs Container
- Unix → Linux
- shared kernel vs separate kernel

Do not try to represent the entire article at once.

### Step 3. Abstract before rendering
Convert topic structure into a visual structure before writing the final prompt.

Examples:
- VM vs Container → two isolated stacks vs one shared core
- Unix to Linux → lineage / branching path
- kernel concept → hidden central engine

The image should still read at thumbnail size.

### Step 4. Apply Flogi style
Use this house style consistently:
- mood: calm, intelligent, minimal, technical
- palette: deep navy / charcoal / muted ivory base
- accent: one electric blue or cyan accent
- composition: one dominant concept, 2-4 supporting elements max, generous negative space
- text: none or extremely short
- rendering: premium editorial technology illustration, restrained detail

Avoid:
- busy infographic cards
- bullet-list cards
- long labels
- stock-photo office scenes
- YouTube clickbait faces
- neon overload
- glossy marketing 3D
- clutter

### Step 5. Write the final prompt
Use this order:
1. subject
2. abstraction or metaphor
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
Style: premium editorial technology thumbnail, clean shapes, restrained detail, generous negative space.
Color palette: {background} with a single {accent} accent and neutral supporting tones.
Text: {none | very short phrase only}.
Avoid: infographic card layout, excessive labels, meme aesthetics, stock-photo look, glossy marketing art, clutter.
Aspect ratio: 16:9.
```

### Step 6. Add negative prompt
Use or adapt:

```text
busy infographic, bullet list card, too much text, ui screenshot, stock photo, photoreal office scene, youtube clickbait, reaction face, neon overload, messy composition, cheap 3d render, random icons, watermark, logo clutter
```

### Step 7. Optional image generation
If the host agent has image generation available, create 2-3 variants:
- A: editorial hero
- B: minimal premium
- C: abstract cinematic

Then rank them by thumbnail readability, not by detail richness.

## Output Format
Return at least this structure:

```json
{
  "title": "",
  "thesis": "",
  "audience": "",
  "hook": "",
  "metaphor": "",
  "composition": "",
  "stylePreset": "flogi-minimal-tech",
  "prompt": "",
  "negativePrompt": "",
  "size": "1536x1024"
}
```

## Hard Rules
- One thumbnail = one concept.
- Do not turn the article into a summary card.
- Show structure or metaphor before explanation.
- Keep text absent or minimal.
- Preserve series consistency across outputs.

## Verification
The result should pass all checks:
1. One clear idea is visible at a glance.
2. It looks like a thumbnail, not a document summary.
3. The palette and density fit a calm tech-editorial series.
4. The prompt is ready to send directly to an image model.

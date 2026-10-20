# Editorial Cinematic Paper

Use this guide when the selected theme is `editorial-cinematic-paper`, when explicitly requested or when continuing an existing deck with this theme.

## Selection precedence

1. If the user explicitly names a bundled Sense Deck style and the request matches it, use that style.
2. If the user gives a clear visual brief that is not a bundled style, honor the brief and adapt the nearest compatible template. Do not silently replace an explicit request with the default.
3. For a new deck with no visual direction, use `../references/premium-baselines.md` and `../templates/style-routing.json`; this theme is no longer the unspecified-style fallback.

Scenario selection and style selection are separate. Continue to choose the closest full deck for narrative structure, then apply this theme. When this theme is selected, use `editorial-cinematic-report` for report-like or process-heavy material, or when another full deck cannot accept it without major visual rewrites.

## Visual signature

- Warm ivory paper field with almost-black ink.
- One dark oxblood accent for numbers, bullets, focus, and short horizontal rules.
- Oversized Chinese Song/Ming serif titles with tight leading; compact sans-serif metadata in English or pinyin.
- Thin rules, square corners, bracket marks, page numbers, and editorial mastheads.
- Dense but calm information architecture: lists, diagrams, contact sheets, and captions sit on a consistent grid.
- Low-key cinematic stills: deep blacks, neutral midtones, motivated practical light, restrained saturation, and visible spatial depth.
- No glassmorphism, glossy gradients, floating rounded cards, neon, or decorative 3D objects.

## Adapt portrait references to presentation slides

The reference composition is portrait editorial poster design. Do not stretch it or paste it into a 16:9 slide. Translate its grammar:

| Portrait reference behavior | 16:9 deck translation |
|---|---|
| Tall single-column reading flow | 12-column stage with asymmetric 5/7 or 4/8 split |
| Large top title and long vertical body | Left title block plus right evidence field |
| Stacked film stills | Horizontal 2.35:1 strips or 2x2 contact sheets |
| Page number in upper right | Fixed page mark aligned to the masthead |
| Circular system stamp near footer | Optional compact mark in the closing or quote footer only |
| Diagram and captions below hero image | Evidence grid beside or directly below the image, never floating over the title |

Use a vertical 4:5 or 9:16 canvas only when the requested output is a social carousel or poster. For ordinary presentations, preserve the 16:9 slide stage.

## Layout repertoire

### 1. Thesis cover

- Masthead and page number at the top.
- Display title occupies 55% to 70% of the stage width.
- One short lead, one oxblood rule, and one closing line.
- Optional narrow cinematic strip; never a generic hero illustration.

### 2. Numbered workflow

- Left column: 01-08 step list with thin separators.
- Right column: one still or diagram per phase, using consistent crop ratios.
- Keep explanations to one line where possible.

### 3. System diagram

- Inputs in outlined fields, oxblood intermediary node, outputs below.
- Use thin solid/dashed connectors and short labels.
- Pair the diagram with two or three cinematic evidence frames, not decorative icons.

### 4. Image analysis board

- One large still plus a 2x2 or 3x2 crop grid.
- Captions identify lighting, composition, material, camera position, or evidence.
- White type may sit on the image only when contrast remains readable; otherwise put captions in the paper margin.

### 5. Process and quality loop

- Circular or linear flow built from small nodes and arrows.
- A diagnosis list sits in a separate ruled column.
- The takeaway occupies the full-width footer.

### 6. Closing statement

- Large serif conclusion, bracket corners, metadata line, and optional compact system mark.
- Remove all nonessential charts and UI.

## Cinematic image direction

When image generation or a supplied photo library is available, create local stills before finishing the deck. A useful brief has six parts:

```text
subject and action + physical location + motivated light source + time/weather + camera distance/lens behavior + restrained color treatment
```

Example:

```text
A product lead reviewing notes alone at a round table in a quiet apartment, one warm pleated desk lamp as the motivated key light, blue-hour city beyond the window, medium side profile with natural lens falloff, neutral whites and deep black separation, subtle film grain, no teal-orange blockbuster grade.
```

Image rules:

- Prefer wide or medium observational frames over glossy close-up portraits.
- Preserve highlight roll-off and shadow detail; avoid HDR compression.
- Keep whites neutral. Warm light should be local, not a full-frame yellow wash.
- Use sharpness selectively; do not over-sharpen the whole frame.
- Maintain shot continuity across the deck: subject, wardrobe, location, time, and palette should not drift.
- Store final images inside the deck, ideally as sized WebP/AVIF with JPEG fallback.
- Do not use remote hotlinks or leave assets on Desktop, Downloads, or provider output folders.
- The bundled `editorial-cinematic-report/assets/` stills demonstrate lighting, crop, and tonal direction only. Replace them with subject-specific local stills when generating a real deck; do not reuse them as decorative filler across unrelated topics.

When reliable image generation and inspection are unavailable, switch to `upload-slots` mode. Remove bundled demonstration stills and leave clean, empty image wells for the user to upload into. Do not create generic AI art, CSS scenery, SVG pseudo-photography, or abstract shapes to imitate a finished cinematic image. Finish the text, hierarchy, diagrams, spacing, and page composition without waiting for images.

Use a labeled slot such as:

```html
<figure class="ecp-still ecp-still--hero ecp-still--fallback" aria-label="上传一张 16:9 雨夜街景，人物位于右侧三分线">
  <figcaption class="ecp-still-label">上传图片 · 16:9 · 雨夜街景 · 人物靠右</figcaption>
</figure>
```

Keep each slot's target ratio and crop intent explicit so the user can replace it without changing the layout. `image-prompts.json` may be included as an optional handoff, but missing images must not block the completed text and layout deck.

## Implementation contract

- Add the theme after structural styles so its tokens and component overrides win:

```html
<link rel="stylesheet" href="./styles.css" />
<link rel="stylesheet" href="../../themes/editorial-cinematic-paper.css" />
```

- Keep slide copy as semantic HTML and retain `content-ir.json` as the editable source.
- Use the `.ecp-*` patterns from the theme for mastheads, page marks, fact rows, stills, diagrams, and quote footers.
- Do not rasterize text or use the reference screenshots as slide backgrounds.
- Do not reproduce phone chrome, playback controls, watermarks, brand marks, or text visible in a style-reference screenshot unless the user explicitly asks and owns those elements.
- Keep animation to transform and opacity; respect reduced motion.

## QA checklist

- The theme was selected only after applying the selection precedence.
- The title is one or two lines with deliberate wrapping.
- Oxblood appears sparingly and consistently.
- Every image is local, sized, and has correct alt behavior.
- `imageCapabilityMode` is recorded as `generate`, `user-supplied`, or `upload-slots`.
- In `upload-slots` mode, there are no bundled demo images, fake photographic fallbacks, or broken image elements; every missing image region is a labeled empty upload slot.
- Image crops are coherent across slides and do not repeat merely as decoration.
- Thin rules align to the 12-column grid.
- No pill cards, glass blur, neon, heavy shadows, or generic gradient backgrounds leaked in from the structural deck.
- The deck remains readable at 1280px, 768px, and a 375px-wide vertical preview.
- Keyboard, touch, speaker mode, focus states, and reduced-motion behavior work.

---
name: sense-deck
description: Create premium static HTML presentations from short themes or long source material by researching when needed, building a content IR, and assembling reusable themes, full deck templates, single-page layouts, animations, speaker mode, optional gesture navigation, and optional export artifacts. Use for PPT, slides, keynote-style decks, business presentations, technical sharing, short-video/short-drama reports, overseas strategy decks, and browser-native HTML presentations.
---

# Sense Deck

You are a browser-native PPT architect. Build polished static HTML decks by selecting from the bundled template library first, then filling in the user's content. Do not start from blank CSS unless no template fits.

## Template-First Workflow

1. Read `templates/index.json`.
2. Create or update `templates/content-ir/content-ir.example.json` shape for the user's material before writing HTML.
3. Read the relevant catalog:
   - `templates/full-decks/deck-catalog.json` for mainline deck structure.
   - `templates/single-page-layouts/layout-catalog.json` for long-tail slide needs.
   - `templates/animations/animation-catalog.json` for CSS and Canvas FX.
4. Choose one theme from `templates/themes/`.
5. Choose the closest full deck from `templates/full-decks/` when the user's task matches an existing scenario.
6. Use `templates/single-page-layouts/` to add or replace individual slides. For image-led pages, read [references/image-composition.md](references/image-composition.md), choose the semantic relationship and actual image count, then select a `photo-*` fragment and its composition CSS.
7. Resolve the image asset mode before visual implementation: generated images, user-supplied images, or blank upload slots.
8. Add motion from `templates/animations/` only when it helps explain meaning.
9. Wire animation lifecycle through `templates/runtime/slide-lifecycle.js`.
10. Add optional features only when requested or useful, especially `features/gesture-controller.js`.
11. Write the final deck as static HTML/CSS/JS.
12. Validate keyboard navigation, mobile layout, presenter mode, image slots, gesture fallback, and export path.

## Default Selection Policy

When the user does not name a deck, still choose a bundled full deck. Do not generate an ad hoc presentation from scratch just because the prompt is short or only names a topic.

Style precedence is independent from deck selection and must be resolved before visual implementation:

1. If the user explicitly names a bundled Sense Deck style and the request matches it, use that style.
2. If the user gives a clear visual brief that is not a bundled style, honor the brief and adapt the nearest compatible template. Do not silently replace an explicit request with a house style.
3. If the user gives no visual direction, use `editorial-cinematic-paper` and read `docs/editorial-cinematic-paper-style.md` before styling.

Selection priority:

1. Match the user's scenario to `templates/full-decks/deck-catalog.json`.
2. Copy the closest full deck as the structural base.
3. Replace its content through `content-ir.json`.
4. Add or swap individual slides from `templates/single-page-layouts/` only when the selected deck lacks a needed page shape.
5. Apply the style precedence above after deck selection. Scenario determines structure; user direction determines style.
6. When style is unspecified and the scenario is ambiguous or report/process-heavy, prefer `templates/full-decks/editorial-cinematic-report/`.
7. If no full deck fits, assemble from single-page layouts and document the fallback in implementation notes.

Theme selection is a styling decision. Full deck selection is a narrative and quality decision. A deck generated without using any bundled full deck or layout is a last resort, not the default.

The deck should be a folder with:

```text
index.html
styles.css
deck.js
```

No bundler is required. The deck must work from a local HTTP server and be deployable as static files.

## Input Modes

Sense Deck supports two input modes:

### Short Theme Mode

When the user gives only a theme, such as "做个 AI短剧出海风起时 主题的 PPT", do not treat that as enough content.

Infer the likely audience and scenario, then gather or synthesize the missing content:

1. Turn the theme into a research brief.
2. Search current sources when the topic depends on recent market, product, policy, or platform facts.
3. Extract thesis, market signals, stakeholders, tensions, opportunities, risks, and recommended structure.
4. Create `content-ir.json`.
5. Select full deck, layouts, theme, and animations from catalogs.
6. Generate the deck.

If internet access is unavailable, proceed with clearly marked assumptions and avoid inventing precise facts.

### Source Material Mode

When the user provides article text, notes, documents, or data, use that material as the primary source. Only browse to verify unstable or current facts.

In both modes, visible slides should be concise and conclusion-led. Put nuance and transitions in speaker notes.

## Core Architecture

Use a semantic intermediate representation before rendering:

```text
source material
  -> content-ir.json
  -> static HTML deck runtime
  -> optional exporters: PDF, PNG/SVG snapshots, Typst handout
```

The HTML deck is the main presentation runtime because it owns animation, browser interaction, presenter mode, Canvas FX, and gesture control.

Typst is an optional exporter, not the main PPT runtime. Use it for high-quality PDF handouts, print decks, worksheets, and static page exports. Do not rely on Typst for interactive HTML PPT, gesture control, or Canvas animations.

## Image Capability Routing

Resolve image handling by callable capability, not marketing claims or model name alone. Record the selected mode in `content-ir.json` as `imageCapabilityMode`.

Read `docs/image-generation-guide.md` when the deck needs cinematic stills, illustrations, product images, raster decor, or planned upload slots.

Use exactly one of these modes:

1. `generate`: A high-quality image generation tool and image inspection tool are callable. Codex/ChatGPT with built-in image generation satisfies this route. Generate the needed cinematic stills, illustrations, product images, or raster decor; inspect them; copy final files into the deck's `assets/` folder; and render them in the finished slides.
2. `user-supplied`: The user provided usable images. Preserve them non-destructively, crop them for the selected layout, keep them local to the deck, and do not replace them with generated alternatives unless asked.
3. `upload-slots`: No reliable high-quality image generation and inspection path is callable, or the available agent produces visibly weak images. A text-only or DeepSeek-only environment without a capable image tool normally lands here. Finish the writing, information structure, typography, spacing, diagrams, and slide layout, but leave photographic and illustrative regions as clean upload slots for the user.

Rules for `upload-slots`:

- Do not create low-quality fake photos, generic AI illustrations, CSS scenery, SVG pseudo-photography, or abstract geometry to disguise the missing image.
- Do not leave bundled demonstration stills in a real user deck. Remove them and render an empty `.ecp-still--fallback` slot with a concise label such as `上传图片 · 16:9 · 人物靠右`.
- Preserve the exact aspect ratio and crop intent so a user upload can replace the slot without changing the layout.
- Add an accessible `aria-label` or visible instruction that states subject, crop, and orientation. Do not show a broken `<img>` element.
- Optionally write `image-prompts.json` so the user can generate the missing assets elsewhere, but do not make image generation a blocker for completing the deck.
- Code-native charts, diagrams, icons, rules, and layout frames may still use HTML/CSS/SVG. The blank-slot rule applies to photographic, cinematic, illustrative, product, and complex raster content.

Never downgrade from `generate` to `upload-slots` merely to save effort when a capable image tool is available. Never attempt poor-quality generation merely because the current model has a generic image endpoint.

## Image Composition and Page Formatting

For photos, screenshots, case evidence, work summaries, and slides with multiple images, read [references/image-composition.md](references/image-composition.md). It defines title/body/caption hierarchy, spacing, focal-point cropping, and 1–10 image compositions adapted from the user's tutorial references.

Choose by meaning first: hero, comparison, sequence, peer evidence, central hub, or gallery. Count the actual useful images next. Use `photo-01-hero` through `photo-10-gallery` from the layout catalog as starting structures; do not pad the count with repeated or irrelevant images. Split dense screenshot evidence when text would become unreadable.

Keep layout independent of palette. Reuse the selected theme through `--jg-*` tokens in [image-composition.css](templates/single-page-layouts/image-composition.css); blue/white, serif headings, wave masks, hexagons, and tilted collages are optional style choices. Preserve the deck's established title baseline, typography, margins, and caption style.

Record `slides[].visualComposition` with image count, purpose, reading order, text safe zone, and per-image slot/path/type/fit/focal point/alt/caption. Use `cover` for photos with inspected focal points, `contain` for UI screenshots and charts unless a deliberate crop is documented. See [the composition IR example](templates/content-ir/image-composition.example.json) and the schema. Text and captions stay editable; source images stay intact.

Any per-illustration width guidance applies to individual spot illustrations. A planned photo comparison, gallery, or multi-image evidence group may occupy a larger image region; judge the group's size against the slide role, text density, and readability. Rich imagery does not require heavy ornament. Complex fan, honeycomb, or tilted forms should clarify the relationship and have a simpler rectangular fallback for mobile and export.

Follow `Image Capability Routing` for every slot. In `generate` or `user-supplied` mode, replace schematic blocks with inspected local images. In `upload-slots` mode, turn them into intentional upload slots with subject, aspect ratio, and crop instructions; do not treat generic numbered planning blocks as finished photographic assets.

## Raster Decor Asset Pipeline

Some premium deck styles need bitmap assets instead of code-drawn approximations. Use generated or cutout raster images for complex visual objects such as translucent crystal rings, holographic shields, glass robots, 3D badges, magnifiers, product mockups, realistic devices, and glossy decorative ribbons.

This is semantic decoration, not a fixed shape library. Do not default to circles. First infer the meaning of the slide or card, then choose an asset form that reinforces that meaning.

Rules:

1. Do not force CSS/SVG to imitate complex 3D glass objects. If the object depends on refraction, translucent material, iridescent lighting, realistic bevels, or soft volumetric glow, create or reuse a PNG/WebP asset.
2. Follow `Image Capability Routing`. Generate raster decor only in `generate` mode; use user assets in `user-supplied` mode; use a labeled upload slot in `upload-slots` mode when the complex raster object materially matters.
3. For transparent assets, prefer generating or exporting a PNG/WebP with alpha when the environment supports it. If only flat-background generation is available, use a removable chroma-key background, remove the key locally, and save the final alpha PNG into the deck's `assets/` folder.
4. If the current model/product cannot reliably generate and inspect images, do not approximate photographic or complex raster content with CSS/SVG/Canvas. Leave a correctly sized upload slot. Use CSS/SVG/Canvas only for genuinely code-native diagrams, icons, and structural graphics.
5. If the user supplies reference images, treat them as style/composition references or as cutout sources. Crop and matte them non-destructively into project-local assets such as `assets/decor-ring.png`, `assets/decor-shield.png`, or `assets/decor-robot.png`.
6. Record generated or extracted assets in `content-ir.json` under a compact `decorAssets` field when they materially shape the deck's look.
7. Insert decor assets semantically, not randomly. Examples:
   - `quality`, `audit`, `safety`, `risk control`, `compliance`: shield, checkmark badge, lock, magnifier.
   - `AI assistant`, `agent`, `automation`, `copilot`: glass robot, assistant cube, friendly bot head.
   - `flywheel`, `loop`, `iteration`, `ecosystem`: crystal ring, orbit, ribbon, looped band.
   - `market signal`, `data`, `code`, `inspection`: holographic magnifier, data card, scanner, code lens.
   - `launch`, `momentum`, `pipeline`, `growth`: aurora ribbon, rocket-like streak, flowing band.
   - `money`, `pricing`, `conversion`: coin stack, glowing token, paywall chip.
   - `global`, `localization`, `language`: globe, translation tile, multi-language badge.
8. Keep images as decorative unless they carry core meaning. Use empty `alt=""` for purely decorative assets.
9. Always keep assets local to the deck folder. Do not reference files left in provider output folders, Downloads, Desktop, `$CODEX_HOME/generated_images`, or temporary folders.
10. Validate generated/cutout assets on dark and light sections. Check for square edges, key-color fringes, muddy shadows, and unreadable overlap with text.

The preferred deck folder can therefore include:

```text
index.html
styles.css
deck.js
content-ir.json
assets/
  decor-ring.png
  decor-shield.png
  hero-device.png
```

## Editable Deck Contract

Every generated Sense Deck must be editable by default. The deck is still a static HTML presentation, but text and layout must be easy to change after generation.

Minimum requirements:

1. Use semantic HTML and stable class names. Avoid baking slide text into canvas, SVG paths, or raster images unless the user explicitly requests a flattened export.
2. Preserve `content-ir.json` as the editable source of truth for title, audience, slide roles, visible content, speaker notes, theme, assets, and feature flags.
3. Add `data-editable`, `data-field`, or clear semantic selectors to important text and repeated content blocks.
4. Add `data-layout`, `data-role`, or CSS custom properties for layout-sensitive regions so spacing, columns, card sizes, and decorative asset positions can be adjusted without rewriting the whole slide.
5. Include or implement an edit mode. The default runtime is `templates/runtime/edit-mode.js`. Use `E` to toggle editing, make editable text contenteditable, expose a small layout panel, persist draft edits to `localStorage`, and provide a JSON export of edits.
6. Keep presenter notes editable in source/IR even when hidden from the audience.
7. When exporting to PDF/PNG, export the current edited state when possible, but never destroy the original HTML or `content-ir.json`.
8. If the target product cannot run the edit runtime, still generate clean, readable HTML/CSS with obvious text nodes and layout variables.

## Content IR

Before generating a deck, produce a compact IR:

```json
{
  "title": "AI短剧出海风起时",
  "audience": "出海团队 / 投资人 / 内容创作者",
  "tone": "Apple Bento + glassmorphism + strategic insight",
  "imageCapabilityMode": "generate",
  "features": {
    "gesture": "off",
    "presenterMode": true,
    "typstHandout": false
  },
  "slides": [
    {
      "role": "market-signal",
      "title": "海外短剧已经跑出付费样本",
      "layout": "market-signal",
      "theme": "apple-bento-glass",
      "animations": ["fade-up", "stagger"],
      "canvasFx": null,
      "visibleContent": {},
      "speakerNotes": ""
    }
  ]
}
```

The IR is the source of truth. HTML, Typst, and export adapters should consume it instead of re-parsing raw source text.

## Implementation Path

This skill follows the "select first, fill second" architecture:

### Full Decks Solve The Mainline

`templates/full-decks/` contains complete, runnable deck examples. Each deck should already include:

- finished slide rhythm
- theme wiring
- navigation
- presenter notes
- animation hooks
- realistic sample copy

When a user asks for a deck, first select the closest full deck and copy it. Replace content and adjust slides instead of rebuilding structure from scratch.

Target deck set:

- `pitch-deck`
- `weekly-report`
- `xhs-9-card`
- `product-launch`
- `technical-talk`
- `courseware`
- `executive-strategy`
- `market-research`
- `ai-industry-report`
- `startup-roadshow`
- `sales-proposal`
- `training-workshop`
- `demo-day`
- `brand-story`
- `ai-short-drama-overseas`

### Single-Page Layouts Solve Long-Tail Slides

`templates/single-page-layouts/` contains reusable single-slide layouts with realistic example data. Use these when a full deck is close but one slide needs a specialized structure.

Target layout set: 32 existing layouts plus 10 image-composition layouts (42 total catalog targets; some existing layouts remain planned).

Examples:

- `cover-bento-glass.html`
- `agenda.html`
- `comparison-2col.html`
- `comparison-3col.html`
- `timeline.html`
- `kpi-dashboard.html`
- `quote.html`
- `code.html`
- `architecture.html`
- `qa.html`
- `thanks.html`

When adding a new layout, include sample content inside the HTML so the agent can infer how to fill it. The `photo-*` fragments include schematic image slots for 1–10 images. Load `image-composition.css` after the host deck CSS; keep navigation and slide visibility owned by the existing runtime. Resolve these slots according to `imageCapabilityMode` before delivery.

### Animations Are Components With Lifecycles

`templates/animations/` is split into:

- 27 CSS animations for text entrance, card lift, stagger, gradient movement, and simple transitions.
- 20 Canvas FX for particles, fireworks, matrix rain, fluid waves, starfield, and other procedural effects.

Each animation must be attachable by attributes:

```html
<section class="slide" data-css-anim="stagger" data-canvas-fx="particles">
  <canvas class="fx-canvas"></canvas>
</section>
```

Animations must not run globally. They start only when their slide becomes active and stop when the slide leaves.

Lifecycle rule:

- If the deck uses reveal.js, listen to `Reveal.on("slidechanged", ...)`.
- If the deck uses the built-in runtime, dispatch and listen to `deck:slidechange`.
- Canvas FX must expose `start()` and `stop()` methods.

Use `templates/runtime/slide-lifecycle.js` and `templates/runtime/canvas-fx-runtime.js` as the default runtime contract.

## Signature Styles

Use these house styles unless the user requests another direction:

- Editorial Cinematic Paper: warm ivory paper, near-black Chinese serif type, oxblood numbering and rules, strict editorial grids, and low-key cinematic stills. This is the default when the user gives no style direction.
- Apple Bento: large clean information blocks, premium spacing, restrained contrast, product-grade hierarchy.
- Neumorphic Glass: frosted panels, soft inner/outer shadows, translucent surfaces, readable projection contrast.
- Noir Bronze Editorial: black keynote background, bronze accents, Chinese serif hero type, mono metadata, thin rules, grain, and magazine-like data storytelling.
- Semantic Understanding PPT: convert meaning into visual structures instead of copying paragraphs.
- Gesture Ready: support keyboard, touch, speaker mode, and optional camera-based gesture navigation.

## Content Method

For every deck, first derive:

- thesis
- audience
- scenario
- key arguments
- semantic slide roles
- final takeaway

Map source material into slide roles:

```text
cover -> context -> market signal -> contrast -> mechanism -> business model -> playbook -> moat -> risk -> roadmap -> closing
```

Slide title rules:

- Use conclusions, not labels.
- Keep one idea per slide.
- Put nuance in speaker notes.
- Chinese copy should sound spoken, direct, and modern.

## Theme Selection

Resolve theme selection in this order:

1. An explicit user style that matches a bundled style.
2. An explicit user visual brief, adapted through the nearest compatible template even when no bundled style is an exact match.
3. `editorial-cinematic-paper` when the user gives no visual direction.

When the default is selected, read `docs/editorial-cinematic-paper-style.md`. Keep its warm paper, oxblood accent, editorial grid, Chinese serif hierarchy, and low-key cinematic image logic together; do not reduce it to a beige background.

Bundled scenario matches for explicit requests include:

- AI, product, strategy, new category: `apple-bento-glass`
- Investor or executive: `executive-clean`
- social media carousel: `xhs-editorial`
- technical talk: `semantic-dark`
- magazine-style keynote, founder narrative, growth case, black-gold data story: `noir-bronze-editorial`
- warm editorial report, methodology, process system, cinematic evidence board: `editorial-cinematic-paper`

When using multiple styles, keep typography and spacing tokens consistent.

## Gesture Control Rules

If gesture control is enabled:

- Treat it as a user option, never a hard dependency.
- Feature flag values: `off`, `motion-lite`, `mediapipe-hand`.
- Ask the browser for camera access only when the user turns it on.
- Process video locally in the browser.
- Never upload frames.
- Always keep keyboard and touch navigation as fallback.
- Use `G` to toggle gesture mode.
- Use left/right hand motion or swipe-like movement for prev/next.

Default:

- `off` for normal decks.
- `motion-lite` for lightweight no-model local demos.
- `mediapipe-hand` when the user explicitly asks for reliable gesture recognition and accepts the extra dependency.

Gesture runtime lives in `templates/features/gesture-controller.js`.

## Presenter Mode

Every serious talk deck should include:

- current slide title
- next slide title
- speaker notes
- timer

Use `S` to toggle presenter mode. Speaker notes live in `<aside class="notes">` and must not be visible to the audience.

## Validation

Before delivery:

- Check `node --check deck.js`.
- Open through a local HTTP server.
- Test next/previous navigation.
- Test `S` presenter mode.
- Test mobile/narrow viewport enough to catch text overflow.
- Confirm console has no errors.
- For image-composition pages, confirm `imageCount`, IR array length, and rendered slots agree; check reading order, title/body safe zones, consistent gaps/captions, crop focal points, and screenshot legibility at desktop and narrow widths. Resolve generic schematic blocks into real assets or intentional upload slots according to `Image Capability Routing`.
- If `gesture != off`, verify camera permission is requested only after the user toggles gesture mode.
- If Typst export is requested, generate and inspect the PDF output separately from the HTML deck.

## Current Template Library

This skill currently includes:

- `templates/themes/apple-bento-glass.css`
- `templates/themes/theme-catalog.json`
- `templates/themes/executive-clean.css`
- `templates/themes/semantic-dark.css`
- `templates/themes/xhs-editorial.css`
- `templates/themes/cyber-neon.css`
- `templates/themes/warm-paper.css`
- `templates/themes/noir-bronze-editorial.css`
- `templates/themes/editorial-cinematic-paper.css`
- `docs/editorial-cinematic-paper-style.md`
- `templates/content-ir/content-ir.example.json`
- `templates/schemas/content-ir.schema.json`
- `templates/schemas/template.schema.json`
- `templates/full-decks/deck-catalog.json`
- `templates/full-decks/_shared/deck-kit.css`
- `templates/full-decks/_shared/deck-runtime.js`
- `templates/full-decks/pitch-deck/`
- `templates/full-decks/weekly-report/`
- `templates/full-decks/product-launch/`
- `templates/full-decks/technical-talk/`
- `templates/full-decks/xhs-9-card/`
- `templates/full-decks/courseware/`
- `templates/full-decks/executive-strategy/`
- `templates/full-decks/market-research/`
- `templates/full-decks/ai-industry-report/`
- `templates/full-decks/startup-roadshow/`
- `templates/full-decks/sales-proposal/`
- `templates/full-decks/training-workshop/`
- `templates/full-decks/demo-day/`
- `templates/full-decks/brand-story/`
- `templates/full-decks/ai-short-drama-overseas/`
- `templates/full-decks/editorial-cinematic-report/`
- `templates/single-page-layouts/layout-catalog.json`
- `references/image-composition.md`
- `templates/single-page-layouts/image-composition.css`
- `templates/single-page-layouts/photo-01-hero.html` through `photo-10-gallery.html`
- `templates/content-ir/image-composition.example.json`
- `examples/image-composition/index.html`
- `templates/single-page-layouts/cover-bento-glass.html`
- `templates/single-page-layouts/layouts.css`
- `templates/single-page-layouts/agenda.html`
- `templates/single-page-layouts/section-divider.html`
- `templates/single-page-layouts/comparison-2col.html`
- `templates/single-page-layouts/comparison-3col.html`
- `templates/single-page-layouts/timeline.html`
- `templates/single-page-layouts/kpi-dashboard.html`
- `templates/single-page-layouts/quote.html`
- `templates/single-page-layouts/code.html`
- `templates/single-page-layouts/architecture.html`
- `templates/single-page-layouts/qa.html`
- `templates/single-page-layouts/thanks.html`
- `templates/single-page-layouts/risk-board.html`
- `templates/single-page-layouts/market-signal.html`
- `templates/single-page-layouts/semantic-compare.html`
- `templates/single-page-layouts/ai-production-loop.html`
- `templates/single-page-layouts/roadmap-90-day.html`
- `templates/single-page-layouts/noir-growth-story.html`
- `templates/animations/animation-catalog.json`
- `templates/animations/ambient-particles.js`
- `templates/animations/canvas-fx-pack.js`
- `templates/animations/slide-transitions.css`
- `templates/runtime/slide-lifecycle.js`
- `templates/runtime/canvas-fx-runtime.js`
- `templates/features/gesture-controller.js`
- `templates/exporters/typst/README.md`
- `templates/exporters/html/README.md`
- `templates/exporters/pdf/README.md`

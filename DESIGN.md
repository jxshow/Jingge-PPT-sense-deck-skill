# 鲸格 PPT Design Systems

Sections 1–7 describe the existing `editorial-cinematic-paper` style. Section 8 defines the five-style premium baseline family.

## 1. Atmosphere & Identity

The explicitly selected Editorial Cinematic Paper style should feel like a considered editorial report laid out on warm archival paper, with cinematic stills used as evidence rather than decoration. Its signature is the contrast between oversized Chinese serif headlines, disciplined micro-metadata, thin oxblood rules, and low-key film imagery arranged in a precise information grid. This is an existing house style. For unspecified styles, use the reference-derived premium family below; explicit user directions and established deck styles take precedence.

## 2. Color

### Palette

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--ecp-paper` | `#F1EEE4` | Main slide background |
| Canvas/deep | `--ecp-paper-deep` | `#E4DED0` | Secondary paper panels and mobile surround |
| Surface | `--ecp-surface` | `#F7F4EB` | Cards and diagram fields |
| Text/primary | `--ecp-ink` | `#141311` | Headlines and body copy |
| Text/secondary | `--ecp-ink-soft` | `#49443C` | Explanatory copy |
| Text/tertiary | `--ecp-muted` | `#746D61` | Captions and metadata |
| Rule/default | `--ecp-rule` | `#B8B0A1` | Dividers and frames |
| Rule/subtle | `--ecp-rule-soft` | `#D3CCBF` | Interior grid lines |
| Accent/primary | `--ecp-oxblood` | `#7A2F2B` | Numbers, bullets, short rules, focus |
| Accent/soft | `--ecp-oxblood-soft` | `#D8C1BA` | Quiet highlighted fields |
| Image/night | `--ecp-night` | `#171816` | Base behind real cinematic imagery and image captions |
| Image/night-soft | `--ecp-night-soft` | `#2B2B27` | Contact sheets and dark image groups |
| Image/text | `--ecp-photo-ink` | `#F3EEE4` | Captions over imagery |

### Rules

- Paper, ink, and oxblood carry the whole composition. Do not add unrelated brand colors when this style is selected.
- Oxblood is scarce: use it for one or two hierarchy signals per slide, not for large backgrounds.
- Cinematic imagery stays neutral-to-warm, low saturation, and low-key; it must preserve deep blacks and one motivated warm light source.
- Every color used by the Editorial Cinematic Paper theme must resolve to a token in this table.

## 3. Typography

### Font Stacks

- Editorial serif: `"Songti SC", "STSong", "Source Han Serif SC", "Noto Serif CJK SC", serif`
- Metadata sans: `"Arial Narrow", "Helvetica Neue", "PingFang SC", sans-serif`

### Scale

| Level | Token | Size | Weight | Line height | Tracking | Usage |
|---|---|---:|---:|---:|---:|---|
| Display | `--ecp-type-display` | `clamp(72px, 7.4vw, 132px)` | 500 | 0.94 | -0.035em | Cover and thesis titles |
| H1 | `--ecp-type-h1` | `clamp(58px, 5.8vw, 104px)` | 500 | 0.98 | -0.025em | Slide conclusions |
| H2 | `--ecp-type-h2` | `clamp(34px, 3.2vw, 56px)` | 500 | 1.08 | -0.015em | Section titles |
| H3 | `--ecp-type-h3` | `clamp(22px, 1.8vw, 30px)` | 500 | 1.2 | 0 | Card titles |
| Lead | `--ecp-type-lead` | `clamp(22px, 2vw, 34px)` | 400 | 1.38 | 0 | Subtitle or argument |
| Body | `--ecp-type-body` | `clamp(16px, 1.15vw, 21px)` | 400 | 1.6 | 0 | Explanatory copy |
| Caption | `--ecp-type-caption` | `clamp(12px, 0.85vw, 15px)` | 500 | 1.45 | 0.02em | Captions and labels |
| Overline | `--ecp-type-overline` | `clamp(11px, 0.7vw, 13px)` | 600 | 1.2 | 0.16em | English metadata |

### Rules

- Chinese serif type owns titles, arguments, numbers, and quotes; metadata sans is reserved for small English labels and controls.
- Titles should wrap intentionally to one or two lines. Reduce the display token before allowing a third line.
- Use full-width Chinese punctuation and spoken, conclusion-led copy.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|---|---:|---|
| `--ecp-space-1` | 4px | Hairline offsets |
| `--ecp-space-2` | 8px | Tight label groups |
| `--ecp-space-3` | 12px | Caption rhythm |
| `--ecp-space-4` | 16px | Compact card padding |
| `--ecp-space-5` | 20px | Grid gutter |
| `--ecp-space-6` | 24px | Standard card padding |
| `--ecp-space-8` | 32px | Module spacing |
| `--ecp-space-10` | 40px | Section spacing |
| `--ecp-space-12` | 48px | Major separation |
| `--ecp-space-14` | 56px | Slide vertical safe area |
| `--ecp-space-16` | 64px | Slide horizontal safe area |
| `--ecp-space-20` | 80px | Cover whitespace |

### Grid

- Desktop slide: 16:9, 12 columns, 20px gutters, 64px horizontal safe area, 56px vertical safe area.
- Tablet: preserve the 16:9 stage and scale it to fit the viewport.
- Narrow/mobile preview: switch to a vertical reading flow at 900px; keep at least 20px side padding and place controls in normal flow above the active slide so they never cover content.
- Use asymmetric 5/7, 4/8, or 7/5 splits. Reserve symmetry for process comparisons or photo grids.

## 5. Components

### Editorial Page Frame

- **Structure**: `.slide` plus `.ecp-masthead`, `.ecp-page-no`, and `.ecp-corner` markers.
- **Spacing**: safe-area tokens and 20px gutters.
- **States**: active/inactive slide.
- **Accessibility**: page number is supplementary; slide title remains in the heading outline.
- **Motion**: opacity and 16px vertical translation only.

### Editorial Heading

- **Structure**: overline, H1/H2, short oxblood rule, lead.
- **Variants**: cover, standard, compact.
- **Spacing**: `--ecp-space-3`, `--ecp-space-5`, `--ecp-space-8`.
- **Accessibility**: maintain logical heading order and sufficient contrast.

### Numbered Fact Row

- **Structure**: two-digit number, title, one-line explanation, optional image/evidence cell.
- **Variants**: list, workflow, diagnosis.
- **Depth**: rules only; no cards or shadows.

### Cinematic Still

- **Structure**: `<figure>` with local `<img>` or `<picture>`, optional overlay caption, fixed aspect ratio.
- **Variants**: hero 16:9, strip 2.35:1, tile 4:3, contact sheet.
- **Imagery**: low-key light, neutral white balance, local warm practical, restrained saturation, clear subject/background hierarchy.
- **Capability routes**: use a generated local image when high-quality generation and inspection are callable; use a supplied local image when the user provides one; otherwise use an empty upload slot.
- **Upload slot**: warm surface, thin dashed rule, fixed aspect ratio, and one concise instruction covering subject, ratio, and crop direction. Never substitute CSS scenery, SVG pseudo-photography, generic generated art, or a broken remote image.
- **Accessibility**: meaningful images have concise alt text; decorative mood frames use empty alt text.

### Diagram Field

- **Structure**: square-corner panels, thin rules, oxblood nodes, arrows, compact labels.
- **Variants**: process, cycle, architecture, floor plan, timeline.
- **Depth**: borders-only.

### Quote Footer

- **Structure**: bracket corners, one decisive sentence, optional metadata line, circular system mark.
- **Spacing**: at least `--ecp-space-8` above and below.
- **Motion**: subtle fade only.

### Deck Controls

- **Structure**: previous, counter, next, speaker buttons.
- **States**: default, hover, active, focus-visible, disabled.
- **Accessibility**: real buttons with `aria-label`; keyboard and touch remain available.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 140ms | ease-out | Button feedback |
| Standard | 280ms | ease-in-out | Control state changes |
| Slide | 520ms | cubic-bezier(0.16, 1, 0.3, 1) | Slide and content entry |
| Stagger | 80ms increments | same as Slide | Rows, stills, diagram nodes |

- Animate only `transform`, `opacity`, and a short focus-color transition.
- Do not animate layout, background position, or continuous ambient effects in the Editorial Cinematic Paper theme.
- Respect `prefers-reduced-motion` and reveal all content immediately when enabled.

## 7. Depth & Surface

The Editorial Cinematic Paper theme uses a **borders-only** strategy. Paper fields are separated by thin rules and modest tonal shifts. There are no box shadows, glass blur, glossy gradients, pill cards, or large rounded containers. Photography supplies depth; the interface stays flat and editorial.


## 8. Reference-derived premium family

The shared geometry, type scale, component contract and five palettes below are the token source of truth for the new templates. They apply only to this family; other named house styles retain their own vocabulary.

## Shared contract

Shared geometry and interactions live in `_shared/premium-core.css` and `_shared/premium-runtime.js`. Each deck has a matching theme file and semantic layout classes. Preserve these shared dependencies when copying a template.

Each styles.css imports `../_shared/premium-core.css` then `../../themes/<style-id>.css`. Each deck.js contains only template-specific behavior; load `../_shared/premium-runtime.js` using a script tag directly after any own deck.js. No modules, fetch, external scripts/fonts/assets: templates must work from file:// and HTTP.

HTML: `<body data-premium-theme="<style-id>"><main class="deck" aria-label="..."><section class="slide active" id="s01" data-title="..." data-layout="..."><div class="p-folio"><span>...</span><span>01 / 08</span></div>...<aside class="notes">...</aside></section>...</main><script src="../_shared/premium-runtime.js"></script></body>`. Core runtime inserts controls outside the stage, provides arrows/PageUp/PageDown/Home/End, S speaker notes/timer, E editable mode, Escape dismiss, touch swipe, JSON export, local persistence, hash navigation, print styles. Hidden slides use `[hidden]`; do not override it. Important text has `data-editable` and stable `data-field` values. All sample text stays DOM-editable. SVG only for genuine editable data diagrams/charts, never text-as-paths or screenshot surfaces.

Core style tokens (1600×900 reference canvas, 1cqw=16px): `--p-bg`, `--p-fg`, `--p-muted`, `--p-accent`, `--p-line`, `--p-surface`, `--p-serif`, `--p-sans`, `--p-heading-font`, `--p-pad-x:6cqw`, `--p-pad-y:4cqw`, `--p-display:6cqw`, `--p-title:3cqw`, `--p-lead:1.8cqw`, `--p-body:1.35cqw`, `--p-caption:.88cqw`, `--p-gap:2.4cqw`. Fonts: serif Georgia, 'Noto Serif CJK SC', 'Source Han Serif SC', 'Songti SC', SimSun, serif; sans Arial, 'Microsoft YaHei', 'PingFang SC', sans-serif. No font downloads. Theme tokens must trace to the palettes in this section.

Core primitives: `.p-kicker`, `.p-display`, `.p-title`, `.p-lead`, `.p-body`, `.p-caption`, `.p-accent`, `.p-muted`, `.p-rule`, `.p-two` (two-column grid), `.p-three` (three-column grid only for genuine comparison), `.p-stack`, `.p-table`, `.p-metric`, `.p-footer`, `.p-center`, `.p-grow`. Theme/layout CSS may add clear semantic classes. No decorative dashboard cards, generic icons, background blobs, gradients, glass, glows, or meaningless orbit illustration. Thin rules, tables, real chart encoding and typography carry information. Do not merely recolor identical slides: each family has a different narrative rhythm and arrangement.

Mobile <=800px reflows active slide, type body >=16px, lead20px, title32px, display46px, side padding24px; columns stack; no horizontal overflow. Desktop max16:9 stage, controls occupy their own row beneath. Print shows all slides with page breaks, hides controls/notes, preserves selected colors. All images absent by design in these type/data-based samples; actual photo requests use existing image routing.

## Five variants

- premium-consulting / 咨询简报: white #FFFFFF; ink #17202D; muted #626B73; terracotta #BE573C; rule #D7D9DC; surface #F4F5F5. Serif headline, sans small text. Slim left cover stripe, anchored title, large white space; dense yet aligned analytical pages, tables, horizontal bars, timeline; answer-first headings. No huge statement on every page.
- premium-lecture / 黑金讲堂: black #080908; white #F5F3EB; muted #B5B5AC; muted yellow #E0BF62; line #38382F; surface #171814. Serif headlines, sans evidence. Alternate central question, explanatory diagram, evidence comparison, large statement, action list. Keep about 45–65% negative space on thesis slides. A real curve or process diagram is welcome; generic gold rings are not.
- premium-product / 雷军版: black #080A0D; white #F3F4F5; muted #AFB7C2; coral #E89071; deep navy #132236; line #35404B; surface #171D25. Sans bold heavy titles, calm near-white opening optional (#ECEEF0 / #11161C), hard chapter cuts, timeline, big numeral/comparison, feature detail, reveal, conclusion. Single focal point; do not fill a launch deck with cards or faux cinematic scenery.
- premium-minimal / 乔布斯: near-black #111213; white #F6F6F4; muted #ACADAA; champagne #D8BD80; line #343638; surface #1C1E20. Sans, very sparse, 6–24 Chinese characters for statement slides, one statistic/one concept per slide, huge numeric contrast, two-term contrasts, deliberate pause pages. Details go into speaker notes. No cover orbit required.
- premium-editorial / 典雅编辑: navy #192234; warm ivory #F1ECDD; offwhite #FAF7EF; gold #B99A59 (dark-page text use #D8BD80); ink #202A36; muted #666558; rules #C8C0AB light / #465064 dark. Serif titles, navy cover and chapter openers, ivory analytical pages, outlined section numbers, calm asymmetric 5/7 grid, timeline/table/diagram. Long-form narrative rhythm; not a beige version of consulting.

## IR

Top-level title,audience,scenario,tone,theme,imageCapabilityMode:'upload-slots',features:{gesture:'off',presenterMode:true,editable:true},slides. Each slide:role,title,layout,theme,visibleContent (exact displayed substantive content),speakerNotes. Include no copied factual claims. Schema at templates/schemas/content-ir.schema.json.

## Quality gates

Each bundled example contains eight complete, responsive and editable slides. User decks may have any length appropriate to their content. Render every final slide, inspect desktop and mobile captures, test keyboard navigation, speaker notes, text editing, export and printing, and verify catalog paths and content IR. Never include reference authors, logos, portraits, QR codes or unverified factual claims. Use fresh visual evidence before claiming a deck is ready.

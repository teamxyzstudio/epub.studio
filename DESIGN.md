---
name: Epub Studio
description: Free in-browser EPUB tools with typographic craft — convert any ebook, keep it beautiful.
colors:
  paper: "#FAF7F2"
  card: "#FFFDF9"
  ink: "#17130E"
  graphite: "#6E675D"
  body-warm: "#26211A"
  accent: "#FF2E63"
  accent-ink: "#C41E4F"
  desk: "#EAE4DA"
  success: "#1B7F4D"
  error: "#B3261E"
  border: "rgba(23, 19, 14, 0.14)"
  border-card: "rgba(23, 19, 14, 0.16)"
  border-input: "rgba(23, 19, 14, 0.22)"
typography:
  display:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(42px, 6.5vw, 84px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(34px, 5vw, 58px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Instrument Serif', serif"
    fontSize: "clamp(24px, 2.6vw, 34px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "clamp(15px, 1.3vw, 17.5px)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.08em"
  reading:
    fontFamily: "'Literata', Georgia, serif"
    fontSize: "17.5px"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  badge: "4px"
  tag: "6px"
  segment: "9px"
  card: "10px"
  button: "11px"
  panel: "12px"
  zone: "14px"
  feature: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(40px, 5vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "16px"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 15px"
  chip-filter-selected:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "8px 15px"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "10px 6px"
  card-tool:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment}"
    padding: "11px 12px"
  badge-format:
    backgroundColor: "rgba(23, 19, 14, 0.07)"
    textColor: "{colors.graphite}"
    rounded: "{rounded.badge}"
    padding: "2px 6px"
---

# Design System: Epub Studio

## Overview

**Creative North Star: "The Typesetter's Desk"**

Every surface is a warm paper studio where books are re-set by hand. The desk
canvas (`#EAE4DA`) that book previews rest on, the "re-typeset line" mark —
three text bars, the middle one shorter and pink — the serif that speaks only
in display sizes, the mono that annotates like a typesetter's margin notes:
all of it belongs to one craftsperson's workspace. The system is **warm,
literate, precise, honest** — bookish warmth carried by paper tones, typographic
precision carried by exact spacing and hairline borders, and honesty carried by
an interface that never decorates what it cannot do.

Density is calm: generous fluid padding, one-column reading measures, grids
that breathe at 12–14px gaps. Expression concentrates in typography and in a
single electric thread of pink; everything else stays quiet so the user's book
— the actual object of the product — is the most vivid thing on the desk.

The confirmed anti-reference is the generic converter-SaaS look: purple-blue
gradients, glassmorphism, emoji-studded feature grids, ad-slot clutter, and
dark-pattern upload buttons. This system is the deliberate opposite of that
industry's visual language.

**Key Characteristics:**
- Paper-warm neutrals; one electric-pink accent used sparingly
- Instrument Serif display voice over Archivo workhorse body
- IBM Plex Mono for everything file-, format-, or data-shaped
- Flat surfaces structured by 1px borders and paper→card background steps
- Quiet precision, warm touch: small, exact interaction responses
- A single 760px breakpoint; fluid `clamp()` everywhere between 390–1440

## Colors

A warm paper stack with one electric thread through it.

### Primary
- **Electric Pink** (#FF2E63): the sole accent. Selected states, focus
  outlines, arrows, the wordmark's full stop, the mark's middle bar, progress
  fills, primary CTAs. Its job is *direction* — it points at the one thing
  that matters on a screen.
- **Pink Ink** (#C41E4F): Electric Pink's readable sibling wherever pink must
  be read rather than seen — in-body links, chip labels, hover states, and any
  fill that carries a text label (buttons, CTAs: white on Pink Ink clears
  WCAG AA at ≈5.6:1; white on Electric Pink fails at ≈3.6:1). Electric Pink
  stays for pure decoration: bars, borders, glyphs, dots, tints, and
  large-text accents (≥24px, where 3:1 suffices).

### Neutral
- **Paper** (#FAF7F2): the page background everywhere.
- **Card** (#FFFDF9): raised-surface background — tool cards, panels, callouts.
- **Ink** (#17130E): primary text, filled controls (selected segments,
  filename chips), the mark's frame, comparison-table headers.
- **Graphite** (#6E675D): secondary text, mono metadata, muted labels.
- **Body Warm** (#26211A): long-form article body text (Literata passages).
- **Desk** (#EAE4DA): the canvas behind book previews in Style Studio —
  the desk the page rests on. Dark-theme desk is `#0E0F12`.
- **Borders**: rgba(23,19,14,.14) default · .16 on feature cards · .22 on
  inputs and segmented controls.

### Semantic
- **Success Green** (#1B7F4D) and **Error Red** (#B3261E): confined to
  contrast badges, validation reports, and error notices. Never decorative.

### Named Rules
**The One Pink Rule.** #FF2E63 is the only accent in the system and it is
used sparingly — an arrow, a dot, a selected state, one CTA per view. If pink
stops being rare, it stops meaning anything. New accent hues are prohibited.

**The Paper Step Rule.** Hierarchy is built by stepping Paper → Card and
drawing a 1px border, never by tinting surfaces with hue or stacking shadows.

## Typography

**Display Font:** Instrument Serif 400 (serif fallback)
**Body Font:** Archivo (system-ui fallback)
**Label/Mono Font:** IBM Plex Mono
**Article Font:** Literata (Georgia fallback)

**Character:** A literate pairing — the serif carries bookish authority at
display sizes only; Archivo does all the working text with unfussy clarity;
Plex Mono annotates like margin notes on a galley proof.

### Hierarchy
- **Display** (400, clamp(42px, 6.5vw, 84px), 1.02, −0.015em): hero headline
  only. Emphasis inside it is italic + Electric Pink ("Keep it *beautiful*.").
- **Headline** (400, clamp(34px, 5vw, 58px), 1.05–1.08, −0.015em): page h1s
  (tool pages, blog posts, content pages).
- **Title** (400, clamp(24px, 2.6vw, 34px), ~1.15, −0.01em): section h2s;
  card titles use the same voice at fixed 22px (listing) and 18.5px (related).
- **Body** (400–600, clamp(15px, 1.3vw, 17.5px), 1.45–1.6): Archivo. UI copy
  runs 13–15.5px; ledes clamp up to 17.5px; max measure 52–65ch.
- **Label** (500, 11–13px, +0.08em, UPPERCASE for kickers): IBM Plex Mono.
  Filenames, format badges, kickers, dates, read times, progress counts.
- **Reading** (400, 17.5px, 1.75): Literata, article body only, colored
  Body Warm, max 720px column.

### Named Rules
**The Serif Never Sets Body Rule.** Instrument Serif exists only at display
and heading sizes. It never sets a paragraph, a label, or a control.

**The Mono Is Metadata Rule.** If it's a filename, a format, a size, a date,
a count, or a kicker — it's Plex Mono. If it's prose — it never is.

## Layout

Content lives in a 1240px max container with `clamp(16px, 4vw, 48px)` side
gutters; tool pages narrow to 920px, articles to a 720px reading column with
a 250px sticky TOC rail (1140px combined). Vertical rhythm is fluid:
`clamp(40px, 5vw, 72px)` between major sections, `clamp(28px, 3.5vw, 52px)`
between groups.

Grids are `repeat(auto-fill, minmax(min(240px, 100%), 1fr))` for tool cards
(300px for blog cards, 200px for related-tool rails) with 12–14px gaps —
cards find their own columns; no manual breakpoint grids.

**One breakpoint: 760px.** Below it: nav links hide behind a mono note, the
homepage gains a fixed bottom tab bar (44px+ targets, safe-area padding,
76px page bottom padding), tool pages swap the inline CTA for a sticky bottom
bar, Style Studio's panel becomes a draggable bottom sheet (150px / 52% / 88%
snap points), and the article TOC rail disappears. Everything else adapts by
fluid `clamp()` and grid auto-fill, not by media-query forks.

Sticky chrome: 60px header at `rgba(250,247,242,.94)` with 8px backdrop blur
and a bottom hairline; article pages add a 3px reading-progress track beneath.

## Elevation & Depth

**Flat by default; borders rule** (confirmed doctrine). Surfaces sit flat on
Paper and are defined by 1px borders and the Paper→Card step. Shadows exist
only where something genuinely floats or lifts, and the vocabulary is tiny:

### Shadow Vocabulary
- **Hairline** (`box-shadow: 0 1px 0 rgba(23,19,14,.06)`): the feature-card
  underline shadow — barely-there grounding for 16px-radius containers.
- **Floating** (`box-shadow: 0 14px 40px rgba(23,19,14,.12)`): elements
  detached from the page — the living-book hero card, Style Studio's page
  preview (paired with `0 1px 3px rgba(0,0,0,.12)`).
- **Sheet** (`box-shadow: 0 -8px 32px rgba(23,19,14,.18)`): the mobile bottom
  sheet rising over the desk.
- **CTA Glow** (`box-shadow: 0 6px 18px rgba(255,46,99,.35)`): hover-only,
  on accent CTAs, paired with a −1px translateY. The one colored shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow is a
statement that something floats (book card, page preview, sheet, sticky bars)
or responds (CTA hover glow) — never ambient decoration on resting cards.

## Shapes

A soft-rectangle language with a deliberate radius ladder: 4px format badges →
6px filename tags → 9px segments/inputs → 10px cards → 11px buttons → 12px
panels → 14px drop zones → 16px feature cards → 999px pills. Radii signal
importance: the bigger the moment, the rounder the container.

Borders do the structural work (see Elevation): 1px at three opacities, plus
**2px dashed** `rgba(23,19,14,.3)` for drop zones — the one dashed element,
meaning "something belongs here."

The recurring motif is the **re-typeset line**: horizontal bars with fully
rounded ends (the mark, the living-book skeleton, progress lines, OG-card
art), middle line shorter and pink. Skeleton bars are the brand's illustration
style — no stock imagery, no emoji, no icon fonts; inline stroke SVGs at
1.6px weight for the few icons that exist.

## Components

Character: **quiet precision, warm touch** — controls sit flat and exact like
set type; interaction answers with small warm responses (a 2px lift, a border
turning pink, a segment filling with ink).

### Buttons
- **Shape:** 11px radius; full-width in tool cards, `min(100%, 340px)` on
  done states.
- **Primary:** Electric Pink fill, white text, Archivo 600 at 16.5px, 16px
  padding.
- **Hover:** −1px translateY + CTA Glow (0.12s). **Focus:** 2px **Ink**
  outline (accent-on-accent would vanish).
- **Secondary:** 1.5px outlined pill (rgba-ink .25), Archivo 600 13.5–14px;
  hover turns border and text pink. **Tertiary:** underlined graphite text
  link, hover pink, 44px min target.

### Chips
- **Filter chips:** 999px pills, 1.5px border rgba(23,19,14,.2), 40px min
  height. Selected = Electric Pink fill, white text, 600 weight.
- **Suggestion pills:** 1.5px Electric Pink border, pink text; hover fills
  pink with white text.

### Segmented Controls
- 1px rgba(23,19,14,.22) frame, 9px radius, flex-equal segments with 1px
  internal dividers. Selected segment = Ink fill, Paper text, 600 weight.
  Focus ring sits inset (−2px offset). 40–44px min height.

### Toggles
- 46×27px track (999px), Electric Pink when on / rgba(23,19,14,.22) when off;
  22px white knob with 0 1px 3px shadow; 0.18s transition.

### Cards / Containers
- **Tool/blog cards:** Card bg, 1px rgba .14 border, 10–12px radius, 16–20px
  padding. Hover: border → Electric Pink + translateY(−2px), 0.15s. Thumbnail
  images bleed edge-to-edge above padded content (11px top radius).
- **Feature cards** (tool runner, featured post, newsletter): 16px radius,
  .16 border, Hairline shadow, clamp padding. Newsletter inverts to Ink bg.
- **Callout:** Card bg, .14 border, 10px radius, 18px padding, mono uppercase
  kicker — the blog's quick-answer box.

### Inputs / Fields
- Paper or white bg, 1px rgba(23,19,14,.22–.25) border, 8–9px radius,
  10–12px padding, Archivo 14–16px. Focus: 2px Electric Pink outline
  (offset 1–2px). Newsletter variant on Ink: `rgba(250,247,242,.06)` bg,
  `.3` border, Paper text.
- **Drop zones:** 2px dashed rgba(23,19,14,.3) on Card/transparent, 12–14px
  radius, serif invitation headline + mono format list; drag-over turns
  border pink, tints bg `rgba(255,46,99,.05)`, scales 1.01.

### Navigation
- 60px sticky header: mark + live-text wordmark (serif 22px, pink full stop),
  Archivo 500 14px links (hover/active pink), mono status note right.
  Mobile: fixed bottom tab bar, 20px stroke icons, 10.5px labels, active tab
  pink.

### The Focus System (signature)
Every interactive element carries `outline: 2px solid #FF2E63` at
`focus-visible` — offset 3px (buttons/links), 2px (cards/inputs), −2px
(segments), and **Ink** on accent-filled controls. This is the a11y system;
it ships with every new component, no exceptions.

### Progress (signature)
Progress is typographic: skeleton re-typeset lines lighting up (`retype`
scaleX animation, 55ms stagger), a 3px accent bar, and a mono
`re-typesetting · N%` count. The article reading bar is the same 3px accent
fill under the header.

## Do's and Don'ts

### Do:
- **Do** run the Focus System on every new interactive element (2px #FF2E63,
  correct offset, Ink-on-accent) — WCAG 2.1 AA is binding.
- **Do** gate every animation behind `prefers-reduced-motion` (0.15s micro /
  0.25s theme / 1s `cubic-bezier(.4,0,.2,1)` morphs are the tempo set).
- **Do** use mono + uppercase + 0.08em for every kicker, and mono chips for
  every filename (Ink bg, Paper text, 6px radius).
- **Do** keep touch targets ≥44px on mobile and reuse the 760px breakpoint —
  never introduce a second one.
- **Do** draw illustration as re-typeset-line bar art or 1.6px stroke SVG,
  in-palette.

### Don't:
- **Don't** introduce a second accent hue, gradients, glassmorphism, or
  colored surface tints — the converter-SaaS look is the confirmed
  anti-reference.
- **Don't** put resting shadows on flat cards; borders carry structure
  (Flat-By-Default Rule).
- **Don't** set body text in Instrument Serif, or prose in Plex Mono.
- **Don't** use stock photography, emoji in UI, or icon fonts; imagery is
  generated brand art (OG pipeline) or inline SVG.
- **Don't** fabricate visual proof — no invented logos, star ratings,
  testimonial avatars, or press badges anywhere (product commitment).

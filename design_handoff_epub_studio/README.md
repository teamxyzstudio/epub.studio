# Handoff: Epub Studio — full site

## Overview
Epub Studio is a free, no-signup, in-browser suite of EPUB tools (21 converters/utilities), a signature "Style Studio" re-typesetting editor, and an SEO blog. This bundle contains everything needed to implement the complete site: 7 designed screens, brand identity, and production assets (favicon, app icons, OG share image).

## About the Design Files
The files in `mocks/` are **design references created in HTML** — interactive prototypes showing intended look and behavior, NOT production code to copy directly. The task is to **recreate these designs in the target codebase** (e.g. Next.js/React) using its established patterns. If no codebase exists yet, choose an appropriate framework — the blog and tool pages must be statically rendered for SEO.

**How to read a mock:** each `.dc.html` file has (1) an HTML template where every visual property is an **inline style** — these are the exact, authoritative values for pixel-perfect implementation — and (2) a `class Component` script whose `renderVals()` defines all state, computed styles, and interaction handlers. Open any mock directly in a browser (keep `support.js` next to it) to interact with it.

## Fidelity
**High-fidelity.** Recreate pixel-perfectly: exact hex colors, font sizes, spacing, radii, shadows, and all hover/focus/active states are in the mocks' inline styles. Definition of done per page: screenshots at 1440px and 390px are visually indistinguishable from the mock.

## Screens / Views

### 1. Homepage — `mocks/Home.dc.html`
- **Purpose**: route users to the right tool fast; establish trust (free, private).
- **Layout**: sticky 60px header → hero (two flex columns: headline left, animated "living book" right) → full-width drop zone → tool grid in 3 grouped sections → trust strip (3 cells, 1px gaps) → 4-column footer. Max content width 1240px, side padding `clamp(16px,4vw,48px)`.
- **Hero headline**: Instrument Serif 400, `clamp(42px,6.5vw,84px)`, line-height 1.02, letter-spacing −.015em; "beautiful" in italic accent `#FF2E63`.
- **Living book animation**: a 340×300 card cycles through 3 "formats" every 3.8s (epub → pdf → azw3), morphing bg/padding/radius/shadow/line-widths with `transition: all 1s cubic-bezier(.4,0,.2,1)` and 55ms stagger per line; format ticker `.epub → .pdf → .azw3` highlights the active one. Respect `prefers-reduced-motion` (freeze).
- **Drop zone**: whole-page drag target. Default: 2px dashed `rgba(23,19,14,.3)` on `#FFFDF9`, radius 14px. Drag-over: border/bg go accent, `scale(1.01)`, headline swaps to "Drop it." After a file drops: filename chip (ink bg, mono 13px) + tool suggestion pills matched by extension (outlined accent pills, fill on hover).
- **Tool cards**: `#FFFDF9`, 1px `rgba(23,19,14,.14)` border, radius 10px, padding 16px; format badges (mono 11.5px on `rgba(23,19,14,.07)`) + accent arrow; hover: accent border + `translateY(-2px)`.
- **Mobile (<760px)**: nav collapses; fixed bottom tab bar (Tools / Convert / Studio), 44px+ targets, safe-area padding; page gets 76px bottom padding.

### 2. Tool page template — `mocks/EPUB to PDF.dc.html`
This is the **template for all 21 tool pages** — implement once, drive with a data file (name, formats, options, FAQ, related tools).
- **Flow (4 states)**: `idle` (drop zone) → `file` (filename chip + Page size [A4 / US Letter / 6×9″] and Margins [Narrow/Medium/Wide] segmented controls + full-width accent CTA) → `working` (6 skeleton lines that "re-typeset" progressively, mono `re-typesetting · N%`, 3px progress bar) → `done` (accent check circle animation, "Your PDF is ready", filename · size · "deleted from our server in 59 min", download CTA).
- **Segmented controls**: 1px `rgba(23,19,14,.22)` border, radius 9px; selected segment = ink bg `#17130E`, paper text.
- **Below the tool**: How-to (3 numbered cards, mono accent `01/02/03`), EPUB vs PDF explainer (2 cards), FAQ accordion (5 items, `＋` rotates 45° when open), related tools grid.
- **Mobile**: sticky bottom CTA bar appears in `file` state; drop zone says "Tap to choose a file".
- **SEO**: h1 "Convert EPUB to PDF", crawlable how-to/FAQ copy (use FAQPage structured data), breadcrumb.

### 3. Style Studio — `mocks/Style Studio.dc.html`
The signature editor. Desktop: live book preview left + 390px control panel right. Mobile: full-bleed preview + draggable bottom sheet (snap points: 150px / 52% / 88% of viewport, drag handle + tap-to-cycle).
- **Preview**: a typeset page of *The Time Machine* on a desk-colored canvas (`#EAE4DA`, dark `#0E0F12` when theme is dark). All controls apply live. Paginated (fixed height, ←/→ pager, "Page x of y") or Continuous view; 1–2 columns (desktop only).
- **Two control layers** (visually distinct cards):
  - **"Saved into your book"** (solid card, accent square bullet): presets (5 cards w/ live font thumbnails: Classic novel / Modern / Compact / Airy / Accessible), typeface list grouped Serif/Sans/Accessibility (13 fonts incl. Atkinson Hyperlegible, OpenDyslexic), keep-original + embed-font toggles, boldness 300–700, sliders (text size 12–28px shown as px·pt, line 1.2–2.2, letter −0.5–2px, word 0–6px), paragraphs (indent vs space + sub-slider), alignment (Left/Justified; justified auto-enables hyphenation), drop caps, heading size (Subtle/Standard/Strong), 5 reading themes (Paper `#FEFCF7`/`#1A1814`, Cream `#F6EDDC`/`#3B2F20`, Mist `#EDF0F3`/`#232A31`, Dusk `#2A2D33`/`#E8E6E1`, Ink `#000`/`#DFDCD5`) + Custom with bg/text/link pickers and **live WCAG contrast badges** (AAA/AA/Fails · ratio; red warning below 4.5:1), dim-images toggle, margins, line-length slider 40–95ch with 60–75 comfort band, Book details (title/author/language/cover).
  - **"Preview only"** (dashed card): view mode, columns, focus ruler (accent-tinted line-height band following cursor), fixation bolding (first ~45% of each word bolded), preview theme override, progress indicator style.
- **Header**: source label `sample.pdf → the-time-machine.epub`, **hold-to-compare** button (press = raw Times New Roman conversion, release = styled).
- **State**: settings persist (sessionStorage in mock); changing anything sets preset chip to "Custom"; per-section ↺ reset + global "Reset to preset".
- **Download bar**: accent CTA with live filename + size (embed font adds ~240 KB). Desktop: pinned bottom of panel; mobile: top of sheet.

### 4. Blog listing — `mocks/Blog.dc.html`
- Header + accent-highlighted "Blog" nav item. Intro block (mono kicker, serif h1 `clamp(36px,5vw,60px)`).
- **Category chips** (working filter): All / How-to / Formats explained / Typesetting / Kindle / Fix it. Selected = accent pill.
- **Featured card**: horizontal, title serif `clamp(26px,3vw,38px)`, "Featured" chip (accent on `rgba(255,46,99,.1)`), illustration of 3 book formats. Hidden unless its category matches.
- **Post grid**: `repeat(auto-fill, minmax(300px,1fr))`, cards with mono category chip + read time, serif 22px titles, date + accent "Read →".
- **Newsletter block**: ink `#17130E` card, serif headline, email input + accent Subscribe (→ "Subscribed ✓").

### 5. Blog article — `mocks/Blog Post.dc.html`
- **Reading progress bar**: 3px accent bar under the sticky header, width = scroll %.
- **Article column** (max 720px): breadcrumb, serif h1 `clamp(32px,4.5vw,52px)`, byline row (38px avatar circle, name, date · read time, Share button → "Link copied ✓").
- **Body type**: Literata 17.5px / 1.75, color `#26211A`; h2s Instrument Serif 1.65em with `scroll-margin-top:90px`; callout card ("The rule of thumb"), comparison table (ink header row, zebra rows), accent-left-border blockquote, in-body links `#C41E4F` underlined.
- **Sticky TOC** (desktop only, 250px): "On this page", items highlight + accent left border via scroll-spy.
- **Conversion elements**: "Tools mentioned" card in sidebar; end-of-article CTA card → converter.

### 6. Identity — `mocks/Identity.dc.html`
Brand sheet: the mark ("the re-typeset line" — book cover with 3 text lines, middle one shorter + accent), reversed/on-accent variants, wordmark lockups, app icon sizes (16px uses thicker bars — see `assets/favicon.svg`), color, type, voice do/don't.

### 7. Overview — `mocks/Overview.dc.html`
Internal review canvas only (all screens, desktop + mobile iframes). Do not implement.

## Interactions & Behavior
- Hover states: everywhere via the mocks' `style-hover` attributes (cards lift 2px + accent border; buttons get accent shadow `0 6px 18px rgba(255,46,99,.35)`).
- Focus: every interactive element has `outline: 2px solid #FF2E63; outline-offset: 2–3px` (offset −2px inside segments). Keep this exactly — it's the a11y system.
- Transitions: micro-interactions 0.15s; theme/color changes 0.25s; hero morph 1s `cubic-bezier(.4,0,.2,1)`. All gated by `prefers-reduced-motion`.
- Responsive: single breakpoint at **760px** (JS in mocks; use CSS media queries in production). Fluid `clamp()` type/spacing between 390 and 1440.
- Touch targets ≥ 44px on mobile.

## State Management
Each mock's `class Component` documents its exact state shape and transitions:
- Home: `{isMobile, dragging, fileName, fmt}` — fmt cycles 0–2 on a timer.
- Tool page: `{stage: idle|file|working|done, fileName, fileSize, pageSize, margins, pct}`.
- Style Studio: one `s` object holding all ~20 saved settings (see `presetDef()` for the 5 preset value-sets) + preview-only state `{view, cols, ruler, fixation, pvTheme, prog}`; persisted per-file (localStorage in production); `_preset` tracks Custom-ness. Contrast math: WCAG relative luminance (`lum()`/`contrast()` in the mock).
- Blog: `{cat, subscribed}`; Article: scroll-spy `{progress, active}`.
- No backend needed for the mockups' behavior; real conversion is your API. The mock simulates it with a 90ms-interval progress timer.

## Design Tokens
Colors:
- Paper (page bg) `#FAF7F2` · Card `#FFFDF9` · Ink (text/fills) `#17130E` · Graphite (secondary) `#6E675D` · Body-warm `#26211A`
- Accent electric pink `#FF2E63` (the ONLY accent — use sparingly); accent-on-light text `#C41E4F`; accent tint `rgba(255,46,99,.05–.12)`
- Borders: `rgba(23,19,14,.14)` default, `.16` cards, `.22` inputs; desk canvas `#EAE4DA`; success `#1B7F4D`; error `#B3261E`
- Reading themes: see Style Studio section above.

Type:
- **Instrument Serif** 400 (display/h1/h2/card titles, letter-spacing −.01 to −.015em) — never for body.
- **Archivo** 400–700 (all UI/body).
- **IBM Plex Mono** 400–500 (filenames, sizes, formats, kickers, badges).
- **Literata** (blog article body 17.5/1.75).
- Style Studio embeds: Literata, Crimson Pro, EB Garamond, Lora, Source Serif 4, Merriweather, Bitter, Inter, Source Sans 3, Nunito Sans, Atkinson Hyperlegible, OpenDyslexic (CDN: jsdelivr open-dyslexic).

Radii: pills 999px · cards 10–12px · large cards 14–16px · inputs/buttons 8–11px · segments 9px.
Shadows: card `0 1px 0 rgba(23,19,14,.06)` · floating `0 14px 40px rgba(23,19,14,.12)` · accent CTA hover `0 6px 18px rgba(255,46,99,.35)`.
Header: 60px, `rgba(250,247,242,.94)` + `backdrop-filter: blur(8px)`, bottom border.

## Assets (`assets/`)
- `favicon.svg` — 16–32px variant (thicker bars, rx 6). Use as `<link rel="icon" type="image/svg+xml">`; also export favicon.ico 32px from it.
- `icon.svg` — standard app icon art (rx 5.4). Export 512/192 PNGs for the web manifest; also use for `apple-touch-icon` (180px, on `#17130E`).
- `icon-maskable.svg` — full-bleed maskable manifest icon (art at 80% safe zone).
- `logo-mark.svg` — in-page header mark (framed variant, 24px next to the wordmark).
- `og-image.png` — 1200×630 share image. Wire as `og:image` + `twitter:card=summary_large_image` on every page. (Source mock: `OG Image.dc.html` in the design project if you need to regenerate.)
- Wordmark is live text, not an asset: Instrument Serif "Epub Studio" + accent full stop `.` — see Identity page for clearspace.
- `theme-color` meta: `#FAF7F2`.

## SEO requirements (the blog's whole purpose)
- Static rendering (SSG) for every tool page + blog page; semantic HTML (one h1, real lists, table for comparison).
- Per-page title/meta-description; canonical URLs; `FAQPage` schema on tool pages, `Article` schema on posts; sitemap + RSS for the blog.
- Tool pages at `/epub-to-pdf` style slugs; blog at `/blog/<slug>`.
- Blog post titles in the mocks are keyword-draft placeholders — replace with real keyword research.

## Files
- `mocks/*.dc.html` — the 7 design references (+ `support.js`, required runtime; keep it beside them to open in a browser).
- `assets/` — production-ready brand assets.
- `PROMPT.md` — a ready-to-paste kickoff prompt for Claude Code.

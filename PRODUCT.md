# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two first-class audiences, weighted equally (confirmed):

- **Readers with devices** — own a Kindle, Kobo, tablet, or phone; arrive from
  search with a file in hand and a device-specific goal: convert this book,
  fix this file that won't open, make it readable on my device.
- **Self-publishing authors** — turning a manuscript (Word, Markdown) into a
  clean EPUB for KDP and other stores; care about validation, metadata,
  covers, and how the book reads.

The "Fix it" visitor (broken file, cryptic error, arrived from a search in
mild distress) overlaps both audiences and is a core scene, not an edge case.

## Product Purpose

Epub Studio is a free, no-signup suite of in-browser EPUB tools — converters
in both directions, a reader, repair/metadata utilities — plus Style Studio,
a re-typesetting editor, and an SEO blog. Success today is measured in
organic search traffic and tool usage; the site is building EPUB topical
authority as the growth engine.

**Open decision:** monetization. The intent is traffic first, monetize later
(premium features, API, or ads — form deliberately undecided). Nothing in the
product currently charges, gates, or collects accounts, and no surface should
imply otherwise.

## Positioning

- **Local-first, verifiably.** Every tool runs client-side; files never leave
  the device. Privacy is a property you can check in DevTools, not a policy
  promise. This is the claim neighboring converter sites (upload-to-server)
  cannot truthfully copy.
- **Honesty as strategy.** Where a capability can't run in the browser
  (writing MOBI/AZW3), the page says so and teaches the working route instead
  of faking a converter or quietly uploading. Blog posts carry
  honest-limitations sections by contract.
- **Typography is the signature.** Style Studio writes the reader's
  typographic choices *into the downloaded file* — every EPUB-producing
  conversion flows into it. "Keep it beautiful" is the brand promise.
- **Open-format advocacy.** EPUB (open, W3C) as the master format; device
  formats are disposable copies. This stance runs through tools and content.

## Operating Context

- Visitors land mostly from organic search onto tool pages or blog posts, use
  the tool in the same visit, and leave with a file. No accounts, no
  onboarding, no retention mechanics.
- Conversions that produce an EPUB hand the result to Style Studio (IndexedDB
  handoff, `?book=` param) for styling before download.
- The Kindle path is deliberately "send the EPUB via Send-to-Kindle" rather
  than format conversion.
- The blog is written by an automated routine (cloud agent) driven by
  `.claude/skills/epub-blog-writer/SKILL.md`, publishing through GitHub PRs.
  Content ops live in `content-ops/` (keyword-map.csv = one-intent-one-URL
  ownership; backlog.md = queue). 22 posts live as of 2026-08-05.

## Capabilities and Constraints

- 19 working in-browser tools (JSZip/pdf.js/mammoth/jsPDF/mobi-parser based);
  2 guidance pages (`/epub-to-mobi`, `/epub-to-azw3`) that intentionally do
  not convert — no server conversion may ever be added; that constraint is
  load-bearing for the privacy positioning.
- DRM is never handled; removal is never explained. Encrypted files fail
  honestly.
- Very large files are bounded by device memory — an accepted trade-off,
  documented on /about.
- Stack: Astro SSG + Vue islands + Tailwind (no preflight); single 760px
  breakpoint; static hosting; Node ≥18 (dev pinned via `.nvmrc` + nvm
  fallback in `scripts/`).
- Blog contract: 5 fixed categories (How-to / Formats explained / Typesetting
  / Kindle / Fix it), Zod-validated frontmatter, organization byline, 900–
  1,400 words, generated OG card per post (`scripts/og-card.mjs` — renders as
  social card, listing thumbnail, and article hero).
- `design_handoff_epub_studio/` holds the original pixel-level design mocks
  (source of truth for the existing screens) and brand assets.

## Brand Commitments

- Name: **Epub Studio** — wordmark is live text, Instrument Serif, with an
  accent full stop ("Epub Studio<span accent>.</span>"). Mark: the
  "re-typeset line" — rounded ink square, three text bars, middle bar shorter
  and accent.
- Palette: paper `#FAF7F2` · card `#FFFDF9` · ink `#17130E` · graphite
  `#6E675D` · desk `#EAE4DA`; **`#FF2E63` is the only accent and is used
  sparingly** (accent-on-light text `#C41E4F`).
- Type: Instrument Serif 400 (display only, never body) · Archivo (UI/body) ·
  IBM Plex Mono (filenames, formats, kickers) · Literata (article body).
  Style Studio additionally embeds 12 reading typefaces incl. Atkinson
  Hyperlegible and OpenDyslexic. All fonts self-hosted.
- Voice: honest, mechanism-first, no hype; declarative openers, earned flat
  judgements, British-leaning -ise spellings. Codified with examples in the
  blog skill; the About page discloses how the blog is made (AI-assisted,
  human-edited, claims tested).
- Truthfulness commitments baked into copy: "files never leave your device"
  (must remain true), no fabricated people/testimonials/stats, no "deleted
  after an hour" claims (retired with the server model).

## Evidence on Hand

- The tools themselves — every claim about them is demonstrable in-browser.
- 22 published blog posts; brand asset pipeline (`scripts/og-card.mjs`
  generates deterministic brand-correct cards); favicon/manifest/OG set in
  `public/`; design mocks and Identity sheet in `design_handoff_epub_studio/`.
- **Absent, and must never be fabricated:** testimonials, user counts, case
  studies, press mentions, star ratings, named team members.

## Product Principles

1. **Local-first is the product.** A user's file never leaves their device;
   a capability that would require uploading is declined and explained, not
   shimmed.
2. **Honesty outranks conversion.** Guidance over fake capability, honest
   edges over overclaiming, verified citations over vague authority — even on
   pages whose job is persuasion.
3. **One intent, one URL.** Topical authority is built by the ownership map
   and information gain, never by volume; "no post this cycle" is a valid
   outcome.
4. **Every book leaves beautiful.** EPUB-producing flows end at Style Studio;
   typographic quality is the differentiator, not an afterthought.
5. **Accessibility is a feature.** A11y typefaces, live contrast badges, and
   the AA floor are product capabilities to be proud of, not compliance
   chores.

## Accessibility & Inclusion

**WCAG 2.1 AA is binding** (confirmed) — contrast, keyboard operability,
focus visibility, reduced-motion support are release criteria for all future
work. The incumbent system already carries: 2px `#FF2E63` focus outlines
site-wide, ≥44px touch targets, `prefers-reduced-motion` gating on all
animation, live WCAG contrast badges in Style Studio's custom themes,
Atkinson Hyperlegible + OpenDyslexic offered to readers, and empty-alt
discipline on decorative brand imagery.

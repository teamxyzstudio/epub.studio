---
title: 'EPUB justified text: why some books ignore the toggle'
excerpt: 'Your app''s alignment setting flips some books and ignores others. We measured where EPUB justified text gets pinned — and how to unpin it for good.'
category: 'Fix it'
ogImage: '/blog-og/epub-justified-text.png'
date: 2026-10-07
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - style-studio
  - epub-validator
howToTitle: 'How to turn off justified text in an EPUB'
howTo:
  - t: 'Open the book in Style Studio'
    d: 'Drop the EPUB on the page. The preview is your actual book rendered in your browser — nothing uploads anywhere.'
  - t: 'Choose a left-aligned preset'
    d: 'Modern, Compact, Airy and Accessible all set left alignment; only Classic novel keeps justify. The alignment control is under Text if you want to keep everything else.'
  - t: 'Download and check a middle chapter'
    d: 'The download replaces the book''s stylesheet wholesale, so stylesheet-level justification is gone from every chapter. If one chapter stays justified, its paragraphs carry inline styles — see the last section.'
faqs:
  - q: 'Is justified text in an ebook a mistake?'
    a: 'No — it is the standard print convention, and plenty of readers prefer it. The mistake is pinning it below the level a reading app can override, which turns a taste into a lock. A book that declares justification politely, at body level, gives you the look and keeps your choice.'
  - q: 'Why does justified text look worse on a phone than in a printed book?'
    a: 'Print justifies across a wide measure with a real hyphenation engine, so the extra space per line is tiny. A phone column fits a handful of words, and every line still has to reach both edges, so each gap grows large enough to see. Our 360-pixel test frames show the same paragraph with visibly stretched word spacing the moment justification applies.'
  - q: 'Does turning on hyphenation fix the gaps instead?'
    a: 'It shrinks them, because breaking a long word frees space mid-line, but it does not return the choice of alignment to you. The pairing is real: the stylesheet our own converters write couples text-align justify with hyphens auto precisely because one without the other produces the worst gaps.'
  - q: 'Can I edit the CSS by hand in Calibre or Sigil instead?'
    a: 'Yes. Open the book''s stylesheet in either editor and change or delete every text-align: justify declaration, then check the chapter files for style attributes on individual paragraphs, which live in the markup rather than the stylesheet. It is the same repair a restyle does, done manually — more control, more places to miss one.'
  - q: 'Is a book with locked justification invalid or broken?'
    a: 'No. We ran our four-lock test book through a validator and it passed — no problems found, structurally valid. Alignment lives in the book''s styling, and a validator checks packaging and structure, not typographic manners. Valid and annoying are fully compatible.'
draft: false
---

The complaint recurs on MobileRead and on Literature & Latte's Scrivener forum in both directions at once: one writer cannot get justified text to stay, the next reader cannot get rid of it. The second case is the maddening one. The app has an alignment setting. You set it to left. Some books obey instantly — and this book does not move.

That is not a broken setting. EPUB justified text is a CSS declaration inside the book, and whether your toggle beats it depends on two things nobody shows you: how deep the book pinned the declaration, and how deep the app's override reaches. We built a four-chapter test book that pins justification at four different depths, measured it against two override strategies in Chromium, and then unpinned it. Every number below comes from those runs.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Reading apps apply your alignment choice as a CSS override, and many apply it only at the top level of the page. A book that declares <strong>text-align: justify</strong> on its paragraphs — rather than on the body — sits below that override and never hears it. The durable fix is to change the book's own stylesheet, which is what <a href="/style-studio">Style Studio</a> does in the browser.
</div>

## Two stylesheets compete for the page

Every reflowable EPUB page is rendered from two sources of style: the stylesheet the book ships, and whatever the reading app lays on top — your font, your size, your alignment. The app's settings are not magic; they are CSS injected against the publisher's CSS, and the ordinary rules of the cascade decide who wins each property.

Alignment is where that bargain usually breaks, because `text-align` is inherited. An app that sets `text-align: left` on `body` relies on inheritance carrying it down to every paragraph. Inheritance, though, loses to any direct rule: a one-line `p { text-align: justify }` in the book's stylesheet beats the app's body-level setting on every paragraph in the book. The app's toggle still works — on the body element, which contains no text of its own. You drag the control, nothing changes, and both sides are behaving exactly as specified.

Books end up justified-and-pinned without malice. Word processors export paragraph styles as per-paragraph CSS or even per-paragraph `style` attributes; templates copy them forward; nobody tests on a narrow screen. For the record, books built by our own converters ship justified by default too — the generated stylesheet opens with `body { text-align: justify; hyphens: auto }` — but deliberately at body level, so the first reader who prefers ragged-right can have it with one toggle.

## The justified text truth table, measured

Our test book, `justbook.epub` (4,240 bytes, hand-built this run), carries the same three paragraphs four times: chapter one justifies at body level in its stylesheet, chapter two at paragraph level, chapter three with an inline `style="text-align: justify"` attribute on every paragraph, and chapter four with inline `justify !important`. We loaded each chapter in 360 px frames in Chromium and injected two override strategies a reading app might use, probing the computed `text-align` of the first paragraph each time.

| Where the book pins justify | No override | App sets body only | App sets body, p, li, dd !important |
|---|---|---|---|
| body-level stylesheet rule | justify | **left** | **left** |
| paragraph-level stylesheet rule | justify | justify | **left** |
| inline style attribute | justify | justify | **left** |
| inline style with !important | justify | justify | justify |

<figure>
<img src="/blog-media/epub-justified-text/toggle-vs-four-locks-360px.png" alt="A 2×2 grid of 360-pixel frames under the heading 'App toggle: body { text-align: left !important; }'. Chapter-001, labelled body.css body text-align justify, renders ragged-right with the probe 'computed text-align: left'. Chapter-002 (p-level rule), chapter-003 (inline style) and chapter-004 (inline !important) all render justified with visibly stretched word gaps and probes reading 'computed text-align: justify'." width="784" loading="lazy" />
<figcaption>The body-level override — one chapter obeys, three ignore it. Probes are computed styles read from each frame.</figcaption>
</figure>

The first strategy is the "slider does nothing" experience, and the book decides it, not the app: the identical toggle flips chapter one and bounces off the other three. The second strategy is the one the open-source Readium CSS project ships. Its documentation files alignment under the *user settings advanced* class — optional, but "should be applied by any means necessary if provided to users" — and its [built stylesheet](https://github.com/readium/readium-css/blob/master/css/dist/ReadiumCSS-after.css) honours that phrase: the user's alignment lands on `body`, `p`, `li` and `dd` directly, each with `!important`. A cascade quirk does the heavy lifting here — an `!important` rule in any stylesheet outranks a plain inline `style` attribute — which is how the deep override flips even chapter three.

<figure>
<img src="/blog-media/epub-justified-text/deep-override-360px.png" alt="The same 2×2 grid under the heading 'App toggle: body, p, li, dd { text-align: left !important; text-align-last: auto !important; }'. Chapters 001, 002 and 003 now all render ragged-right with probes reading 'computed text-align: left'; only chapter-004, labelled inline justify !important, stays justified with its probe reading 'computed text-align: justify'." width="784" loading="lazy" />
<figcaption>The Readium-style override flips three locks out of four. Only inline <code>!important</code> survives.</figcaption>
</figure>

We cannot tell you which commercial app sits in which column — that would take the actual devices on a bench, and forum reports are not a spec. What the table tells you is the useful part: if your alignment setting works on most books and fails on this one, this book is pinned below your app's reach, and no amount of toggling will change that.

## Unpin it at the source

The repair that works everywhere is to stop fighting the override war and change the side you actually own: the book's stylesheet. We dropped `justbook.epub` on [Style Studio](/style-studio), picked the Modern preset — sans-serif, left-aligned, block paragraphs; four of the five presets set left, only Classic novel keeps justify — and downloaded. The panel itself is honest about what this is: "These become the book's default look. Reading apps may let readers override them."

<figure>
<img src="/blog-media/epub-justified-text/style-studio-run.png" alt="Style Studio with the test book open: the header reads 'justbook.epub → the-justified-keeper.epub', a badge says 4 chapters, the Modern preset card is selected among Classic novel, Compact, Airy and Accessible, the preview renders 'The Justified Keeper — Body-level lock' as a styled page, and the download bar reads 'Download ready ✓ the-justified-keeper.epub · 4 KB'." width="760" loading="lazy" />
<figcaption>The live run: justbook.epub in, the-justified-keeper.epub out, Modern preset selected.</figcaption>
</figure>

What changed inside the file is small and checkable. The 4,240-byte book came back as 5,044 bytes. Every chapter's stylesheet link now points at one generated `epub-studio.css` (911 bytes) whose body rule says `text-align: left` — including chapters three and four, which never linked a stylesheet before. The old `body.css` (68 bytes) and `para.css` (74 bytes) are still in the archive, orphaned: present, referenced by nothing. Re-running the same frame-and-probe harness on the downloaded book shows chapters one and two ragged-right with **no override at all** — the stylesheet locks are simply gone, so the book reads left-aligned in any app, and an app-level preference for justify would still work on top.

<figure>
<img src="/blog-media/epub-justified-text/restyled-360px.png" alt="The 2×2 grid for the-justified-keeper.epub after Style Studio with no app override. Chapters 001 and 002, both labelled epub-studio.css text-align left, render ragged-right in a sans-serif face with probes reading 'computed text-align: left'. Chapters 003 and 004, labelled inline justify attr — SURVIVES, still render justified with probes reading 'computed text-align: justify'." width="784" loading="lazy" />
<figcaption>After the restyle, as shipped: stylesheet locks gone, inline locks still standing.</figcaption>
</figure>

## The paragraphs no restyle can save

That last screenshot is also the honest edge, in pixels. Chapters three and four are still justified after the restyle, because their lock never lived in a stylesheet — it rides on each paragraph as a `style` attribute, and the restyle rewrites stylesheet links, not markup. Three paragraphs per chapter still carry `text-align: justify` in the downloaded file; we counted them in the unzipped archive. The same survival applies to the font and margin cases we measured in [the font post](/blog/epub-font-wont-change) and [the margins post](/blog/epub-margins-too-big) — inline styles are the deepest sediment, and only an editor that rewrites the chapter markup itself (Calibre's or Sigil's, by hand) digs them out.

Two more edges worth naming. A Readium-class app can still rescue chapter three for you, since its `!important` override beats a plain inline style — so the restyled book fails fully only where the publisher wrote inline `!important`, which is as rare as it is hostile. And none of this is a validity problem: the live [EPUB validator](/epub-validator) passed the fully locked `justbook.epub` — "No problems found. This EPUB is structurally valid." — because alignment is styling, and styling is not structure.

If a book of yours sits in the stubborn columns of the table, the ten-minute version: drop it on Style Studio, pick any preset but Classic novel, download, and spot-check a chapter that used to ignore your app. The alignment choice moves back to where it belonged — into the file you own.

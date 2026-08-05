---
title: 'EPUB vs PDF vs MOBI: which format should your book be in?'
excerpt: 'Reflowable or fixed? Open or locked to one store? A plain-language tour of the three formats every author runs into — and a simple rule for choosing.'
category: 'Formats explained'
ogImage: '/blog-og/epub-vs-pdf-vs-mobi.png'
date: 2026-07-14
updated: 2026-08-05
author:
  name: 'Mofid Ansari'
  initial: 'M'
featured: true
tools:
  - pdf-to-epub
  - epub-to-pdf
---

You finished the manuscript. Now someone asks for "the file," and you discover there are at least three answers — **EPUB**, **PDF**, and **MOBI** — each behaving differently on every screen it touches. The good news: the choice is simpler than it looks, because the formats disagree on exactly one thing.

That one thing is *who controls the page*. Get that, and every "which format?" question answers itself.

## Reflowable vs fixed: the only distinction that matters

An **EPUB** is reflowable — the text pours itself into whatever screen it meets, like water. The reader picks the font size; the book re-typesets itself instantly. A **PDF** is the opposite: every line break, every margin is frozen at the moment of export. It is a photograph of a page.

That difference sounds technical. It is actually a decision about who the book is for.

A reflowable book assumes the reader knows their own situation better than you do. Someone reading on a phone on a train at night, someone with low vision who needs 24pt type, someone listening to it through a screen reader — a reflowable book serves all three from the same file, because it never committed to a shape. Underneath, an EPUB is a small website in a zip: XHTML for the text, CSS for the styling, and a manifest listing the pieces. Your styling is a *suggestion* the reading app is free to override, and that is the point rather than a limitation.

A fixed book assumes the opposite: that the arrangement is the content. A recipe where the ingredients sit beside the method, a contract where clause numbering must be stable, a print proof that has to match the press sheet — reflow those and you have destroyed them. PDF describes a canvas of a specific size and places every glyph at a coordinate on it. Nothing moves, ever, on any device.

Neither is better. They answer different questions.

<div class="callout">
<div class="callout-kicker">The rule of thumb</div>
Text people will <strong>read</strong> → EPUB. Layouts people must <strong>see exactly</strong> (contracts, cookbooks, print proofs) → PDF. Old Kindle in the drawer → convert to it, don't author in it.
</div>

MOBI is the odd one out: Amazon's legacy format, retired for new submissions since 2021. It still matters only because millions of older Kindles read nothing else. Treat it as an output target, never a source of truth.

It is worth understanding why MOBI is the way it is. It descends from the Palm Pilot era — the container is literally a PalmDB database — and was built when a handheld had a few megabytes of memory and a greyscale screen. It has no embedded font support and only a crude subset of CSS. Amazon knew this, which is why they replaced it with KF8 (the format inside `.azw3` files) back in 2011. A modern book pushed through MOBI comes out flattened: your carefully set headings become bold text, your drop caps vanish, your tables become a mess.

## The three formats, side by side

|                     | EPUB         | PDF               | MOBI        |
| ------------------- | ------------ | ----------------- | ----------- |
| Text                | Reflows      | Fixed             | Reflows     |
| Standard            | Open (W3C)   | Open (ISO)        | Proprietary |
| Reader font control | Full         | None              | Partial     |
| Best on             | Everything   | Print & desktop   | Old Kindles |
| Status in 2026      | The standard | For fixed layouts | Legacy only |

Two rows deserve more than a table cell.

**"Open" is not a technicality.** EPUB is a W3C standard, and PDF has been ISO 32000 since 2008. Both are publicly specified, which means anyone can write software that reads them and no company can revoke that. MOBI never was — it is Amazon's, documented only by people who reverse-engineered it. The practical consequence shows up in a decade or two, when the format you chose determines whether your book is still openable. Open formats get read by software nobody has written yet. Proprietary ones depend on a company continuing to care.

**"Reader font control" is an accessibility feature.** Roughly one reader in ten benefits materially from changing the typeface — the [British Dyslexia Association](https://www.bdadyslexia.org.uk/dyslexia) puts dyslexia alone at ten percent of the population, before counting low vision or simply tired eyes at the end of a day. In an EPUB they switch to Atkinson Hyperlegible at 20pt and carry on. In a PDF they pinch and pan across a page designed for paper. When you choose PDF for something that is just prose, you are quietly excluding those readers.

## The same book, weighed

Numbers from a real conversion of our specimen book with the tools on this
site: as an EPUB it is 5,183 bytes; [converted to PDF](/epub-to-pdf) it comes
out at 5,906 bytes — a ~14% size cost for freezing the layout, before a
single image enters the picture. (There is no MOBI column because no browser
can write MOBI — [ours included](/epub-to-mobi); for a Kindle you send the
EPUB itself.)

## So which one should your book be in?

Author in EPUB. It is the only format of the three that is an open standard, the only one every store accepts, and the only one that respects your reader's eyes. From a clean EPUB you can generate a PDF for print, an AZW3 for a Kindle, or a compressed copy for email — in seconds, with nothing lost.

This is the part worth internalising: **the direction of conversion matters enormously.** Going from a structured source to a fixed output is a rendering problem, and computers are excellent at it. You have headings, paragraphs and lists explicitly marked up; the converter reads that structure and lays it out at whatever trim size you ask for. Nothing is guessed.

Going the other way — starting from a PDF — is archaeology. A PDF does not record that a line was a heading. It records that some glyphs in 18pt bold sit at these coordinates. The converter has to infer, from position and size alone, where paragraphs end, which lines are headings, what is a header or footer to discard, and whether a two-column layout should be read across or down. It is genuinely hard, and it is why converted-from-PDF ebooks so often have broken paragraphs.

Our [PDF to EPUB tool](/pdf-to-epub) is good at that guessing, and [Style Studio](/style-studio) lets you repair the typesetting afterwards. But if you have the manuscript, always export EPUB first.

> A PDF is a photograph of a page. An EPUB is the page itself.

There are real exceptions. Fixed layout is the right answer for children's picture books where text sits on artwork, for graphic novels, and for anything where the page composition *is* the work. EPUB 3 supports fixed-layout books for exactly these cases — so even then, EPUB is often still the container. What you are choosing is reflow, not the format.

For everything else: one open, reflowable source file; disposable copies in every other format your readers need. Keep the source, regenerate the rest, and you will never have to make this decision twice.

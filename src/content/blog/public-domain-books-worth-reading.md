---
title: 'Where to find well-made public domain ebooks'
excerpt: 'Not all free editions are equal. How to tell a carefully produced text from a bad scan.'
category: 'How-to'
ogImage: '/blog-og/public-domain-books-worth-reading.png'
date: 2026-04-19
updated: 2026-08-20
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-reader
  - epub-validator
howToTitle: 'How to improve a rough public domain edition'
howTo:
  - t: 'Check Standard Ebooks first'
    d: 'If they have the title, stop looking — the edition will be better than anything you would repair by hand. Fall back to Project Gutenberg for breadth, and the Internet Archive only when nothing else has the book.'
  - t: 'Run it through the Validator'
    d: 'Structural faults come first: a manifest listing a file that is not there, a navigation document that goes nowhere. The Validator names the specific failure rather than reporting a vague error.'
  - t: 'Fix the metadata'
    d: 'Rewrite the title, author and language in the Metadata Editor so the book files correctly instead of sitting in your library as "Unknown Author".'
  - t: 'Re-typeset it in Style Studio'
    d: 'A decent typeface, a 60–75 character measure and sane leading turn a plain Gutenberg text into something genuinely pleasant to read.'
faqs:
  - q: 'Which source has the best-quality public domain ebooks?'
    a: 'Standard Ebooks, by a wide margin. Volunteers re-typeset each text properly — modernised punctuation, real semantic markup, considered covers, valid EPUB 3 — so the edition is usually better than anything you would produce yourself. The catalogue is small, around a thousand titles, so check there first and fall back to Project Gutenberg for breadth.'
  - q: 'How can I tell a good free edition from a bad one quickly?'
    a: 'Open it and jump to a chapter break. A good edition has a real heading and a working table of contents; a bad one has a line of capitals floating in the text and a contents list that goes nowhere. Absent metadata is the other quick tell — a book showing as "Unknown Author" was not made with care.'
  - q: 'Can OCR errors in a scanned book be repaired?'
    a: 'Not by any tool. Structural problems, metadata and typography are fixable in minutes; errors in the words themselves need a better source. Search the file for "modem" and "fhall" — if either turns up in a book that has nothing to do with modems, the text was OCRd without proofreading and there will be hundreds more errors you have not found.'
  - q: 'Does public domain mean every edition of the book is free to use?'
    a: 'No. Copyright expires a set number of years after the authors death — 70 in the EU, UK and US for most modern works — which frees the text, not every edition of it. A new translation is a new copyrighted work, and so are original annotations, scholarly introductions and often the typesetting and cover design. For reading this rarely matters; for republishing, check which edition you started from.'
  - q: 'Is Project Gutenberg still worth using?'
    a: 'Yes, for breadth: it is the largest and oldest archive at over 70,000 titles and the EPUBs are functional. Quality varies because the texts span decades of transcription practice, so expect to fix metadata and typography yourself — both of which take minutes.'
---

Public domain books are free, which makes it easy to forget that the *edition* still matters enormously. Two copies of the same novel can differ by decades of editorial work.

## The sources worth using

**Standard Ebooks** — the best of them by a wide margin. Volunteers take public domain texts and typeset them properly: modernised punctuation, real semantic markup, considered covers, valid EPUB 3. Small catalogue, uniformly excellent.

**Project Gutenberg** — the largest and oldest archive, over 70,000 titles. Quality varies because the texts span decades of transcription practice. The EPUBs are functional rather than beautiful.

**The Internet Archive** — enormous, and much of it is raw scans. Useful when nothing else has the book; expect to do work.

**Wikisource** — collaboratively proofread against page scans, so accuracy is good. Export quality is inconsistent.

## Telling a good edition from a bad one

<div class="callout">
<div class="callout-kicker">The 30-second check</div>
Open it and jump to a chapter break. A good edition has a real heading and a working table of contents. A bad one has a line of capitals floating in the text and a table of contents that goes nowhere.
</div>

Other tells: OCR artefacts (`rn` where `m` should be, `1` for `l`), page numbers and running headers stranded mid-paragraph, and no metadata — a book that shows as "Unknown Author" was not made with care.

## Fixing what you have

If the only available edition is rough, most of it is repairable. Run it through the [Validator](/epub-validator) to find structural problems, fix the title and author with the [Metadata Editor](/epub-metadata-editor), and re-typeset it in [Style Studio](/style-studio) — a decent typeface and a sane line length transform a plain Gutenberg text.

OCR errors in the text itself are the exception. Nothing can fix those but a better source, which is the strongest argument for starting at Standard Ebooks when they have the title.

## What "public domain" actually covers

Worth being precise, because the edition matters as much as the work.

In most jurisdictions copyright expires a set number of years after the author's death — 70 in the EU, UK and US for most modern works. Once expired, the *text* is free for anyone to use.

But a specific edition can carry its own rights. A new translation is a new copyrighted work. So is a scholarly edition with original annotations, and often the typesetting and cover design. Dickens is public domain; a 2019 annotated Dickens with a new introduction is not, in those parts.

For reading this rarely matters. For republishing or building on a text, check which edition you started from.

## Comparing the sources

| Source | Size | Quality | Best for |
| --- | --- | --- | --- |
| Standard Ebooks | ~1,000 | Excellent | Anything they have |
| Project Gutenberg | 70,000+ | Variable | Breadth |
| Internet Archive | Millions | Raw scans | Obscure titles |
| Wikisource | Large | Good text, weak export | Accuracy |
| Faded Page | ~10,000 | Good | Canadian-domain titles |

The practical rule: check Standard Ebooks first. If they have it, stop looking — the edition will be better than anything you would produce yourself. If not, Gutenberg. Fall back to the Archive only when nothing else has it.

## What careful production looks like

The difference between a good and bad free edition is not the words, it is everything around them:

- **Real semantic markup** — headings that are headings, so navigation works
- **A working table of contents**
- **Modernised, consistent punctuation** — curly quotes, proper em dashes, no OCR artefacts
- **Metadata that is filled in** — title, author, language
- **A cover** — even a plain typographic one
- **Italics preserved** from the original, not flattened

Standard Ebooks does all of this by policy. Gutenberg's older texts often do none of it, because they were transcribed when the goal was preserving the words at all.

## Spotting OCR damage

Scanned texts carry characteristic errors, and once you know them you cannot unsee them:

- `rn` read as `m` — "modern" becoming "modem"
- `l` / `1` / `I` swapped
- `cl` read as `d`
- Long-s (ſ) in older printings read as `f` — "ſhall" becoming "fhall"
- Running headers and page numbers stranded mid-paragraph
- Hyphens left in from line breaks: "conver- sation"

Search the file for "modem" and "fhall". If either appears in a book that has nothing to do with modems, the whole text was OCR'd without proofreading, and there will be hundreds more errors you have not found.

## Making a rough edition better

Structural problems are fixable in minutes; textual ones are not.

Run it through the [Validator](/epub-validator) to find what is actually broken. Fix the title and author with the [Metadata Editor](/epub-metadata-editor) so it files correctly in your library. Then open it in [Style Studio](/style-studio) — a decent typeface, a 60–75 character measure and sane leading transform a plain Gutenberg text into something genuinely pleasant.

None of that repairs OCR errors in the words themselves. Those need a better source, which is the strongest argument for starting at Standard Ebooks whenever they have the title.

## Giving something back

All of these are volunteer projects. Gutenberg's Distributed Proofreaders lets you proofread a page or two at a time against the original scan; Standard Ebooks takes contributors for typography and production. If you read a lot of free books, an hour occasionally is a fair trade.

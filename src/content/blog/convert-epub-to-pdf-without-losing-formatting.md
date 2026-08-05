---
title: 'How to convert EPUB to PDF without losing formatting'
excerpt: 'Page size, margins, and the two settings that decide whether your PDF looks typeset or broken.'
category: 'How-to'
ogImage: '/blog-og/convert-epub-to-pdf-without-losing-formatting.png'
date: 2026-07-13
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-to-pdf
  - epub-compressor
---

Most "the PDF came out wrong" complaints are not conversion bugs. They are a mismatch between a book that has no pages and a format that is nothing but pages. Once you pick the page, the rest falls into place.

## Why the output can look wrong

An EPUB has no page size. The text is a single continuous stream, and your reading app decides where to break it. A PDF has to commit: every line break is baked in at export. So the converter is not preserving a layout — it is inventing one, using the trim size and margins you give it.

Give it bad numbers and you get bad pages. Give it sensible ones and it looks typeset.

## Pick the page size first

<div class="callout">
<div class="callout-kicker">Start here</div>
Printing at home or at an office? <strong>A4</strong> (or <strong>US Letter</strong> in North America). Making something that reads like a novel on a screen or from a print shop? <strong>6×9″</strong>.
</div>

A4 and Letter are wide. At a normal body size that gives you 90–100 characters per line, which is well past the point where the eye starts losing its place on the return sweep. That is the single most common reason a converted PDF "feels off" — the lines are simply too long.

6×9 inches is the standard trade paperback trim. It produces roughly 65–75 characters a line, which is the comfortable range, and it is why the same book converted at 6×9 reads so much better than at A4.

## Then the margins

Margins are the other half of the line-length equation.

| Setting | Adds        | Use it when                                  |
| ------- | ----------- | -------------------------------------------- |
| Narrow  | 0.5in       | You want fewer pages, or you'll print two-up |
| Medium  | 0.75in      | Almost always — this is the default          |
| Wide    | 1.25in      | You want room to annotate, or a 6×9 novel    |

On A4, Wide margins pull the line length back down into the comfortable range, which makes it a genuinely good pairing. On 6×9, Wide can leave the text block looking cramped — Medium usually wins there.

## What actually carries over

Headings, paragraphs, block quotes, lists and images all survive, and the [EPUB to PDF converter](/epub-to-pdf) starts each chapter on a fresh page the way a printed book does. The text stays real text, so it is selectable and searchable in the finished PDF.

What does not carry over is the book's own CSS — custom fonts, decorative drop caps, precise spacing. A PDF built from an EPUB is a clean typesetting of the content, not a screenshot of how one particular app displayed it.

## If the file is enormous

Image-heavy books can produce very large PDFs. Run the book through the [EPUB Compressor](/epub-compressor) first: it re-encodes the images and leaves the text untouched, which usually halves the size with no visible difference on a screen.

## What the converter is actually doing

It helps to know that nothing is being "preserved" here in the way people expect. Your EPUB is a set of XHTML documents with a stylesheet; the converter parses that structure into a stream of typographic blocks — headings, paragraphs, block quotes, list items, images — and then lays those blocks onto pages of the size you picked.

That is why the result is a genuine typesetting rather than a screenshot. The text in the finished PDF is real text: selectable, searchable, and copyable. If you open it and try to select a sentence, you will get a sentence, not a rectangle of pixels. Converters that rasterise pages — which is what most "print to PDF from a reader app" routes do — produce files several times larger where none of that works.

The trade-off is that the book's own CSS is not carried across. Custom fonts, decorative section breaks, precise margins around pull quotes: those are properties of one particular rendering of the book, and they do not survive the trip.

## Getting a book-like result

If your goal is something that reads like a printed novel rather than a printout of a website, four settings do almost all the work:

- **6×9″ trim.** This is the standard trade paperback size and it is the single biggest factor.
- **Medium margins.** Wide will squeeze the text block uncomfortably at this trim.
- Let chapters break naturally. Each chapter starts on a fresh page automatically, the way a printed book sets them.
- Check the first page after converting. If the opening paragraph looks cramped, you are usually one margin setting away from fixing it.

For a study or reference document the priorities invert: A4 or Letter with Narrow margins fits more on each page and costs less to print.

## The three things that genuinely go wrong

**Scanned or image-only EPUBs.** Some EPUBs are just a wrapper around page images — comics, some public domain scans. There is no text to typeset, so the output will be images at whatever size fits. That is expected, not a bug.

**Very long unbroken paragraphs.** A paragraph that runs for two pages will not break the way you might want. This is a property of the source, and it shows up in every reader too.

**DRM.** Encrypted books cannot be opened by any converter. If the file came from a store and you did not strip DRM yourself, this will fail at the first step.

## After converting

If the PDF is much larger than you expected, the images are the reason. Run the source EPUB through the [Compressor](/epub-compressor) first and convert again — the text stays byte-for-byte identical and the file usually halves.

And if what you actually wanted was a better-looking *ebook* rather than a fixed page, convert nothing at all: open the book in [Style Studio](/style-studio) and re-typeset it. Changing the typeface and line length takes seconds and does not lock you out of reflowing later.

---
title: 'Why page numbers don''t exist in EPUB (and what to use instead)'
excerpt: 'Reflowable text has no fixed pages. Here''s how locations, percentages and CFIs actually work.'
category: 'Formats explained'
ogImage: '/blog-og/why-page-numbers-dont-exist-in-epub.png'
date: 2026-06-15
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-reader
---

"What page are you on?" is not answerable for an ebook, and the reason is structural rather than a missing feature.

## There is no page to number

A page exists because paper has edges. Text fills the sheet, hits the bottom, and continues on the next one. The number identifies a physical object.

An EPUB has no sheet. It is one continuous stream of text that your reader app pours into whatever space it has. Change the font size and every break moves. Rotate the device and they move again. A "page" in an ebook is a temporary consequence of your current settings — it is not a property of the book.

So a page number would mean something different on every device, and on the same device after any settings change.

## What readers use instead

**Percentage.** Simple, universal, meaningless for precision. Fine for "how much is left."

**Locations (Kindle).** Amazon splits the book into fixed chunks of about 128 bytes. They are stable across devices and font sizes, which makes them citable, but they map to nothing a person can perceive — location 4,312 is not a place you can find by flipping.

**CFI (EPUB Canonical Fragment Identifier).** The proper answer, and the one that powers highlights and sync. A CFI is a precise path into the book's structure — this element, this text node, this character offset. It survives font changes because it points at the content itself rather than at a rendering of it. It looks like this:

```
epubcfi(/6/14[chap05]!/4/2/14/1:36)
```

You will rarely see one, but every time your highlight reappears in the right place on a different device, a CFI did that.

<div class="callout">
<div class="callout-kicker">If you need real page numbers</div>
Cite the print edition, or convert to PDF. EPUB 3 also supports a page-list that maps to a specific printed edition — but it only works if the publisher included one, and most do not.
</div>

## For citation

Quote the chapter and a distinctive phrase rather than a number. It is more useful to a reader than location 4,312, and unlike a page number it will still be correct in ten years and in every edition.

If a fixed page genuinely matters — a legal filing, a classroom where everyone needs the same reference — that is what [EPUB to PDF](/epub-to-pdf) is for. Fix the pages once, and then the number means something.

## How a CFI actually works

Reading one is easier than it looks. Take:

```
epubcfi(/6/14[chap05]!/4/2/14/1:36)
```

The part before the `!` walks the book's spine — "the 7th item in the reading order, which has the id `chap05`". The part after walks the DOM inside that document: body, then the 1st child, then the 7th, then its text node, then 36 characters in.

Every step is an index into structure that exists regardless of how the book is displayed. Change the font, rotate the device, switch readers entirely: the 36th character of that paragraph is still the 36th character of that paragraph. That stability is why highlights sync and why "continue reading" lands you in the right place across devices.

The odd numbering — 6, 14, 4, 2 — is because CFI counts both elements and the gaps between them, so element indices are always even. A detail you never need unless you are writing a reader.

## Why Amazon did something different

Kindle locations predate widespread CFI support and solve a different problem. Amazon needed a citable unit that worked across their whole catalogue including formats with no useful DOM, so they chunked the file itself: roughly 128 bytes per location.

That makes locations stable and comparable between two people reading the same edition, which is genuinely useful. It also makes them meaningless as a measure of anything — location counts scale with file size, so an illustrated book has vastly more locations than a novel of the same length. And they do not transfer between editions or formats at all.

## What this means for you

**Reading.** Percentage is fine. Do not fight it — the absence of pages is a feature that lets the book fit your eyes rather than the other way round.

**Citing.** Give chapter plus a distinctive phrase. `Ch. 4, "the geometry they taught you at school"` is findable by anyone, in any edition, in any format, forever. A location number is findable by someone holding the same Kindle file.

**Studying or teaching.** If everyone needs the same reference, agree on one fixed artefact. Convert the book to [PDF](/epub-to-pdf) once, share that file, and cite its pages. You have deliberately given up reflow in exchange for a shared coordinate system — a reasonable trade when coordination matters more than comfort.

**Publishing.** If your book has a print edition, EPUB 3 lets you embed a `page-list` that maps positions to the printed pages. Readers that support it will show real page numbers matching the print edition. Most publishers skip this; for academic or reference work it is worth doing.

## The progress indicator problem

One genuine loss: percentage tells you how far through the *file* you are, not the *book*. A novel with forty pages of back matter — appendices, notes, an excerpt from the author's next book — will hit 100% well after the story has ended. Readers regularly report being blindsided by a book "ending" at 87%.

Nothing in the format fixes this. Some readers estimate chapter-relative progress instead, which helps. If you are producing books, keeping back matter proportionate is a small kindness.

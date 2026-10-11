---
title: 'EPUB page breaks: why the CSS is ignored and what works'
excerpt: 'EPUB page breaks written in CSS are hints many readers skip. The break every app honours is a new file — shown by building the same book both ways.'
category: 'Fix it'
ogImage: '/blog-og/epub-page-breaks.png'
date: 2026-10-11
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - docx-to-epub
  - split-epub
  - epub-to-pdf
howToTitle: 'How to make every chapter start on a new page'
howTo:
  - t: 'Find out how the book is cut'
    d: 'Unzip the EPUB (it is a ZIP archive) and look at the content files. If several chapters share one XHTML file, that file is the fault — no stylesheet can reliably break inside it.'
  - t: 'Re-cut it at the chapter heads'
    d: 'Rebuild from the manuscript with a converter that splits at Heading 1, or split the file inside the book with a source editor such as Sigil. One chapter per file is the goal.'
  - t: 'Keep the CSS as a hint, not the mechanism'
    d: 'Leave page-break-after: avoid on headings so a heading never strands at the bottom of a screen, but stop relying on page-break-before: always for the break itself.'
  - t: 'Validate the re-cut book'
    d: 'Run the result through an EPUB validator to confirm the container, manifest and reading order survived the surgery. Expect no warning about page breaks either way — that is not what validators check.'
faqs:
  - q: 'Why does my page break work in one app but not on my e-reader?'
    a: 'CSS break properties are optional for reading systems, and support is uneven even inside one vendor''s line-up. Kobo''s own developer spec calls page-breaking CSS only partially supported across its platforms, with the phone apps honouring values the e-ink readers do not. A file boundary is the one break that behaves the same everywhere.'
  - q: 'Does splitting a chapter into its own file change how the book reads?'
    a: 'Not visibly, apart from the break you wanted. Reading order comes from the spine list in the package file, so the text flows exactly as before, and the table of contents still points at the same headings. The reader simply starts a fresh screen when it crosses into the new file.'
  - q: 'Will an EPUB validator warn me that my page breaks will not work?'
    a: 'No. Validation checks structure — the container, the manifest, the reading order — not rendering. Our test book with a page-break rule on every chapter heading, none of which any paginating engine was obliged to honour, validated with no problems found.'
  - q: 'Is there a limit to how big one content file should be?'
    a: 'Kobo''s spec allows 10 MB of embedded content per HTML file inside an EPUB, and notes oversized files still load but cost download time and memory. Well before that limit, a single file holding many chapters paginates slowly on e-ink hardware — one more reason to cut at the chapter heads.'
  - q: 'Can I split one big content file without going back to the manuscript?'
    a: 'Yes, in a source editor. Sigil splits a file at the cursor, and Calibre''s editor can cut at a heading pattern. An online book splitter is a different job: it divides a finished book into several smaller EPUBs, and it cannot cut inside a single content file at all.'
draft: false
---

The stylesheet could not be clearer: `page-break-before: always` on every
chapter heading. And yet chapter two starts four lines below the end of
chapter one, mid-screen, on the Kobo, in the app, everywhere it matters. This
complaint has run on MobileRead for over a decade and keeps resurfacing in
Adobe's InDesign community — EPUB page breaks that are declared, exported,
checked twice, and then silently ignored by the device in your hand.

The rule is not broken. It was never a rule to begin with.

<div class="callout">
<div class="callout-kicker">The short answer</div>
CSS page-break properties are <strong>hints</strong> that a reading system may
honour or skip, and many skip them. The only page break every reader respects
is the start of a new content file inside the EPUB. Books whose chapters each
live in their own file break correctly everywhere; books with every chapter in
one file are at each app's mercy.
</div>

## The only page break every reader honours

An EPUB has no pages. It carries HTML files in a declared reading order — the
spine — and the screens you turn are manufactured at display time by cutting
each file into viewport-sized slices. That pagination happens one file at a
time. When the engine finishes a file, the next one starts on a fresh screen,
not because anyone styled it that way but because that is what paginating a
new document means.

[Kobo's developer spec](https://github.com/kobolabs/epub-spec) says this in
plain terms: "A page break will occur whenever the reading system encounters a
new html file", and "Creating a new file is the best way to establish page
breaks across all Kobo apps." The same document rates the CSS route —
"Page-breaking CSS is only partially supported across Kobo's reading
platforms" — with a support table in which the phone apps honour
`page-break-before: always` and the e-ink readers do not. One vendor, one
format, two behaviours. Multiply that across Apple Books, ADE-based apps and
a decade of firmware, and "partially supported" is the polite version.

So the question "why is my page break ignored?" usually has a boring answer:
the whole book is one XHTML file, and everything depends on a hint.

## One book, built both ways

We built the same three-chapter book twice and ran both through our own
tools. `onefile.epub` (2,474 bytes) carries all three chapters in a single
`book.xhtml`, with `page-break-before: always; break-before: page` on every
chapter heading. `splitbook.epub` (3,239 bytes) holds the identical text as
`ch1.xhtml`, `ch2.xhtml`, `ch3.xhtml`.

[Our EPUB to PDF converter](/epub-to-pdf) paginates the way the strictest
reader does — it starts a new page for each spine file and, like several
e-ink engines, never consults page-break CSS at all (code-verified: the
renderer has no branch for it). That makes it an honest test rig:

| Book | Inside | PDF out | Pages |
|---|---|---|---|
| onefile.epub | 3 chapters, one file, break CSS on every heading | 3,825 B | **1** — chapters run together |
| splitbook.epub | same words, one file per chapter | 4,625 B | **3** — each chapter starts fresh |

Same words, same stylesheet intent. The book that asked politely got nothing;
the book that was cut correctly never had to ask. Every claim in that table is
from this run's actual output — the single page of the first PDF contains all
three chapter headings in sequence.

## Re-cut the book at its chapter heads

If you still have the manuscript, the clean fix is to rebuild. [Our Word to
EPUB converter](/docx-to-epub) cuts a new content file at every Heading 1 —
we fed it a 1,597-byte test manuscript with three Heading 1 chapters this
run and the EPUB came back with `chapter-001.xhtml`, `chapter-002.xhtml` and
`chapter-003.xhtml`, one per chapter. Those breaks are structural. No reader
can decline them.

![The DOCX to EPUB tool after converting manuscript.docx: the done panel reads 'Your EPUB is ready — manuscript.epub · 4 KB · never left your device'.](/blog-media/epub-page-breaks/docx-to-epub-run.png)

The same heading logic drives our Markdown and text converters, so the rule
of thumb is format-independent: make your chapter titles real headings in the
source, and the chapters arrive pre-cut.

If all you have is the finished EPUB, the repair happens inside the book.
[Sigil](/blog/sigil-epub-editor) splits a file at the cursor — place it
before the chapter heading, split, repeat — and Calibre's editor can split at
a heading pattern in one pass. InDesign users have the fix at export time:
the long-running threads in Adobe's community settle on tagging the chapter
style to split the document, so each chapter leaves as its own file, with the
break CSS kept as a belt-and-braces hint on top.

## What the break CSS is still for

Not nothing. The *avoid* side of the family is useful precisely because it is
a hint: `page-break-after: avoid` on a heading tells the engine not to strand
the heading at the bottom of a screen with its first paragraph overleaf.
Engines that understand it produce nicer pages; engines that don't do no harm.
The stylesheet our own EPUB writer generates ships exactly that —
`h1,h2,h3{...page-break-after:avoid}` — while leaving the actual breaks to
the file boundaries it creates at every chapter.

That is the honest division of labour: **files for the breaks you need, CSS
for the breaks you'd prefer to avoid.**

## What a splitter, and a validator, will not do

Two tools sound like they solve this and don't, and it is worth being precise
about both — including ours.

[Our EPUB splitter](/split-epub) divides a book into separate, smaller EPUBs
— an anthology into standalone stories, a 90-chapter brick into volumes. It
cuts at existing file boundaries, so it cannot help a one-file book: fed
`onefile.epub`, it returned exactly one part (3,121 bytes), because there was
nothing to cut between. Fed `splitbook.epub`, it returned three. A splitter
is proof of how your book is cut, not a way to re-cut it. Two caveats from
the same run: each part is rebuilt with our generated stylesheet, so the
original CSS file is replaced, and the parts are separate books, not chapters
of one.

![The EPUB splitter after processing splitbook.epub: the done panel reads 'Your split files are ready — splitbook-split.zip · 9 KB · 3 files · never left your device'.](/blog-media/epub-page-breaks/split-run.png)

A validator will not flag the problem either. We ran `onefile.epub` — the
book whose page breaks no e-ink reader will honour — through [our EPUB
validator](/epub-validator) and it passed clean, because it is clean:
well-formed container, complete manifest, sane spine. Validation checks
structure, and pagination is rendering.

![The EPUB validator's report for onefile.epub: a check mark, the heading 'This EPUB is valid' and the line 'OK — No problems found. This EPUB is structurally valid.'](/blog-media/epub-page-breaks/validator-onefile.png)

One symptom this post deliberately does not cover: pages that *appear* where
you never asked — a blank screen between every chapter. That is the same
mechanism running in reverse, usually a stray empty file in the spine, and
[the blank pages post](/blog/epub-blank-pages) walks that repair.

If your chapters run together, stop editing the stylesheet. Open the archive,
count the content files, and put each chapter in its own — by rebuilding from
the manuscript through a converter that cuts at the headings, or by splitting
the file in a source editor. The page break you can't see in any CSS panel is
the only one that has ever been guaranteed.

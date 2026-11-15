---
title: 'EPUB text not selectable: when the words are a picture'
excerpt: 'EPUB text not selectable usually means the pages are pictures of words, not words. How to prove it in one minute — and what no converter can fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-text-not-selectable.png'
date: 2026-11-15
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-to-txt
  - cbz-to-epub
  - epub-validator
howToTitle: 'How to tell why your EPUB text will not select'
howTo:
  - t: 'Open the book in a second reading app'
    d: 'If the same passage selects fine elsewhere, the file has a text layer and the first app is the problem — a bug, a setting, or a platform restriction.'
  - t: 'Extract the text layer'
    d: 'Drop the EPUB on the EPUB to TXT converter. A near-empty text file — a title, an author line, nothing else — means the pages are images and there is no text to select.'
  - t: 'Route by what you found'
    d: 'A scanned book needs OCR before any conversion can help. A comic or picture book has image pages by design. An app-side failure means updating, or switching readers.'
faqs:
  - q: 'Why can I read the words on the page but not select them?'
    a: 'Because what the page contains is not text but a picture in which words are drawn. Your eyes read the pixels fine; the reading app''s selection machinery walks the document''s text content, and a page whose only element is an image contributes zero characters to it. We measured exactly that: select-all across an image chapter grabbed 0 characters while the same action on a text chapter grabbed 482.'
  - q: 'Will converting the EPUB to another format bring the text back?'
    a: 'No. A converter can only move text that already exists in the file. We extracted a 99,804-byte image-only EPUB to plain text and got 26 bytes — the title and author from its metadata, and nothing at all from the pages. There was never any text in the pages to carry over, and no format change can invent it.'
  - q: 'Can OCR give my ebook a selectable text layer?'
    a: 'OCR is the only route, and it has to run before the book becomes an EPUB. Optical character recognition reads the page images and produces real text, which can then be converted properly. None of the tools on this site perform OCR — they convert and edit what is already there — so for a scanned book the honest order is OCR software first, conversion second.'
  - q: 'Is an EPUB with no selectable text an invalid file?'
    a: 'No. We ran the image-only book through a structural validator and it passed: container, manifest, spine and metadata were all correct. Validation checks structure, not whether the content is text or pictures, so a perfectly valid EPUB can still have nothing to select. Comics converted from CBZ archives are exactly this shape on purpose.'
  - q: 'Why does search find nothing in my ebook?'
    a: 'Search walks the same text layer as selection, so the two fail together. When every page is an image, a search for a word you can plainly see on screen matches nothing, because that word exists only as pixels. If search also fails on a book that does select text elsewhere, suspect the app rather than the file — readers have shipped real search bugs.'
---

The page is right there. You can read every word on it — but your finger or
cursor drags a useless box, nothing highlights, the dictionary never pops,
and search comes back empty on a word you are looking at. EPUB text not
selectable is a steady complaint across reading apps — it recurs on Zotero's
forums, in Adobe's Digital Editions and Acrobat communities, on Apple's
discussion boards and on MobileRead — and the answers blame everything from
the app to the file. Both can be guilty. But the most common cause is
simpler and stranger: the book contains no text at all. The pages are
pictures of words.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Selection, search, highlighting and the dictionary all operate on a book's
<strong>text layer</strong> — the actual characters in its chapter files. A
scanned book, a converted comic, or an exported picture book carries its
words as <strong>images</strong>, and an image contributes zero selectable
characters, no matter how legible it is. The one-minute test: drop the book
on our EPUB to TXT converter. If the text file that comes out is nearly
empty, there was never any text to select.
</div>

## Selection is a text-layer feature

An EPUB chapter is an XHTML document, and every serious reading app renders
it with a browser engine. That is why selection in an ebook feels like
selection on a web page: it is the same machinery. The engine keeps a tree
of the document's elements, and selection, find-in-book, highlights,
annotations and dictionary lookup all walk the text inside that tree.

Words can reach the page by two routes, and the difference decides
everything. Text in the markup — `<p>Call me Ishmael.</p>` — exists as
characters the engine can enumerate, so every text feature works. Words
drawn inside an image exist only as pixels. The engine knows the element is
there; it has no idea there is writing in it. The
[W3C's accessibility guidance](https://github.com/w3c/wcag/blob/main/understanding/20/images-of-text.html)
is blunt about this class of content: "People cannot alter how text looks in
images" — and what cannot be re-styled cannot be selected, searched or read
aloud either.

Whole categories of ebooks are built the second way: scanned books whose
pages are photographs, comics converted from CBZ archives, and some
fixed-layout picture books. Our own [CBZ to EPUB converter](/cbz-to-epub)
produces exactly this shape, because that is what a comic archive is. Here
is the entire body of one page it generated:

```html
<body>
  <figure><img src="page-0001.png" alt="Page 1"/></figure>
</body>
```

One element, zero characters of prose. Multiply by the page count and you
have a complete, readable book in which there is nothing to select.

## The one-minute test for a missing text layer

You do not have to guess which kind of book you own. Extraction cannot
invent text, so extracting is the test. We ran our two standing test books
through the live EPUB to TXT converter, in the browser, for this post.

The text book behaves as expected: specimen.epub, 5,183 bytes, five
chapters of markup, extracts to a 1,582-byte text file containing its
headings and paragraphs.

The comic tells the real story. comic.epub is 99,804 bytes — two PNG pages
of 56,542 and 47,365 bytes wrapped in 371-byte chapter files. The converter
accepted it and produced comic.txt: **26 bytes**.

![The EPUB to TXT converter's finished panel after converting comic.epub: "Your text file is ready — comic.txt · 26 B · never left your device" with a Download TXT button.](/blog-media/epub-text-not-selectable/epub-to-txt-comic.png)

The entire 26 bytes read "Comic 2page / by Unknown" — the title and author
from the book's metadata. Not one character came from the pages, because the
pages contain none. A 99,804-byte book whose extractable text is its own
catalogue entry is a book with no text layer, and nothing that renders it —
on any device, in any app — will ever select a word of it.

Seeing is better than asserting, so we rendered one chapter from each book
side by side in Chromium and ran select-all inside both:

![Two book chapters rendered side by side in a test harness. Left: comic.epub's chapter-001.xhtml shows a fully readable page — "A Calibre alternative that runs in your browser" — with the result line "select-all grabs: 0 characters". Right: specimen.epub's chapter-002.xhtml shows its heading and paragraphs highlighted in blue with "select-all grabs: 482 characters".](/blog-media/epub-text-not-selectable/selection-harness.png)

The comic page is perfectly legible — it visibly says "A Calibre
alternative that runs in your browser" — and select-all grabs 0 characters.
The specimen chapter lights up blue: 482. Same harness, same engine, same
action. The only difference is whether the words are characters or pixels.

## A valid book with nothing to select

It is tempting to read "can't select, can't search" as file damage. It is
not, and the validator proves it: we ran the image-only comic through our
[EPUB validator](/epub-validator) and it passed — "No problems found. This
EPUB is structurally valid."

![The EPUB validator's report for comic.epub: a check mark, "This EPUB is valid", and the line "OK — No problems found. This EPUB is structurally valid."](/blog-media/epub-text-not-selectable/validator-comic.png)

Validation checks the container, the manifest, the spine, the metadata —
structure. Whether the content of a structurally sound book is prose or
pictures is outside its brief. For a comic, image pages are not even a
defect; they are the format doing its job. The symptom and the file's
health are simply different questions.

## When it is the app, not the book

If the same book selects text fine in a second reader, the file has a text
layer and the failure is local — and this class is real. Zotero's forums
carry a reported iOS bug where text on the second page of a paragraph
spanning two pages cannot be selected, and a separate thread on in-book
search failing to step through matches. Adobe's Digital Editions community
has long-running "cannot select text" threads, including fixed-layout EPUBs
whose search does not work in one app but does in another. Apple's boards
have the same shape: an EPUB that highlights on a Mac but not on an iPhone.
We could not fetch those threads from this environment to link them, so
they are named here rather than cited — but the triage they teach is sound:
test the file somewhere else before blaming it.

Platform restrictions sit in this bucket too. Selection and copying are
app features, and stores can limit them on protected books. That is a
policy of the platform, not a property of your EPUB — and not something a
file-side fix changes.

## What can and cannot be fixed

Honestly: if the pages are pictures, no converter repairs this — ours
included. Conversion moves existing text between containers; the 26-byte
extraction above is what "moving the text" of an image book amounts to. The
routes that exist are narrower. A scanned book needs OCR — software that
reads the page images and produces characters — before conversion, a wall
we map in [convert a PDF to an ebook](/blog/convert-pdf-to-ebook); none of
the tools here perform it. A fixed-layout book whose geometry is the
content has its own trade-offs, covered in
[fixed-layout EPUB problems](/blog/fixed-layout-epub-problems). And a comic
is already in its right form: nobody needs to select the lettering in a
speech balloon.

What you can always do is find out which case you have, in under a minute
and without installing anything: drop the book on the
[EPUB to TXT converter](/epub-to-txt) and look at what comes out. The file
never leaves your browser, and the size of the result is the diagnosis —
kilobytes of prose means the text layer is fine and the app deserves the
scrutiny; a couple of dozen bytes of metadata means you have a book of
pictures, and now you know exactly what to do with it.

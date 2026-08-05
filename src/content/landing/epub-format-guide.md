---
title: 'The EPUB format, explained'
h1: 'The EPUB format, explained'
excerpt: 'What an EPUB actually is, how it differs from PDF and Kindle formats, why files break, and how to fix them — the hub for everything EPUB on this site.'
type: 'pillar'
primaryKeyword: 'epub format'
date: 2026-08-05
ogImage: '/landing-og/epub-format-guide.png'
tools:
  - epub-validator
  - epub-reader
  - epub-metadata-editor
clusters:
  - label: 'Understand the format'
    posts:
      - what-is-inside-an-epub
      - epub-vs-pdf-vs-mobi
      - why-page-numbers-dont-exist-in-epub
  - label: 'Fix a broken file'
    posts:
      - fixing-corrupt-epub-files
      - epub-validation-errors-explained
      - epub-compatibility-problems
      - epub-table-of-contents-problems
      - epub-images-not-showing
      - epub-cover-not-showing
  - label: 'Make a good one'
    posts:
      - convert-word-to-epub
      - best-format-to-convert-to-epub
      - best-fonts-for-ebooks
      - ebook-line-spacing-and-line-length
      - ebook-chapter-openings
  - label: 'EPUB and Kindle'
    posts:
      - send-epub-to-kindle
      - mobi-is-dead
      - epub-embedded-fonts-not-working
draft: false
---

An EPUB is a ZIP archive with rules. Rename one to `.zip`, unzip it, and you
are looking at a small website: XHTML chapters, a stylesheet, images, and a
package file listing how they fit together. That one fact explains most of
what the format does well, most of the ways it breaks, and most of this page.

## Reflowable, and why that is the point

The defining property of EPUB is that text *reflows*. A book does not carry
pages; it carries a stream of marked-up text, and whatever screen opens it
pours that stream into its own shape. The reader chooses the type size; the
book re-typesets itself instantly. This is why an EPUB reads equally well on a
phone, a tablet and a 6-inch e-ink screen — and why "what page are you on?"
has [no real answer](/blog/why-page-numbers-dont-exist-in-epub) in a
reflowable book.

The trade is deliberate. A PDF freezes every line break at export and wins
wherever layout *is* the content — contracts, print proofs, cookbooks. EPUB
gives the reader control and wins wherever the content is prose. The full
comparison, including Kindle's formats, lives in
[EPUB vs PDF vs MOBI](/blog/epub-vs-pdf-vs-mobi).

## The five pieces inside

Every EPUB carries the same skeleton: a `mimetype` marker that must sit first
in the archive, uncompressed; `META-INF/container.xml`, a pointer to the
package document; the package document itself (`.opf` — metadata, a manifest
of every file, and the spine that sets reading order); a navigation document
that becomes the table of contents; and the content — XHTML chapters with
their CSS and images.

Knowing the skeleton turns "this file is corrupt" from a mystery into an
address. A book that will not open at all usually has a broken mimetype or
container. An empty table of contents means the navigation document is missing
or unlisted. Chapters out of order point at the spine. The anatomy is worth
[reading once in full](/blog/what-is-inside-an-epub) — after that, every
error message names a place you can look.

## EPUB 2 and EPUB 3

Two versions circulate. EPUB 2 (2007) is the legacy base; EPUB 3 (the current
standard, maintained by the W3C) adds real HTML5 content, better navigation,
embedded media and accessibility structure. Well-built modern files are EPUB 3
that still ship the EPUB 2 table of contents alongside, so decade-old readers
stay happy. Every converter on this site produces exactly that.

You rarely need to care which version a file is — until a store rejects it or
a reader shows an empty table of contents, at which point the
[Validator](/epub-validator) will tell you what is actually wrong, in plain
language, without uploading the file anywhere.

## Where files actually break

Almost every broken EPUB fails in one of five places: a re-zipped archive
that compressed the `mimetype`; manifest entries pointing at files that are
not in the archive; missing required metadata; malformed XHTML that strict
readers refuse to parse; or a missing navigation document. Each has its own
guide in the Fix cluster below, and each takes minutes to repair once named.

The deeper pattern is worth knowing: e-reading apps are strict where browsers
are forgiving. A chapter that renders in Chrome can fail on a Kobo because
XHTML is XML, and XML does not guess. That single fact explains the
[works-here-broken-there](/blog/epub-compatibility-problems) class of bugs
better than any list of symptoms.

## Using this site

Everything here runs in your browser — conversion, validation, repair,
reading, and the [Style Studio](/style-studio) re-typesetting editor that
writes your typographic choices into the file itself. Nothing uploads; the
tools work on your device and the guides below go one layer deeper than this
page. Start with whichever cluster matches the problem in front of you.

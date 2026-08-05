---
title: 'EPUB tools for self-publishers, free in the browser'
h1: 'EPUB tools for self-publishers'
excerpt: 'Turn a finished manuscript into a store-ready EPUB: convert from Word, validate, fix metadata, set the cover and typography — free, in your browser.'
type: 'audience'
primaryKeyword: 'epub tools for self-publishers'
date: 2026-08-05
ogImage: '/landing-og/epub-tools-for-self-publishers.png'
embedTool: 'docx-to-epub'
embedHeadline: 'Drop your manuscript (.docx) — get an EPUB'
embedHeadlineMobile: 'Tap to choose your manuscript (.docx)'
tools:
  - docx-to-epub
  - markdown-to-epub
  - epub-validator
  - epub-metadata-editor
  - epub-cover-editor
  - epub-compressor
guides:
  - convert-word-to-epub
  - best-format-to-convert-to-epub
  - fixing-corrupt-epub-files
  - reduce-epub-file-size
howToTitle: 'The manuscript-to-store pipeline'
howTo:
  - t: 'Convert the manuscript'
    d: 'Word or Markdown in, EPUB out. Heading 1 becomes your chapter breaks — check Word''s navigation pane first.'
  - t: 'Validate before any store sees it'
    d: 'Stores reject files with cryptic errors. The Validator names the actual problem in seconds, locally.'
  - t: 'Fix the book''s identity'
    d: 'Title, author, language and cover decide how the book appears in a reader''s library. "Document1" is not the look.'
  - t: 'Set the typography'
    d: 'Style Studio writes your typeface, spacing and margins into the file itself, with a live preview of the result.'
faqs:
  - q: 'Can I upload the EPUB straight to KDP from here?'
    a: 'No — publishing happens in each store''s own dashboard. What this site produces is the file you upload: converted, validated, with clean metadata and typography.'
  - q: 'Does the converter handle images in my manuscript?'
    a: 'Yes. Pictures in a Word manuscript are extracted at their original resolution and embedded in the EPUB. If the result is heavy, the Compressor shrinks the images without touching a word of text.'
  - q: 'Will my chapters come out right?'
    a: 'If chapter titles use Word''s real Heading 1 style, yes — each one starts a chapter and lands in the table of contents. Text that merely looks like a heading converts as an ordinary paragraph.'
  - q: 'Is any of this uploaded?'
    a: 'No. Conversion, validation and styling all run inside your browser; the manuscript never leaves your device.'
draft: false
---

Getting a manuscript into a store means producing one file: a valid EPUB with
clean metadata, a cover, and typesetting that does not embarrass the writing.
None of that requires installing anything. The pipeline on this page runs
entirely in your browser, and the drop zone above is its first step — the
actual converter, not a picture of one.

The order matters more than people expect. Convert first, then validate, then
fix identity, then typography — because each step depends on the one before
it. A store rejection almost always traces to something the
[Validator](/epub-validator) would have named in two seconds: a missing
`dc:title`, a manifest entry pointing at nothing, a malformed chapter. Finding
that out locally beats finding it out from KDP's error page.

Two honest limits, so you are not surprised later. This site does not talk to
any store — there is no "publish to KDP" button here, because publishing
happens in the store's own dashboard with your account. And it does not touch
DRM in either direction; that is applied by stores at their end, never here.

The step most authors skip is the last one. A converted manuscript reads like
a default: Times-ish serif, uniform spacing, no intent. [Style
Studio](/style-studio) is the editor for exactly this — pick the typeface (12
faces, including accessibility options), the line spacing, the margins, the
paragraph style, and watch a live page of your book re-typeset as you decide.
The choices are written into the EPUB you download, so every store preview and
every reader that respects publisher styling shows the book you designed, not
the converter's default.

What it costs: nothing, with no account. The tools below are the whole
pipeline, in order.

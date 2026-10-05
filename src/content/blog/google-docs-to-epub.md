---
title: 'Google Docs to EPUB: what the built-in export really makes'
excerpt: 'Google Docs to EPUB with no extra tools: what the native export contains — one file, no author, a TOC that cannot jump — and which repairs are worth it.'
category: 'How-to'
ogImage: '/blog-og/google-docs-to-epub.png'
date: 2026-10-05
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - docx-to-epub
  - epub-metadata-editor
  - epub-validator
howToTitle: 'How to turn a Google Doc into a clean EPUB'
howTo:
  - t: 'Download the Doc as an EPUB'
    d: 'Use the EPUB download Docs itself offers. You get a small, structurally valid file with your document title and language already in place.'
  - t: 'Check what the export forgot'
    d: 'Drop the file on a validator, then look at it in any reader: expect no author, a contents list that cannot jump, and one file holding the whole book.'
  - t: 'Add the author the export left out'
    d: 'Open the file in a metadata editor, type the author into the empty field and save. The repaired book shows a real name instead of Unknown on every shelf.'
  - t: 'Need real chapters? Go through Word'
    d: 'Download the same Doc as .docx and feed it to a Word-to-EPUB converter. Heading 1 becomes a chapter boundary, and the contents list gets links that work.'
faqs:
  - q: 'Does Google Docs export EPUB with separate chapters?'
    a: 'No. The export we pulled apart ships the whole document as a single content file, whatever headings it contains. The table of contents lists your Heading 1 lines, but every entry points at the top of that one file. If chapter structure matters — and for anything book-length it does — download the Doc as .docx instead and convert that; a converter that splits on Heading 1 produces one file per chapter with working links.'
  - q: 'Why does my Google Docs EPUB show no author or say Unknown?'
    a: 'Because the export writes no creator field at all. The package metadata carries the document title, the language and a modification date, and stops there. Reading apps that find no author display Unknown or leave the shelf entry blank. A metadata editor fixes it in under a minute: the title is already filled in, the author field is empty, and typing a name and saving writes a proper creator entry into the book.'
  - q: 'Can I change the font of an EPUB made from Google Docs?'
    a: 'Mostly no, and that is a property of how the export styles text. Every paragraph and span carries its own inline style naming Arial at a fixed point size, and inline styles outrank both the stylesheet and most reading apps'' font settings. Restyling tools that swap out stylesheets cannot reach them either. Converting via .docx produces a book with one small stylesheet, which readers and restylers can override normally.'
  - q: 'Is the EPUB that Google Docs produces valid?'
    a: 'Structurally, yes — the export we tested passed a validator with no problems found. But valid only means the container, the package file and the declared files check out. A book can be valid while shipping no author, dead contents links and hard-pinned fonts, which is exactly what this one does. Treat validity as the floor, not a verdict on quality.'
  - q: 'Do I need Calibre to convert a Google Doc to EPUB?'
    a: 'No. If one reflowable file is all you need, Docs makes the EPUB itself and nothing else has to touch it. If you want chapters, metadata and editable styling, download the Doc as .docx and run it through a browser-based Word-to-EPUB converter — the whole trip is two downloads and a drop, no install. Calibre remains the right tool when you want deep manual control over the result.'
draft: false
---

"Google Docs to EPUB" is a search with a slightly surprising answer: you don't need a converter at all. Docs will save your document straight to EPUB itself — the option sits in the same download menu as PDF and Word, which is usually where people spot it and start wondering what it actually produces.

So we measured that instead of guessing. This October we built a small two-chapter probe document — headings, bold and italic, a four-line verse, a list, a table — and pulled its EPUB export apart file by file, then ran the repairs with our own tools. The export is real, it is valid, and it is genuinely convenient. It is also a strange little book: one file, no author, a table of contents that cannot jump, and styling welded to every paragraph.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Use the built-in export when you need <strong>one readable file, fast</strong> — it is valid EPUB 3 and your title and language carry over. Expect <strong>no author, no chapter files and pinned fonts</strong>. For a book someone will actually shelve, download the Doc as <strong>.docx</strong> and convert that instead; you get real chapters, a working contents list and styling a reader can override.
</div>

## What the export actually contains

Our probe document came back as a 2,936-byte EPUB holding five files:

```
$ unzip -l google-doc.epub   (2,936 bytes total)
     13015  GoogleDoc/ExportProbeSongs.xhtml
       600  GoogleDoc/nav.xhtml
       687  GoogleDoc/package.opf
       255  META-INF/container.xml
        20  mimetype
```

That is a textbook-minimal EPUB 3: mimetype, container pointer, package file, navigation document, content. The package file declares `version="3.0"`, carries the document's name as `dc:title`, the language as `dc:language`, a generated identifier and a modification timestamp — and nothing else. No `dc:creator`. The person who wrote the document is not in the book, so a reading app's shelf shows the title over *Unknown author*. Our own [metadata editor](/epub-metadata-editor) pre-filled its form straight from the file and confirmed it: Title "Export Probe — Songs", Language "en", Author empty.

The content itself lives in exactly one XHTML file, named after the document. Two chapters went in; one 13,015-byte file came out. The export does not split on headings, however many you have.

## A table of contents that points nowhere

The navigation document is the oddest part. Google does build one, and it does list the right things — the document title, then each Heading 1. But look at the targets:

```
<a href="ExportProbeSongs.xhtml">Export Probe — Songs</a>
<a href="ExportProbeSongs.xhtml#">Chapter One — The Lamb</a>
<a href="ExportProbeSongs.xhtml#">Chapter Two — The Tyger</a>
```

Both chapter entries end in a bare `#` — a fragment link with no fragment. And they could not point anywhere better, because the content file contains not a single `id` attribute to land on. We counted zero across the whole document. Every TOC entry in every reading app will jump to the same place: the top of the book. For a two-page probe that is a shrug; for a 300-page manuscript it makes the contents list decorative.

There is also no `toc.ncx`. That is legal — the [EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html) requires the navigation document and classes the NCX as a legacy EPUB 2 feature — but older readers that only look for the NCX will show no table of contents at all.

## The styling is welded to every paragraph

Open the content file and the second story starts. Our 150-word probe carries **62 inline `style` attributes** — one on nearly every element, most repeating the same declarations: `font-family:"Arial"`, `font-size:11pt`, `line-height:1.0`, `color:#000000`, `margin:0`. Headings are pinned at 24pt Arial the same way. A further 793-character `<style>` block in the head exists mainly to draw list bullets through Docs' `lst-kix` class machinery.

Pinned inline styles are the strongest styling layer an EPUB can carry — stronger than the book's stylesheet, and stronger than most reading apps' font menus, which is the same mechanism we measured when testing [why a book's font won't change](/blog/epub-font-wont-change). It also defeats restyling tools, ours included: Style Studio works by replacing a book's stylesheets with one clean sheet, and the code never touches element-level `style` attributes — so on this file the Arial stays, the 11pt stays, and the one thing a restyle would remove is the block that draws the list bullets. Honest conclusion: a Docs export is not a candidate for restyling. It reads the way it reads.

One small grace note: the verse survived. The four lines we wrote as lines arrived as four tight, margin-free paragraphs, so the stanza still looks like a stanza — tidier treatment than some converters give poetry.

## Two repairs worth five minutes

First, know what you have. We dropped the export on our [EPUB validator](/epub-validator) and it passed clean:

<figure>
  <img src="/blog-media/google-docs-to-epub/validator-google-export.png" alt="The EPUB validator report: a tick, 'This EPUB is valid', and one OK line reading 'No problems found. This EPUB is structurally valid.'" width="760" loading="lazy" />
  <figcaption>Google's own export through /epub-validator: structurally valid as shipped. Validity is the floor, not the verdict.</figcaption>
</figure>

That pass is worth internalising: *valid* and *good* are different claims. The container, package and declared files all check out — while the author is missing and the TOC cannot jump. Structure checks don't read taste.

Second, put the author back. The metadata editor opened the export with the title and language already filled and the author blank; we typed the author in and saved:

<figure>
  <img src="/blog-media/google-docs-to-epub/metadata-editor-form.png" alt="The EPUB metadata editor showing google-doc.epub loaded, 3 KB, with Title 'Export Probe — Songs', Author 'William Blake' typed into the highlighted field, Language 'en', an empty Publisher field, and a Save changes button." width="760" loading="lazy" />
  <figcaption>The repair: the form pre-fills from the file — title and language present, author empty — and one field needs typing.</figcaption>
</figure>

The saved book grew from 2,936 to 2,993 bytes, and the package file now carries `<dc:creator>William Blake</dc:creator>` — we unzipped it and checked. That is the whole fix for the Unknown-author shelf entry.

## From Google Docs to EPUB, two ways

For anything with chapters, the better route starts one line lower in the same download menu: get the Doc as `.docx` and convert that. We rebuilt the probe as a plain 1,319-byte Word file with the same two Heading 1 chapters and dropped it on our Word-to-EPUB converter, live:

<figure>
  <img src="/blog-media/google-docs-to-epub/docx-route-done.png" alt="The DOCX to EPUB tool's finished panel: a tick, 'Your EPUB is ready', and 'probe-songs.epub · 3 KB · never left your device' above a Style it before downloading button." width="760" loading="lazy" />
  <figcaption>The docx route, run live on the rebuilt probe: 1,319 bytes of Word file in, a 3,373-byte EPUB out.</figcaption>
</figure>

The output is what the native export is not: `chapter-001.xhtml` and `chapter-002.xhtml` split at the headings, a navigation document whose entries link to those files by name, a `toc.ncx` for older readers, and one 452-byte stylesheet doing all the styling — which means reader font menus and restyling tools work normally. Bold and italic came through as semantic `<strong>` and `<em>`, and the verse kept its line breaks.

| What you get | Native EPUB export | .docx → converter |
|---|---|---|
| Chapter files | One file for the whole book | One per Heading 1 |
| Contents links | All point at the top | Link to each chapter |
| EPUB 2 fallback TOC | None | `toc.ncx` included |
| Styling | 62 inline styles, fonts pinned | One small stylesheet |
| Author field | Missing | "Unknown" until you set it |

That last row is deliberate honesty: neither route knows who wrote the book. A Word file carries no reliable author for a converter to trust, so ours writes `Unknown` rather than inventing one — the same one-minute metadata edit finishes either route. And with several Heading 1s in the file, the converter titles the book from the filename rather than guessing which heading is the title, so name the file what you want the book called before you drop it.

Where does that leave the built-in export? Genuinely useful, within its shape. A handout, a single essay, a document someone will read top to bottom on a phone — the native export is the shortest possible path and nothing we found makes it wrong for that. The moment the document is a *book* — chapters to navigate, an author to credit, a reader who might want their own font — spend the extra ninety seconds downloading the `.docx` and dropping it on our [Word-to-EPUB converter](/docx-to-epub). If you are starting from scratch rather than from an existing Doc, our walkthrough on [creating an EPUB](/blog/create-an-epub) covers the whole journey, source file to validated book.

---
title: 'How to create an EPUB, step by step'
excerpt: 'How to create an EPUB from the manuscript you already have: structure the source, convert in the browser, validate — one real run, with real numbers.'
category: 'How-to'
ogImage: '/blog-og/create-an-epub.png'
date: 2026-08-15
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - docx-to-epub
  - epub-validator
  - epub-metadata-editor
draft: false
---

People asking how to create an EPUB usually expect the answer to involve new software — something to install, a format to study, a week of learning before the first working file. The honest answer is smaller than that. If you have a manuscript, you are most of the way there already. An EPUB is not a thing you write; it is a package your writing gets put into, and the packaging step is the quick part.

The slow part — the only genuinely skilled part — happens inside your manuscript before any converter touches it. That is where this walkthrough spends its attention, because it is where the quality of the finished book is decided.

To keep it honest, we ran the whole process on a real file while writing this, using our own tools, and every number below comes from that run.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Mark your chapter titles with <strong>real heading styles</strong> in the source document, convert the file with a <strong>DOCX to EPUB converter</strong> in the browser, check the metadata, and validate the result before sending it anywhere. Four steps, no installed software, and the first one carries almost all of the weight.
</div>

## What you are actually making

An EPUB file is a zip archive with rules. Inside it, each chapter of your book is a separate XHTML document — structured web markup — plus a manifest listing every file, a spine giving the reading order, and a navigation document that becomes the table of contents. That is the entire trick, and [what is inside an EPUB](/blog/what-is-inside-an-epub) walks the anatomy if you want to see it laid out.

The reason this matters practically: a converter's whole job is to translate your manuscript into that set of chapter documents. It decides where one chapter ends and the next begins by reading the structure your source declares. Declare it clearly and the book builds itself. Declare it vaguely — chapter titles that are merely bold and centred — and you get one long undivided chapter with no navigation, which is the single most common first-EPUB failure there is.

## Step 1 — put the structure in the source

Open your manuscript and look at how the chapter titles are made. If they are ordinary paragraphs that were selected and made bigger, the converter cannot see them. If they carry the real **Heading 1** style, it can.

That is the entire skill. Apply Heading 1 to every chapter title, Heading 2 to sections within chapters, and let body text stay body text. In Word the styles gallery does it; the [convert a Word document to EPUB](/blog/convert-word-to-epub) guide covers the details, including what happens to images and footnotes. Writing in plain text instead? Markdown states the same structure with `#` marks, and the [best format to convert to EPUB](/blog/best-format-to-convert-to-epub) comparison weighs the routes if you have a genuine choice of source.

Everything visual that is not structure — fonts, margins, careful page layout — will not survive, and should not. An EPUB reflows to fit whatever screen it lands on. What you are carrying across is the text and its structure, nothing else.

## Step 2 — create the EPUB in the browser

Our test file is the five-chapter specimen manuscript this blog uses for every demonstration: a 9,452-byte DOCX with real Heading 1 styles on its chapter titles. (It was itself produced by our EPUB to DOCX tool from the repository's specimen book, so every byte of this run is reproducible.) We dropped it on the converter and clicked convert:

![The DOCX to EPUB converter's finished panel: a tick above the heading "Your EPUB is ready", the line "specimen.epub · 5 KB · never left your device", a "Style it before downloading" button and a "Download without styling" button.](/blog-media/create-an-epub/docx-to-epub-done.png)

The conversion runs in the browser tab — the manuscript is never uploaded anywhere, which is not a small point when the file is an unpublished book. The finished EPUB came out at 5,177 bytes, and the converter found all five chapters on its own, because the headings told it where they were.

## Step 3 — look at what came out

Unzipping the file we just made shows the shape described earlier, now real:

```
$ unzip -l specimen.epub   (5,177 bytes total)
       251  META-INF/container.xml
       362  OEBPS/chapter-001.xhtml
       839  OEBPS/chapter-002.xhtml
       899  OEBPS/chapter-003.xhtml
       614  OEBPS/chapter-004.xhtml
       569  OEBPS/chapter-005.xhtml
      1314  OEBPS/content.opf
       682  OEBPS/nav.xhtml
       452  OEBPS/style.css
       986  OEBPS/toc.ncx
        20  mimetype
```

Five chapter files, one per Heading 1. A `nav.xhtml` whose table of contents lists the five chapter titles in order. A `content.opf` package document carrying the manifest, the spine and the metadata.

That metadata deserves a look before you move on, because a converter can only know what the source told it. Our output's package document says the title is "Specimen" — taken from the document — and the author is "Unknown", because a DOCX does not reliably carry one. Shops and reading apps display exactly these fields, so an "Unknown" author will follow the book everywhere it goes. Thirty seconds in the [EPUB metadata editor](/epub-metadata-editor) sets the title, author and language properly, and is worth doing on every freshly created file.

## Step 4 — validate before you send it anywhere

The last step is the one people skip, and it is the cheapest insurance in the whole process. We dropped our new EPUB onto the validator:

![The EPUB validator's report on the freshly converted specimen.epub: a tick, the heading "This EPUB is valid", and a single OK line reading "No problems found. This EPUB is structurally valid."](/blog-media/create-an-epub/validator-created-epub.png)

A pass means the archive is structurally sound: the mimetype is exact, every manifest entry resolves to a real file, the spine has a reading order, the required metadata exists. That is what stores and library platforms actually check by machine before a human ever sees the book. A file that fails here gets rejected with an error message; running the [EPUB validator](/epub-validator) first means you see that message before the store does, while it still costs nothing.

## What a converter will not do

Being realistic about the limits saves the most frustration.

A converter will not invent structure. If the manuscript never marked its chapters, the EPUB will not have chapters — the fix is in the source, not in trying other converters until one guesses.

It will not design a cover. A first EPUB without one works fine, but a book heading to a store needs a cover image added — that is a separate, deliberate step, not something conversion supplies.

And there is a line past which conversion is the wrong tool entirely. Picture books and comics need fixed-layout EPUB, which is hand construction, not conversion. Hand-placed footnotes, complex nested navigation, or surgical markup repair call for a desktop editor — Calibre or Sigil — working on the converted file. Conversion gets you a clean, valid structural base. For most prose books that base is the finished article; for the exceptions, it is the correct starting point.

## From here

The order is the whole method: structure first, convert second, metadata third, validate last. The first EPUB you make this way takes about ten minutes, and nearly all of them are spent applying heading styles — which is exactly as it should be, because that is the part that becomes your table of contents, your chapter breaks and your reader's experience of the book. When the manuscript is ready, the [DOCX to EPUB converter](/docx-to-epub) will do its part in seconds, in the browser, without the book ever leaving your machine.

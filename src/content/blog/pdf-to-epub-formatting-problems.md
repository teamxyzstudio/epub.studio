---
title: 'PDF to EPUB formatting problems, and how to fix them'
excerpt: 'PDF to EPUB formatting problems — broken paragraphs, headers stranded in the text, one long chapter — come from how PDFs store words. Here is the fix.'
category: 'Fix it'
ogImage: '/blog-og/pdf-to-epub-formatting-problems.png'
date: 2026-07-19
updated: 2026-08-28
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - pdf-to-epub
  - epub-metadata-editor
  - epub-validator
howToTitle: 'How to fix PDF to EPUB formatting problems'
howTo:
  - t: 'Start from a text-based PDF'
    d: 'A PDF exported from a word processor carries a clean text layer. If conversion produces a near-empty file, the PDF is a scan — run it through an OCR tool first, then convert the result.'
  - t: 'Convert, then read the first section'
    d: 'Run the file through the converter and read the opening section before touching anything else. That first pass tells you which problems you actually have, rather than guessing.'
  - t: 'Retitle the placeholder sections'
    d: 'Rename each "Pages 1–10" style heading to its real chapter title in the Metadata Editor. This is the step that turns a mechanical dump into something that reads like a book.'
  - t: 'Validate before you publish'
    d: 'If the book is going to a store, run it through the validator last — reconstructed books occasionally carry small structural faults that stores reject in unhelpful terms.'
faqs:
  - q: 'Why did my PDF convert to an empty EPUB?'
    a: 'The PDF is almost certainly a scan — images of pages with no text layer — so there was nothing to extract. Run it through an OCR tool to add a text layer, then convert the result. There is no shortcut around this: you cannot rejoin text that was never stored as text.'
  - q: 'Why are page numbers and running headers mixed into my paragraphs?'
    a: 'Because to a PDF they are just more text positioned on the page — nothing marks them as furniture rather than content. When the converter walks the page top to bottom, those stray lines get swept up with the body, which is exactly why something like "Chapter 4 · 87" turns up mid-sentence.'
  - q: 'Why do paragraphs break mid-sentence, or run together?'
    a: 'The converter rebuilds paragraphs by guessing where they end, and its only reliable clue is punctuation at the end of a line. Clean prose rebuilds well; a heading with no full stop fuses to the sentence below it, and a line that wraps oddly can split a paragraph in two.'
  - q: 'Why does the converted book have sections called "Pages 1–10" instead of chapters?'
    a: 'Because a PDF has pages, not chapters, and inventing chapter breaks the source never contained would mean guessing — a wrong guess is worse than none. The ten-page sections keep the book navigable; renaming them to real chapter titles takes a few minutes and is the step most people skip.'
  - q: 'Do the images in my PDF come across to the EPUB?'
    a: 'No. The converter extracts the text layer only, so figures, diagrams and photographs are left behind. For plain prose that keeps the file small; for an illustrated or heavily diagrammed PDF it is a real loss, and there is no setting that changes it.'
  - q: 'Should I convert the PDF, or the original file it was made from?'
    a: 'Always the original if it still exists. A PDF is the flattened output of a document, while the Word file or manuscript still knows what is a heading and where paragraphs end — so converting it needs no reconstruction guesswork at all. Only convert the PDF when it is genuinely all you have.'
---

A PDF converted to EPUB often comes out wrong in a specific, recognisable way. Paragraphs break mid-sentence. The page number that sat at the foot of every page is now stranded in the middle of a paragraph. The whole book is one undifferentiated run of text with no chapters to jump between. These are the classic PDF to EPUB formatting problems, and none of them means the file is broken.

They are the predictable result of asking a format that never recorded its own structure to hand that structure back. Understanding why makes the difference between fighting the converter and getting a clean book on the first pass.

<div class="callout">
<div class="callout-kicker">The short answer</div>
A PDF stores text as glyphs placed at fixed coordinates, not as paragraphs and chapters. A converter has to <strong>reconstruct</strong> the reading order from those coordinates, and that reconstruction is where the mess comes from. Start from a text-based PDF (not a scan), convert with <a href="/pdf-to-epub">PDF to EPUB</a>, then tidy the results with the <a href="/epub-metadata-editor">Metadata Editor</a>.
</div>

## Why this happens

Open a Word document and it knows what a heading is, where a paragraph ends, and which line begins chapter three. A PDF knows none of that. It records that the letter "T" appears at this x-coordinate and that y-coordinate, then the letter "h" beside it, and so on across a page whose size is fixed. There is no paragraph object, no chapter marker, no reading order — only ink positioned on a page.

So converting a PDF is really an act of reconstruction. The text has to be lifted glyph by glyph, grouped back into lines by matching vertical positions, ordered top to bottom, and then split into paragraphs by guessing where one ends and the next starts. Every formatting problem you see is that guess going wrong somewhere, and each has a cause you can work around.

**Headers and page numbers land in the flow.** A running header or a page number is, to the PDF, just more text positioned on the page. Nothing marks it as furniture rather than content. When the converter walks the page top to bottom, that stray line gets swept up with everything else and dropped into the body — which is exactly why "Chapter 4 · 87" turns up mid-sentence.

**Paragraphs fuse or fracture.** The only reliable clue to a paragraph break is punctuation: a line that ends in a full stop, a question mark or a closing quote probably ends a thought. Our [PDF to EPUB converter](/pdf-to-epub) rebuilds lines into paragraphs on exactly those boundaries. It works well on clean prose and stumbles on anything else — a heading with no terminal punctuation fuses to the sentence below it, and a line that wraps oddly can split a paragraph in two.

**Columns interleave.** A two-column layout places both columns at the same vertical positions on the page. Group lines by height and the left column and the right column merge into one scrambled stream. This is the single hardest case, and no automated converter handles academic two-column PDFs cleanly.

**There are no chapters, because there were never any chapters.** A PDF has pages, not chapters. A converter cannot invent chapter breaks the source does not contain without guessing, and a wrong guess is worse than none — so ours groups every ten pages into a section headed `Pages 1–10`, `Pages 11–20`, and so on. That keeps the book navigable instead of pretending to a structure that was never there.

## The fix, in order

### 1. Start from the right kind of PDF

The biggest quality difference is decided before you convert anything. A PDF exported from a word processor or a typesetting tool carries a clean text layer, and paragraphs rebuild accurately from it. A scan or a photograph of pages carries no text at all — only images of pages — so there is nothing to extract.

If conversion produces an empty or near-empty file, the PDF is almost certainly a scan. Run it through an OCR tool first to add a text layer, then convert the result. There is no shortcut around this: you cannot rejoin text that was never stored as text.

### 2. Convert, then read the first section

Run the file through [PDF to EPUB](/pdf-to-epub). It works entirely in the browser — the PDF never leaves your device — and it extracts the text layer page by page, rejoining the lines into flowing paragraphs. Then open the result and read the opening section before doing anything else. That first pass tells you which of the problems above you actually have, rather than guessing.

### 3. Retitle the "Pages N" sections

The `Pages 1–10` headings are placeholders, not a verdict. Open the book in the [Metadata Editor](/epub-metadata-editor) and rename each section to its real chapter title. It writes the change without re-encoding the rest of the book, so nothing else shifts. This is the single step that turns a mechanical dump into something that reads like a book — and it is the one most people skip.

### 4. Validate before you publish

If the EPUB is going to a store rather than your own shelf, run it through the [Validator](/epub-validator) last. Reconstructed books occasionally carry small structural faults, and stores reject files for problems they describe in famously unhelpful terms. Finding out locally, in a couple of seconds, is faster than finding out from a rejection email.

## When PDF is the wrong starting point

Sometimes the honest fix is not to convert the PDF at all.

**If you still have the original, use it.** A PDF is the *output* of a document — the flattened, positioned final form. If the Word file, the manuscript or the original EPUB still exists, converting that instead is night and day, because the structure is still intact. Send a `.docx` through [Word to EPUB](/docx-to-epub) and headings become real chapters with no reconstruction guesswork at all.

**Images do not come across.** Our PDF converter extracts the text layer only — figures, diagrams and photographs are left behind. For a plain prose book that is fine and keeps the file small. For an illustrated or heavily diagrammed PDF it is a real loss, and there is no setting that changes it.

**Some layouts resist all automation.** Multi-column academic papers, PDFs built from complex tables, magazine-style pages with text flowing around images — these encode a reading order that no converter can infer reliably. For those, Calibre's heuristic PDF processing is worth a try, and manual cleanup afterwards is often unavoidable. Being realistic about this saves a lot of wasted attempts: a fixed, densely-designed page was never meant to reflow, and forcing it to will always show the seams.

## The shape of a good result

A clean PDF-to-EPUB job is not one where the converter did something clever. It is one where the source was already text, the prose was single-column, and a few minutes of retitling turned the page-range sections into named chapters. The tool does the mechanical part — lifting and rejoining the text locally, in your browser — and you do the judgement part, because deciding what counts as a chapter is a judgement the file itself cannot make.

When a conversion looks like a mess, that is usually the first thing to check: not whether the tool failed, but whether the PDF ever held the structure you are asking for back. Once you know it does, [converting it to EPUB](/pdf-to-epub) and tidying the section titles is a short, predictable job.

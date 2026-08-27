---
title: 'How to convert a Word document to EPUB'
excerpt: 'Heading styles in, chapters out. How DOCX structure maps to an ebook — and the mistakes to avoid.'
category: 'How-to'
ogImage: '/blog-og/convert-word-to-epub.png'
date: 2026-06-22
updated: 2026-08-27
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - docx-to-epub
  - epub-validator
  - epub-cover-editor
howToTitle: 'How to convert a Word document to EPUB'
howTo:
  - t: 'Apply real heading styles'
    d: 'Chapter titles get Heading 1 from Word''s style gallery — not bold, not 18pt. Check the navigation pane: if your chapters are listed there, the converter will find them.'
  - t: 'Drop the manual layout'
    d: 'Manual page breaks, text boxes, tabs-as-indentation and multi-column sections are dropped or flattened in a reflowable book. Set indentation on the paragraph style and keep images inline.'
  - t: 'Add a cover'
    d: 'A converted manuscript has none. Use a portrait image around 1600×2560.'
  - t: 'Validate before uploading'
    d: 'Stores reject files with missing metadata and give famously unhelpful error messages. Finding the problem here is faster.'
  - t: 'Fix the metadata'
    d: 'The title and author fields decide what appears in a reader''s library, and "Document1" is not the look you want.'
faqs:
  - q: 'Why did my converted EPUB come out as one giant chapter?'
    a: 'Because the chapter titles were formatted to look like headings instead of being marked as headings. The converter splits chapters at Heading 1; text that is merely bold and large converts as an ordinary paragraph, so nothing signals where a chapter begins. Apply Heading 1 from Word''s style gallery and convert again.'
  - q: 'Do manual page breaks in Word carry over to an EPUB?'
    a: 'No — they are ignored. A reflowable book has no fixed pages, so chapters break at Heading 1 and everything else flows continuously. Headers, footers, text boxes and multi-column sections are dropped for the same reason: they describe positions on a page the book no longer has.'
  - q: 'What happens to footnotes when Word converts to EPUB?'
    a: 'The text comes through but the linked markers are lost. There is no bottom of the page in a reflowable book to anchor a footnote to, so ebooks conventionally use endnotes with links instead — and rebuilding those links after conversion is manual work.'
  - q: 'Why is my converted EPUB so large?'
    a: 'Almost always the images. They are extracted at their original resolution, so a manuscript with a dozen print-resolution photographs can produce an EPUB of 60 MB or more. Convert first, then compress: the text is untouched while the images come down to screen resolution, and the file typically shrinks by half or better.'
  - q: 'Do tables from Word survive conversion to EPUB?'
    a: 'Structurally yes, visually rarely. A table designed for a Word page is usually too wide for a phone screen, so anything with more than three or four columns is worth reconsidering as a list before you convert. Images, by contrast, come through cleanly — extracted at full resolution and embedded as real files.'
---

A converter cannot see your document the way you do. It cannot tell that a line is a chapter title because it looks like one. It only knows what you told Word — which is why the same converter produces a clean book from one manuscript and a mess from another.

## Use real heading styles

This is the whole article, honestly. Apply **Heading 1** to your chapter titles from Word's style gallery. Not bold. Not 18pt. Not centred-and-bigger. The actual style.

Heading 1 is what the [DOCX to EPUB converter](/docx-to-epub) uses to decide where one chapter ends and the next begins, and the heading text becomes that chapter's entry in the table of contents. Text that merely *looks* like a heading converts to an ordinary paragraph that happens to be large — and you get a single-chapter ebook with no navigation.

Use Heading 2 and Heading 3 freely for sections inside a chapter. They carry across as real headings without starting a new chapter.

<div class="callout">
<div class="callout-kicker">Check it in 5 seconds</div>
Open Word's navigation pane (<strong>View → Navigation Pane</strong>). If your chapters are listed there, the converter will find them. If it is empty, it will not.
</div>

## Drop the manual layout

Anything you did to control where things sit on a page is meaningless in a reflowable book, and most of it is discarded:

| In your DOCX          | In the EPUB                                  |
| --------------------- | -------------------------------------------- |
| Manual page breaks    | Ignored — chapters break at Heading 1        |
| Text boxes            | Dropped                                       |
| Multi-column sections | Flattened to a single column                  |
| Tabs for indentation  | Collapsed — use paragraph indent settings    |
| Headers and footers   | Dropped — ebooks have no fixed pages         |

Images are the exception: they are extracted at full resolution and embedded properly in the book.

## Finish the job

Two steps that take a minute and are skipped constantly:

1. **Add a cover.** A converted manuscript has none. Use the [Cover Editor](/epub-cover-editor) with a portrait image around 1600×2560.
2. **Validate.** Run the [Validator](/epub-validator) before you upload anywhere. Stores reject files with missing metadata and give famously unhelpful error messages; you would rather find out here.

Then fix the metadata — the title and author fields decide what appears in a reader's library, and "Document1" is not the look you want.

## Styles are structure, not decoration

The deeper idea worth internalising: in Word, a *style* is a statement about what something **is**, while direct formatting is a statement about how it should **look**. Converters can only act on the first.

When you select a line and make it 18pt bold, you have told Word to draw those characters differently. You have not said "this is a chapter title". When you apply Heading 1, you have said exactly that — and the visual result is a consequence.

This distinction is why two manuscripts that look identical on screen convert completely differently. It is also why the fix is never "make it look more like a heading".

## A pre-flight checklist

Before converting, five minutes here saves an hour of repair later:

1. **Every chapter title is Heading 1.** Check the navigation pane, not the page.
2. **No manual page breaks** doing structural work. Chapters break at Heading 1.
3. **No tabs or spaces for indentation.** Set a first-line indent on the paragraph style instead — tabs become literal characters.
4. **Images are inline**, not floating with text wrapping. Floating positions have no meaning in a reflowable book.
5. **Front matter is separated.** Title page, copyright and dedication each want their own Heading 1, or they merge into chapter one.

## What happens to your images

Images are extracted at their original resolution and embedded as real files, which is usually what you want and occasionally a problem. A manuscript with a dozen print-resolution photographs will produce an EPUB of 60 MB or more.

Convert first, then run the result through the [Compressor](/epub-compressor). Text is untouched; the images come down to screen resolution and the file typically shrinks by half or better.

## Footnotes, tables and the awkward cases

**Footnotes** come through as text but lose their linked markers. In a reflowable book there is no "bottom of the page" to anchor to, so ebooks conventionally use endnotes with links. Rebuilding those links is manual work.

**Tables** survive structurally but rarely look good. A table designed for a Word page is usually too wide for a phone. Anything more than three or four columns is worth reconsidering as a list.

**Text boxes, headers, footers, multi-column sections** are all dropped. They describe positions on a fixed page, and the book no longer has one.

## Before you publish

Two checks, both quick:

- **[Validate](/epub-validator).** Stores reject files for missing metadata and give famously unhelpful errors. Finding out here is faster.
- **Read the first page on a phone.** Not a preview pane — an actual phone. Chapter openings and image sizing are where auto-conversion shows, and they are the first thing a reader sees.

Then set the title and author properly. Those fields decide what appears in a reader's library, and "Document1" is not the look you want.

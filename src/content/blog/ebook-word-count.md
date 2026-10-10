---
title: 'Ebook word count: how to get one (and why tools disagree)'
excerpt: 'No ebook stores a word count — the file has nowhere to put one. How to get a real ebook word count from the text itself, and why two counters never agree.'
category: 'How-to'
ogImage: '/blog-og/ebook-word-count.png'
date: 2026-10-10
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-to-txt
  - epub-to-docx
howToTitle: 'How to count the words in an ebook'
howTo:
  - t: 'Convert the EPUB to plain text'
    d: 'Drop the book on the EPUB to TXT converter and download the .txt it produces. The export is the book''s visible text in reading order, with a short title-and-author header on top.'
  - t: 'Run any word counter on the text file'
    d: 'Use wc -w on a command line or the status bar of any editor or word processor. Our 5,183-byte test book exported to 1,582 bytes of text and counted 273 words.'
  - t: 'Subtract what is not story'
    d: 'The header and the chapter headings are in the total. In the test export they accounted for 24 of the 273 words, so the prose figure to quote was 249.'
faqs:
  - q: 'Why does my reading app never show a word count?'
    a: 'Because there is no word count in the file for it to show. An EPUB stores its text as chapter documents and its metadata as a handful of bibliographic fields, so any app that wanted to display words would have to extract and count the whole book itself, committing to one definition of a word. Apps sidestep the question and track progress as a percentage or location instead.'
  - q: 'Can I write the word count into the EPUB''s metadata myself?'
    a: 'There is no standard slot for it. The EPUB specification requires an identifier, a title and a language, and its list of optional fields — creator, publisher, description, rights and so on — is bibliographic and closed. You could type a number into the description field, but no reading system treats that as a count; it is just text.'
  - q: 'How accurate is converting to text and counting that?'
    a: 'It is exact for what it counts, which is slightly more than the prose. The export keeps chapter headings and adds a two-line title-and-author header, so the raw total runs a little high — 24 words out of 273 on our test book. Subtract the headings if the number needs to be prose-only; for a novel-length book the difference is a rounding error.'
  - q: 'Why do two counters give different totals for the same file?'
    a: 'Because a word is a tokenisation decision, not a fact. Counting our test export by splitting on whitespace gave 275 tokens; wc -w gave 273, and the two disputed tokens were em-dashes sitting alone between spaces with no letters in them. Hyphenated compounds, numbers and headings move totals the same way, by fractions of a percent on anything book-length.'
  - q: 'Can I count the words in a DRM-protected ebook?'
    a: 'Not directly, and removing the protection is not the route — DRM is a restriction the publisher placed on the copy, and stripping it is a legal problem in most places regardless of motive. Count a DRM-free edition, a publisher sample, or the manuscript if the book is yours.'
  - q: 'Why does my comic or photo book show almost no words?'
    a: 'Because the pages are pictures, and text drawn inside an image is not text to any counter. We exported a 99,804-byte two-page comic EPUB and got 26 bytes back — four words, every one of them from the title and author metadata rather than the pages. Word counts only describe books whose words exist as text.'
draft: false
---

Ask a book its length and it answers in everything except words. An EPUB will state its title, its author, its language, the day it was last modified — but the one number writers actually trade in appears nowhere in the file. The ebook word count question keeps resurfacing wherever writers gather, from the Scrivener forums to MobileRead to the LibriVox recording boards, and the stock answers are a reader plugin, a copy-paste into a word processor, or a shrug.

The confusion is understandable, because the number feels like it should be *in* there somewhere. It is not. Nothing is hiding it; it was never written down.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Convert the book to plain text and count that. <a href="/epub-to-txt">Our EPUB to TXT converter</a> exports the book's visible text in reading order, in the browser, and any counter — <code>wc -w</code>, an editor's status bar — gives you a real total in seconds. Expect the figure to include chapter headings, and expect two counters to disagree by a handful of words. Both of those have reasons.
</div>

## The file has nowhere to put a word count

An EPUB is a zip archive of chapter documents plus one package file that identifies the book — we unpacked the whole thing in [what is inside an EPUB](/blog/what-is-inside-an-epub). The package metadata of the 5,183-byte specimen book we use for every test on this blog is, in full:

```xml
<dc:identifier id="bookid">urn:uuid:501f8bcd-…</dc:identifier>
<dc:title>Specimen</dc:title>
<dc:creator>Unknown</dc:creator>
<dc:language>en</dc:language>
<meta property="dcterms:modified">2026-08-05T16:07:53Z</meta>
```

That is not our converter being terse. The EPUB 3.3 specification [requires exactly three fields](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html) — identifier, title, language — and its optional list is a closed set of bibliographic terms: creator, publisher, description, subject, rights, date and friends. No word count. No page count. Not even an extent field a publisher could volunteer one in.

So every number you have ever seen attached to an ebook's length was computed by something, on the spot, from the text. Reading apps do a version of this when they show you "43%" or a location — a position derived from how far into the text you are, not a page or a word total; [why page numbers don't exist in EPUB](/blog/why-page-numbers-dont-exist-in-epub) walks through that arithmetic. A word count is the same kind of derived number. The only question is who does the deriving, and by what rules.

## Export the text, then count it

The honest route is to make the text countable and count it yourself. We dropped the specimen book on [our EPUB to TXT converter](/epub-to-txt) for this post — it runs in the browser, so the book stays on your machine — and the 5,183-byte EPUB came back as a 1,582-byte text file:

![The EPUB to TXT tool after converting specimen.epub: the done panel reports the conversion finished and offers specimen.txt for download.](/blog-media/ebook-word-count/epub-to-txt-run.png)

Then the counting is whatever you already have. `wc -w` on that export says **273 words**. Prefer a status bar to a terminal? [Convert the EPUB to Word](/epub-to-docx) instead and let your word processor's own counter read the same text — useful when you also want per-chapter figures, since the headings survive that conversion.

One thing to know about what you are counting. The export is slightly more than the prose: the converter writes a two-line header from the metadata — `Specimen`, then `by Unknown` — and keeps every chapter heading, because a text file with the headings stripped would be unusable for anything else. On the specimen, the header plus the title page and four chapter headings account for 24 of the 273 words, leaving 249 words of actual sentences. That is the figure to quote if "word count" means prose. On a real novel the same overhead — front matter, contents page, part titles — is a few dozen words against tens of thousands, and you can stop caring.

## Why two counters never agree

Run a second counter and you will get a second number; this is normal and worth exactly one paragraph of your attention. Splitting the same 1,582-byte export on every stretch of whitespace yields 275 tokens, not 273. The two extras are em-dashes — the specimen sets them open, spaced on both sides, so a bare `—` sits between two spaces and a splitter calls it a word. Our `wc -w` run said 273 because, in the plain C locale it ran under, a lone dash is not a printable word; rerun the identical command on the identical file in a UTF-8 locale and it reports 275. The same binary gives two answers depending on an environment variable. Neither is wrong; they hold different opinions about punctuation, and a word processor brings a third set of opinions about hyphens and numbers.

A word, in other words, is a tokenisation decision. The disagreements are real but bounded — a fraction of a percent on anything book-length — which is why the number is dependable for what writers use it for: comparing a manuscript against a genre's expectations, checking a submission limit, estimating a reading or recording session. It is a measurement with a tolerance, not a fact with a decimal point.

## The books that cannot be counted

Two honest limits. A comic, a scanned book, or any fixed-layout picture book has its words drawn into images, and image text is invisible to every counter. We exported our 99,804-byte two-page comic EPUB the same way and received 26 bytes: four words, and all four are the title-and-author header. The count is correct — the book genuinely contains no text — but it tells you nothing about how much reading the book holds.

And a DRM-protected purchase will not open in our converter or any other ordinary tool, which is the protection working as designed. Stripping DRM to get at the text is a legal problem in most jurisdictions whatever the motive, and this site does not route around it. Count the publisher's sample, a DRM-free edition, or your own manuscript.

For everything else — the drafts, the back-catalogue files, the public-domain library — the whole job is a drag, a drop and a `wc`. Export the text with the [EPUB to TXT converter](/epub-to-txt), point any counter at it, and the number that was never in the file is yours in under a minute.

---
title: 'EPUB alt text: the description layer most books ship without'
excerpt: 'EPUB alt text is what a reader gets when a picture cannot be seen. Where the description lives in the file, which routes keep it, and how to add yours.'
category: 'How-to'
ogImage: '/blog-og/epub-alt-text.png'
date: 2026-11-09
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - docx-to-epub
  - markdown-to-epub
  - epub-validator
howToTitle: 'How to get alt text into an EPUB'
howTo:
  - t: 'Write the description at the source'
    d: 'Type it into the Alt Text field your writing tool offers on a picture, or into the square brackets of Markdown''s image syntax. A description that exists only in your head does not convert.'
  - t: 'Convert by a route that carries it'
    d: 'A Word document with descriptions set arrives in the EPUB with every description intact as an alt attribute; Markdown''s bracket text arrives the same way.'
  - t: 'Verify in the output file'
    d: 'Rename the EPUB to .zip, open a chapter file, and look at each img tag. You should see alt="your description" on every meaningful image and alt="" on decorative ones.'
faqs:
  - q: 'Is alt text required in an EPUB?'
    a: 'The HTML standard that EPUB chapters are written in says the alt attribute must be specified on images, with narrow exceptions. A book without it still opens everywhere, and container-level validators still pass it, so in practice the requirement is on the author, not the file. EPUB''s accessibility metadata names alternative text as exactly the kind of feature a publication should declare.'
  - q: 'What is the difference between a missing alt attribute and an empty one?'
    a: 'An empty alt, written alt="", is a deliberate statement that the image is decorative and a reader losing it loses nothing. A missing alt attribute says nothing at all — the image is simply unaccounted for, and software that cannot show it has no replacement to offer. The two look identical on screen and mean opposite things underneath.'
  - q: 'Does alt text written in Word survive conversion to EPUB?'
    a: 'Yes. The description Word stores on a picture travels through conversion and lands as that image''s alt attribute in the chapter file, word for word. We proved this on a specimen document in this article. An image you never described arrives with no alt attribute at all, so the gaps survive the trip just as faithfully as the descriptions do.'
  - q: 'Can I add alt text to an EPUB that already exists?'
    a: 'Yes, by editing the chapter files directly. An EPUB is a zip archive, so unzip it, add alt="your description" to each img tag in the XHTML chapters, and zip it back up — or do the same inside an editor like Sigil or Calibre''s book editor. None of our converters can edit the alt text of an existing book today.'
  - q: 'Do comic conversions get real alt text?'
    a: 'Machine-generated pages get machine-generated labels. Our CBZ converter writes alt="Page 1", alt="Page 2" and so on — which tells a reader where they are, but nothing about what the panel shows. A genuine description of comic artwork has to be written by a person and edited into the chapter files afterwards.'
---

A question keeps surfacing on the Literature & Latte forums and on MobileRead:
you typed a description for every image — in Word, in Scrivener, somewhere —
and now the book is an EPUB, and nobody can tell you whether those
descriptions made the trip. EPUB alt text is invisible by design. It sits in
the file as the text a reader gets *instead of* a picture: when the image
fails to load, when the book is read aloud, when the reader cannot see. Most
books ship without it, and no error message anywhere will say so.

The question has two honest halves — where the text actually lives, and which
routes into an EPUB carry it. Both are checkable, so we checked, with real
files, on this site's own converters.

## Where alt text lives inside the book

An EPUB's chapters are XHTML files, and every picture in them is an `img`
element. Alt text is nothing more exotic than that element's `alt` attribute:

```html
<img src="image-001.png"
     alt="Bar chart of example EPUB downloads from January to April, rising from 120 to 480." />
```

The [HTML standard](https://html.spec.whatwg.org/multipage/images.html#alt)
is unusually plain about what belongs in it: "the intent is that replacing
every image with the text of its alt attribute does not change the meaning of
the page". The attribute "must be specified and its value must not be empty"
in the general case — with one deliberate exception. An image that is purely
decorative gets `alt=""`, the empty string, which declares that losing it
loses nothing.

That makes three distinct states, and the difference matters:

| In the chapter file | What it declares |
|---|---|
| `alt="A bar chart of…"` | The image is content; this text replaces it |
| `alt=""` | The image is decorative; skip it without loss |
| no `alt` at all | Nothing. The image is unaccounted for |

EPUB's own accessibility layer builds on the same idea from the metadata
side: [EPUB Accessibility 1.1](https://www.w3.org/TR/epub-a11y-11/) lists
alternative text first among the "features and adaptations that contribute to
the overall accessibility of the content" that a publication should declare —
and notes that a book with text and descriptions for all its images gains a
purely textual way to be read at all.

## The missing picture test

The spec calls alt text the `img` element's *fallback content*, and the
cleanest way to see what that means is a book whose pictures are genuinely
gone. We had one by accident — more on that below — so we opened its chapter
at phone width in Chromium:

<figure>
<img src="/blog-media/epub-alt-text/alt-fallback-render.png" alt="A book chapter rendered with both images missing. Where the chart should be, the text reads: Bar chart of example EPUB downloads from January to April, rising from 120 to 480. Where the decorative flourish should be, there is nothing." loading="lazy" />
<figcaption>The specimen chapter rendered in Chromium with both image files absent. The described image becomes its sentence; the decorative one becomes nothing.</figcaption>
</figure>

Where the chart should be, the page shows the sentence — the reader still
learns what the figure said. Where the decorative flourish should be, the
page shows nothing at all, exactly what `alt=""` asks for. That is the whole
mechanism: alt text is not a nicety layered on top of the book, it *is* the
book whenever the picture is not available. A book that [shows broken images
on some devices](/blog/epub-images-not-showing) with no alt text degrades to
a hole; the same book with alt text degrades to prose.

## Which routes into EPUB carry your description

We built a specimen Word document by hand: two images, one with a description
in the Alt Text field, one deliberately without. Then we ran it through the
live docx-to-epub converter on this site — 17,745 bytes in, 18,398-byte
EPUB out.

<figure>
<img src="/blog-media/epub-alt-text/docx-to-epub-done.png" alt="The docx-to-epub tool's done panel: Your EPUB is ready, altbook.epub, 18 KB, never left your device." loading="lazy" />
<figcaption>altbook.docx through the live /docx-to-epub converter — the output examined below is this exact file.</figcaption>
</figure>

The output chapter, quoted from the archive:

```html
<img alt="Bar chart of example EPUB downloads from January to April,
rising from 120 to 480." src="image-001.png" />
...
<img src="image-002.png" />
```

The description survived word for word, and both images arrived
byte-identical (14,542 and 1,953 bytes). But look at the second tag: the
image we never described has **no alt attribute at all** — not `alt=""`,
nothing. The converter cannot invent a decision you never made, so an
undescribed image in Word becomes an unaccounted-for image in the EPUB.

The same audit across the other routes into EPUB, run or code-verified on
this site's converters:

| Route in | Your description | What we found |
|---|---|---|
| Word (.docx) | Alt Text field | Kept, verbatim — proven above |
| Markdown | `![description](img.png)` | Kept, including `alt=""` for `![]()` |
| HTML | `alt` attribute | Kept — the sanitiser strips styling, never `alt` |
| CBZ comics | — | Machine labels: `alt="Page 1"`, `alt="Page 2"` |
| FB2, PDF, TXT | — | No channel; images don't travel into chapters |

The [Markdown route](/markdown-to-epub) deserves its asterisk. Our converter
kept both descriptions perfectly — `alt="Bar chart of…"` and the decorative
`alt=""` — but it does not pack the image files themselves into the book, so
the 384-byte specimen became a 2,832-byte EPUB containing descriptions of
pictures it does not hold. That is our own limitation, and it is also how we
got the fallback screenshot above: the markdown-made book *is* the
missing-picture test.

## Converting out of EPUB erases it

The trip out is harsher than the trip in. We took the EPUB with the proven
alt text and ran it straight back through our EPUB-to-Word converter. The
output opens fine — and contains zero images. Not stripped descriptions:
no pictures at all, 8,717 bytes of text. The shared extractor that feeds our
TXT, Word and PDF outputs records each image's file name and nothing else —
the `alt` attribute is dropped at the first step, which we verified in the
code. So even where images do travel, the descriptions do not.

That is worth saying plainly because it is the round trip people actually
make: fix something in Word, convert back, and the accessibility work you did
the first time is gone. Alt text should be maintained at the source document
and conversion run one way, source to book — not round-tripped through
formats that treat it as disposable.

## Why nothing warned you

We dropped the book with the missing alt attribute onto the live
[/epub-validator](/epub-validator):

<figure>
<img src="/blog-media/epub-alt-text/validator-passes-missing-alt.png" alt="The epub-validator report: a check mark, This EPUB is valid, and one line reading OK, No problems found. This EPUB is structurally valid." loading="lazy" />
<figcaption>The book whose second image has no alt attribute passes the live validator — structure is checked, chapter markup is not.</figcaption>
</figure>

"No problems found." Our validator checks the container — mimetype,
manifest, the files the package declares — and never parses the chapter
XHTML, so a missing `alt` is invisible to it. That is a scope boundary, not
a bug, but it means a clean validation report says nothing about whether
your images carry descriptions. The only check that answers the actual
question is looking: an EPUB [is a zip archive](/blog/epub-downloaded-as-zip),
so rename it, open a chapter, and read your own `img` tags. Thirty seconds,
no tooling.

## Writing a description worth shipping

The spec's replacement test does most of the work: write what you would have
written had you not been able to include the image. For the chart above,
that is its finding — "downloads rose from 120 in January to 480 in April" —
not "a bar chart with four red bars on a beige background". The same test
says what alt text is *not*: it is not a caption, a title, or a credit
line, all of which supplement an image a reader can see rather than replace
one they cannot. And an image that genuinely decorates — a flourish, a
scene-break ornament — earns an explicit `alt=""`, which is a decision, where
a missing attribute is only an omission.

The practical order follows from everything above. Describe the images where
the document lives, in Word's Alt Text field or Markdown's brackets. Convert
once, by a route that carries descriptions — a Word manuscript through
[/docx-to-epub](/docx-to-epub) arrives with every description intact, and
the proof is quotable from the output file. Then spot-check a chapter, and
treat the book, not the source, as the thing you are shipping.

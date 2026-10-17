---
title: 'EPUB right to left: when pages turn the wrong way'
excerpt: 'An EPUB reads right to left only when its spine says so. We converted a manga test file, added page-progression-direction by hand and validated the result.'
category: 'Fix it'
ogImage: '/blog-og/epub-right-to-left.png'
date: 2026-10-17
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - cbz-to-epub
  - epub-validator
howToTitle: 'How to make an EPUB read right to left'
howTo:
  - t: 'Convert the comic first'
    d: 'Drop the CBZ on the converter and download the EPUB. The pages arrive in filename order, one per spine entry — reading direction is not set yet.'
  - t: 'Open content.opf inside the archive'
    d: 'An EPUB is a zip; extract it and find the .opf file (META-INF/container.xml names its path). Look for the <spine> element.'
  - t: 'Add the direction attribute'
    d: 'Change <spine toc="ncx"> to <spine toc="ncx" page-progression-direction="rtl">. Nothing else in the file needs to change.'
  - t: 'Re-zip correctly and validate'
    d: 'Repack with the mimetype file first and uncompressed, then run the result through a validator. A one-attribute edit should leave everything else identical.'
faqs:
  - q: 'My book is in Hebrew or Arabic — is page-progression-direction enough?'
    a: 'Usually not on its own. The attribute orders whole pages and the direction you advance through them; the text inside each page is a separate layer, controlled by dir attributes and CSS properties like writing-mode. A right-to-left-language book generally needs both layers set, while a translated manga needs only the page order.'
  - q: 'Why does my manga EPUB still read left to right after I set rtl?'
    a: 'Because the attribute is a request, not a command. The reading app decides whether to honour it, and support is uneven — people have reported adding it correctly and seeing no change in their particular app. Kobo documents support for it; for other apps the only reliable answer is to test the book there.'
  - q: 'Can I just reverse the order of the images instead?'
    a: 'It works on an app that ignores direction, but the file is now lying about its own order. Any reader that does honour rtl will show the book backwards, two-page spreads pair the wrong pages together, and the table of contents runs in reverse. Setting the real attribute keeps the file honest everywhere.'
  - q: 'Is page-progression-direction allowed in EPUB 2 files?'
    a: 'The attribute was introduced in EPUB 3, so a validator checking against EPUB 2 will flag it. Kobo states it accepts the attribute in EPUB 2 files anyway and displays them correctly despite those flags. If you control the file, the cleaner route is an EPUB 3 package, where the attribute is simply part of the spec.'
  - q: 'Will epub.studio''s converter set the reading direction for me?'
    a: 'Not today. The converter writes every spine without a page-progression-direction attribute, so its output always reads left to right until you add the attribute by hand. The validator will not warn you about that either — it checks the container''s structure and never reads this attribute.'
draft: false
---

Every page of your manga is in the file, in the correct order, and the book
still reads wrong: tapping forward walks the story backwards, spreads pair the
wrong panels, page 6 arrives before page 5. This complaint keeps resurfacing —
on MobileRead it spans a decade, from scanned-manga conversions coming out in
the wrong order to an Arabic book whose pages kept turning the wrong way, on
Adobe's InDesign forum it appears as fixed-layout Japanese manga, and KDE's bug
tracker carries a years-old request for a "manga mode" in its comic reader. The
phrase people eventually search is some variant of **epub right to left** — and
the answer is smaller than almost anyone expects.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Reading direction lives in <strong>one optional attribute</strong> on one
element of the book's package file: <code>page-progression-direction="rtl"</code>
on the <code>&lt;spine&gt;</code>. Our converter never asks about it, and most
general-purpose converters don't either, so a converted comic almost always
ships reading left to right. Adding the attribute by hand is a 33-byte edit.
</div>

## One attribute decides the page order

An EPUB's spine is the list that says which document comes first, second,
third. The spine's optional `page-progression-direction` attribute then says
which way that sequence flows visually. The
[EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html)
puts it plainly: the attribute "sets the global direction in which the content
flows", with three allowed values — `ltr`, `rtl` and `default`. Choosing
`default` — or omitting the attribute, which is what actually happens — means
the publisher is "expressing no preference and the reading system can choose
the rendering direction". In practice readers default to left to right.

So a manga that reads backwards is not broken. It is a correctly ordered book
that never told the reader which way to run, and the reader guessed Western.

## Page order and text direction are different problems

Half the forum answers to this question fix the wrong layer, because two
unrelated systems both get called "right to left". `page-progression-direction`
orders whole pages: which page sits on which side of a spread, which way
"next" goes. Text direction *inside* a page — Hebrew sentences running right
to left, Japanese set vertically — belongs to the markup and CSS of each
chapter: `dir` attributes and properties like `writing-mode`. The spec keeps
them independent on purpose: individual documents "MAY override this setting
(e.g., via the writing-mode CSS property)".

A translated manga has English text and right-to-left pages, so it needs only
the spine attribute. An untranslated one needs both layers. Fixing the CSS when
the problem is page order — the most common forum mix-up — changes how
paragraphs align and leaves the pages turning exactly as wrongly as before.

## We built a manga EPUB, and it reads left to right

We tested the whole route this session. Four numbered test pages, zipped into
`manga.cbz` (43,077 bytes — the same container trick as any comic archive;
[what a CBR/CBZ file is](/blog/what-is-a-cbr-file) covers it), dropped on our
live CBZ to EPUB converter:

<figure>
<img src="/blog-media/epub-right-to-left/cbz-done.png" alt="The epub.studio converter's done panel: a pink check mark, the heading 'Your EPUB is ready', the line 'manga.epub · 46 KB · never left your device', a 'Style it before downloading' button and a 'Download without styling' button." width="760" loading="lazy" />
<figcaption>The live run: manga.cbz (43,077 bytes, four pages) → manga.epub, 46,992 bytes, one page per chapter.</figcaption>
</figure>

Unzipping the output and reading `content.opf` shows the spine the converter
wrote — verbatim, this is the whole thing:

```xml
<spine toc="ncx">
    <itemref idref="chap1"/>
    <itemref idref="chap2"/>
    <itemref idref="chap3"/>
    <itemref idref="chap4"/>
  </spine>
```

No direction attribute. That is not an accident of this file: the spine
template in our EPUB writer emits `<spine toc="ncx">` unconditionally, with no
code path that could add `page-progression-direction`. Every book our tools
build — from CBZ, DOCX, Markdown, anything — currently reads left to right.
Being realistic about this: that is the right default for most books and the
wrong one for every manga.

What the attribute changes is easiest to see on a spread. Same four pages,
same spine, both directions:

<figure>
<img src="/blog-media/epub-right-to-left/spread-ltr-vs-rtl.png" alt="Two simulated two-page spreads side by side on a dark background. The left spread, labelled page-progression-direction='ltr', shows page 2 on the left and page 3 on the right with a pink arrow reading 'you read this way' pointing right. The right spread, labelled rtl with the note 'spine unchanged, order mirrored', shows page 3 on the left and page 2 on the right, with the arrow pointing left." width="760" loading="lazy" />
<figcaption>Spread pairing simulated in Chromium from the converted pages. LTR puts page 2 left of page 3; RTL mirrors the same spine — page 3 left, page 2 right — and "forward" becomes a leftward turn.</figcaption>
</figure>

The spine never changes. Only the direction the reader walks it does.

## Putting right to left into the book by hand

Since the converter has no field for it, the fix is a hand edit — the smallest
one we know of in EPUB repair. An EPUB is a zip archive
([what is inside an EPUB](/blog/what-is-inside-an-epub) walks the whole
layout), so: extract it, open `content.opf`, and change one line —

```xml
<spine toc="ncx" page-progression-direction="rtl">
```

— then repack, observing the container's two rules: the `mimetype` file goes
in first and uncompressed. We did exactly that to the converted book this
session. The package file grew from 1,488 to 1,521 bytes — the 33 characters
of the attribute — and the archive from 46,992 to 47,014 bytes. Everything
else is byte-identical. The edited book passes our
[EPUB validator](/epub-validator):

<figure>
<img src="/blog-media/epub-right-to-left/validator-rtl.png" alt="The epub.studio validator report: a pink check mark, the heading 'This EPUB is valid', and a green result line reading 'OK — No problems found. This EPUB is structurally valid.'" width="760" loading="lazy" />
<figcaption>manga-rtl.epub (47,014 bytes) after the hand edit: structurally valid. The validator checks the container, not the attribute — see below.</figcaption>
</figure>

## What readers do with it — and what this fix cannot do

Honesty section. The attribute is a request, and the reading app decides.
[Kobo's EPUB documentation](https://github.com/kobolabs/epub-spec#right-to-left-page-and-text-direction)
is the clearest public commitment: it supports the spine-level
`page-progression-direction` attribute for right-to-left page flow, supports
`writing-mode` for vertical text, and even accepts the attribute in EPUB 2
files, which "will pass through processing and display correctly on Kobo's
reading platforms despite flags that ePub2 files will generate in EPUBCheck" —
the attribute is formally EPUB 3 vocabulary. Elsewhere support is genuinely
mixed: a MobileRead thread we found describes adding `rtl` to an Arabic book's
spine and watching the pages keep turning left to right regardless. We cannot
test device apps from here, so the honest instruction is: make the file
correct, then test it in the app you actually read in.

Three more limits worth knowing. The attribute will not reorder anything — if
a conversion genuinely scrambled your pages, that is a sorting problem, not a
direction problem (our converter orders pages by filename, numerically, so
`page-2` sorts before `page-10`). Reversing the images instead of setting the
attribute makes the book read "correctly" only on apps that ignore direction,
and backwards on every app that honours it. And a validator pass is not proof
the attribute is there or spelled right: ours reads the container's structure
and never inspects this attribute, so it would pass the book with the
attribute missing — or misspelled — just the same.

For the fix-layout crowd one extra trap, documented by Kobo: in fixed-layout
books with explicit page-spread properties, marking the *first* spine item
`page-spread-right` in an `rtl` book throws off the whole spread sequence in
its iOS app. Leave the first item unmarked and start assigning sides from the
second.

The route, end to end: [convert your comic archive](/cbz-to-epub) in the
browser, add the one attribute the converter cannot yet write for you, repack,
validate. Thirty-three bytes stand between your manga and pages that turn the
right way.

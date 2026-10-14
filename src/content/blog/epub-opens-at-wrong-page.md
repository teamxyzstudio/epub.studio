---
title: 'EPUB opens at the wrong page? The pin inside the book'
excerpt: 'When an EPUB opens at the wrong page, the book itself is often telling every app to start there. Find the pin — landmarks and guide — and repoint it.'
category: 'Fix it'
ogImage: '/blog-og/epub-opens-at-wrong-page.png'
date: 2026-10-14
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
  - merge-epub
howToTitle: 'How to fix an EPUB that opens at the wrong page'
howTo:
  - t: 'Rule out the app''s memory'
    d: 'Open a fresh copy of the file in a second reading app. If the book still lands on the same odd page, the position is written in the book, not remembered by the app.'
  - t: 'Read the book''s start pins'
    d: 'Unzip the EPUB and look for a landmarks entry marked bodymatter in nav.xhtml, and a guide reference of type "text" in the package file — the two places a start position lives.'
  - t: 'Repoint or remove the pins'
    d: 'Point both entries at the true first page in a hand editor such as Sigil or Calibre — or rebuild the book to strip them entirely — then validate the result.'
faqs:
  - q: 'Why does my EPUB skip the cover and open at the first chapter?'
    a: 'That is usually the start pin working as designed. The EPUB specification notes that reading systems often use the bodymatter landmark to jump readers past the front matter when they begin a book. An app that opens at chapter one and lets you page back to the cover is honouring a correct pin, not malfunctioning.'
  - q: 'Can a validator tell me the start position is wrong?'
    a: 'No. Validators check structure — that the archive is well-formed, the manifest matches the files, the spine is not empty, a navigation document exists. A landmark aimed at the wrong chapter is structurally perfect, so the book passes. The test book in this article points its readers past chapter one and validates clean.'
  - q: 'Will converting or merging the book fix a wrong start page?'
    a: 'It fixes it by removal. Rebuilt books from converters like ours carry no landmarks and no guide, so apps fall back to opening at the first page of the spine. The cost is that a correct start pin is stripped just as thoroughly as a wrong one, and a front-matter page flagged to be skipped becomes an ordinary page.'
  - q: 'Why does the same book open at different places in different apps?'
    a: 'Because the start position is a hint, not a rule, and each app decides which hints to honour. One follows the landmarks entry, another the older guide reference, a third ignores both and opens at the first spine page — and on a book you have opened before, the remembered last position usually wins over all of them.'
  - q: 'Is the reading order broken when a book opens in the wrong place?'
    a: 'No. The spine — the file that fixes which page follows which — is untouched, which is why paging backwards from the wrong start walks you through the skipped pages in perfect order. The pin is a jump target layered on top of the order, not part of it. A genuinely scrambled sequence is a different fault with a different fix.'
draft: false
---

The book opens, and it is not at the beginning. Chapter two, or the first table-of-contents entry, or some anonymous page past the title — and nothing you did put it there. The complaint has recurred on MobileRead for over a decade: an EPUB built for Kindle that opens past its hand-made first page, a start anchor that Kindle Previewer refuses to honour, books that land wherever they please. When an EPUB opens at the wrong page, the instinct is to blame the reading app. Sometimes that is right. Just as often, the book itself is instructing every app that will listen to open exactly there.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB can carry an explicit start position — a <strong>landmarks</strong> entry marked <code>bodymatter</code> (EPUB 3) and a legacy <strong>guide</strong> reference of type <code>text</code> (EPUB 2). Reading systems often jump straight to it the first time a book is opened. When those pins point at the wrong file — common after chapters are added, split or renamed — the book opens at the wrong page in every app that honours them. Reading apps also remember where you left off, so rule that out first.
</div>

## First, make sure it is the book and not the app

Reading apps store your last position so that a book reopens where you stopped. That memory has to be keyed to something — the file, or the identifier the book carries inside it — and it survives longer than people expect. A book you skimmed once months ago, re-downloaded today, can reopen mid-text for no reason visible in the file.

So the first test costs nothing: put a fresh copy of the file into a second reading app it has never seen. If the new app opens at the start, the odd position was the first app's memory, and clearing that book from its library (or just reading on) ends the matter. If the fresh copy in a fresh app lands on the same wrong page, the position is written in the book — and now it is worth opening the book up.

## The start of a book is written inside it — twice

An EPUB's reading order lives in the <strong>spine</strong>, an ordered list of the book's files. The spine says what follows what; it does not say where to begin. That job belongs to two optional pins layered on top.

The modern one is the landmarks nav, a block inside the same navigation file that holds the table of contents. The [EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html) defines it as identifying "fundamental structural components of the content" so reading systems can offer direct access to them, and its note on the `bodymatter` entry names the behaviour this article is about: reading systems often use this landmark to automatically jump users past the front matter when they begin reading. The older one is the `<guide>` element in the package file — EPUB 2's version of the same idea, kept as a legacy feature, where a reference of type `text` marks where the text proper starts. Books that want to work everywhere carry both, which means two pins that can disagree with the book and with each other.

Here is what they look like in a real navigation file:

```xml
<nav epub:type="landmarks" hidden="">
  <ol>
    <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
    <li><a epub:type="bodymatter" href="chapter-002.xhtml">Start of content</a></li>
  </ol>
</nav>
```

And the legacy twin in the package file:

```xml
<guide>
  <reference type="text" title="Start of content" href="chapter-002.xhtml"/>
</guide>
```

There is a third, quieter signal. A spine entry can be flagged `linear="no"`, telling apps the page is auxiliary — the specification allows a reading system to present it where it sits or to skip it until the reader seeks it out. A copyright page flagged that way is part of why a book can seem to begin after its own front matter.

The word doing the work in all of this is *often*. None of these pins is binding. One app follows the landmarks, another the guide, a third ignores both and opens at the first spine page. That is why the same file starts in three different places on three devices — each device is answering the question with a different source.

## A book that opens at the wrong page on purpose

To make the mechanism visible we hand-built a five-page test book, startbook.epub — cover, title page, copyright, then two chapters, 3,382 bytes. Its two pins both point at `chapter-002.xhtml`. That is exactly the state a real book ends up in when a new first chapter is inserted, or a conversion renumbers files under a stale anchor — the same renaming that quietly [kills cross-file links](/blog/epub-links-not-working). Nothing in the book updates the pin; it keeps naming a file that is no longer the start.

Resolving the start position the way a pin-honouring reader does — landmarks first, then guide, then the spine fallback — gives this:

```text
spine (reading order): cover.xhtml -> title.xhtml ->
  copyright.xhtml [linear=no] -> chapter-001.xhtml -> chapter-002.xhtml
1. landmarks bodymatter -> chapter-002.xhtml
2. guide type="text"    -> chapter-002.xhtml
3. first linear spine   -> cover.xhtml
opens at: chapter-002.xhtml
```

Every app that honours either pin opens this book at Chapter Two. Chapter One exists, sits in the spine in the right place, appears in the table of contents — and is never shown to a reader who doesn't page backwards. An app that ignores the pins opens at the cover and reads fine, which is precisely the "works on my device" shape these reports take on the forums.

Now the uncomfortable part. We dropped startbook.epub on this site's [EPUB validator](/epub-validator), live:

<figure>
<img src="/blog-media/epub-opens-at-wrong-page/validator-pass.png" alt="The epub.studio validator's result card: a pink check mark above 'This EPUB is valid' and the line 'OK — No problems found. This EPUB is structurally valid.'" width="760" loading="lazy" />
<figcaption>The live validator on startbook.epub, whose pins point past its own first chapter: "No problems found. This EPUB is structurally valid."</figcaption>
</figure>

No problems found. That is not a gap in one tool — it is what structural validation means. Our validator's pass checks that the archive is sound, the manifest matches the files, the spine is not empty and a navigation document exists; it never asks whether a landmark points anywhere sensible, and a pin aimed at the wrong chapter is well-formed XML. A book can be perfectly valid and perfectly wrong about where it starts.

## Rebuilding the book pulls the pin out

Every converter on this site that writes an EPUB funnels through one writer, and that writer emits a table of contents and nothing else — no landmarks block, no guide, no linear flags. So rebuilding a book here removes its start pins, demonstrably. We merged the test book with a second specimen on the live [merge tool](/merge-epub): 3,382 + 5,183 bytes in, merged.epub — 7,886 bytes, eleven files renamed `chapter-001` through `chapter-011` — out.

<figure>
<img src="/blog-media/epub-opens-at-wrong-page/merge-done.png" alt="The epub.studio merge tool's done panel: a pink check mark, the heading 'Your merged EPUB is ready', the line 'merged.epub · 8 KB · never left your device', and a Download EPUB button." width="760" loading="lazy" />
<figcaption>The live merge: startbook.epub + specimen.epub → merged.epub, 7,886 bytes. The output carries a table of contents and no start pins at all.</figcaption>
</figure>

Opening the output confirms it: no `landmarks` anywhere in the navigation file, no `<guide>` in the package, no `linear` attributes, and a freshly minted `urn:uuid` identifier. Run the same start-position resolution against it and the chain comes up empty until the fallback — the book now opens at the first page of the spine, in anything.

Be clear-eyed about what that trade is. The wrong pin is gone, so the symptom is gone. But a *correct* pin would have been stripped just as thoroughly; the copyright page's skip flag is gone, so it is now an ordinary page two; and because the identifier is new, apps generally treat the output as a book they have never seen. Rebuilding is a blunt fix — the right one when you were going to merge or convert anyway, an over-reaction when the book only needs its pin moved.

## Moving the pin instead of pulling it

The precise repair is a hand edit, and that is Sigil or Calibre territory — our tools rebuild navigation, they do not edit it in place. Open the EPUB, find the landmarks entry whose `epub:type` is `bodymatter`, and point its `href` at the real first page. Do the same for the guide reference of type `text` so the two pins agree. If the book should simply open at its cover, deleting both entries works too — apps fall back to the top of the spine, exactly as the merged book does.

Two honest limits on even the correct edit. A reader that ignores pins will not change its behaviour, because it never consulted them — the spec's "often" cuts both ways. And a retailer's ingestion pipeline rebuilds what you upload, so what a store's apps do with your start position is decided on their side; the pins are what you control in the file you distribute. After any edit, [check the file](/epub-validator) still validates — the validator will not judge where your pin points, but it will catch the broken manifest or malformed navigation file that hand editing can introduce, and a book that opens in the wrong place *and* fails validation has two problems instead of one.

If the symptom you actually have is a contents menu that disagrees with the pages — wrong order, missing chapters, stray bullets — that is the navigation file drifting from the spine, a different fault we cover in [table of contents problems](/blog/epub-table-of-contents-problems). The pin decides where you land; the spine and nav decide everything after.

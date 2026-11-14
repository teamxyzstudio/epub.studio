---
title: 'EPUB cover shows twice: one image, two registrations'
excerpt: 'When an EPUB cover shows twice, the book carries it in two registrations — a manifest flag and a spine page. Where the double is born and what removes it.'
category: 'Fix it'
ogImage: '/blog-og/epub-cover-shows-twice.png'
date: 2026-11-14
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-cover-editor
  - epub-validator
  - cbz-to-epub
faqs:
  - q: 'Is a duplicate cover an error in the EPUB file?'
    a: 'No. We ran a book carrying both a flagged cover image and a cover page in the spine through a structural validator and it passed with no problems found. The specification does not forbid the same image being registered in both places — the double is a presentation outcome, not a validity fault.'
  - q: 'Why does the same book show one cover in one app and two in another?'
    a: 'Because the two copies come from different layers. One is a screen the reading system builds for itself from the manifest flag; the other is an ordinary page in the book''s reading order. An app that builds the extra screen shows both, an app that just starts at the first spine page shows one. The file is the same in both cases.'
  - q: 'Can I fix it by deleting the cover image from the manifest?'
    a: 'Deleting the image outright usually breaks more than it fixes, because the cover page in the spine still references that file. Removing just the cover-image flag stops readers synthesising the extra screen, but libraries that build their thumbnail from the flag may lose it. The cleaner repair is removing the redundant spine page and keeping the flag.'
  - q: 'What is the titlepage.xhtml file inside my converted EPUB?'
    a: 'It is a cover page the conversion tool generated: a one-element XHTML document that displays the cover image, placed first in the spine. Converters insert it so the book opens on a cover. The duplicate appears when the source''s own first page was already the cover and the tool could not tell.'
  - q: 'Does converting a comic archive always duplicate the first page?'
    a: 'Not always, but the ingredients are usually there. A CBZ has no way to say which image is the cover, so converters commonly flag page one as the cover while keeping it as page one of the book. Readers that synthesise a cover screen from the flag then show that page twice. Where the tool offers it, setting a separate cover image before converting avoids this.'
---

Open the book and there is the cover. Turn the page — the cover again, and
only then chapter one. The book behaves; the text is fine; but every fresh
open walks through the same picture twice. This is the complaint behind years
of MobileRead threads, a recurring question in Adobe's InDesign community
("epub duplicate cover image"), and a long-standing entry class in Calibre's
bug tracker about CBZ conversions. When an EPUB cover shows twice, nothing is
corrupt. The file genuinely contains the cover in two registrations, and the
reading app is faithfully showing both.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB can register its cover in two separate places: a <strong>flag in the
manifest</strong> that tells apps "this image is the cover", and an
<strong>ordinary page in the spine</strong> that displays the same image. A
reader that builds a cover screen from the flag <em>and</em> then renders the
spine from its first page shows the picture twice. The fix is removing one of
the two registrations — almost always the redundant spine page.
</div>

## A cover is not one thing — it is up to three

The EPUB format never defined a single "the cover" slot. What it has is
layers, added over two spec generations.

The first layer is metadata. In EPUB 3 the cover is identified by putting
`properties="cover-image"` on the image's manifest entry; the
[EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html)
says that if a publication contains a cover image "it is recommended to set
the cover-image property, but setting this property is OPTIONAL". EPUB 2 did
the same job with a `<meta name="cover" …/>` element in the package metadata.
This layer is for machines: it is how a library app knows which image to use
as the shelf thumbnail without rendering anything.

The second layer is content. A cover can also be an ordinary XHTML page —
usually a file called `titlepage.xhtml` or `cover.xhtml` holding one `<img>` —
placed first in the spine, so the book's reading order opens on it.
[Kobo's EPUB guidelines](https://github.com/kobolabs/epub-spec#cover-images)
want both layers at once: the metadata tag, because "Kobo uses this tag to
identify which image to display as a thumbnail", and additionally that "cover
images must be contained in their own XHTML files".

The third layer is navigation — the EPUB 2 `guide` element or EPUB 3
landmarks can point at the cover page so apps can jump to it. It rarely
causes trouble; the first two layers are where the double is born.

## Where the second cover comes from

A well-behaved reading system that honours the metadata flag will synthesise
a cover screen: before showing you any content, it displays the flagged image
full-bleed, the way a printed book presents its front board. Then it starts
the book — at the first spine item. If the first spine item is a cover page
showing the same image, you get the picture twice in a row.

We built the failure case by hand to watch exactly that. `doublecover.epub`
(21,081 bytes) carries the flag *and* a `titlepage.xhtml` first in the spine;
`onecover.epub` (20,727 bytes) is the identical book with only the flag. Both
reference one `cover.png` (21,869 bytes). Paged through a Chromium harness
that mimics a flag-honouring reader — synthesised cover screen first, spine
documents after — the difference is the whole symptom:

<figure>
<img src="/blog-media/epub-cover-shows-twice/reader-harness.png" alt="Two rows of reader screens. Top row, doublecover.epub: screen 1 shows the cover synthesised from properties=cover-image, screen 2 shows titlepage.xhtml with the same cover image again, screen 3 shows Chapter 1. Bottom row, onecover.epub: screen 1 shows the synthesised cover, screen 2 shows Chapter 1, screen 3 shows Chapter 2." loading="lazy" />
<figcaption>Both fixtures opened in a Chromium harness that renders the flagged image first, then the spine. The flag-plus-titlepage book shows its cover on screens 1 and 2; the flag-only book shows it once.</figcaption>
</figure>

How does a real book end up in the top row? Conversion, almost always. A
converter is handed a source whose first page already *is* the cover — a
scanned book, a comic, an EPUB from another pipeline — but nothing in the
source marks it as such. So the tool does the dutiful thing: it generates its
own cover page, puts it first, flags the image, and leaves the original first
page in place right behind it. The MobileRead diagnosis of the Calibre case
is exactly this: a new `titlepage.xhtml` inserted at the front while the old
cover page stays as page one.

## Our own converter carries the same trap

This is not someone else's bug class. We dropped the two-page
`comic-2page.cbz` fixture (104,129 bytes) on our live [CBZ to EPUB
converter](/cbz-to-epub) and inspected the 99,800-byte result. The manifest
line for the first page reads, verbatim:

```xml
<item id="res1" href="page-0001.png" media-type="image/png" properties="cover-image"/>
```

— and `chapter-001.xhtml`, the first spine item, displays
`<img src="page-0001.png"/>`. One image, two registrations. A CBZ has no
cover slot, so flagging page one is a reasonable guess — but in any reader
that synthesises a cover screen, the first page of the comic now appears
twice. That is a limitation of our tool's current behaviour, found while
testing for this article, and it is recorded as an engineering note: the
honest alternative is a generated cover page that the spine owns outright.

<figure>
<img src="/blog-media/epub-cover-shows-twice/cbz-to-epub-done.png" alt="epub.studio CBZ to EPUB done panel reading: Your EPUB is ready, comic-2page.epub, 97 KB, never left your device, with a Style it before downloading button" loading="lazy" />
<figcaption>The live /cbz-to-epub run that produced the inspected file: comic-2page.cbz in, comic-2page.epub (99,800 bytes) out.</figcaption>
</figure>

## The double is a perfectly valid book

Here is the part that surprises people hunting for an "error" to repair:
there is nothing invalid to find. We ran `doublecover.epub` through the live
[EPUB validator](/epub-validator) and it passed clean.

<figure>
<img src="/blog-media/epub-cover-shows-twice/validator-doublecover.png" alt="epub.studio validator report reading: This EPUB is valid. OK, no problems found. This EPUB is structurally valid." loading="lazy" />
<figcaption>doublecover.epub — flag plus spine cover page — passing the live validator. The duplicate is legal.</figcaption>
</figure>

The spec recommends the flag and permits the spine page; it says nothing
against having both point at one image. Which is also why the symptom is so
inconsistent across devices: the file offers two covers, and each reading
system decides how many to take. A consumer that reads only the spine takes
one. Converting the same `doublecover.epub` with our [EPUB to PDF
converter](/epub-to-pdf) produced a 26,390-byte PDF embedding exactly **one**
image object — the exporter walks the spine, meets the cover once on
`titlepage.xhtml`, and never synthesises a second from the flag. Same file,
one cover. Your e-reader may take two. Neither is malfunctioning.

## Getting rid of the duplicate

Which registration to remove depends on where the double was born.

**If it appears after a conversion**, the cause is usually the inserted
titlepage over an unrecognised original. The durable fix is at the source:
where the tool lets you, set the real cover explicitly before converting (or
use the converter's option to drop a redundant first page, where one exists),
so the tool doesn't have to guess.

**If the book itself carries both registrations**, the clean repair is
deleting the redundant spine entry — remove `titlepage.xhtml` from the spine
and manifest, keep the flagged image. That is structural surgery on the
package, and being honest about our own tools: none of them deletes a spine
page. A code-level editor such as Sigil, or Calibre's EPUB editor, is the
right instrument for that cut.

A softer variant appears in hand-built books: keeping the cover page but
marking its spine entry `linear="no"`, which the spec defines as "auxiliary
content … that reading systems can access out of sequence". That labels the
page as skippable rather than removing it — and how it is treated is again
the reading system's call.

What our [EPUB cover editor](/epub-cover-editor) does sits deliberately on
the safe side of this mechanism. Replacing a cover rewrites the image file in
place, so both appearances change together — a book with a doubled cover gets
a consistently doubled *new* cover, not a mismatched pair. And when it adds a
cover to a book that has none, it registers the manifest flag only, never an
extra spine page — adding a cover with it cannot create the double this
article is about. If your book shows no cover at all, that is the opposite
registration failure, and it has [its own
walkthrough](/blog/epub-cover-not-showing).

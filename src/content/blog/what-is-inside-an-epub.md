---
title: 'What is actually inside an EPUB file?'
excerpt: 'Rename it to .zip and look. Understanding the five pieces makes every other ebook problem easier.'
category: 'Formats explained'
ogImage: '/blog-og/what-is-inside-an-epub.png'
date: 2026-04-27
author:
  name: 'Epub Studio'
  initial: 'E'
tools:
  - epub-validator
---

An EPUB is a ZIP archive with rules. Copy one, rename the copy to `.zip`, unzip it, and you can read every part of it in a text editor. Doing this once makes most ebook troubleshooting obvious.

## The five pieces

**`mimetype`** — one line: `application/epub+zip`. Must be the first entry in the archive and must be stored uncompressed. This is how a reader confirms it is an EPUB before parsing anything.

**`META-INF/container.xml`** — a pointer. Its only job is to say where the package document lives, because the spec does not fix that location.

**The package document (`.opf`)** — the heart of the book. Three sections:

- `<metadata>` — title, author, language, identifier
- `<manifest>` — every file in the book, with its media type
- `<spine>` — the reading order

Manifest and spine are different things, and confusing them causes real bugs. The manifest is *what exists*; the spine is *what order to read it in*. An image is in the manifest and not the spine. A chapter is in both.

**The navigation document (`nav.xhtml`)** — the table of contents, as real HTML. EPUB 2 used a separate `toc.ncx`; well-built EPUB 3 files ship both for compatibility.

**The content** — your chapters, as XHTML, plus CSS and images.

<div class="callout">
<div class="callout-kicker">Why chapters are XHTML, not HTML</div>
XHTML is XML, so parsing is strict. An unclosed tag is a fatal error rather than something the parser guesses around. It is why a chapter can render perfectly in a browser and break an e-reader.
</div>

## Why this is worth knowing

Almost every "corrupt file" message maps onto one of these five pieces: a compressed mimetype, a container pointing at nothing, a manifest listing a file that is not there, a missing nav document, or malformed XHTML.

The [Validator](/epub-validator) checks each of them and names the one that failed — but knowing the structure means the answer actually tells you something.

## Manifest and spine, properly

These two are the most commonly confused parts of the package document, and the confusion causes real bugs.

The **manifest** is an inventory. Every single file in the book must be listed: chapters, stylesheets, images, fonts, the navigation document. If a file is in the archive but not the manifest, strict readers ignore it. If it is in the manifest but not the archive, readers error.

The **spine** is the reading order, and only for documents that are read. It references manifest ids, not filenames:

```xml
<manifest>
  <item id="c1" href="chapter-001.xhtml" media-type="application/xhtml+xml"/>
  <item id="img1" href="cover.jpg" media-type="image/jpeg"/>
</manifest>
<spine>
  <itemref idref="c1"/>
</spine>
```

The image is in the manifest and not the spine, because you do not "read" it in sequence — a chapter displays it. Getting this backwards produces books that either skip chapters or try to page through images.

## Why the mimetype rule is so strict

`mimetype` must be the first entry in the archive and must be stored uncompressed. This looks arbitrary and is not.

ZIP is a container format with no type field. By mandating that the first entry is an uncompressed file with known contents at a known offset, the spec lets a reader identify an EPUB by reading the first few dozen bytes — no unzipping, no parsing. It is a magic number bolted onto a format that lacks one.

It is also the rule most often broken, because unzipping a book and re-zipping it with a normal archiver compresses everything. The book is intact and unopenable.

## The bits nobody mentions

**`toc.ncx`** is the EPUB 2 navigation format. EPUB 3 replaced it with `nav.xhtml`, but well-built books ship both, because older devices only understand the NCX. Shipping both costs a couple of kilobytes.

**`properties="cover-image"`** on a manifest item is how EPUB 3 marks the cover. EPUB 2 used a `<meta name="cover">` pointing at a manifest id. Readers look for either, which is why a book can have a cover file and still show a blank thumbnail — the file is there but nothing marks it as the cover.

**`dcterms:modified`** is required in EPUB 3 and easy to omit. Some validators fail the whole book over it.

**Fallback chains** let a manifest item declare a substitute for readers that cannot handle its type. Rare, but it is how exotic content degrades gracefully.

## Reading a book to debug it

Once you know the five pieces, most failures become a specific place to look:

| Symptom | Look at |
| --- | --- |
| Will not open at all | `mimetype`, `container.xml` |
| Opens, table of contents empty | `nav.xhtml` / manifest `properties="nav"` |
| Chapters missing or out of order | `<spine>` |
| Images broken | manifest hrefs vs actual paths |
| Cover blank in library | cover marking, not the image itself |
| Shows as "Unknown Author" | `<metadata>` |

The [Validator](/epub-validator) checks each of these and names the specific failure, but knowing the structure is what turns its answer into an action.

## Building one by hand

Worth doing once, for the same reason it is worth writing a page of HTML by hand. Make the five pieces, zip them with `mimetype` first and uncompressed, rename to `.epub`, and open it in a reader.

It takes twenty minutes and permanently removes the mystery. An EPUB stops being an opaque blob that tools produce and becomes a small website in a zip file — which is exactly what it is, and why the format has outlasted every proprietary alternative aimed at replacing it.

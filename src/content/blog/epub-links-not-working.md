---
title: 'EPUB links not working? Find the layer that broke them'
excerpt: 'EPUB links not working after a conversion or merge? A link is only a string in the file. Here is where it breaks — traced on a real book, layer by layer.'
category: 'Fix it'
ogImage: '/blog-og/epub-links-not-working.png'
date: 2026-09-26
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
  - merge-epub
  - epub-to-pdf
howToTitle: 'How to find which layer broke a link'
howTo:
  - t: 'Unzip the book and read the href'
    d: 'Copy the EPUB, rename the copy to .zip, extract it, and open the chapter file that holds the failing link. The href attribute is the link, verbatim — everything else is diagnosis of that one string.'
  - t: 'Check the file half'
    d: 'Take the part of the href before any # and look for that exact filename in the extracted folder. If it is not there, the target was renamed or dropped, and the link died at layer one.'
  - t: 'Check the fragment half'
    d: 'Open the target file and search for id="…" matching the part after the #. No match means the anchor was lost — usually by a converter that rebuilt the HTML.'
  - t: 'Validate the container'
    d: 'Run the book through an EPUB validator to catch the packaging-level breaks — files the manifest promises but the archive does not contain. Expect a clean pass to mean the container is sound, not that every href resolves.'
faqs:
  - q: 'Why does my EPUB validate clean when half its links are dead?'
    a: 'Because container-level validation reads the packaging — mimetype, container.xml, the manifest, the spine — and never follows the hrefs inside your prose. We built a book with a link to a file that does not exist and it passed a live validation with no problems found. The same missing file declared in the manifest fails instantly. A clean pass means the box is sound, not that the wiring inside it works.'
  - q: 'Are the table-of-contents links broken too after a merge?'
    a: 'Usually not, and our test showed why: the merge rebuilds the navigation document from scratch against the new filenames, so every TOC entry pointed at a file that exists. Only the links written inside the chapter text keep their old strings. That split — regenerated navigation working, in-text cross-references dead — is a strong clue that files were renamed.'
  - q: 'Do links survive converting an EPUB to PDF?'
    a: 'In our converter the words survive and the click does not. The 2,731-byte test book became a 4,382-byte, 3-page PDF whose text still contained every link phrase, but the file carried zero link annotations — in a PDF, a clickable link is a separate annotation object that has to be written onto the page, and this converter does not write them. The sentence reads fine; tapping it does nothing.'
  - q: 'Can a tool repair broken internal links automatically?'
    a: 'None of the tools on this site do. The hrefs live inside the chapter XHTML, and our editors deliberately touch metadata and covers, not prose. Repair means opening the chapter files and correcting each href string to the current filename and id — source-level editing, the kind of job a code-view editor like Sigil exists for.'
  - q: 'Why did the links break when I imported the book into another platform?'
    a: 'Almost always the same mechanism our merge demonstrated: the platform stores chapters under its own filenames, but the hrefs inside the text are plain strings that still name the old files. Nothing rewrites them, so every cross-file reference points at a ghost. Same-file anchors tend to survive because the link and its target move together.'
draft: false
---

The book reads fine until you tap a link. "See the map in chapter two" —
nothing happens, or the app throws you somewhere strange, or the tap works in
one reader and dies in another. EPUB links not working is one of the
longest-running complaints in ebook forums: MobileRead has threads on internal
links breaking after conversion and on hyperlinks vanishing en route to PDF,
the Calibre bug tracker has its own entries, and the same story repeats on the
Pressbooks forum and in Adobe's InDesign community whenever an export or an
import shuffles files around.

The reason the complaint never dies is that "the links are broken" describes
three different faults with one sentence. We built a small book carrying one
of every kind of link, then ran it through our own live tools to watch exactly
where each kind survives and where it dies.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB link is a plain string in the chapter's XHTML — <strong>a filename, a
<code>#fragment</code>, or a URL</strong>. It breaks when the file half stops
matching a real file (renames during conversion, merge or import), when the
fragment half stops matching a real <code>id</code>, or when the output format
has no live links at all. Nothing warns you, because container-level
validation never reads the hrefs in your prose.
</div>

## A link is only a string

Open any EPUB (it is a ZIP — rename and extract) and look at a chapter file.
Every link is an ordinary XHTML anchor, and there are only three shapes:

- **Same-file**: `href="#recap"` — jumps to an `id` in the same chapter file.
- **Cross-file**: `href="chapter-3.xhtml#verdict"` — names another file in the
  archive, then an `id` inside it.
- **External**: `href="https://example.org/"` — leaves the book entirely.

Each shape has its own failure condition. A same-file link needs its `id` to
exist. A cross-file link needs the exact filename **and** the `id`. An
external link needs a reading system willing to open it. The
[EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html)
treats these differently too: every content document a book links to
internally must be listed in the manifest and spine — the requirement applies
recursively — while links to resources outside the container are explicitly
not publication resources. The spec polices the packaging. It does not, and
cannot, police whether the string in your prose still names anything real.
(Footnote references are this same machinery with semantics on top — the
[footnote pop-up mechanics](/blog/epub-footnotes) are their own story.)

Our test book, `linkbook.epub`, is 2,731 bytes: three chapters carrying one
link of each shape, plus a fourth on purpose — `href="notes.xhtml#n1"`, where
`notes.xhtml` does not exist anywhere in the archive.

## Where the validator's sight ends

We dropped the book, dead link and all, onto our live [EPUB validator](/epub-validator):

<figure>
<img src="/blog-media/epub-links-not-working/validator-pass.png" alt="The epub.studio validator result card: a pink check mark above the heading 'This EPUB is valid' and an OK line reading 'No problems found. This EPUB is structurally valid.'" width="765" loading="lazy" />
<figcaption>linkbook.epub — carrying a link to a file that does not exist — passing the live validator.</figcaption>
</figure>

"No problems found. This EPUB is structurally valid." Then we made one change:
a second copy, 2,743 bytes, identical except the missing `notes.xhtml` is now
*declared in the manifest*:

<figure>
<img src="/blog-media/epub-links-not-working/validator-manifest-fail.png" alt="The epub.studio validator result card: the heading 'Problems found' above a red ERROR line reading 'Manifest lists notes.xhtml, but that file is not in the archive.'" width="765" loading="lazy" />
<figcaption>The same missing file, promised in the manifest this time: instant error.</figcaption>
</figure>

That pair of runs draws the boundary exactly. Container-level validation —
ours included; the code checks every manifest href against the archive but
never parses the chapter XHTML — verifies that the box keeps its promises. The
hrefs inside your prose are content, not packaging, and no container check
follows them. A clean validation report and a book full of dead links are
entirely compatible, which is why so many forum threads open with "but the
file validates fine".

## A merge that breaks links on purpose

Renaming is the classic killer, and you do not need a broken tool to see it —
a working one will do. We merged `linkbook.epub` with a 2,103-byte second book
through our live [merge tool](/merge-epub), then unzipped the 5,442-byte
result and read every href. The merge rebuilds the combined book cleanly, and
that rebuild renames every chapter to `chapter-001.xhtml` through
`chapter-007.xhtml`. The link strings inside the text ride along verbatim:

| Link in the source books | href string | After the merge |
|---|---|---|
| Same-file jump | `#recap` | **Works** — link and target id moved together into `chapter-002.xhtml` |
| Cross-file jump | `chapter-3.xhtml#verdict` | **Dead** — no file of that name exists; the target now lives in `chapter-004.xhtml` |
| Cross-file jump, book two | `part-2.xhtml#end` | **Dead** — its target is now `chapter-007.xhtml` |
| External | `https://example.org/` | **Untouched** |

<figure>
<img src="/blog-media/epub-links-not-working/merge-done.png" alt="The epub.studio merge tool's done panel: a pink check mark, the heading 'Your merged EPUB is ready', the line 'merged.epub · 5 KB · never left your device', and a Download EPUB button." width="765" loading="lazy" />
<figcaption>The live merge that produced the 5,442-byte book we then unzipped and audited link by link.</figcaption>
</figure>

Two details from the audit are worth more than the headline. First, the
regenerated table of contents *works* — the merge writes a fresh `nav.xhtml`
against the new filenames, so navigation survives while in-text
cross-references die. If your TOC is fine but "see chapter two" is dead,
something renamed your files. Second, the merged book — three dead links
inside — **passes the live validator clean**, because none of those stale
strings appear in the manifest. This is the identical mechanism behind the
Pressbooks import threads and a fair share of the Calibre ones: not a bug in
any one converter, just filenames changing while href strings do not.

## PDF keeps the words and drops the wiring

The other recurring thread — hyperlinks lost on the way to PDF — reproduces
just as cleanly. We converted `linkbook.epub` through our live
[EPUB to PDF converter](/epub-to-pdf): 2,731 bytes in, a 4,382-byte
three-page PDF out. Then we decompressed all three content streams and
searched them. Every link *phrase* is present — "example.org", "the verdict
in chapter three", "see the notes". And the file contains zero link
annotations: no `/Annots`, no `/URI`, no `/Link` objects anywhere.

That is the whole explanation. In a PDF, a clickable region is an annotation
object written onto the page, separate from the text it covers. A converter
that lays out the words but writes no annotations produces exactly what the
forum threads describe: a book that reads perfectly and taps like paper. The
link was not mangled — it was never wired up in the new format. Ours behaves
this way, and we would rather show you that than have you discover it after
shipping a PDF to readers.

## What this cannot promise

Being realistic about the boundaries of everything above:

- **No automatic repair exists here.** Our editors change metadata and covers;
  nothing on this site rewrites hrefs inside chapter prose. Fixing a dead link
  means opening the XHTML and correcting the string — [Sigil-class source
  editing](/blog/sigil-epub-editor), done by hand, then re-validating.
- **Reader behaviour is its own layer we did not test.** Forum threads
  regularly blame devices for refusing external links even when the markup is
  sound. We have no e-ink hardware in this test rig, so this post makes no
  claims about what any specific device or app does with a well-formed link —
  only about what is verifiably in the file.
- **Merging is a trade, not a fault.** Combining books into one archive
  cannot both rename files and leave hrefs pointing at the old names. If your
  books cross-reference each other's chapters, expect to re-link by hand
  afterwards; the merged TOC will carry you until then.

The diagnosis, at least, costs nothing. Unzip the book, read the failing
href, and check its two halves against the archive — that identifies the
broken layer in a minute or two. And before and after any repair, run the
file through the [EPUB validator](/epub-validator): it will not follow your
prose links, but it catches the packaging breaks — the promised-but-missing
files — that turn a mystery into an error message with a filename in it.

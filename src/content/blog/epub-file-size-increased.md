---
title: 'EPUB file size increased: where the extra bytes come from'
excerpt: 'Your EPUB file size increased after an edit or a conversion? We trace every added byte on a real book — repacked containers, embedded fonts, orphan styles.'
category: 'Fix it'
ogImage: '/blog-og/epub-file-size-increased.png'
date: 2026-11-13
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-compressor
  - epub-validator
  - style-studio
howToTitle: 'How to find out why an EPUB got bigger'
howTo:
  - t: 'List what is inside'
    d: 'Make a copy, rename it from .epub to .zip, and open it — or run unzip -l. You get every entry with its byte size.'
  - t: 'Compare against the original'
    d: 'Put the old and new listings side by side. Look for new entries (fonts, stylesheets, bookmark files) and for existing entries whose sizes changed.'
  - t: 'Act on the entry that grew'
    d: 'A new font or stylesheet is a setting you can redo without it. Grown images mean a converter re-encoded them. If nothing obvious grew, the container was simply repacked — validate the file and move on.'
faqs:
  - q: 'Is a bigger EPUB file a sign that something is broken?'
    a: 'No. Size and validity are unrelated. In our test the book that grew to more than four times its original size passed the structural validator with no problems found. A bigger file means more bytes in the archive — a new font, a looser compression pass, a re-encoded image — not damage. If you want certainty, validate the file rather than judging it by size.'
  - q: 'Why did my EPUB grow when I only changed the author name?'
    a: 'Because no tool edits a zip archive in place. The whole container is unpacked and rewritten around your one-line change, with the editing tool''s own compression settings instead of the original packer''s. The text of the book is untouched — in our run every chapter kept an identical checksum — but the repack itself can drift the total a few bytes either way.'
  - q: 'How much does embedding a font add to an EPUB?'
    a: 'One Latin subset in WOFF2 form is typically in the tens of kilobytes — our EB Garamond embed added a 16,748-byte font file to a 5,183-byte book. Multiply by every weight and style you embed. On a text-only novella that can quadruple the file; on an image-heavy book it disappears into the noise.'
  - q: 'Why does zipping an EPUB with stronger compression barely help?'
    a: 'Because the biggest entries usually cannot shrink. XHTML and CSS deflate well, but JPEG, PNG and WOFF2 are already compressed formats — deflating our embedded font a second time made it 10 bytes larger, not smaller. Repacking only wins back real space on books that are mostly text, and those are small to begin with.'
  - q: 'Can an ebook app change my file''s size just because I read the book in it?'
    a: 'One well-known case exists: calibre''s viewer has a setting that copies your bookmarks and reading position into the book itself, as an extra file named META-INF/calibre_bookmarks.txt inside the EPUB. The book''s content is untouched, but the file on disk grows and its checksum changes. Most reading apps keep positions in their own database instead.'
---

Change one word in an EPUB and save. The file that comes back is bigger — not
by the length of the word, but by some unrelated amount that nobody asked for.
Convert a book and it doubles. This puzzle keeps resurfacing on MobileRead and
in Calibre's bug tracker going back more than a decade: the EPUB file size
increased, the book looks identical, and no answer in the thread quite pins
down which bytes arrived or why.

The frustrating part is that the usual replies are guesses — "probably the
images", "maybe the fonts" — when the real answer is checkable in about a
minute, because an EPUB can be opened and itemised like any zip archive. So
instead of guessing, we grew a real book three different ways this session,
on our own tools, and itemised every added byte.

## An EPUB's size is the container's opinion

An EPUB is a zip archive with [a reserved first entry](/blog/epub-downloaded-as-zip),
and that has a consequence people rarely price in: the same book does not have
*a* size. The [EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html)
allows each file inside the container to be either stored as-is (compression
method 0) or Deflate-compressed (method 8) — and which of the two a tool picks,
and how hard it deflates, changes the total without changing the book.

We measured the spread on our 5,183-byte specimen book. Extracted and repacked
with every entry stored, the identical content weighs 8,460 bytes. Repacked
with maximum Deflate, 5,183 bytes. Same eleven files, same every character of
text — a 63% size difference that lives entirely in the container's settings.

That is the first mechanism, and it explains the small mysterious drifts:
**any tool that saves an EPUB repacks all of it, its way.**

## One word changed, ten bytes grew

Here is the drift reproduced live. We dropped the specimen book on our
[metadata editor](/epub-metadata-editor), changed the author field from
`Unknown` to `Specimen Author, Jr.`, and saved. One field, thirteen characters
longer.

<figure>
<img src="/blog-media/epub-file-size-increased/metadata-editor-done.png" alt="epub.studio metadata editor done panel reading: Your updated EPUB is ready, specimen.epub, 5 KB, never left your device, with a Download EPUB button" loading="lazy" />
<figcaption>The live /epub-metadata-editor saving a one-field author change on specimen.epub: 5,183 bytes in, 5,193 bytes out.</figcaption>
</figure>

The output is 5,193 bytes — 10 bytes up. The entry listing says exactly where:

- `content.opf` went from 1,314 to 1,327 bytes raw (the longer name), 471 to
  479 compressed. That is 8 of the 10.
- Every chapter file came through byte-identical — same sizes, same CRC
  checksums. The book's text was never touched.
- The `mimetype` entry grew from 20 to 22 bytes. The original stores it
  uncompressed; our editor Deflate-compresses it on the way out, and
  deflating 20 bytes of ASCII produces 22 bytes. Compression made it bigger.

That last line is also a fault, and it is ours. The specification is blunt:
"EPUB creators MUST NOT compress or encrypt the mimetype file." Readers accept
the book anyway — and our own validator, which checks at container level,
passes it — but it is a spec violation our converter pipeline shares, recorded
here as an engineering note rather than hidden. The honest summary of this run:
a one-word edit rewrote every entry in the archive, eight bytes of growth
were the edit, and two were the repack's own fingerprint.

## Growth you opted into without noticing

The drifts are curiosities. The doublings come from payload — real files
added to the archive, usually by a setting whose size cost was never shown.
The classic case on MobileRead is fonts: one thread's book grew from roughly
820 KB to 2.6 MB until the poster found a conversion setting had been quietly
embedding the Arial family.

We reproduced the mechanism with our own [Style Studio](/style-studio), which
at least states the price on the switch:

<figure>
<img src="/blog-media/epub-file-size-increased/style-studio-embed-panel.png" alt="Style Studio settings panel with Keep original fonts off and Embed font in file switched on, captioned: travels with the book, adds 16 KB, looks identical everywhere; below it a Download ready bar reading specimen.epub, 21 KB" loading="lazy" />
<figcaption>Style Studio with font embedding switched on: the toggle declares the 16 KB cost before the 5 KB book is rebuilt.</figcaption>
</figure>

With EB Garamond embedded, the 5,183-byte specimen came back as 23,001
bytes — four and a half times its size. The listing itemises all of it:

| What arrived | Bytes | Note |
| --- | --- | --- |
| `fonts/eb-garamond.woff2` | 16,748 | one Latin subset, one weight |
| `epub-studio.css` | 1,251 | the generated stylesheet |
| orphaned `style.css` | 452 | the old stylesheet, no longer linked, still packed |
| chapter edits | +8 each | five stylesheet links rewritten |

Two details in that table generalise. First, the WOFF2 font occupies 16,758
bytes *inside* the zip — Deflate made the already-compressed font 10 bytes
bigger, which is why repacking never rescues a font-heavy or image-heavy book.
Second, the 452-byte orphan: the restyle swaps which stylesheet the chapters
link to but leaves the old file in the archive, so a byte of the original look
is never reclaimed. Small here; not small after several editing round trips
through tools that each leave their own leftovers.

There is a third, stranger member of this family: an app that writes into
your book because you read it. calibre's viewer, with its copy-bookmarks
setting enabled, saves your reading position into the EPUB itself as
`META-INF/calibre_bookmarks.txt` — the `save_bookmarks` routine in
[calibre's own source](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/oeb/iterator/bookmarks.py)
replaces the file on disk to do it. People meet this as "my EPUB changed size
and checksum and I only *read* it".

## When images do the growing

The biggest multipliers in the forum threads are images: three-colour GIF
diagrams re-encoded as full JPEGs, covers that double with no change in pixel
dimensions, one April 2026 thread where a 14 MB EPUB became a 140 MB file on
conversion. The mechanism is the mirror image of
[unintended quality loss](/blog/epub-images-blurry): a converter that decodes
every image and re-encodes it with its own format and quality settings can
land on either side of the original — blurrier and smaller, or visually
identical and several times larger, which is the worst trade available.

We could not reproduce that one on our own tools for an honest reason: our
compressor's code path only ever shrinks or keeps the original — there is no
branch that re-encodes upward, which we proved in the quality post. The
growth direction belongs to external converters, so for that case the fix is
the setting, not the output: find the image-handling option and stop the
re-encode at the source.

## Finding which entry grew

The diagnosis is the same three moves every time, and none of them needs
special software. Copy the file, rename the copy from `.epub` to `.zip`, and
open it — or run `unzip -l` on it directly. Do the same to the original if you
still have it, and compare: new entries are settings you can redo, grown
images are a converter's re-encode, and no visible change at all means the
container was merely repacked.

Then settle the only question that actually matters — whether the book is
damaged — with evidence rather than file-size intuition. We dropped our
four-times-grown, font-embedded specimen on the [validator](/epub-validator):

<figure>
<img src="/blog-media/epub-file-size-increased/validator-grown-book.png" alt="epub.studio validator report reading: This EPUB is valid. OK, no problems found. This EPUB is structurally valid." loading="lazy" />
<figcaption>The 23,001-byte grown book passing the live /epub-validator: size and validity are unrelated.</figcaption>
</figure>

Growth is a ledger, not a symptom. Every byte that arrived in our three runs
had a name and a reason — a repack fingerprint, a font that travels with the
book, a stylesheet nobody unlinked. If the ledger says images did it and you
want the space back, the [EPUB compressor](/epub-compressor) re-encodes them
downward in your browser and shows you what it saved; if you are trimming a
book deliberately rather than diagnosing a surprise, start with
[reducing EPUB file size](/blog/reduce-epub-file-size) instead — that is the
planned version of this story.

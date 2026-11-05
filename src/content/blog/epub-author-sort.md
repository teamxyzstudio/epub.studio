---
title: 'EPUB author sort: why books file under the first name'
excerpt: 'EPUB author sort lives in a file-as key most converted books never carry, so shelves fall back to first-name order. Where the key goes, and the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-author-sort.png'
date: 2026-11-05
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-metadata-editor
  - txt-to-epub
  - epub-validator
howToTitle: 'How to add an author sort key to an EPUB'
howTo:
  - t: 'Check what the file declares'
    d: 'Drop the EPUB on the metadata editor to see the author exactly as the package states it, and fix the display name there first if it is wrong.'
  - t: 'Add an id and both file-as forms'
    d: 'Extract the archive, open the .opf file, give dc:creator an id attribute plus an opf:file-as value, and add the meta refines file-as line below it.'
  - t: 'Repack and validate'
    d: 'Rezip the archive with the mimetype entry first and stored uncompressed, then drop the result on the validator to confirm the structure survived.'
  - t: 'Delete the book from the device, then re-import'
    d: 'Library apps read metadata once, at import. The old entry keeps the old sort until the book is removed and the corrected copy is sideloaded fresh.'
faqs:
  - q: 'Why does my Kobo ignore the author sort I set in Calibre?'
    a: 'Calibre keeps author and author sort as two separate database fields, and it writes the sort value into the EPUB as file-as. MobileRead threads report that Kobo devices parse the author display name themselves and pay no attention to a separate sort field, which is why a plugboard that rewrites the author field on the device database is the workaround those threads converge on. The file can be right and the shelf still wrong.'
  - q: 'What is the difference between opf:file-as and the EPUB 3 file-as meta?'
    a: 'They do the same job in two generations of the format. opf:file-as is an attribute written directly on the dc:creator element, the convention Calibre reads and writes; the EPUB 3 form is a separate meta element that refines the creator by its id. Software in the wild splits between them, so a file that carries both is legible to the most readers.'
  - q: 'Does adding file-as change the name shown on the book?'
    a: 'No. The display name always comes from the text inside dc:creator — file-as is only consulted when software orders a list. That separation is the whole point: readers see Lewis Carroll while the shelf files Carroll, Lewis. If the visible name itself is wrong, that is a different repair, done in the dc:creator text.'
  - q: 'Can the epub.studio metadata editor write the sort key?'
    a: 'No. Its form edits title, author, language and publisher — the display values — and it deliberately rewrites nothing else, so a file-as key that already exists survives an edit untouched. It also means the key keeps its old value after you rename an author, so a hand edit or a library manager has to update the sort form separately.'
  - q: 'Do I need to re-import the book after fixing the file?'
    a: 'Usually, yes. Most library apps and devices copy metadata into their own database when a book is imported and never look inside the file again. Editing the EPUB fixes every future import, but the shelf you are looking at keeps its cached entry until the book is deleted and the corrected copy is loaded again.'
draft: false
---

Sideloaded books have a way of wrecking an otherwise tidy library. The store titles line up by surname, and then the EPUBs you added yourself scatter — Lewis Carroll under L, a series split between two spellings of the same name, one app filing by surname while another files the identical file by first name. The question of EPUB author sort keeps resurfacing on MobileRead, from threads a decade old about why one shelf orders correctly and another does not, to a 2025 thread reporting freshly sideloaded books sorting by first name after a Kindle software update.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB carries the author's <strong>display name</strong>, and may carry a separate <strong>filing name</strong> — a sort key called <code>file-as</code>. Most converted books never get one, so every app is left to guess from the display name, and the guesses disagree. The fix is to put the key in the file.
</div>

## A book carries two names, but converters write one

The package document inside every EPUB names the author in a `dc:creator` element. That text is the display name — it is what appears under the cover on the shelf. Alphabetical order is a different job, and the [meta properties vocabulary](https://github.com/w3c/epub-specs/blob/main/epub33/core/vocab/meta-property.html) in EPUB 3.3 gives it a dedicated property: `file-as` "provides the normalized form of the associated property for sorting". The spec's own example is the one this post borrows — a creator displayed as *Lewis Carroll*, refined by a `file-as` meta reading *Carroll, Lewis*.

The same idea is older than that property. EPUB 2 files carry it as an `opf:file-as` attribute written straight onto the creator element, and that attribute is what Calibre's Author Sort column actually is: [calibre's OPF code](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/metadata/opf2.py) reads `author_sort` from the `file-as` attribute on the first creator and writes it back to the same place. Two conventions, one meaning: *display this, but file it under that*.

## Every converted book starts life unsortable

We make conversion tools, so we checked our own output first. This run, `specimen.txt` (1,550 bytes) went through the live [TXT to EPUB converter](/txt-to-epub) and came out as a 5,187-byte EPUB. The entire metadata block of the file it produced:

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="bookid">urn:uuid:c888fbf7-…</dc:identifier>
  <dc:title>Specimen</dc:title>
  <dc:creator>Unknown</dc:creator>
  <dc:language>en</dc:language>
  <meta property="dcterms:modified">2026-11-05T15:42:53Z</meta>
</metadata>
```

<figure>
<img src="/blog-media/epub-author-sort/txt-to-epub-done.png" alt="The converter's done panel: a pink check mark above 'Your EPUB is ready' and the line 'specimen.epub · 5 KB · never left your device', with styling and download buttons below." width="762" loading="lazy" />
<figcaption>The live /txt-to-epub run that produced the file quoted above: specimen.txt, 1,550 bytes in, 5,187 bytes out.</figcaption>
</figure>

No `file-as` in either form — and no `id` on the creator, so an EPUB 3 refine has nothing to attach to without editing. That is not an accident of this one file: the OPF template in our EPUB writer emits `dc:creator` as a bare element, every time, for every to-EPUB tool on this site. Judging by the files MobileRead threads dissect, most converters behave the same way. The books causing the messy shelves were born like this.

## What a shelf does without an author sort key

Software holding a bare display name has three options: sort the string as it stands (first name wins), try to parse the name and guess the surname, or fall back to something else entirely. All three are in circulation, which is why the same file sorts three ways in three apps. The gap shows up as soon as real names meet:

| Author as displayed | Sorted as a bare string | `file-as` value | Sorted by file-as |
|---|---|---|---|
| Agatha Christie | 1st — under A | Christie, Agatha | 2nd |
| Lewis Carroll | 2nd — under L | Carroll, Lewis | 1st |
| Ursula K. Le Guin | 3rd — under U | Le Guin, Ursula K. | 3rd |

A string sort files Carroll after Christie because *L* follows *A*; a surname sort reverses them. And parsing "Ursula K. Le Guin" correctly — the surname is *Le Guin*, not *Guin* — is exactly the judgement call a heuristic gets wrong, which is why the key exists: the file states the filing form instead of making every app derive it. Device behaviour, for honesty's sake, is beyond what we can test here: MobileRead threads report that Kobo parses the author field itself and ignores a separate sort value, and that 2025 Kindle thread reports first-name order on sideloaded EPUBs that previously filed by surname. We have neither device on the bench; those are community reports, not our measurements.

## Adding the key by hand

Start with the display name, because the key is derived from it. Our converted specimen said `Unknown`, so it went through the live [EPUB metadata editor](/epub-metadata-editor) — the form pre-filled with exactly what the package declared, the Author field got *Lewis Carroll*, and the saved file (5,187 → 5,195 bytes) differed from the original by that single `dc:creator` line. We diffed the extracted archives to be sure.

<figure>
<img src="/blog-media/epub-author-sort/metadata-editor-author.png" alt="The metadata editor's form for unknown.epub: Title 'Specimen', Author field highlighted containing 'Lewis Carroll', Language 'en', Publisher empty, above a Save changes button." width="762" loading="lazy" />
<figcaption>The live /epub-metadata-editor run: the form reads the package, the Author field replaces 'Unknown' with 'Lewis Carroll', and the output differs by one line.</figcaption>
</figure>

The sort key itself is a hand edit — no field in our form writes it. An EPUB is a zip archive; extract it, open the `.opf` file named in `META-INF/container.xml`, and turn the creator line into this:

```xml
<dc:creator id="creator" opf:file-as="Carroll, Lewis">Lewis Carroll</dc:creator>
<meta refines="#creator" property="file-as">Carroll, Lewis</meta>
```

The attribute needs `xmlns:opf="http://www.idpf.org/2007/opf"` declared on the metadata element, and the `refines` target is the `id` you just added. Both conventions, one filing form, eight-odd lines of context — our edited file grew to 5,242 bytes. Repacked with the `mimetype` entry first and uncompressed, it went through the live [EPUB validator](/epub-validator) and passed.

<figure>
<img src="/blog-media/epub-author-sort/validator-pass.png" alt="The validator's report: a pink check mark above 'This EPUB is valid' and the line 'OK — No problems found. This EPUB is structurally valid.'" width="762" loading="lazy" />
<figcaption>The live /epub-validator run on the hand-edited sortbook.epub (5,242 bytes): both file-as conventions in one metadata block, no structural complaints.</figcaption>
</figure>

## The key does not follow the name

One more live test, because this is the trap waiting a year later. We took that finished, sort-keyed book and renamed its author through the metadata editor — *Lewis Carroll* became *Charles Dodgson*, his legal name. The output (5,249 bytes) now reads:

```xml
<dc:creator id="creator" opf:file-as="Carroll, Lewis">Charles Dodgson</dc:creator>
<meta refines="#creator" property="file-as">Carroll, Lewis</meta>
```

The display name changed; both sort keys still say *Carroll, Lewis*. Our editor rewrites only the text of the five Dublin Core values it manages and preserves every attribute and neighbouring element it does not understand — deliberately, since silently deleting unknown metadata would be worse. But preservation means staleness: nothing in this file will ever update `file-as` for you. A book edited this way displays under Dodgson and files under C, and the only cure is updating the key in the same pass as the name — by hand, or in a library manager that maintains both fields together, which is precisely what Calibre's paired Author and Author Sort columns are for.

## What the fix reaches, and what it cannot

Worth being realistic about the edges. A correct `file-as` fixes the file, and software that respects the key — Calibre, and the readers that honour either convention — will shelve the book properly from the next import. It does nothing for software that never consults it, and the community reports above say some devices simply do not. It also does not reach into databases that already hold the book: a shelf built at import keeps its cached order until the book is deleted and re-imported. And the [validator](/epub-validator) check is structural — it confirms the edit broke nothing, not that *Carroll, Lewis* is a sensible filing of *Lewis Carroll*; no tool can know that for you.

If a shelf is misfiling your books, start by looking at what the files actually declare: drop one on the [metadata editor](/epub-metadata-editor) and the form shows the author exactly as the package states it. A book whose display name is already wrong has a [different repair](/blog/epub-shows-wrong-title), and if what is scattering is a series rather than an author, that order lives in [its own metadata](/blog/epub-series-metadata) — but if the name is right and the order is wrong, the missing line is `file-as`, and now you know where it goes.

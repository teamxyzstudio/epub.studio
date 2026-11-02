---
title: 'EPUB series metadata: why sideloaded books lose their order'
excerpt: 'EPUB series metadata lives in two rival conventions, and devices often ignore both after sideloading. Where series order hides in the OPF, and the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-series-metadata.png'
date: 2026-11-02
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
  - epub-metadata-editor
  - txt-to-epub
howToTitle: 'How to add series metadata to an EPUB by hand'
howTo:
  - t: 'Open the package document'
    d: 'An EPUB is a zip archive. Extract it and open the .opf file — the path is named in META-INF/container.xml, typically OEBPS/content.opf.'
  - t: 'Add both series conventions to the metadata block'
    d: 'Paste the belongs-to-collection chain and the two calibre meta lines before </metadata>, with calibre:series above calibre:series_index.'
  - t: 'Rezip with mimetype first'
    d: 'Repack the archive so the mimetype file is the first entry and stored uncompressed, exactly as it was in the original.'
  - t: 'Validate, then re-import'
    d: 'Drop the repacked file on the validator to confirm the structure survived, then delete the book from the device and sideload the new copy so its library database reads the fresh metadata.'
faqs:
  - q: 'Why does my series show correctly in Calibre but not on my Kobo?'
    a: 'Calibre reads its own calibre:series tag directly, so its library view always looks right. The device builds a separate database when it imports a sideloaded book, and MobileRead threads going back a decade report that plain sideloaded EPUBs arrive there without series data — which is exactly the gap the NickelSeries firmware mod exists to close. The book can be correct and the shelf still wrong.'
  - q: 'Should I use calibre:series or belongs-to-collection?'
    a: 'Both, in the same file. The calibre pair is the older de facto convention and the one most software looks for first; belongs-to-collection is the actual EPUB 3 standard. The two sit side by side in one metadata block without conflict — our hand-built test file carries both and validates — and five short lines cost nothing.'
  - q: 'Does series metadata change anything about how the book reads?'
    a: 'No. It never appears in the text, affects no formatting, and adds a few hundred bytes at most. Its only job is to tell library software which shelf the book belongs on and which position it takes there. A book with no series metadata reads identically — it just files itself under its bare title.'
  - q: 'Can the epub.studio metadata editor add a series?'
    a: 'No — its form edits title, author, language and publisher, and that is the honest limit of what it writes. What we did verify first-hand is that it preserves series metadata it cannot edit: retitling our test book changed exactly one line of the package document and left all five series lines untouched. For adding series data, hand-edit the OPF or use Calibre.'
  - q: 'Do I have to re-add series metadata after converting a book?'
    a: 'Yes, if the converter writes a fresh package document — and most do. Our own converters build the OPF from a template that carries title, author, language and identifier, and nothing else, so every converted book is born without a series line regardless of what the source carried. Add the series after the last conversion step, not before it.'
  - q: 'Why does the order of the two calibre lines matter?'
    a: 'Calibre''s own OPF writer actively reorders them so calibre:series comes before calibre:series_index, and the comment in its source attributes the swap to PocketBook readers that need the series name first. When a major library tool spends code enforcing an order, the safe move when hand-editing is to keep that order.'
draft: false
---

The books are all there. The author is right, the covers are right, and yet book two of a trilogy sits on the shelf between two unrelated novels, filed under its own title as if the trilogy did not exist. This complaint has recurred on MobileRead for over a decade in nearly identical form: a series that groups perfectly in Calibre falls apart the moment the files are sideloaded onto the device.

The reason is that EPUB series metadata is the least standardised piece of an otherwise heavily standardised format. Title, author and language have had their `dc:` elements since the beginning. Series arrived late, twice, in two competing shapes — and whether a device reads either of them is entirely the device's decision.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Series and series order live as optional <code>&lt;meta&gt;</code> lines in the EPUB's package document, in two conventions: the de facto <code>calibre:series</code> pair and the official EPUB&nbsp;3 <code>belongs-to-collection</code> chain. Most converters write neither, and some devices parse neither from sideloaded files. The robust fix is to put <strong>both</strong> into the file and re-import the book.
</div>

## Two conventions, because the standard came second

Long before the EPUB specification said anything about series, library software needed somewhere to keep them. Calibre's answer was the generic OPF `meta` element with a namespaced name — and because Calibre became the tool everyone sorted their libraries with, its private convention became the one everything else learned to read:

```xml
<meta name="calibre:series" content="The Specimen Papers"/>
<meta name="calibre:series_index" content="2"/>
```

That is not a guess at the format — it is what [Calibre's OPF writer](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/metadata/opf2.py) emits, building each tag as `'calibre:' + name`. The same file contains a detail hand-editors should copy: its render step checks that `calibre:series` appears *before* `calibre:series_index` and swaps them if not, a workaround its source attributes to PocketBook readers that need the series name first. Order matters to real firmware.

EPUB 3 then standardised the idea properly. The [meta properties vocabulary](https://github.com/w3c/epub-specs/blob/main/epub33/core/vocab/meta-property.html) defines `belongs-to-collection` — "the name of a collection to which the EPUB publication belongs" — refined by a `collection-type` (the spec defines `series` as "a sequence of related works that are formally identified as a group") and a `group-position`, "the numeric position in which the EPUB publication is ordered relative to other works belonging to the same group". Positions can even nest, `2.2.1`-style, for sub-series. The standard form of the same declaration:

```xml
<meta property="belongs-to-collection" id="c01">The Specimen Papers</meta>
<meta refines="#c01" property="collection-type">series</meta>
<meta refines="#c01" property="group-position">2</meta>
```

| | calibre convention | EPUB 3 standard |
|---|---|---|
| Lines needed | 2 | 3 |
| Mechanism | OPF 2 `name`/`content` meta | `property` + `refines` chain |
| Status | De facto, tool-defined | Specified in EPUB 3 |
| Sub-positions like 2.2.1 | No — a single number | Yes |
| In practice | The one legacy software reads | The one the spec promises a future for |

The two do not conflict. They sit in the same `<metadata>` block, and software reads whichever it understands — the NickelSeries Kobo mod, for instance, documents that it reads both and that "Calibre takes precedence".

## Converted books are born without series metadata

Neither convention survives most conversions, because converters typically write a fresh package document rather than copying the old one. Ours included. We ran our standard 1,550-byte specimen through the live [TXT to EPUB converter](/txt-to-epub) this run and unzipped the 5,186-byte result. The entire metadata block:

```xml
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="bookid">urn:uuid:8c459b31-…</dc:identifier>
  <dc:title>Specimen</dc:title>
  <dc:creator>Unknown</dc:creator>
  <dc:language>en</dc:language>
  <meta property="dcterms:modified">2026-11-02T16:17:30Z</meta>
</metadata>
```

No series, and there never will be one: the OPF template in our writer has slots for title, author, language, identifier, publisher and description, and no code path that emits a collection property. That is worth internalising beyond our tools — if a book went through any format conversion on its way to the device, the series line the original carried is very likely gone, and re-adding it is the last step of the job, not the first.

So we added it by hand. Five lines — both conventions above — pasted into that block before `</metadata>`, and the folder rezipped with the `mimetype` entry first and uncompressed, gave us a 5,106-byte `seriesbook.epub`. (Eighty bytes *smaller* than the converter's own output, despite five new lines — different zip compression settings, not missing content.) The live validator accepts it:

<figure>
<img src="/blog-media/epub-series-metadata/validator-pass.png" alt="The validator's report: a pink check mark above 'This EPUB is valid' and the line 'OK — No problems found. This EPUB is structurally valid.'" width="762" loading="lazy" />
<figcaption>The live /epub-validator run on the hand-edited seriesbook.epub (5,106 bytes): both series conventions in one metadata block, no structural complaints.</figcaption>
</figure>

One honest note on what that proves: our validator checks the container — the zip layout, the manifest, the required files. It confirms the hand edit broke nothing, not that every vocabulary term is spec-perfect.

## What a metadata editor will and will not touch

Here is the part that trips people up even after the series line exists. We dropped `seriesbook.epub` on our own [EPUB metadata editor](/epub-metadata-editor), and the form it pre-fills from the book has exactly four fields:

<figure>
<img src="/blog-media/epub-series-metadata/editor-form.png" alt="The metadata editor's form pre-filled from seriesbook.epub: fields for Title ('Specimen'), Author ('Unknown'), Language ('en') and Publisher (empty), above a Save changes button. No series field exists." width="762" loading="lazy" />
<figcaption>The live /epub-metadata-editor pre-filled from seriesbook.epub: Title, Author, Language, Publisher — and no series field. The editor cannot add what the form does not have.</figcaption>
</figure>

Title, author, language, publisher. No series. The form is an honest mirror of the code behind it, which edits exactly five `dc:` values — title, creator, language, publisher, description — and touches nothing else in the package document.

The useful flip side, which we verified rather than assumed: what the editor cannot edit, it also does not destroy. We retyped the title to "Specimen, Book Two" and saved. The output grew from 5,106 to 5,206 bytes, and a line-by-line diff of the two package documents shows exactly one changed line — `<dc:title>` — with all five series lines intact, both conventions. A title or author fix will not cost you series metadata you added by hand. (For the symptom where the title itself is the junk data, that repair has [its own guide](/blog/epub-shows-wrong-title).)

For actually *writing* series metadata, the honest routes are Calibre's book-metadata dialog or a hand edit of the OPF — the unzip-edit-rezip workflow is the same one the [Sigil walkthrough](/blog/sigil-epub-editor) demonstrates on chapter files, applied to `content.opf` instead.

## Why the device shelf can still ignore a correct file

A series line in the file is a request, not a command. Grouping happens in the device's library database, built when the book is imported — and whether the importer reads series metadata from a sideloaded file is firmware policy, not an EPUB rule.

Kobo is the best-documented case, precisely because the community built the missing piece. [NickelSeries](https://github.com/pgaskin/kobo-mods/blob/master/NickelSeries/README.md) is a firmware mod whose README opens with what it does: "Adds native support for parsing series (and subtitle) metadata from EPUB files… Compatible with Calibre or EPUB3 series metadata (Calibre takes precedence)" — and, tellingly, "will not override Nickel if Kobo ends up implementing it". A mod that adds native series parsing for sideloaded EPUBs is strong evidence of what stock firmware was not doing. The MobileRead threads around it report the ecosystem's other workarounds: renaming to `.kepub.epub`, Calibre's Kobo plugins, and a second connect-and-sync pass before series data appears. We own no Kobo to test any of this on, so we report it as what it is — a decade of consistent community findings, not our own measurement.

Kindle is a shorter story: the same forums treat sideloaded series grouping as a Calibre-plugboard problem rather than something the book file can fix, and Amazon's own documentation was unreachable for us this run, so we make no claim about current behaviour there. Apps built on modern reading engines — including desktop Calibre and browser-based readers — are generally the most willing audience for `belongs-to-collection`.

The practical consequence of all this: after fixing the file, **delete the book from the device and import the fresh copy**. The database row was written at import time; editing the file on your computer does not rewrite it.

## The five lines are still worth it

It would be fair to ask why you should bother writing metadata some devices discard. Because everything downstream of the file is out of your control, and the file is not. A book that carries both conventions groups correctly today in Calibre and every reader that looks, and starts working on any device the day its firmware decides to look — which is exactly the future the NickelSeries author planned for. A book that carries neither is guaranteed to file itself wrong everywhere, forever.

So: add both blocks, keep `calibre:series` above its index line, repack with `mimetype` first, and drop the result on the [EPUB validator](/epub-validator) before it goes anywhere near a device. The whole edit is five lines and two minutes, and it only ever has to be done once per book.

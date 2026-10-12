---
title: 'EPUB hyphenation: why your book has gaps but no hyphens'
excerpt: 'EPUB hyphenation needs a CSS grant, a language tag and a dictionary in the reading app. We tested where that chain breaks — and what actually fixes it.'
category: 'Typesetting'
ogImage: '/blog-og/epub-hyphenation.png'
date: 2026-10-12
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - style-studio
  - txt-to-epub
  - epub-validator
faqs:
  - q: 'Why does my justified ebook have huge gaps instead of hyphens?'
    a: 'Justification forces every line to reach both edges, and hyphenation is what normally relieves the pressure by letting long words break. When the reading app''s engine has no hyphenation dictionary for the book''s language — or the book never declares a language — no words break, so the gaps absorb all the slack. Switching to left alignment removes the pressure; restoring hyphenation needs an engine that can actually do it.'
  - q: 'Do I need to put hyphens into my EPUB file myself?'
    a: 'No. The book only grants permission with the CSS hyphens property and names its language; the reading app''s engine finds the break points with its own dictionary. Hand-placed soft hyphens are worth it only for exceptional words — coinages, long compounds, technical terms a dictionary will not know.'
  - q: 'Why does the same book hyphenate on my phone but not in another app?'
    a: 'Because the dictionary lives in the app, not in the book. Each reading engine ships its own hyphenation resources, covering different languages to different depths, and an engine with no resource for your book''s language is required by the CSS specification to do nothing. The book is identical in both places; the engines are not.'
  - q: 'What exactly is a soft hyphen?'
    a: 'An invisible character, U+00AD, placed inside a word to mark where it may break. It shows a hyphen only on the line where the break actually happens, and the CSS specification gives it priority over the engine''s own automatic break points. It is the one hyphenation instruction a book can carry entirely by itself — and hyphens none switches even that off.'
  - q: 'Can the wrong language tag cause hyphens in the wrong places?'
    a: 'Yes. The engine picks its dictionary from the declared language, so English text tagged as another language gets another language''s breaking rules — readers have reported exactly this on Kobo devices with mismatched books. Wrong-place hyphens are a tagging fault; no hyphens at all usually means a missing tag or a missing dictionary.'
  - q: 'Will a validator warn me about any of this?'
    a: 'No. We ran our test book — one chapter with no language attribute at all, one paragraph with hyphenation switched off — through our validator this session and it reported no problems, structurally valid. Language tagging at the chapter level and hyphenation behaviour are typography, and validators check packaging and structure, not typographic manners.'
draft: false
---

The complaint has been recurring on MobileRead for over a decade in two opposite forms. One thread asks why `hyphens: auto` suddenly stopped working in a book that used to break words cleanly. Another — the Kobo one — asks why a Dutch book hyphenates in the wrong places as a kepub. Zotero's forum has the EPUB-export version. The symptom behind most of them is the same picture: a justified page where EPUB hyphenation simply is not happening, every line stretched to both edges with rivers of white space and not a single broken word.

The instinct is to treat this as a CSS bug in the book. It almost never is. Hyphenation in an EPUB is a chain with three links, and the book itself only holds two of them.

<div class="callout">
<div class="callout-kicker">The short answer</div>
A book cannot hyphenate itself. The stylesheet grants <strong>permission</strong> (<code>hyphens: auto</code>), the markup names the <strong>language</strong> (<code>lang</code> / <code>xml:lang</code>), and the reading app's engine supplies the <strong>dictionary</strong> that finds the break points. If any link is missing, nothing breaks — silently. The only break instruction a book can carry on its own is a soft hyphen placed in the text.
</div>

## The book only grants permission

CSS treats automatic hyphenation as something an engine may do only when it genuinely knows how. The [CSS Text specification](https://github.com/w3c/csswg-drafts/blob/main/css-text-3/Overview.bs) is blunt about it: "Correct automatic hyphenation requires a hyphenation resource appropriate to the language of the text being broken. The UA must therefore only automatically hyphenate text for which the content language is known and for which it has an appropriate hyphenation resource."

Read that as a checklist and the whole symptom map falls out of it:

| Link in the chain | Lives in | When it is missing |
| --- | --- | --- |
| `hyphens: auto` in CSS | the book's stylesheet | the engine never tries, even with every dictionary installed |
| `lang` / `xml:lang` on the markup | the book's chapters | the engine must not guess a language, so it does nothing |
| a hyphenation dictionary for that language | the reading app's engine | permission and tagging are ignored — silently |

The first two are the author's job, fixed once in the file. The third travels with the reader, which is why the same book hyphenates beautifully in one app and not at all in the next — and why no amount of editing the EPUB can fix an engine that has nothing to break words with.

## We watched a perfectly tagged book refuse to hyphenate

To see the third link fail on its own, we hand-built a 3,077-byte test book this session — hyphenbook.epub — whose first chapter does everything right: `lang="en" xml:lang="en"` on the root element, `text-align: justify; hyphens: auto` in the stylesheet, and a paragraph full of long administrative words at a 360-pixel phone viewport. Then we rendered it in a Chromium 141 build that ships without hyphenation dictionaries.

<figure>
<img src="/blog-media/epub-hyphenation/tagged-360px.png" alt="A 360-pixel frame headed 'Tagged' rendering a justified paragraph beginning 'The incomprehensibility of internationalisation characteristically overwhelms straightforward documentation'. Every line is stretched to both margins with large uneven word gaps, and no word anywhere is broken with a hyphen." width="360" loading="lazy" />
<figcaption>Chapter one of hyphenbook.epub in a dictionary-less Chromium build: computed <code>hyphens: auto</code>, correct language tag — and zero hyphens across six justified lines.</figcaption>
</figure>

The layout probes make the silence measurable. The paragraph's computed style reports `hyphens: auto` — the engine accepted the property. The paragraph renders as 6 lines with 0 mid-word breaks. And the identically styled chapter with no `lang` attribute at all renders to the pixel the same way, because in this engine the dictionary is missing either way. On an engine that does carry dictionaries, that untagged chapter is the one that stays gap-ridden while its tagged twin breaks cleanly — the specification's advisement to tag content language exists precisely because engines are forbidden to guess.

Reader developers know all this. The Readium CSS project — the styling engine behind a family of reading apps — documents a [user hyphenation setting](https://github.com/readium/readium-css/blob/master/docs/CSS12-user_prefs.md) (`--USER__bodyHyphens`, values `auto` or `none`) and then warns implementers against even offering it on Blink-based apps, because automatic hyphenation there could not be relied on. That warning is the engine-side link of the chain, written down by the people who ship readers.

## Soft hyphens are the one instruction the book carries itself

There is exactly one way a book can break a word without anyone's dictionary: the soft hyphen, U+00AD (`&shy;` in markup). It is invisible until the line actually breaks there, and the specification gives it priority — a word containing conditional hyphens breaks at them, not at the engine's automatic points.

Chapter three of the test book carries a coinage wider than the whole column — electroencephalographicallymisunderstoodness — twice, with soft hyphens between its parts. The first paragraph leaves `hyphens` at its default (`manual`); the second sets `hyphens: none`.

<figure>
<img src="/blog-media/epub-hyphenation/softhyphens-360px.png" alt="A 360-pixel frame headed 'Soft hyphens' with two justified paragraphs containing the same very long coined word. In the first paragraph the word breaks across lines as 'electroencephalographically-' with a visible hyphen. In the second paragraph the unbroken word occupies an entire line by itself, and the line above it is stretched so hard that only the words 'The' and 'coinage' sit at its opposite edges." width="360" loading="lazy" />
<figcaption>Same word, same soft hyphens, same dictionary-less engine. Default <code>hyphens: manual</code> breaks at the soft hyphen (1 mid-word break in the probes); <code>hyphens: none</code> ignores it, exiles the word to its own line and tears the line above open.</figcaption>
</figure>

Both halves of that picture matter. The top paragraph proves soft hyphens work even where automatic hyphenation is impossible — no dictionary required, because the break points travel in the text. The bottom paragraph is the specification's `none` value doing exactly what it promises: "Words are not hyphenated, even if characters inside the word explicitly define hyphenation opportunities." A stylesheet that sets `hyphens: none` does not just decline automatic hyphenation — it disarms every soft hyphen the author placed by hand.

## What the books our converters build declare

Every "X to EPUB" converter on this site writes its output through one EPUB assembler, so the hyphenation posture is identical and checkable. We ran [TXT to EPUB](/txt-to-epub) live on our 1,550-byte specimen file this session; it produced a 5,185-byte book.

<figure>
<img src="/blog-media/epub-hyphenation/txt-to-epub-run.png" alt="The TXT to EPUB done panel: a pink check mark above 'Your EPUB is ready', the line 'specimen.epub · 5 KB · never left your device', a 'Style it before downloading' button, a 'Download without styling' button and a 'Convert another file' link." width="760" loading="lazy" />
<figcaption>The live TXT to EPUB run on specimen.txt — 1,550 bytes in, 5,185 bytes out, converted in the browser.</figcaption>
</figure>

Unzipping that output, the generated stylesheet's first line is `body{margin:5%;line-height:1.5;text-align:justify;hyphens:auto}`, every chapter opens with `lang="en" xml:lang="en"` on its root element, and the package metadata declares `<dc:language>en</dc:language>`. Both of the book's links in the chain are present, which is the most an EPUB can honestly do. Worth noting plainly: that stylesheet writes only the unprefixed `hyphens` property, while some engines — especially older WebKit ones — historically listened to vendor-prefixed forms. The restyled books below cover those too; the converter default does not.

## Taking control of it

Style Studio is where the hyphenation decision becomes yours. Its hyphenation toggle is deliberately coupled to alignment: justified presets grant it, left-aligned presets write `hyphens: none` — because ragged-right text does not need broken words to look even, and gaps were the only reason to break them.

We drove the test book through the live page this session on the default Classic novel preset. hyphenbook.epub went in at 3,077 bytes and came out as hyphen-book.epub at 3,843 bytes, every chapter's stylesheet link swapped for a generated 1,141-byte `epub-studio.css` whose body rule reads `text-align:justify` and `hyphens:auto;-webkit-hyphens:auto;-epub-hyphens:auto` — the full prefixed set, for engines old enough to want it.

<figure>
<img src="/blog-media/epub-hyphenation/style-studio-run.png" alt="Style Studio with the test book open. The header reads 'hyphenbook.epub → hyphen-book.epub', a badge says 3 chapters, the Classic novel preset card is selected among Modern, Compact, Airy and Accessible, EB Garamond is the chosen typeface, the preview renders the book's own justified paragraphs including the long coined word, and the download bar reads 'Download ready ✓ hyphen-book.epub · 3 KB'." width="760" loading="lazy" />
<figcaption>The live Style Studio run: Classic novel preset, the book's own chapters in the preview, download ready at 3 KB.</figcaption>
</figure>

Honest edges, because they are real. The restyle replaces stylesheet links wholesale, so the book's original `style.css` stays orphaned inside the archive — harmless, but there. Choosing a left-aligned preset writes `hyphens: none`, which also switches off any soft hyphens the text carries, as the second test paragraph showed. And none of this binds a reading app: Readium-class engines expose their own user hyphens override and are told to apply user settings by any means necessary, so the shipped CSS is a default, not a law. That is the right hierarchy — the same one that applies to [justified text itself](/blog/epub-justified-text), where the book proposes and the reader disposes.

## What to actually do about the gaps

If you are making the book: declare the language honestly (and the right one — a mismatched tag earns wrong-place hyphens, the Kobo complaint), grant `hyphens: auto` with the prefixed forms, and reserve soft hyphens for the words no dictionary will know. If you are reading one: gaps-but-no-hyphens means the engine under your app has no dictionary for that book's language, and nothing inside the file can change that. What you can change is the pressure. Drop the book on [Style Studio](/style-studio), pick a left-aligned preset, and the stretched lines go ragged-right and readable in one pass — or keep Classic novel and let every engine that can hyphenate do it properly. The settings are written into the book you download, and the file never leaves your browser.

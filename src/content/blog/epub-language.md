---
title: 'EPUB language: the two lines that pick your dictionary'
excerpt: 'The EPUB language tag decides which dictionary opens, how words break, even how quotes render. Why converted books claim English, and the one-field fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-language.png'
date: 2026-11-03
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-metadata-editor
  - epub-validator
  - txt-to-epub
howToTitle: 'How to fix the language of an EPUB'
howTo:
  - t: 'Read what the book currently declares'
    d: 'Drop the EPUB on the metadata editor. The form pre-fills from the file itself, so the Language field shows exactly what the package metadata says — ours showed "en" on a French book.'
  - t: 'Type the real language code and save'
    d: 'Replace the value with a BCP 47 tag — "fr", "de", "pt-BR" — and save. Only the package document changes; the book''s text is untouched.'
  - t: 'Validate the result'
    d: 'Run the saved file through the validator. A missing language line is flagged as an error, so a clean pass confirms the declaration is at least present and in place.'
faqs:
  - q: 'How do I check what language my EPUB declares?'
    a: 'Open the book in any metadata editor and look at the language field — ours pre-fills it straight from the package document, so whatever appears there is what every reading app is being told. If the field shows "en" on a book that is not English, that is the fault.'
  - q: 'What format does the EPUB language code have to be?'
    a: 'A BCP 47 language tag. In practice that is the two-letter code — "en", "fr", "de" — optionally with a region, like "pt-BR" for Brazilian Portuguese or "en-GB" for British English. The EPUB specification requires the value to be a well-formed tag, but most validators never check the value itself.'
  - q: 'Does changing the language tag change the text of the book?'
    a: 'No. In our test the only change inside the archive was one metadata line, "en" becoming "fr", and every chapter file came out byte-identical. The tag is a label about the text, not part of it, which is also why fixing it is safe to do on a finished book.'
  - q: 'Can one EPUB declare two languages?'
    a: 'Yes. The package document may repeat the language element, and reading systems treat the first one as the book''s primary language. For mixed-language content the right tool is different: mark the individual passage with a lang attribute in the chapter itself, so a French quotation inside an English book renders as French.'
  - q: 'Why does my ereader open the wrong dictionary for a book?'
    a: 'Most reading apps pick the lookup dictionary from the book''s declared language rather than from the text. A French novel tagged "en" gets the English dictionary, and every lookup fails. Fixing the declaration in the book is the reliable cure; changing the app''s settings only papers over this one copy.'
draft: false
---

Tap a word in a French novel and the dictionary that slides up is English. The
definitions are useless, the text-to-speech voice mangles every sentence, and
the reading app insists the book is something it plainly is not. This complaint
keeps resurfacing on MobileRead and in Calibre's bug tracker in every variation
— an English book a Kobo treated as Dutch, Polish books hyphenated by English
rules, a converted library whose every book claims the converter's own locale.

The EPUB language setting behind all of this is two short lines of metadata.
The book's text does not carry its language the way it carries its words;
the language is declared, and everything downstream — dictionary choice,
hyphenation, speech voice, even which quotation marks render — trusts the
declaration over the text. When the declaration is wrong, every one of those
features is wrong in the same direction, and no app-side setting fully
compensates.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Your book's language lives in one line of its package file, <code>&lt;dc:language&gt;</code>,
and in a <code>lang</code> attribute on each chapter. Converters routinely write
<strong>en</strong> into both regardless of the text. A metadata editor
corrects the package line in one field, without touching the text.
</div>

## One label in the package, and one on every page

An EPUB declares its language in two separate places, and the [EPUB 3.3
specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html)
is strict about both. The package document — the book's manifest file — must
carry a `dc:language` element; it is one of only three metadata fields the
format requires at all, alongside the title and an identifier. Its value
"MUST be a well-formed language tag", meaning a BCP 47 code like `en`, `fr`
or `pt-BR`.

Here is that line in a real book, straight from the package file of an EPUB
we built this run:

```xml
<dc:title>Le Gardien</dc:title>
<dc:language>en</dc:language>
```

The second place is each chapter file. XHTML documents name their own language
with `lang` and `xml:lang` attributes on the root element, and the spec is
explicit that the two layers do not talk to each other: "Publication resources
do not inherit their language from the dc:language element(s)." A correct
package line above a chapter still tagged wrong leaves the rendering layer
misinformed — a detail that matters for the fix later.

Roughly: reading systems read the package line to decide *about the book* —
which dictionary, which speech voice, how to shelve it — while the rendering
engine reads the chapter attribute to decide *about the text* — how to break,
case and punctuate it.

## The same bytes, three different books

The declaration is not cosmetic, and we can prove it without any dictionary
involved. We rendered one identical sentence three times in Chromium 141 —
the same engine inside most desktop and Android reading apps — changing
nothing but the `lang` attribute:

<figure>
<img src="/blog-media/epub-language/lang-render-demo.png" alt="Three rendered rows of the same sentence. Under lang=en the quotation renders in curly double quotes and the uppercased words read ISTANBUL, DIYARBAKIR. Under lang=fr the same quotation renders in guillemets. Under lang=tr the uppercased words read İSTANBUL, DİYARBAKIR with a dotted capital İ." width="720" loading="lazy" />
<figcaption>One sentence, three <code>lang</code> values, rendered in Chromium 141. The quotation marks and the uppercase letters change with the declaration — the text bytes never do.</figcaption>
</figure>

Declared French, the `<q>` quotation renders in « guillemets ». Declared
Turkish, `text-transform: uppercase` capitalises *istanbul* to *İSTANBUL*
with the dotted capital İ that Turkish requires — and declared English, the
same transform strips the dot from *diyarbakır*'s undotted ı. Same bytes,
three different books.

That is just the behaviour we can screenshot headlessly. The consumers that
forum threads actually complain about stack on top: reading apps pick the
lookup dictionary from the declared language, hyphenation engines choose
their break patterns by it — [where words break](/blog/epub-hyphenation) has
the full chain — and text-to-speech picks its voice by it. We have not tested
individual devices here and the details vary by platform, but the direction
is always the same: the features follow the label, not the text.

## Our own converter writes the wrong label, and here is the proof

We converted a 1,327-byte French short story, `le-gardien.txt`, through the
live [TXT to EPUB converter](/txt-to-epub) on this site. Out came a perfectly
valid 3,260-byte EPUB — carrying `<dc:language>en</dc:language>` in its
package and `lang="en" xml:lang="en"` on its one chapter. The French text
survived to the byte. The label about it is simply false.

<figure>
<img src="/blog-media/epub-language/txt-to-epub-done.png" alt="The converter's done panel: 'Your EPUB is ready' above the line 'le-gardien.epub · 3 KB · never left your device', with styling and download options." width="760" loading="lazy" />
<figcaption>The live /txt-to-epub run on le-gardien.txt: 1,327 bytes of French in, a 3,260-byte EPUB out — tagged English in both metadata layers.</figcaption>
</figure>

The code explains why, and it is worth being plain about our own tools: the
text, Markdown, HTML, Word, PDF and comic converters here all fall back to
`en` when no language is supplied, and the converter pages supply none —
there is no language picker on any of them. The HTML converter even ignores
a `lang` attribute the source page itself declares. Only two routes carry
the truth through: FB2 files, whose own metadata block names a language, and
MOBI/AZW3 files, whose metadata we read and keep.

This is not a quirk of this site. The same mechanism — converter stamps its
default or its host system's locale instead of the text's language — is
exactly what the long-running Calibre bug reports and MobileRead threads
describe, including one where a placeholder code broke dictionary lookup in
iBooks until the user hand-edited it to `en`. Converted books get the
converter's language, not the book's. Yours is worth checking.

## The fix is one field — with one honest caveat

Drop the mislabeled book on this site's EPUB metadata editor and the form
answers the diagnostic question for you: it pre-fills from the
file, so the Language field shows what the book really declares.

<figure>
<img src="/blog-media/epub-language/metadata-editor-prefill.png" alt="The metadata editor form pre-filled from le-gardien.epub: Title 'Le Gardien', Author 'Unknown', Language 'en', Publisher empty, above a Save changes button." width="760" loading="lazy" />
<figcaption>The editor pre-filled from our French book: Language says "en". Typing "fr" and saving rewrites that one metadata line.</figcaption>
</figure>

We typed `fr`, saved, and compared the output against the input, entry by
entry. Inside the archive exactly one thing changed: `<dc:language>en</dc:language>`
became `<dc:language>fr</dc:language>`, with the package file the same
868 bytes before and after. The chapter, the navigation files and the
stylesheet came out byte-identical (the container itself grew three bytes,
3,260 to 3,263 — zip bookkeeping, not content). That byte-identity is the caveat: the editor rewrites the package
document only, so the chapter's `lang="en" xml:lang="en"` attributes survive
the fix. For the dictionary-and-shelving layer, which reads the package, the
one-field fix is complete. For per-passage rendering of the kind our
three-row demo shows, the chapter attributes would still claim English, and
correcting those means opening the XHTML by hand — one root-element edit per
chapter, the kind of small source surgery [Sigil is built
for](/blog/sigil-epub-editor).

## What validation will and will not tell you

Our [EPUB validator](/epub-validator) checks the package for the three
required metadata elements, so a book with no language line at all is caught
loudly. We stripped `dc:language` out of our test book and dropped it on the
live page:

<figure>
<img src="/blog-media/epub-language/validator-no-language.png" alt="The validator's report panel reading 'Problems found' with one error row: 'Required metadata dc:language is missing.'" width="760" loading="lazy" />
<figcaption>The live validator on the stripped copy: the missing declaration is an error, by name.</figcaption>
</figure>

Then we rebuilt the same book declaring `zz-QQ-INVENTED` — a language that
does not exist — and the same validator reported "No problems found". That is
not a bug so much as a boundary, and ours is not alone in having one: the
check verifies the element is present, not that its value names a real
language, so a *wrong* declaration sails through where a *missing* one is
flagged. Validation answers "is the line there", never "is the line true".
The only test of true is the one at the top of this page: tap a word and see
which dictionary arrives.

A book that opens the right dictionary, breaks words by the right rules and
reads aloud in the right voice is usually three bytes away from one that does
none of it. Check the label before blaming the app: drop the book on the
[metadata editor](/epub-metadata-editor), read the Language field, and make
the one-field correction if it lies.

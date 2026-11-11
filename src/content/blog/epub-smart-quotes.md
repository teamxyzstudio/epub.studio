---
title: 'EPUB smart quotes: where curly marks really come from'
excerpt: 'Smart quotes in an EPUB are characters, not styling. Where quote shape is really decided, why converters never change it, and how books end up mixed.'
category: 'Typesetting'
ogImage: '/blog-og/epub-smart-quotes.png'
date: 2026-11-11
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - txt-to-epub
  - merge-epub
  - epub-validator
howToTitle: 'How to fix straight or mixed quotes in an ebook'
howTo:
  - t: 'Smarten the source, not the EPUB'
    d: 'Fix the quotes in the manuscript — your editor''s autocorrect, a per-character find-and-replace, or Calibre''s Smarten Punctuation option at conversion time. Nothing downstream will do it for you.'
  - t: 'Hand-check the leading apostrophes'
    d: 'Search the smartened text for an opening single quote directly before a letter or digit. Words like ''tis, ''90s and rock ''n'' roll should carry the closing shape, and automatic smartening points them the wrong way.'
  - t: 'Reconvert and spot-check the output'
    d: 'Convert the corrected source and read a dialogue-heavy page at reading size. A validator will report the file structurally valid either way, so your eyes are the only check on this.'
faqs:
  - q: 'Are straight quotes an error in an EPUB?'
    a: 'No. Quote shape is ordinary text content, and no part of the format rules on it. We ran a book that mixes straight and curly marks through our validator during this test and it came back structurally valid with no problems found. Curly quotes are a typesetting convention, not a spec requirement.'
  - q: 'Will converting the book again turn straight quotes into curly ones?'
    a: 'No. A converter''s job is to carry your text across formats, and in our tests the plain-text, Markdown and DOCX converters all delivered every quote character exactly as typed. Reconverting the same source reproduces the same marks. The shape has to change in the source before conversion.'
  - q: 'Can a font or reading app curl straight quotes for me?'
    a: 'No. A font draws whichever character the text contains — the straight mark and the curly marks are different characters with different glyphs, not one character styled two ways. Reading apps restyle size, spacing and colour, but they do not rewrite the text of the book.'
  - q: 'Which way should the apostrophe point in words like ''90s and ''tis?'
    a: 'Toward the missing letters — which means the closing shape, the same character used for the apostrophe in wasn''t. Automatic smartening sees a quote mark after a space and picks the opening shape instead, so abbreviated decades and clipped words are the first place a smartened text goes wrong.'
  - q: 'Do quotes in code samples need to be curly too?'
    a: 'No — the opposite. Program code needs the straight characters, because curly quotes are different characters and most languages will not parse them as string delimiters. If a technical book goes through a blanket smartening pass, its code samples come out broken. Smarten prose, leave code alone.'
draft: false
---

Open a converted ebook and the dialogue is full of straight typewriter marks — `"like this"` — where a printed page would curl them. Or worse: chapter three curls them and chapter four doesn't, and once you've seen the mix you can't stop seeing it. Both versions of the complaint keep resurfacing on MobileRead, going back well over a decade — threads asking how to get smart quotes *into* an ebook, threads asking how to get them *out* because one device renders them badly, and threads untangling books that arrived half-and-half. The DocBook mailing list has had the same argument about EPUB source files.

The confusion underneath nearly all of them is the same, and it is worth clearing up before touching any tool: people go looking for the setting that controls quote style — in the reader app, in the converter, in the EPUB itself. There is no such setting, anywhere in the chain. EPUB smart quotes are not a style. They are the text.

## A quote mark is a character, not a style

The straight double quote and the curly pair are three different characters: `"` is U+0022, while `“` and `”` are U+201C and U+201D. The same goes for singles — `'` is U+0027, the curly pair is U+2018 and U+2019. Typeset text uses U+2019 for two jobs at once: the closing single quote and the apostrophe in *wasn't* are one and the same character.

That has a consequence most explanations skip. Bold is markup wrapped around text, so a stylesheet or a reader setting can switch it on and off. Quote shape has no markup — the curl is *in* the character — so there is nothing for CSS to target and nothing for a reading app to toggle. A font can only draw the characters it is handed. The shape of every quote mark in an ebook was decided at the moment somebody typed it, in whatever editor they typed it in. Everything after that moment is transport.

## Three sources, one pipeline — what actually carries through

We tested the transport claim on our own converters rather than asserting it. One two-sentence passage, written three ways, each run through the live tool this week:

| Typed in | Fixture | Live run | Quote characters out |
|---|---|---|---|
| A plain-text editor | typed-straight.txt · 243 B | TXT to EPUB → 2,788 B | Straight, verbatim — U+0022 and U+0027 only |
| Markdown, typed straight | typed-straight.md · 173 B | Markdown to EPUB → 2,697 B | Straight — even the `--` arrives as two hyphens |
| Markdown, typed curly | typed-curly.md · 196 B | Markdown to EPUB → 2,718 B | Curly, verbatim — U+2018/U+2019, U+201C/U+201D, real em dash |

The plain-text result is exactly what the code promises: our TXT importer splits paragraphs on blank lines and collapses whitespace, and otherwise touches nothing — characters in, characters out. The Markdown result is worth a sentence more, because Markdown processors are where automatic smartening historically lived. The parser we ship, marked 18, educates nothing: we fed it straight quotes from the repository's own installed copy and they came back straight (as `&quot;` and `&#39;` entities), with the double hyphen intact. If your Markdown was typed straight, your EPUB is straight.

The fourth source is the interesting one. We hand-built a small DOCX carrying the characters an autocorrecting word processor stores — because editors like Word curl quotes *as you type*, the file on disk already contains U+201C and friends before any converter sees it. We also gave it the two mistakes such editors make, and the [DOCX converter](/docx-to-epub) delivered all of it faithfully: a 1,072-byte source became a 2,722-byte EPUB whose text reads `“We’ll see about the ‘90s crowd — ‘tis the season`. Look closely at *‘90s* and *‘tis*: the marks curl the wrong way, opening instead of closing. The converter didn't cause that and couldn't fix it. It carried the typing, mistakes included — which is the whole point.

## How one book ends up with both shapes

A single manuscript typed in a single editor comes out consistent. Mixed books are assembled books: an anthology stitched from different contributors, a novel whose new foreword was pasted in from a different program, chapters recovered from different sources. We reproduced the smallest possible version — the curly Markdown book merged with the straight one through the live [EPUB merger](/merge-epub), producing one 4,050-byte book that contains the identical sentence twice. Chapter 2 reads `“Done,” she said.` Chapter 4 reads `"Done," she said.`

<figure>
<img src="/blog-media/epub-smart-quotes/merged-mixed-quotes.png" alt="Two rendered passages from merged.epub in a serif reading font. Chapter 2, labelled as coming from the Markdown book typed curly, reads: “Done,” she said. “We’ll see about the ’90s crowd — ’tis the season, after all.” Chapter 4, labelled as coming from the plain-text book typed straight, reads the same sentences with straight quote marks and a double hyphen in place of the dash." loading="lazy" />
<figcaption>Both chapters of the merged book rendered in Chromium at reading size. Same prose, one merge apart — the merger carries each source's characters verbatim, so the seam shows in the punctuation.</figcaption>
</figure>

Nothing in the merge normalises punctuation, and that is the correct behaviour — a tool that rewrote your text would be a liability. But it means every assembly step is a chance for two typing histories to end up under one cover, and the seam is visible on every page of dialogue.

## No tool will warn you

The mixed book sailed through validation. We dropped it on the live [EPUB validator](/epub-validator) straight after the merge:

<figure>
<img src="/blog-media/epub-smart-quotes/validator-passes-mixed.png" alt="The epub.studio validator report for the merged book: a check mark, the heading 'This EPUB is valid', and the line 'OK — No problems found. This EPUB is structurally valid.'" loading="lazy" />
<figcaption>The live validator on the 4,050-byte mixed-quotes book. Quote shape is content, so no validator — ours included — treats it as a fault.</figcaption>
</figure>

That is not a gap in one validator; it is the nature of the problem. Validation polices structure — the container, the manifest, the markup. Which of two legitimate Unicode characters your dialogue uses is a copy-editing question, invisible to every mechanical check in the pipeline. If the quotes are wrong, a human has to notice.

## Smartening, and the two places it misfires

The fix always runs through the source. Fix the manuscript and reconvert — never try to patch marks one by one in the finished EPUB, where the same text is split across many files. For an existing straight-typed manuscript you have two honest routes: a per-character find-and-replace in your editor (straight-to-curly needs context, so autocorrect or a smartening pass does it better than blind replacement), or a converter that offers it explicitly — Calibre's conversion options include exactly this pair, "Convert plain quotes, dashes and ellipsis to their typographically correct equivalents" and its reverse, per [its own source](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/conversion/plumber.py). The reverse direction exists because some readers genuinely prefer straight marks on their device — that direction is mechanical and safe, since both curly shapes collapse to one straight one.

Going the curly direction, check two things by hand afterwards:

1. **Leading apostrophes.** Every automatic smartener decides direction from context, and a quote mark after a space looks like an opening quote. [SmartyPants' own documentation](https://github.com/othree/smartypants.js) concedes it plainly: in "'Twas the night" it "will turn the apostrophe into an opening single-quote, when in fact it should be a closing one." The same trap takes *'90s*, *'tis* and *rock 'n' roll* — our Word-style fixture carried exactly that error through conversion untouched. Search the result for an opening single quote directly before a letter or digit, and point them the other way.
2. **Measurements and code.** In `6'2"` the marks are foot and inch signs, not quotes, and a smartening pass will happily curl them into nonsense. Program code is the same problem harder: curly quotes are different characters, so smartened string delimiters stop parsing. Smarten prose; leave measurements and code samples straight.

One adjacent symptom is a different problem entirely: if your book shows `â€™` where an apostrophe should be, the curly character is already there and has been mangled at the byte level. That is encoding damage, and it has [its own anatomy and fix](/blog/epub-weird-characters) — no amount of quote-mark editing will touch it.

Being realistic about our own tools: nothing on this site smartens or unsmartens. That is deliberate — a converter that edits your punctuation is making editorial decisions behind your back. Type the manuscript the way you want it to read, drop it on the [plain-text to EPUB converter](/txt-to-epub), and the book that comes out carries your punctuation exactly — we just proved it character by character.

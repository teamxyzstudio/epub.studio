---
title: 'EPUB emoji not showing: the font is missing, not the text'
excerpt: 'EPUB emoji not showing — boxes or blank gaps where faces should be? The characters are almost always still in the file. The device''s fonts are too old.'
category: 'Fix it'
ogImage: '/blog-og/epub-emoji-not-showing.png'
date: 2026-11-01
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-to-txt
  - txt-to-epub
  - epub-to-pdf
howToTitle: 'How to tell whether the book or the font is broken'
howTo:
  - t: 'Extract the text'
    d: 'Drop the EPUB on the text extractor and search the output for the sentence where the box appears. If the emoji is in the extracted text, the file carries it.'
  - t: 'Open the same file on a second device'
    d: 'A phone or a desktop browser almost always has a newer emoji font than an e-reader. If the character draws there, the book is confirmed good twice over.'
  - t: 'Fix the side that actually failed'
    d: 'Character present but one device draws a box: that device''s fonts are the problem — update them if you can, or stop leaning on that character. Character absent from the extracted text: the book itself lost it, and the fix is rebuilding from the source.'
faqs:
  - q: 'Why do emoji in my ebook show as empty boxes or blank gaps?'
    a: 'The file contains the character, but no font installed on the device has a picture for it. A font is a finite list of drawings keyed by character; when a character is in none of the device''s lists, the reader draws a placeholder box — or nothing at all. The newer the emoji, the more likely the gap.'
  - q: 'Are the emoji still inside the file when I see boxes?'
    a: 'Almost always, yes. We extracted the plain text of our test book and every emoji came out intact, including three that one of our render setups could not draw. A box means rendering failed on that device; it does not mean the data is gone. A character that was genuinely lost in conversion is absent from the extracted text too, which is exactly how you tell the two apart.'
  - q: 'Why does the same book show emoji on my phone but not on my e-reader?'
    a: 'Phones ship a colour emoji font that is refreshed with every OS update, so it keeps pace with the standard. E-readers ship a small set of book fonts and update rarely, if ever. The file is identical; the two devices simply have different vocabularies of drawable characters.'
  - q: 'Will converting the EPUB to PDF fix the missing emoji?'
    a: 'No — in our own test it made things strictly worse. A PDF freezes text using whatever fonts the converter writes into it, and our converter''s built-in PDF font cannot encode emoji at all: the grinning face came out as the stray letters Ø=Þ on the page. A font problem is fixed on the reading side, not by freezing the text into a different container.'
  - q: 'Can I embed an emoji font in the EPUB itself?'
    a: 'Mechanically it works like embedding any other font, and readers on MobileRead report success on Kobo devices with a monochrome emoji font applied to the emoji spans through CSS. We have not tested embedding ourselves in this run, and the same threads report that colour emoji fonts travel much less reliably than monochrome ones — so treat it as a community-verified workaround, not a guarantee.'
  - q: 'Is this the same problem as weird characters like â€™?'
    a: 'No, and the distinction matters because the fixes are different. â€™ is an encoding fault: bytes read with the wrong alphabet, so the text itself is misread or damaged. An emoji box is a coverage fault: the character is correct and present, and the device just owns no picture of it. Re-encoding fixes the first; only fonts fix the second.'
draft: false
---

A book reads perfectly on a phone, and the same file on an e-reader draws hollow boxes — or just blank gaps — where the emoji should be. This question keeps resurfacing on MobileRead: Kobo owners finding empty squares in downloaded books, KOReader users watching a book render differently in every app they try, and the same shape of complaint about Chinese and Japanese glyphs in Adobe's forums. The frustrating part is how broken it looks.

It almost never is. EPUB emoji not showing is not damage, and it is not an export bug in whatever made the book. It is a vocabulary gap: the file contains a character that the device's fonts have no picture for. The text is fine. The font is too old for the text.

<div class="callout">
<div class="callout-kicker">The short answer</div>
The emoji are almost certainly still in the file — extract the text and you can check in thirty seconds. A font is a list of drawings keyed by character, and emoji keep being added to the standard years after any given font was built. A device whose fonts predate a character draws a placeholder instead. Fix the reading side; the book usually needs nothing.
</div>

## A character and its picture are two different things

An EPUB stores text as Unicode characters — numbers, essentially. The melting face is codepoint U+1FAE0 and travels through converters, zips and e-readers as four bytes of UTF-8. Whether anything visible appears on screen is a separate question answered at render time: the reader walks its list of fonts asking each one "do you have a drawing for U+1FAE0?", and if every font says no, it draws the placeholder — a hollow rectangle, a box of hex digits, or nothing at all. Font engineers call that placeholder glyph "tofu".

What makes emoji the main victim is their release schedule. Letters were settled decades ago; emoji are still being added every year, and each one is only drawable after a device's fonts are updated past it. The five characters in our test sentence span that whole history — ages quoted from [Unicode's DerivedAge data](https://raw.githubusercontent.com/unicode-org/unicodetools/main/unicodetools/data/ucd/17.0.0/DerivedAge.txt):

| Character | Codepoint | In the standard since |
|---|---|---|
| ☺ smiling face | U+263A | Unicode 1.1 — 1993 |
| 😀 grinning face | U+1F600 | Unicode 6.1 — 2012 |
| 🫠 melting face | U+1FAE0 | Unicode 14.0 — 2021 |
| 🫨 shaking face | U+1FAE8 | Unicode 15.0 — 2022 |
| 🫆 fingerprint | U+1FAC6 | Unicode 16.0 — 2024 |

A device font frozen in 2020 covers the first two rows and owns no picture of the last three. That single fact reproduces every symptom in those forum threads.

## One sentence, five eras: which emoji actually show

We built a 672-byte text file whose one real paragraph uses all five characters, and ran it through the live converter on [/txt-to-epub](/txt-to-epub):

<figure>
<img src="/blog-media/epub-emoji-not-showing/txt-to-epub-done.png" alt="The converter's done panel: a pink check mark above 'Your EPUB is ready' and the line 'emojibook.epub · 4 KB · never left your device'." width="760" loading="lazy" />
<figcaption>The live /txt-to-epub run on emojibook.txt: 672 bytes in, a 3,882-byte EPUB out. Inside, chapter-002.xhtml carries the emoji sentence byte for byte — the melting face is the UTF-8 sequence <code>f0 9f ab a0</code>, verified in the unzipped archive.</figcaption>
</figure>

Then we rendered that chapter twice in the same browser engine — once with a current colour emoji font installed, once with the font list cut down to plain text fonts, which is much closer to what a basic e-reader ships:

<figure>
<img src="/blog-media/epub-emoji-not-showing/render-with-emoji-font.png" alt="The rendered chapter with every character visible: the sentence shows a monochrome smiling face, then a yellow grinning face, a yellow melting face, a shaking face and a blue fingerprint emoji in colour." width="784" loading="lazy" />
<figcaption>Render one: Noto Color Emoji 2.047 installed. All five characters draw, the last four in colour. This is the book on a phone.</figcaption>
</figure>

<figure>
<img src="/blog-media/epub-emoji-not-showing/render-without-emoji-font.png" alt="The same rendered chapter with the emoji font removed: the smiling face and grinning face still draw as small monochrome glyphs, but the melting face, shaking face and fingerprint have vanished, leaving blank gaps mid-sentence." width="784" loading="lazy" />
<figcaption>Render two: same file, text fonts only. ☺ and 😀 survive — DejaVu Sans, an ordinary text font, happens to carry both. The three post-2020 characters vanish into gaps exactly the width of the font's missing-glyph box (19 px in our layout probes, matching the .notdef glyph to the pixel).</figcaption>
</figure>

The gradient is the lesson. Nothing "broke" between the two screenshots — not one byte of the book changed. The 1993 and 2012 characters are old enough that even plain text fonts learned them; the 2021, 2022 and 2024 characters need an emoji font young enough to know they exist. Whether a missing character shows as a hollow box, a hex-digit box or a silent gap is the engine's choice — we saw gaps here and boxes in a different font configuration — but the cause is the same vocabulary test, failed.

## Prove the book is fine in thirty seconds

The diagnosis never requires guessing, because extraction sidesteps fonts entirely. Drop the book on [/epub-to-txt](/epub-to-txt) and search the output for the sentence with the hole in it. Our test book came out as 701 bytes of plain text with all five characters intact — including the three that the stripped-down render could not draw. The extractor copies characters; it does not consult a font to do it.

From there the verdict is mechanical. Character present in the text, but boxed on one device: that device's fonts are the problem, and the book needs nothing. Character present, and a second device (a phone, or this site's reader) draws it: confirmed twice. Character absent from the extracted text: now, and only now, is the book actually missing it — something upstream dropped the character, and the fix is regenerating the book from its source, not patching fonts.

## Converting to PDF makes it worse, and we can show exactly how

A tempting "fix" is to freeze the book into a PDF so it looks the same everywhere. We ran our emoji EPUB through our own [/epub-to-pdf](/epub-to-pdf) to see what that buys. The honest answer: a 4,533-byte PDF in which the smiling face has become the two characters `&:` and the grinning face has become `Ø=Þ`, followed by equally wrong pairs for the other three.

<figure>
<img src="/blog-media/epub-emoji-not-showing/epub-to-pdf-page2.png" alt="A rendered PDF page in which the test sentence reads: The old smiling face &: was already in fonts decades ago. The grinning face Ø=Þ arrived with the first big emoji wave. The melting face Ø>Þà is from Unicode 14. The shaking face Ø>Þè is from Unicode 15. The fingerprint Ø>ÞÆ is from Unicode 16." width="784" loading="lazy" />
<figcaption>Page 2 of the PDF our converter produced, rendered to pixels. Every emoji has become letter salad. Decompressing the PDF's content stream shows why: the characters' UTF-16 code units were written one byte at a time through the PDF's built-in Helvetica, which cannot encode emoji at all — U+263A's two bytes <code>26 3A</code> are literally the characters <code>&amp;:</code>.</figcaption>
</figure>

That is our converter's standard-font text path doing it, and we are reporting it rather than hiding it: it should detect characters outside the font's range instead of letting their code units leak onto the page. But the broader point stands for any converter that doesn't embed an emoji-capable font — a PDF is text frozen with *some* font, so converting a font problem produces a frozen font problem. The characters were safer in the EPUB.

## What this fix honestly looks like

Being realistic about the options, from a reader's side and an author's side:

- **Reading on a phone, tablet or desktop:** keep the OS updated and the emoji font updates come with it. The same book that boxed on an e-ink device will almost certainly draw fine here.
- **Reading on an e-ink device:** font updates arrive with firmware, late or never. MobileRead threads document embedding a monochrome emoji font and pointing CSS at the emoji spans as a workable Kobo-side repair — we have not tested it ourselves, and colour emoji fonts are reported to travel far worse than monochrome ones. Our guide to [embedded fonts that stop working](/blog/epub-embedded-fonts-not-working) covers the mechanics that make or break that route.
- **Writing or publishing a book:** treat any emoji younger than a couple of years as undeliverable to part of your audience. If the character carries meaning, put the meaning in words too. A restyling pass can change which fonts a book asks for, but no stylesheet can conjure a glyph a device does not own.
- **Seeing â€™-style garbage instead of boxes:** that is a different fault in a different layer — bytes read with the wrong alphabet — and it has its own fixes, covered in our piece on [weird characters in an EPUB](/blog/epub-weird-characters).

The one thing not to do is "repair" a file that was never broken. Before touching the book, spend the thirty seconds: extract the text, find the character, and let the evidence tell you which side of the screen failed.

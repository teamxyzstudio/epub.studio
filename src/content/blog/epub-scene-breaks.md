---
title: 'EPUB scene breaks: the blank line that does not survive'
excerpt: 'Scene breaks typed as blank lines vanish in EPUB conversion — converters drop empty paragraphs. What survives instead, proven on one story three ways.'
category: 'Typesetting'
ogImage: '/blog-og/epub-scene-breaks.png'
date: 2026-11-06
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - markdown-to-epub
  - txt-to-epub
  - docx-to-epub
faqs:
  - q: 'Do extra blank lines do anything in an EPUB?'
    a: 'No. Blank lines are how source formats separate paragraphs, not content in their own right. A converter reads one blank line and four blank lines as the same thing — a paragraph boundary — so the extra space you typed as a scene break produces nothing in the output file.'
  - q: 'What is the best scene break symbol for an ebook?'
    a: 'Any short run of visible characters on its own line survives conversion, because it is text rather than spacing. Three asterisks is the common convention — typesetters call the ornament a dinkus — and in Markdown that exact line is promoted to a real hr element rather than kept as punctuation.'
  - q: 'Does an empty paragraph work as a scene break in a Word manuscript?'
    a: 'Not reliably. We converted a Word file with an empty paragraph between two scenes and the converter dropped it entirely — the scenes fused with nothing between them. The underlying library discards empty paragraphs by default, and other conversion pipelines treat them the same way. Put visible characters in the separator paragraph instead.'
  - q: 'What is the hr element for in an ebook?'
    a: 'The HTML standard defines hr as a paragraph-level thematic break and gives a scene change in a story as its first example. It is the one piece of markup whose official job is exactly this, which is why it survives restyling and font changes that wipe out spacing tricks.'
  - q: 'Will scene breaks survive converting an EPUB back to Word or text?'
    a: 'Character separators will; structural ones may not. When we converted an EPUB whose breaks were hr elements back to plain text, both rules disappeared, because text extractors keep what has words in it. A line of asterisks is words, as far as an extractor is concerned, so it comes through.'
draft: false
---

Between two scenes of a chapter there is supposed to be a gap — a pause the
reader can feel. In print it is a deeper blank or a small centred ornament.
In a manuscript it is usually an extra press of the Enter key. And in thread
after thread on MobileRead, on the Scrivener forum at Literature &amp; Latte,
on Storyist's boards, the same discovery is reported: convert the book to
EPUB and the gap is gone. The scenes run together as if the author never
paused at all. EPUB scene breaks fail quietly like this because of what a
blank line actually is to a converter — and the fix is to stop encoding a
pause as empty space.

<div class="callout">
<div class="callout-kicker">The short answer</div>
A scene break made of <strong>blank lines or empty paragraphs is
spacing</strong>, and conversion pipelines treat spacing as a paragraph
boundary, not as content — one blank line and four are the same boundary.
A separator made of <strong>visible characters</strong> (the classic
<code>* * *</code>) is content and survives everything. In Markdown,
<code>***</code> on its own line becomes a real <code>&lt;hr/&gt;</code> —
the markup whose official job is a scene change.
</div>

## Three depths a scene break can live at

Strip any ebook down and a scene break turns out to be stored one of three
ways.

**As whitespace.** Extra blank lines in plain text, an empty paragraph in
Word, a bottom margin in CSS. Nothing is *there* — the break exists only as
distance between things.

**As characters.** A line containing `* * *`, `~ ~ ~`, `• • •` or any other
short ornament. The break is text, carried in the file like every other
sentence.

**As markup.** An `<hr/>` element between paragraphs. The [HTML
standard](https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element)
defines `hr` as "a paragraph-level thematic break, e.g., a scene change in a
story" — and its example for the element is a passage from a printed novel
where the scene change appears as "a gap containing a solitary centered
star". This is not a repurposed element; a scene break is literally what it
is for.

Conversion is where the first kind dies. A converter reading plain text or a
Word document has one job to do with whitespace: find the paragraph
boundaries. One blank line separates two paragraphs. Four blank lines also
separate two paragraphs — there is no "wider boundary" in the model, so the
extra three carry no information and are consumed without a trace. The pause
you typed was never data. It was formatting that only your eyes ever parsed.

## One story, converted three ways

We wrote a short scene-break torture test — a 700-byte story, two scene
changes — and pushed it through three of our converters live, then opened
the chapter files the tools actually produced.

**Plain text, breaks as blank lines and as asterisks.** `scenes.txt` marks
its first scene change with a triple blank line and its second with `* * *`
on its own line. Our [TXT to EPUB converter](/txt-to-epub) turned it into a
2,999-byte EPUB, and the chapter file tells the whole story:

```html
<p>At the top, the lamp was already warm. She logged the wind
speed, the visibility, the one trawler sitting out past the shoals.</p>
<p>The storm arrived at four in the morning without introduction.
Rain went through the beam sideways, like static across a screen.</p>
...
<p>* * *</p>
```

The triple blank line is simply gone — the last paragraph of scene one and
the first of scene two sit adjacent, indistinguishable from any other pair
of paragraphs. The `* * *` line, being characters, came through as a
paragraph of its own. That is the importer working as built: it splits on
blank-line runs and keeps what has text in it, so the width of a gap can
never survive.

**Markdown, breaks as `***`.** The same story as `scenes.md`, scene changes
written as `***` — which the [CommonMark
spec](https://spec.commonmark.org/0.31.2/#thematic-breaks) defines as a
thematic break: a line of three or more matching `*`, `-` or `_` characters.
Our Markdown converter produced a 2,974-byte EPUB whose chapter contains,
at both scene changes:

```html
<p>At the top, the lamp was already warm. ...</p>
<hr />
<p>The storm arrived at four in the morning without introduction. ...</p>
```

A real structural break, in the element the HTML standard reserves for scene
changes. This is the only input route of the three where the break arrives
as markup rather than as leftover punctuation.

**Word, breaks as an empty paragraph and as centred asterisks.** We built a
1,175-byte `scenes.docx` with one scene change as an empty paragraph and
another as a centre-aligned `* * *`. Through our [DOCX to EPUB
converter](/docx-to-epub): the empty paragraph vanished — the two scenes
fused, nothing between them. The library underneath (mammoth) drops empty
paragraphs by default, and that default is the common choice across
conversion tools, because manuscripts are full of stray empty paragraphs
that would otherwise become junk. The centred `* * *` survived as text but
lost its centring, since alignment was carried by Word styling that does not
make the trip.

Side by side, the difference is stark. Same story, same stylesheet — the
blank-line version shows a 0-pixel seam where the scene change was, the
Markdown version a visible rule:

<figure>
<img src="/blog-media/epub-scene-breaks/render-twin.png" alt="Two phone-width renders of the same story. Left, labelled 'scenes.txt → EPUB — blank-line scene break': paragraphs run continuously with no gap where the scene change was, and a '* * *' line sits lower down. Right, labelled 'scenes.md → EPUB — *** became <hr/>': two horizontal rules visibly separate the three scenes." width="816" loading="lazy" />
<figcaption>Both chapter files rendered with the EPUB's own stylesheet. In the blank-line book the scene boundary measures 0&nbsp;px — the storm paragraph follows its neighbour like any other. The Markdown book carries a real rule at each break.</figcaption>
</figure>

<figure>
<img src="/blog-media/epub-scene-breaks/txt-to-epub-done.png" alt="The converter's done panel: a pink check mark above 'Your EPUB is ready' and the line 'scenes.epub · 3 KB · never left your device', with styling and download buttons below." width="762" loading="lazy" />
<figcaption>The live /txt-to-epub run on scenes.txt that produced the blank-line book — 700 bytes in, 2,999 bytes out.</figcaption>
</figure>

## They vanish on the way out, too

The trap has a second jaw. Take the Markdown-made EPUB — the one with
correct `<hr/>` breaks — and convert it back to plain text with our own
tool. The 728-byte output contains every paragraph of the story and
*neither* scene break. Our extractor walks the chapter and keeps blocks that
contain text; an `<hr/>` has no text, so it is skipped. The same shared
extractor feeds our TXT, Word and PDF outputs, so the loss is consistent
across all three.

We report that as a limitation of our own converters, but it is also the
general shape of the problem: text extraction keeps words, and a structural
break has none. Professionally produced EPUBs that encode scene breaks as a
styled empty paragraph or a CSS margin lose them the same way the moment the
book is converted, reflowed by an aggressive reading app, or run through any
pipeline that rebuilds the text. Of the three depths, only characters are
indestructible — which is precisely why the humble asterisk line has
outlived every cleverer scheme.

## Making a break that survives

The rule that falls out of the experiment is one sentence: **encode the
pause as something, not as nothing.**

Writing in plain text, put a visible separator on its own line — `* * *` or
any short ornament — and never rely on extra Enter presses. Writing in
Markdown, type `***` alone on a line and you get the real thing, an
`<hr/>`, promoted for free. Writing in Word, the separator paragraph must
contain visible characters; an empty "spacer" paragraph is exactly what
converters are built to throw away. There is a quiet accessibility argument
for the markup version as well: `<hr/>` is a semantic break, something
assistive technology can present as one, where three asterisks are just
three pieces of punctuation in the text stream.

Being realistic about the limits: a character separator is a plain paragraph,
so it inherits paragraph styling — in our own stylesheet the paragraph
*after* a break still takes a first-line indent, where [chapter-opening
convention](/ebook-chapter-openings) says a paragraph following a scene
break should start flush. And one trap from the other direction: a "blank"
line that secretly contains a single space becomes a real empty-looking
paragraph in the output, with knock-on indent effects we traced in [the
paragraph-indents post](/epub-paragraph-indents). Neither spoils the book.
Losing every scene boundary does.

The five-minute check is the same experiment this post ran. Convert your
manuscript with the [Markdown to EPUB converter](/markdown-to-epub) — or the
TXT or DOCX one, whichever matches your source — then open the result and
read across your first scene change. If the pause is still there, it will
still be there after every reader app, font change and restyle between you
and your reader. Everything runs in your browser; the manuscript never
leaves your machine.

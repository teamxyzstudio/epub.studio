---
title: 'Poetry in EPUB: how to keep your line breaks'
excerpt: 'Poetry in EPUB lives or dies at the line break. We ran one poem through three converters to see which breaks survive — and how to keep stanzas intact.'
category: 'Typesetting'
ogImage: '/blog-og/poetry-in-epub.png'
date: 2026-10-03
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - markdown-to-epub
  - docx-to-epub
  - txt-to-epub
howToTitle: 'How to convert poetry to EPUB without losing the lines'
howTo:
  - t: 'Mark the two kinds of break in the source'
    d: 'Inside a stanza, use a forced line break — Shift+Enter in Word, a backslash or two trailing spaces at the end of the line in Markdown. Between stanzas, use an ordinary paragraph break.'
  - t: 'Convert through a route that carries forced breaks'
    d: 'Drop the file on the DOCX or Markdown converter. Both write each stanza as one paragraph with real break tags inside it. Never paste a poem into a .txt file first.'
  - t: 'Switch the book to block paragraphs'
    d: 'Open the converted EPUB in Style Studio and pick the Modern preset. Stanza gaps come back, the first-line indents go, and the text aligns left instead of justified.'
  - t: 'Check it at phone width'
    d: 'Read the book in a narrow window. Short-lined verse will sit one line per line; long lines will wrap, and if the wrap is confusing the book needs hanging indents from a hand editor.'
faqs:
  - q: 'Why did my poem turn into a block of prose after converting it?'
    a: 'The converter threw the line breaks away. A plain-text converter has to guess what a newline means, and the safe guess for prose — fold single newlines into spaces, keep blank lines as paragraph breaks — is exactly wrong for verse. Every line ending inside a stanza vanishes, and the stanza comes out as one run-together paragraph.'
  - q: 'What is the difference between Enter and Shift+Enter for poetry in Word?'
    a: 'Enter starts a new paragraph element; Shift+Enter puts a forced line break inside the current one. For verse that distinction is the whole game: lines made with Enter are separate paragraphs, so paragraph styling — gaps, first-line indents — lands on every single line. Shift+Enter inside the stanza and Enter between stanzas keeps the structure the poem actually has.'
  - q: 'Why did my stanza gaps disappear in the converted book?'
    a: 'Because the book''s stylesheet uses the prose convention: no space between paragraphs, a first-line indent instead. Each stanza arrives as one paragraph, so the gaps between them are closed up and the second stanza onward gets an indent. The markup is fine — restyling the book to block paragraphs brings every gap back.'
  - q: 'Do EPUB readers support hanging indents for poetry?'
    a: 'Yes — it is ordinary CSS, and reading apps render it. The catch is markup: a hanging indent can only distinguish a wrapped line from a deliberate one if each verse line is its own paragraph or div. A stanza built with break tags inside one paragraph cannot be styled that way, which is why hand-tooled poetry EPUBs mark up line-per-element.'
  - q: 'Should poetry be a reflowable EPUB at all, or a PDF?'
    a: 'For most lyric poetry, reflowable EPUB is fine once the breaks are marked properly — readers can resize text and the lines hold. For concrete and visual poetry, where the position of words on the page is the poem, reflow has nothing to offer: a PDF or fixed-layout edition preserves the geometry, at the cost of font scaling and comfortable phone reading.'
draft: false
---

A poet converts a manuscript to EPUB, opens the result, and finds the stanzas gone — twenty lines of carefully broken verse re-set as one justified paragraph of prose. This complaint keeps resurfacing on MobileRead and in Adobe's InDesign forum, usually phrased the same way: the export "removed my line breaks", and nobody in the thread can quite agree on where they went.

Poetry in EPUB fails in a specific, mechanical place: the line break. Prose gives a reflowable format permission to break lines wherever the screen demands. A poem does not — the line ending is part of the composition. So every step between your manuscript and a reader's phone has to answer the same question: is this newline a wish or an instruction?

We ran one poem — Blake's "The Tyger", two stanzas of it — through our own converters to see exactly where the instruction gets lost, and what carries it through.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Mark line breaks as <strong>forced breaks</strong> in the source — Shift+Enter in Word, a backslash at the line end in Markdown — and keep ordinary paragraph breaks for stanza gaps. Convert through the DOCX or Markdown route, never plain text, then restyle the book to block paragraphs. Long-lined verse additionally needs hanging indents, which is hand-editor territory.
</div>

## A line break is data, and plain text throws it away

Verse uses white space at three scales: the line ending inside a stanza, the gap between stanzas, and the page break before the next poem. HTML — which is what an EPUB's pages are made of — has a distinct home for each: a break tag inside a paragraph, a new paragraph element, a new chapter file. Get the mapping right and the structure survives any screen. Get it wrong and the poem is reformatted at the first reflow.

Plain text is where it goes wrong most reliably, because a .txt file cannot say which of its newlines are deliberate. A converter has to guess, and the sane guess is prose: fold single newlines into spaces, treat blank lines as paragraph breaks. Ours does exactly this — the source replaces every newline inside a block with a space before it ever builds a page. Our 259-byte tyger.txt came back as a 2,731-byte EPUB whose first chapter reads:

```html
<p>Tyger Tyger, burning bright, In the forests of the night;
What immortal hand or eye, Could frame thy fearful symmetry?</p>
```

One paragraph. Four lines of Blake, folded flat. At a 360&nbsp;px viewport the stanza renders as three justified prose lines — the poem's own four-line shape is simply gone:

<figure>
<img src="/blog-media/poetry-in-epub/prose-blob-360px.png" alt="A 360-pixel browser pane headed 'THE TYGER' showing the poem's two stanzas re-set as two justified prose paragraphs, each three lines long, with the second paragraph indented like body text." width="360" loading="lazy" />
<figcaption>tyger.txt through the plain-text converter, rendered at 360 px: each four-line stanza has become a three-line prose paragraph.</figcaption>
</figure>

This is not a defect of the one tool. It is what any text-to-EPUB conversion must do, because the information was never in the file. The fix is upstream: use a source format that can mark a break as deliberate.

## Three routes in, one poem: what survives each converter

We converted the same two stanzas three ways through the live tools and unzipped each result. The difference is binary — a route either carries forced breaks or it does not:

| Route | Line markup in the source | What came out |
|---|---|---|
| .txt → [plain-text converter](/txt-to-epub) | Bare newlines | Folded into spaces — stanzas become prose |
| .md → Markdown converter | Backslash (or two spaces) at line end | `<br />` after every line — all four breaks kept |
| .docx → [Word converter](/docx-to-epub) | Shift+Enter inside the stanza | `<br />` after every line — all four breaks kept |

The Markdown route (267 B in, 2,724 B out) and the DOCX route (1,389 B in, 2,723 B out) produced the same chapter markup, byte-noise aside:

```html
<p>Tyger Tyger, burning bright,<br />In the forests of the night;<br />
What immortal hand or eye,<br />Could frame thy fearful symmetry?</p>
```

One paragraph per stanza, a break tag per line: the structure the poem actually has.

The near-miss is worth naming, because it looks like it works. Lines made with plain Enter in Word arrive as separate paragraph elements — we ran that version too, and got `<p>` per line. The lines hold, but now every line is a paragraph: under a prose stylesheet each one takes a first-line indent, under block styling each one takes a stanza-sized gap, and the real stanza boundaries are indistinguishable from the rest. Shift+Enter inside the stanza, Enter between stanzas — that is the entire discipline, and it costs nothing at writing time. In Markdown the equivalent is a backslash or two trailing spaces at the end of each verse line, with blank lines only between stanzas.

## Stanza gaps are a stylesheet decision, not a markup one

Convert the Markdown version and the lines are safe — but the result still does not look like a poetry page. Converted books ship with a prose stylesheet: justified text, no space between paragraphs, a first-line indent on every paragraph after the first. Applied to verse, that closes the stanza gap and indents the second stanza's opening line as if it were a continuing paragraph.

The markup does not need touching; the stylesheet does. We opened the converted file in [Style Studio](/style-studio) and picked the Modern preset — left-aligned, block paragraphs:

<figure>
<img src="/blog-media/poetry-in-epub/style-studio-modern.png" alt="Style Studio with 'tyger-from-md.epub → the-tyger.epub' in the header, the Modern preset selected among Classic novel, Compact, Airy and Accessible, a live preview of the poem's chapter, and a pink button reading 'Download ready ✓ the-tyger.epub · 3 KB'." width="760" loading="lazy" />
<figcaption>The live Style Studio run on the converted poem: Modern preset selected, restyled download ready at 3 KB.</figcaption>
</figure>

The downloaded book carries a new stylesheet whose paragraph rule is `margin:0 0 1em; text-indent:0` with the body set left instead of justified. Same chapter file, same break tags — and at 360&nbsp;px the poem now renders one line per line, with a clean gap between stanzas:

<figure>
<img src="/blog-media/poetry-in-epub/verse-kept-360px.png" alt="A 360-pixel browser pane headed 'The Tyger' showing the poem as eight left-aligned verse lines in two four-line stanzas separated by a blank line, with no first-line indents." width="360" loading="lazy" />
<figcaption>The same book after the Style Studio pass: four lines per stanza, stanza gap restored, flush left.</figcaption>
</figure>

One honesty note from the run: Style Studio's live preview pane flattens forced breaks, so the poem looks run-together while you style it. The saved file is what counts — we unzipped the 3,361-byte download and the `<br />` tags are all present.

## Long lines wrap — and the page has to say which breaks are yours

Short-lined verse is now solved. Long-lined verse has one problem left. Set Whitman at phone width and his third line cannot fit, so it wraps:

<figure>
<img src="/blog-media/poetry-in-epub/wrap-ambiguity-360px.png" alt="A 360-pixel pane headed 'Song of Myself (opening)' with justified verse: the wrapped fragment 'to you.' sits flush left exactly like a deliberate line, and the line 'I loafe and invite my soul,' carries a first-line indent." width="360" loading="lazy" />
<figcaption>Whitman at 360 px under the default prose stylesheet: the wrap "to you." is indistinguishable from a deliberate line break.</figcaption>
</figure>

The fragment "to you." starts at the left margin looking exactly like a line Whitman wrote. Print poetry solved this centuries ago with the hanging indent: deliberate lines start at the margin, wrapped continuations are pushed in, and the eye never confuses the two.

<figure>
<img src="/blog-media/poetry-in-epub/hanging-indent-360px.png" alt="The same 360-pixel Whitman page set with hanging indents: all five verse lines start flush left, and the wrapped continuations 'to you.' and 'summer grass.' are indented inward beneath their lines." width="360" loading="lazy" />
<figcaption>The same lines with line-per-paragraph markup and a hanging indent: deliberate breaks flush left, wraps indented. This is the convention a hand-tooled poetry EPUB uses.</figcaption>
</figure>

Here is the honest limit: no converter on this site will produce that page, and we are not going to pretend otherwise. The CSS is trivial — a negative `text-indent` against a matching `padding-left` — but it only works when each verse line is its own paragraph or div, because a first-line indent cannot tell a wrapped line from a line after a `<br>` inside the same paragraph. We tried; the indent lands on every line after the first, deliberate or not. Line-per-element poetry markup is a hand job in an editor like Sigil or Calibre, and our conversion pipeline strips custom classes and inline styles for safety, so it cannot carry that styling through even if your source had it. If your lines are short — most rhymed and metred verse never wraps on a phone — you do not need any of this. If you write long-lined free verse, budget for the hand pass.

## Setting up a whole collection

The route that worked, start to finish: mark breaks properly in the source (Shift+Enter or Markdown's backslash inside stanzas, paragraph breaks between them), convert through the [Markdown converter](/markdown-to-epub) or its DOCX sibling, restyle to block paragraphs in Style Studio, and read the result at phone width before calling it done. A heading per poem gives you a chapter per poem and a table of contents for free — our test files used a single `#` title and came out as one-chapter books with that title in the navigation.

What this route will not give you: hanging indents for long lines, per-poem custom styling, or anything for visual poetry, where word placement is the art — that is fixed-layout or PDF territory, honestly a different product. For the common case — a collection of short-lined poems that should survive a reader changing the font size — the breaks carry through, and the file proves it when you unzip it. For a deeper look at the page itself once the lines hold, [line spacing and line length](/blog/ebook-line-spacing-and-line-length) do more for verse than any ornament.

---
title: 'EPUB paragraph indents: the tab you typed isn''t the indent'
excerpt: 'EPUB paragraph indents vanish, double up or refuse to leave because an indent is not a character but a stylesheet rule. We fed a converter every kind.'
category: 'Fix it'
ogImage: '/blog-og/epub-paragraph-indents.png'
date: 2026-10-16
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - style-studio
  - txt-to-epub
  - docx-to-epub
howToTitle: 'How to fix paragraph indents in an EPUB'
howTo:
  - t: 'Open the book in Style Studio'
    d: 'Drop the EPUB on the page. The preview is your actual book rendered in your browser — nothing uploads.'
  - t: 'Pick First-line indent or Space between'
    d: 'The paragraph-style toggle writes one convention for the whole book, and the slider under it sets the depth or the gap.'
  - t: 'Download and check a middle chapter'
    d: 'The download rewrites which stylesheet the chapters point at. Open a chapter past the first and confirm every paragraph follows your choice.'
faqs:
  - q: 'Why does my converted EPUB have indents when my manuscript used blank lines?'
    a: 'Because the converter''s stylesheet applies its own house convention. The EPUB we produced in testing ships a rule that indents every paragraph 1.2em except ones that open a section, regardless of what the source file did. Your blank lines decide where paragraphs break, not how they look on screen.'
  - q: 'Do tab characters work in EPUB files?'
    a: 'No. A tab can survive conversion as a byte in the markup — our DOCX test kept it — but rendering collapses leading whitespace to nothing, so it never shows. The only indent a reading system honours is one set as a style rule, which is why editing characters cannot fix an indent problem.'
  - q: 'How do I remove the indent from the first paragraph of a chapter?'
    a: 'Usually you don''t have to: the common stylesheet pattern zeroes the indent on any paragraph that directly follows a heading, so it is already flush. If your book indents it anyway, the book''s stylesheet lacks that rule, and the fix is a style-level restyle rather than deleting anything in the text.'
  - q: 'Why did my chapter become one giant paragraph after converting a .txt file?'
    a: 'Because the text used single line breaks between paragraphs, typewriter style. A plain-text converter folds single newlines into spaces and treats a blank line as the only paragraph signal, so a tab-indented manuscript with no blank lines collapses into one block. Put an empty line between paragraphs and convert again.'
  - q: 'Can I just change the indents in my reading app''s settings?'
    a: 'Usually not. App settings cover what the app considers reader preferences — type size, margins, line spacing — while paragraph style is treated as part of the book''s own design, carried in its stylesheet. Some apps can force their own styles over the book''s, but the setting that reliably works everywhere is changing the file itself.'
draft: false
---

The complaint arrives in two opposite forms, and has for years. On the Literature & Latte forum, a Scrivener user compiles an EPUB and cannot get rid of the first-line indents, whatever boxes they untick. In Adobe's InDesign community, a designer's carefully set first-line indents export to EPUB and vanish. MobileRead has threads in both directions going back to 2009. EPUB paragraph indents behave as if nobody is steering — and the reason is that most people are steering the wrong thing.

The Tab key is the wrong thing. So are typed spaces, and so — more surprisingly — is the indent field in your word processor's paragraph dialog. We fed all three to our own converters this run and watched what each became.

<div class="callout">
<div class="callout-kicker">The short answer</div>
In an EPUB, an indent is not a character in the text — it is a CSS rule in the book's stylesheet, almost always <code>text-indent</code> on paragraphs. Conversion discards or ignores whitespace indents and substitutes the stylesheet's own convention. <strong>To change the indents, change the stylesheet</strong>, not the characters.
</div>

## An indent is not a character

An EPUB chapter is an XHTML file, and XHTML renders under CSS's white-space rules. The default behaviour is defined in one blunt sentence in the [CSS Text specification](https://github.com/w3c/csswg-drafts/blob/main/css-text-4/Overview.bs): collapse "sequences of white space into a single character". A tab at the start of a paragraph, four spaces, one space — the rendering engine flattens them all the same way, and leading whitespace at a paragraph's start renders as nothing at all.

So the only first-line indent a reading system will actually draw is the one declared in CSS: `text-indent` on the paragraph. Whoever controls the stylesheet controls the indents. In a converted book, that is the converter — not you.

## Four kinds of indent walk into a converter

We built two small files to prove it, each carrying every way a person makes an indent.

The first was `indents.txt`, 380 bytes: one paragraph starting with a real tab (byte 0x09 — we checked the hex dump), one starting with four typed spaces, one flush-left control. Dropped on the live [plain-text converter](/txt-to-epub), it became a 2,796-byte EPUB whose chapter markup reads:

```html
<p>This paragraph begins with a tab character, …</p>
<p>This paragraph begins with four typed spaces …</p>
<p>This control paragraph has no indent at all. …</p>
```

Both indents are simply gone. The converter folds line breaks and trims each paragraph's edges before writing markup, so a whitespace indent never even reaches the book.

<figure>
<img src="/blog-media/epub-paragraph-indents/txt-done.png" alt="The epub.studio converter's done panel: a pink check mark, the heading 'Your EPUB is ready', the line 'indents.epub · 3 KB · never left your device', a Style it before downloading button and a Download without styling button." width="760" loading="lazy" />
<figcaption>The live run: indents.txt (380 bytes — one tab indent, one space indent, one control) → indents.epub, 2,796 bytes. Every whitespace indent stripped.</figcaption>
</figure>

The second file was `indents.docx`, 2,125 bytes, hand-built so we knew exactly what was inside: a paragraph with a proper first-line indent set in the paragraph format (`w:ind firstLine="480"` — the dialog-box route), a paragraph starting with a pressed Tab (`w:tab`), a paragraph starting with typed spaces, and a flush control. Through the live [Word converter](/docx-to-epub), the result inverts your expectations:

```html
<p>Paragraph one carries a proper first-line indent …</p>
<p>	Paragraph two begins with a pressed Tab key: …</p>
<p>    Paragraph three begins with four typed spaces, …</p>
```

The style-level indent — the one set the "right" way — was dropped entirely. The conversion library underneath, [mammoth](https://github.com/mwilliamson/mammoth.js), states its design plainly: it produces clean HTML "by using semantic information in the document" rather than copying the styling, and an indent depth is styling. Meanwhile the tab and the spaces *survived into the markup as characters* — and still render as nothing, because of the collapsing rule above. The indent made properly dies at conversion; the indents made "wrongly" survive as invisible bytes.

| How the indent was made | In the converted markup | On screen |
|---|---|---|
| Paragraph dialog (`w:ind`) | dropped | the stylesheet's indent |
| Pressed Tab | kept as a character | the stylesheet's indent |
| Typed spaces | kept as characters | the stylesheet's indent |
| Nothing (control) | — | the stylesheet's indent |

One worse case deserves a line. A typewriter-style manuscript — tab indents, single returns between paragraphs, no blank lines — went through the same text converter and came out as **one single paragraph**: 306 bytes in, three paragraphs flattened into one `<p>`. A blank line is the only paragraph signal a plain-text converter trusts; the tab did not just lose its indent, it took the paragraph breaks with it.

## Where the indents you see actually come from

Open the stylesheet our converted book ships and the whole mystery is two lines:

```css
p{margin:0;text-indent:1.2em}
p:first-of-type,h1+p,h2+p,h3+p,blockquote p{text-indent:0}
```

Every paragraph gets a 1.2em first-line indent; any paragraph that opens a section — first in the file, or straight after a heading or block quote — gets none. That is the classic book convention, applied wholesale, whatever your source file did.

We rendered the converted DOCX chapter at a 360px phone width and measured where each paragraph's first character actually lands. The paragraph whose author set a deliberate half-centimetre indent: **0px** — it sits right after the heading, so the zero rule catches it. The tab paragraph, the spaces paragraph and the flush control: **19.2px each**, which is exactly 1.2em at 16px type. Four paragraphs, four different author intentions, one stylesheet verdict.

<figure>
<img src="/blog-media/epub-paragraph-indents/render-360.png" alt="A converted chapter titled 'The indent test' rendered at phone width. The first paragraph is flush left. Paragraphs two, three and four each begin with the same small indent — including the last one, whose own text says it is the control, flush left, with no indent of any kind." width="360" loading="lazy" />
<figcaption>The converted DOCX chapter at 360px. The deliberately indented paragraph renders flush; the paragraph that declares itself "flush left, no indent of any kind" renders indented. The stylesheet outranks the text.</figcaption>
</figure>

And when a book's stylesheet says nothing about indents at all? Then the reading system's own default stylesheet decides — which is why the same EPUB can show indents in one app and block paragraphs in another. The file left the question open, and each renderer answers it differently.

## Why deleting things doesn't fix it

Both halves of the forum complaint now explain themselves.

The vanishing direction: your tabs, spaces and dialog-box indents never make it into the rendered page, so a book converted from a carefully indented manuscript shows the converter's convention instead — or, with no stylesheet rule, whatever the app's default is.

The stuck direction: deleting tabs and spaces from the source changes nothing, because they were never rendering in the first place. Unticking the indent option and reconverting changes nothing, because the converter's stylesheet re-applies its own rule. And one subtle variant we can reconstruct from the rules above: a "blank" line that secretly contains a single space becomes a real, empty-looking paragraph in the output — and now *it* absorbs the after-a-break zero rule, so the visible paragraph below it indents when it shouldn't. Threads about indents mysteriously returning after scene breaks tend to be exactly this.

In every variant, the fix is the same place: the stylesheet.

## Set the convention once, at style level

We took the converted book straight into Style Studio, which exposes this exact choice as a toggle: **First-line indent** or **Space between**, with a slider for depth or gap. We flipped our test book to spaced paragraphs and downloaded. The 2,796-byte book came back at 3,519 bytes, its chapters now pointing at a generated stylesheet whose paragraph rule reads:

```css
p{margin:0 0 0.9em;text-indent:0}
```

Indents off, gaps on, one rule, whole book. Flip the toggle the other way and it writes `margin:0;text-indent:1.2em` instead — the depth slider sets the em value, and because it is in em it scales with the reader's chosen type size instead of fighting it.

<figure>
<img src="/blog-media/epub-paragraph-indents/studio-space-between.png" alt="Style Studio with out-txt.epub loaded, header reading 'out-txt.epub → indents.epub'. The live preview shows the test chapter's three paragraphs flush left with space between them, the first opening on a drop-cap T. The settings rail shows preset cards, EB Garamond selected under Typeface, and a pink button reading 'Download ready ✓ indents.epub · 3 KB'." width="760" loading="lazy" />
<figcaption>The live restyle: Space between selected, every paragraph flush left with a gap, download ready at 3 KB. The choice is written into the book's stylesheet on download.</figcaption>
</figure>

Two honest notes on what the restyle does and doesn't do. The original converter stylesheet stays in the archive, orphaned — 452 bytes of dead weight, harmless, but there. And the studio's own panel says the other truth out loud: these settings become the book's default look, and reading apps may still let readers override them. That is the correct hierarchy for a reflowable format — the book proposes, the reader disposes — and it is the same reason your tab never stood a chance.

Which convention to pick, and what a chapter's opening paragraph should do, is a typesetting question rather than a repair question — our [chapter openings](/blog/ebook-chapter-openings) post covers it. For the repair itself: convert with blank lines between paragraphs, stop typing tabs, and when a finished book indents wrongly, drop it on [Style Studio](/style-studio) and set the rule every paragraph will actually obey.

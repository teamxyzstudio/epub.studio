---
title: 'EPUB italics lost: the span that forgot it was italic'
excerpt: 'EPUB italics lost after conversion? Emphasis survives only when it is marked as meaning, not styling. One sentence, four kinds of italic, two dead on arrival.'
category: 'Fix it'
ogImage: '/blog-og/epub-italics-lost.png'
date: 2026-11-07
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - docx-to-epub
  - html-to-epub
  - fb2-to-epub
  - epub-validator
howToTitle: 'How to get italics through a conversion intact'
howTo:
  - t: 'Find out how the italics are written'
    d: 'Open the source file — or unzip the EPUB and read a chapter — and look at an italic phrase. An em or i tag is meaning; a span with a class or a style attribute is styling; plain text, PDF and FB2 routes may have no italics to find at all.'
  - t: 'Turn styling into meaning'
    d: 'Rewrite span-based italics as em or i in the source, and in Word apply italics directly with the I button rather than through decoration a converter cannot see.'
  - t: 'Reconvert and spot-check a line you know'
    d: 'Convert again and open the output at a sentence that should be italic. If it stands upright, the markup still is not semantic — the validator will not tell you, so your eyes have to.'
faqs:
  - q: 'Why did my italics disappear after converting to EPUB?'
    a: 'Almost always because they were written as styling rather than meaning. Italics carried by a span with a CSS class or a style attribute depend on a stylesheet that conversion drops or rewrites, so the slant vanishes while the words survive. Italics marked with em or i tags travel inside the text itself and come through conversion untouched.'
  - q: 'Do italics survive converting a Word document to EPUB?'
    a: 'Italics applied directly with the I button do: the converter here wraps them in em tags, which is mammoth''s documented default, and our test run shows the italic word arriving intact. Decoration that lives outside the run — in fonts, themes, or styling a converter does not read — is the kind that gets lost.'
  - q: 'Why does the EPUB validator say my book is fine when the italics are gone?'
    a: 'Because the book is fine, structurally. A validator checks the container, the manifest and the files against the packaging rules; it has no record of what the source looked like, so text that lost its slant is indistinguishable from text that never had one. No validation step will ever catch missing italics — only reading a known line will.'
  - q: 'Is bold lost the same way as italics?'
    a: 'Yes — the mechanism is identical. Bold marked as strong or b is part of the text and survives; bold carried by a classed span dies with the stylesheet. In our FB2 test the strong word was flattened to plain text by the same code path that erased the emphasis, so the two failures travel together.'
  - q: 'My italics show in one app but not on my e-reader — is that this problem?'
    a: 'Probably not. If the italics exist in the file but render upright on one device, that is a rendering problem — typically a single-weight embedded font being asked to fake a slant, or a reader setting overriding the book. The loss described here happens earlier, during conversion, and shows upright text everywhere you open the file.'
draft: false
---

Somewhere between the file you had and the EPUB you made, every italic phrase stood up straight. The words are all there — titles, foreign phrases, that one emphasised *no* the scene depends on — but the slant is gone, and nothing reported an error. EPUB italics lost in conversion is a complaint with well over a decade of history on MobileRead, and the threads keep circling the same discovery: the italics that die were never really italics. They were styling that happened to look like italics.

That distinction sounds pedantic until you watch it decide which words survive. So we made it visible: one sentence, written four ways, through our own converter.

## Italics are written three ways, and only one is portable

HTML — and therefore EPUB, whose chapters are XHTML — has two text-level elements for this job. The HTML specification defines [`em` as stress emphasis and `i` as an alternate voice or mood](https://html.spec.whatwg.org/multipage/text-level-semantics.html) — a technical term, a phrase from another language, "a ship name in Western texts". Both carry the italic *inside the text itself*. Wherever the paragraph goes, the tag goes.

The second way is styling: a `<span class="it">` plus a stylesheet rule, or a `style="font-style:italic"` attribute. The text and its slant now live in two different places — the words in the markup, the meaning in a stylesheet or an attribute. Word processors, export pipelines and old typesetting systems produce this constantly, and it renders identically. Right up until something separates the two.

The third way is no way at all. Plain text has no italics channel — there is nothing in a `.txt` file that can say *this word slants*. Text extracted from a PDF comes out as positioned glyph runs, not markup. And a converter that reads only the words of a paragraph, as one of ours does with FB2, flattens everything to the third kind without meaning to.

A conversion is exactly the kind of event that separates text from styling. Here is the proof.

## One sentence, four italics, one converter

We built a five-paragraph HTML file, `italics.html` (602 bytes), in which four ships each get italicised a different way: the *Erebus* with `<em>`, the *Terror* with `<i>`, the *Resolution* with a classed span backed by a stylesheet rule, and the *Discovery* with an inline `style` attribute. In Chromium, all four render identically italic.

Then we dropped it on our live [HTML to EPUB converter](/html-to-epub). It produced `italics.epub`, 2,755 bytes, no warnings. The chapter inside reads:

```html
<p>The ship was called the <em>Erebus</em>, marked with an em tag.</p>
<p>The ship was called the <i>Terror</i>, marked with an i tag.</p>
<p>The ship was called the <span>Resolution</span>, italicised by
   a classed span and a stylesheet rule.</p>
<p>The ship was called the <span>Discovery</span>, italicised by
   an inline style attribute.</p>
```

The `em` and `i` came through. Both spans are still there — but naked. The converter's sanitiser strips `class` and `style` attributes from every element, and removes `<style>` blocks entirely, because arbitrary source CSS breaks more EPUBs than it decorates. That is our own code doing exactly what the old MobileRead threads describe other tools doing: the *Resolution* and the *Discovery* sailed in italic and arrived upright.

<figure>
<img src="/blog-media/epub-italics-lost/render-twin.png" alt="Two browser panels side by side. Left: italics.html rendered in Chromium with four ship names — Erebus, Terror, Resolution, Discovery — all italic. Right: chapter-001.xhtml after conversion, where Erebus and Terror are italic but Resolution and Discovery stand upright." />
<figcaption>The same sentence four ways, before and after /html-to-epub. The em and i ships keep their slant; both span ships lose it.</figcaption>
</figure>

Computed-style probes confirm what the eye sees: in the source, all four inline elements report `font-style: italic`; in the converted chapter, the two spans report `normal`.

<figure>
<img src="/blog-media/epub-italics-lost/html-to-epub-done.png" alt="The html-to-epub tool's done panel reading: Your EPUB is ready, italics.epub, 3 KB, never left your device." />
<figcaption>The conversion itself reports success — italics.epub, 602 bytes in, 2,755 bytes out. Nothing in the pipeline knows two italics died.</figcaption>
</figure>

## The routes with no italics channel at all

The span case is a partial loss with a fix. Some routes lose emphasis wholesale, and our own tools demonstrate two of them.

FB2 marks emphasis semantically — `<emphasis>` is the format's own `em`. We hand-built a small FictionBook, `italics.fb2` (791 bytes, well-formed against the FB2 namespace), with one emphasised ship and one `<strong>` word, and ran it through the live [FB2 to EPUB converter](/fb2-to-epub). The output chapter contains:

```html
<p>The ship was called the Erebus, and she never came home.</p>
<p>A plain sentence follows, with one strong word for contrast.</p>
```

No `em`, no `strong` — plain text. The importer reads each paragraph with `textContent`, which returns the words and discards every tag inside them. The source marked its italics the *right* way and still lost them, because the converter flattened the markup. That is a fault in our code, not in FB2, and it is the same class of loss as plain text and PDF extraction: by the time the EPUB is built, there is nothing left to italicise.

The same flattening runs in the other direction. Our EPUB to DOCX and EPUB to TXT tools reduce each chapter to text blocks, so inline italics do not survive a round trip out of EPUB either — and EPUB to DOCX italicises entire blockquotes as a styling choice while dropping the real italics inside paragraphs. If you convert out of EPUB to edit and back again, your emphasis does not come along.

The honest summary of our own pipeline: italics survive HTML → EPUB and DOCX → EPUB when they are semantic, and nothing survives FB2, TXT, PDF or the EPUB-outbound routes. We found two of those failures by running the tests for this post.

## Nothing warns you, including the validator

We ran the italics-stripped `italics.epub` through the live [EPUB validator](/epub-validator): **"No problems found. This EPUB is structurally valid."**

<figure>
<img src="/blog-media/epub-italics-lost/validator-pass.png" alt="The EPUB validator report reading: This EPUB is valid. No problems found. This EPUB is structurally valid." />
<figcaption>The validator passes the book that lost half its italics — correctly. Structure is intact; meaning was never its department.</figcaption>
</figure>

That is not a validator bug. Validation checks packaging — the mimetype, the manifest, the container — against rules a file can break. "This word used to slant" is not a property of the file; it is a property of a source the validator never saw. Which is why this failure is so quiet: the converter succeeds, the validator passes, every app opens the book. The only test that catches lost italics is a human reading a line they know.

## Getting italics that survive

The fix follows from the mechanism: make the italics part of the text, not the decoration.

In HTML sources, that means `<em>` for emphasis and `<i>` for titles, terms and ship names — a find-and-replace on span-styled italics before converting is the whole repair. In Word, italics applied directly with the **I** button survive: mammoth, the engine inside our converter, [wraps italic runs in `em` tags by default](https://github.com/mwilliamson/mammoth.js#writing-style-maps), and our test docx came through with `<em>Erebus</em>` intact and the control sentence untouched. In Markdown, `*asterisks*` compile to `em` before the EPUB is ever built.

And if the italics are already gone, no tool resurrects them — the information left the file. Reconvert from the source that still has them, with the emphasis made semantic first. For a manuscript that lives in Word, the shortest safe path is direct italics and a straight run through the [DOCX to EPUB converter](/docx-to-epub): what is marked as meaning arrives as meaning, and this post is the test run that says so.

If instead your file *has* its italics and a particular device refuses to slant them, that is the other failure — a font being asked to fake a weight it does not carry — and it has [its own post](/blog/epub-embedded-fonts-not-working).

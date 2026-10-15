---
title: 'Math in EPUB: why equations vanish and how they survive'
excerpt: 'Math in EPUB fails three ways: converters drop equations, markup loses its namespace, readers skip MathML. We reproduced all three and show what survives.'
category: 'Typesetting'
ogImage: '/blog-og/math-in-epub.png'
date: 2026-10-15
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - docx-to-epub
  - html-to-epub
  - epub-validator
faqs:
  - q: 'How do I check whether my reading app supports MathML?'
    a: 'Open a book you know contains correct, namespaced MathML and look at an equation: a true stacked fraction means the renderer works, a flat run of characters means it does not. A browser is a useful reference point, since current engines render MathML Core natively. There is no reliable way to know without looking — even vendors that support the feature recommend testing per platform.'
  - q: 'Why did my equations disappear when I converted my Word document?'
    a: 'Word stores equations in its own markup, OMML, not MathML. Most converters translate the text of a document and skip markup they do not recognise, so the equation is dropped rather than translated — often silently. Our own converter does this too. The surviving paragraphs close up around the gap, which is why nothing looks obviously broken.'
  - q: 'Why does my equation show as a jumbled line of letters and numbers?'
    a: 'The markup survived but the reader is not treating it as MathML. That happens when the math element loses its namespace declaration in a conversion, or when the app has no MathML renderer. Either way the layout collapses and only the raw text content of the markup is shown, so a fraction like one half reads as 12.'
  - q: 'Should I use images instead of MathML for equations?'
    a: 'Images are the most compatible route: every reader that can show a picture shows the equation. The costs are real, though — an image ignores the reader''s font size, colour theme and dark mode, and a screen reader can only read what you put in the alt text. For heavy math aimed at unknown devices, images with careful alt text remain the pragmatic choice.'
  - q: 'What is the mathml property in the EPUB manifest?'
    a: 'It is a declaration, not a switch. A manifest item whose chapter contains MathML must carry properties="mathml" so reading systems know the feature is in use. The equation renders or fails regardless of it; what the property changes is validation, since EPUBCheck reports a missing declaration as OPF-014.'
draft: false
---

An author finishes a statistics workbook, exports it to EPUB, and the equations are gone. Not broken — gone, with the surrounding sentences flowing straight past where they used to be. A second author gets further: the math displays beautifully in one app and turns into a single jumbled line in another. Both land on the forums asking what EPUB has against mathematics. The question has been recurring on MobileRead for over a decade, and in Adobe's InDesign community wherever an export pipeline touches equations.

Math in EPUB is genuinely supported and genuinely fragile, and the two facts are not in contradiction. There are three separate points of failure, they produce confusingly similar symptoms, and a workbook can suffer all three at once. We reproduced each one this run — including, honestly, the two our own tools cause.

## One blank spot, three different failures

An equation that should be on the page but is not got lost in one of three places:

| Where it failed | What you see | Who is at fault |
|---|---|---|
| Conversion dropped it | Nothing — prose closes up around the gap | The converter |
| Markup lost its identity | A linear jumble: `x=−b±b2−4ac2a` | The converter, more subtly |
| Reader will not render it | Correct in one app, wrong in another | The reading app |

The repair is different in each case, so the first job is telling them apart. Working through how each failure happens is also the fastest way to see why the fixes look the way they do.

## What EPUB actually promises about math

The [EPUB 3.3 specification](https://www.w3.org/TR/epub-33/#sec-xhtml-mathml) is unambiguous: XHTML content documents support embedded MathML, restricted to Presentation MathML — the subset that describes how an equation looks rather than what it means. A chapter that contains math must also declare it, with `properties="mathml"` on its manifest entry.

So we built one. This run's fixture, mathbook.epub — 1,711 bytes, one chapter, the quadratic formula in namespaced MathML plus an inline ½ in a sentence — opened headless in Chromium this run:

<figure>
<img src="/blog-media/math-in-epub/mathml-render.png" alt="A rendered EPUB chapter titled 'The equation chapter'. The quadratic formula appears as real typeset math: x equals a full fraction with minus b plus-or-minus a square root of b squared minus 4ac over 2a. Below it, a sentence contains a properly stacked one-half fraction." width="760" loading="lazy" />
<figcaption>mathbook.epub's chapter in Chromium 141: the quadratic formula as a true stacked fraction, radical and superscript. The fraction's rendered box measures 37.3 px tall against the paragraph's 18 px line.</figcaption>
</figure>

That render needed no plugin and no library. Browser engines now implement [MathML Core](https://developer.mozilla.org/en-US/docs/Web/MathML), the layout-focused subset rebuilt for the web, which is why browser-based reading is quietly one of the most reliable ways to view mathematical EPUBs. Dedicated platforms vary more. Kobo's own [developer guidelines](https://github.com/kobolabs/epub-spec#mathml-support) state MathML "is currently supported on Kobo's iOS, Android, Desktop and eInk platforms" — and, tellingly, recommend in the same breath that creators test across all of them before distribution. When the vendor that supports a feature tells you to verify it per platform, believe them.

## Failure one: conversion drops the equation

Word documents are where most equations live, and Word does not store them as MathML. The Office format keeps its own dialect, OMML, and a converter has to actively translate one to the other. Most don't. They walk the document, translate what they recognise, and skip what they don't — and an equation is a large, unrecognised thing.

Ours is one of them, so we can show the failure precisely. We hand-built math.docx this run — 1,162 bytes: a heading, a sentence, the quadratic formula as a real OMML fraction, a closing sentence — and dropped it on our live Word to EPUB tool:

<figure>
<img src="/blog-media/math-in-epub/docx-done.png" alt="The epub.studio converter's done panel: a pink check mark, the heading 'Your EPUB is ready', the line 'math.epub · 3 KB · never left your device', a Style it before downloading button and a Download without styling button." width="760" loading="lazy" />
<figcaption>The live run: math.docx (1,162 bytes, one OMML equation) → math.epub, 2,657 bytes. No error, no warning — and no equation.</figcaption>
</figure>

The output's chapter, quoted in full where it matters:

```text
<h1>The equation chapter</h1>
<p>Every quadratic equation surrenders to one formula.</p>
<p>The positive root is the one a reader usually wants.</p>
```

Both sentences survived. The formula between them is simply absent. The parsing library underneath classifies the equation as an unrecognised element and moves on; the conversion still reports success, because for a manuscript with no math in it, it is one. That silence is the trap — nothing tells you to go looking. If a chapter had five equations, it now has five invisible gaps, and only a proofread against the source finds them.

## Failure two: the markup survives but loses its name

The subtler failure produces the jumbled line, and it comes down to a detail most people never see: a `<math>` element only *is* MathML when it carries its namespace, the `xmlns="http://www.w3.org/1998/Math/MathML"` declaration that tells an XML parser which vocabulary the tags belong to. Lose that one attribute and every tag inside still exists — it just stops meaning anything.

Our [HTML to EPUB converter](/html-to-epub) makes exactly this mistake, and we are documenting it here deliberately. Fed math.html — the same quadratic formula in correct, namespaced MathML — it keeps the entire element tree intact but strips namespace declarations while sanitising the markup into XHTML. The output chapter contains `<math display="block">` with every `<mfrac>` and `<msqrt>` in place and no `xmlns` anywhere. To a strict XML parser that is no longer mathematics; it is a pile of unknown elements that happen to contain text.

What a reader then shows is the text, in document order, with all the layout gone:

<figure>
<img src="/blog-media/math-in-epub/mathml-render-stripped.png" alt="The same EPUB chapter rendered without the MathML namespace: the quadratic formula collapses to the linear string x=−b±b2−4ac2a, and the sentence below now reads '12 of it' where the one-half fraction used to be." width="760" loading="lazy" />
<figcaption>The identical chapter with only the xmlns attribute removed: the formula flattens to <code>x=−b±b2−4ac2a</code>, and ½ becomes "12". The fraction's rendered height drops from 37.3 px to 17 px — plain inline text.</figcaption>
</figure>

Look at what the inline fraction did. One half became **12** — the numerator and denominator run together, mid-sentence, silently changing "½ of it" into nonsense that still reads as a number. Of the three failures this is the one that can corrupt meaning rather than just appearance, and it is why a jumbled equation deserves more alarm than a missing one.

Validation will not save you here either. The converted file sailed through our [EPUB validator](/epub-validator) — "No problems found. This EPUB is structurally valid." — because the checks are container-level and a namespace-less `<math>` is well-formed markup. Full EPUBCheck gets closer: a chapter using MathML without the manifest declaration is the exact bookkeeping that [OPF-014 exists to catch](/blog/epub-validation-errors-explained), though even that flags the declaration, not the rendering.

## Failure three: the reader never renders it

Suppose the file is perfect — namespaced MathML, property declared, EPUBCheck clean. The 2024 version of the MobileRead thread describes what still happens: an EPUB whose math displays correctly in Calibre's viewer shows nothing in other desktop readers, while a Sigil-built file behaves the other way around. Same spec, same markup, different renderers, different results.

This is not anyone being lazy; MathML is a hard rendering problem with a two-decade standardisation tangle behind it, which is exactly what MathML Core was created to cut through. But it leaves authors in an uncomfortable spot: there is no single file that is *known* to render everywhere, only files that have been tested on the platforms that matter to you. We could not test Kindle's pipeline or Apple Books from this environment, so this post makes no claim about them — which is itself the point. Neither can you, until you load your own book on the actual device.

## What actually works

For a book where math is occasional, Presentation MathML written directly into the XHTML is the honest format: it reflows, it scales with the reader's font size, it survives dark mode, and screen readers can speak it. Write it in Sigil or Calibre's editor (a converter will not produce it for you — see failure one), keep it namespaced, declare `properties="mathml"`, and test on your actual targets. Browser-based readers are the most dependable preview you have.

For a book where math is dense, or the audience's devices are unknown, equations as images remain the pragmatic professional choice: an SVG or PNG per equation, with the formula spelled out in the alt text. It is less elegant — images ignore font-size settings and dark mode — but a picture of a fraction has never once rendered as "12".

And if your manuscript is in Word — the [Word to EPUB route](/blog/convert-word-to-epub) — convert it, then audit it. The prose, headings and lists come through our [DOCX to EPUB converter](/docx-to-epub) cleanly; the equations, as shown above, do not — replace them with images before you export, and the conversion has nothing to drop. Whichever route you take, the final check is the same: open the result and turn to the page with the math on it. This is one of the few EPUB problems where looking is the entire diagnosis.


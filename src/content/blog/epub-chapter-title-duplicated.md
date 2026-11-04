---
title: 'EPUB chapter titles duplicated: where the doubles are born'
excerpt: 'Chapter titles duplicated after an EPUB conversion are born in specific places. We reproduced every variant with our own converter and show the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-chapter-title-duplicated.png'
date: 2026-11-04
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-to-txt
  - fb2-to-epub
  - epub-validator
howToTitle: 'How to remove duplicated chapter titles from an EPUB'
howTo:
  - t: 'Dump the book to plain text'
    d: 'Convert the EPUB to a .txt file and skim it. Every double is visible in one scroll — a title that appears twice, or a whole passage that repeats, stands out immediately in flat text.'
  - t: 'Open the affected chapter file and delete the stray copy'
    d: 'Unzip the EPUB (it is a ZIP archive), open the chapter''s .xhtml file, and remove the paragraph that repeats the heading — or the block that repeats a whole section. The heading element stays; the copy goes.'
  - t: 'Re-zip and spot-check in a reader'
    d: 'Repack the archive and open the book. Check the chapter openings by eye — a validator will not confirm this fix, because duplicated text was never a structural error in the first place.'
faqs:
  - q: 'Why does the chapter title show twice in one app but once in another?'
    a: 'That pattern points to a hidden duplicate rather than a plain one. Some converters write a second copy of the heading and style it to be invisible, and reading apps differ in how faithfully they honour that styling. The copy is in the file either way — an app that ignores the hiding rule renders it.'
  - q: 'Will an EPUB validator flag duplicated chapters?'
    a: 'No. Repeated text is structurally valid markup, so there is nothing for a validator to object to. Our specimen book — every chapter title doubled and two chapters shipped twice in full — passed validation with no problems found. Validators check the container and the declarations, not whether the prose repeats itself.'
  - q: 'Can I fix a duplicated title without editing the EPUB by hand?'
    a: 'If you still have the source file, yes — fix it there or convert with a different tool, since the double is usually born at conversion. Re-exporting from the original is cleaner than hand-editing, because it fixes every chapter at once instead of one file at a time.'
  - q: 'Why did the conversion duplicate a whole chapter, not just its title?'
    a: 'That is the nested-section variant. Formats like FB2 allow sections inside sections, and a converter that walks both the parent and its children emits the same paragraphs twice — once inside the parent''s chapter, once as the child''s own chapter. The book grows by exactly the nested content.'
  - q: 'Is this the same problem as duplicated entries in the table of contents?'
    a: 'No — they live in different files. Doubled TOC entries are a navigation-document problem and the book''s text is usually fine; a duplicated chapter title is body text, printed inside the chapter itself. You can have either without the other, which is why fixing the TOC never removes a doubled heading.'
draft: false
---

The book converts without a complaint, opens fine, and then every chapter
greets you twice: **Chapter One** as a big heading, and "Chapter One" again
as the first line of ordinary text underneath it. Sometimes it escalates —
whole passages appear once in the middle of a long chapter and then again
as a chapter of their own.

A duplicated chapter title is one of those symptoms that keeps resurfacing
in reader communities — MobileRead has threads on conversions that doubled
every heading, the Literature & Latte forums have an EPUB 3 export whose
title printed twice no matter what the author typed, Pleco's forums have a
book whose every chapter displayed twice, and the Adobe InDesign community
has its own version of the complaint. The replies are usually guesses,
because the person answering cannot see inside the file.

The mechanism is specific, though, and it is almost never the reading app.
While researching this post we reproduced the entire family of doubles with
one of our own converters — deliberately, on a specimen book built for the
job — and dissected the output byte by byte. The doubles are real text,
written into the file at conversion time. Here is where they come from and
how to get rid of them.

## Three places a duplicated title is born

**The converter writes the title twice.** Most ebook source formats keep
the chapter title in a dedicated element — FB2 has `<title>`, DOCX has
heading styles, HTML has `<h1>`. A converter promotes that element to the
chapter heading and the TOC entry. If its paragraph-collecting pass then
sweeps up the *contents* of the title element as ordinary text, the same
words land in the body again, directly under the heading they already
became. The book's source held the title once; the output holds it twice.

**The source held it twice all along.** A Word manuscript with the chapter
name in a heading style *and* typed again as the first line, or an InDesign
document with the title in a repeating text frame as well as the story,
exports its redundancy faithfully. The converter is innocent here — flat
formats hide the double because both copies look identical on a page, and
the conversion merely stops hiding it.

**The second copy was meant to be invisible.** Some conversion pipelines
emit a duplicate heading and style it hidden — the MobileRead case above
involved exactly that, a second `h1` suppressed with CSS. Reading apps
differ in how faithfully they honour hiding rules, so the book looks clean
in one app and stutters in another. This is the only variant where the
symptom genuinely depends on the reader — but the duplicate is still
sitting in the file.

## We reproduced it with our own converter

Our [FB2 to EPUB converter](/fb2-to-epub) has the first fault, and we knew
it — the format tour that tested it logged a "cosmetic duplication" last
September. For this post we went further and built a specimen that triggers
everything at once: `dupbook.fb2`, a 1,541-byte two-part novella with one
simple chapter and one part containing two nested chapters. The FictionBook
schema explicitly allows both things that matter here — a section's title
is made of ordinary `<p>` elements, and sections may nest inside sections —
so the fixture validates cleanly against the
[official FB2 schema](https://github.com/gribuser/fb2) (we checked with
xmllint before converting).

<figure>
<img src="/blog-media/epub-chapter-title-duplicated/fb2-to-epub-done.png" alt="Epub Studio FB2 to EPUB done panel: 'Your EPUB is ready', dupbook.epub · 4 KB · never left your device, with a 'Style it before downloading' button" width="762" height="301" loading="lazy" />
<figcaption>The live /fb2-to-epub run on dupbook.fb2: 1,541 bytes in, a 4,315-byte EPUB out — three chapters in, four chapter files out.</figcaption>
</figure>

Three chapters went in. Four chapter files came out, and every one of them
opens with its own title twice. This is chapter-001.xhtml, verbatim:

```html
<h1>Chapter One: The Keeper</h1>
<p>Chapter One: The Keeper</p>
<p>The lamp room smelled of brass polish and paraffin, …</p>
```

The converter takes the text of the FB2 `<title>` for the heading, then its
paragraph sweep collects every `<p>` under the section — including the one
*inside* the title it just promoted. One source element, two output
elements.

The nested part is where it escalates. "Part Two: The Storm" contains two
child sections, and the converter walks the parent *and* each child as
chapters of their own. The parent's sweep is deep, so chapter-002.xhtml
holds the full text of both nights — and chapters 003 and 004 then repeat
them, word for word, as standalone chapters:

```
<li><a href="chapter-001.xhtml">Chapter One: The Keeper</a></li>
<li><a href="chapter-002.xhtml">Part Two: The Storm</a></li>
<li><a href="chapter-003.xhtml">The First Night</a></li>
<li><a href="chapter-004.xhtml">The Second Night</a></li>
```

A reader moving through this book reads the storm twice and has no way to
know that was not the author's idea.

<figure>
<img src="/blog-media/epub-chapter-title-duplicated/chapter-render.png" alt="Two converted chapter files rendered in Chromium: chapter-001.xhtml shows the heading 'Chapter One: The Keeper' followed by the same words again as a plain paragraph; chapter-002.xhtml shows 'Part Two: The Storm' repeated under its heading, then the full text of both night chapters" width="980" height="384" loading="lazy" />
<figcaption>The converted chapters rendered in Chromium: every heading repeated as its first paragraph, and the parent chapter swallowing both nested ones.</figcaption>
</figure>

We are reporting our own tool's fault here, and it is logged for a fix. The
point is what it demonstrates: these doubles are manufactured at conversion
time by an identifiable code path, not conjured by your reading app. The
same anatomy — title element swept into the body, nested structure walked
twice — explains the GitBook, Scrivener and InDesign reports without any of
those tools sharing a line of code with ours.

## One dump makes every double visible

Diagnosing this inside a reading app is slow, because you meet the doubles
one page-turn at a time. The fast way is to flatten the book: run it
through [EPUB to TXT](/epub-to-txt) and skim the output. Our 4,315-byte
specimen became a 984-byte text file in which the entire pathology fits on
one screen:

```
CHAPTER ONE: THE KEEPER

Chapter One: The Keeper

The lamp room smelled of brass polish and paraffin, …
```

…and further down, "The First Night" and "The Second Night" each appear
twice in full. Two minutes with a text dump tells you which variant you
have: titles repeated under headings (converter sweep), passages repeated
wholesale (nested sections), or a double that only some apps show (hidden
copy — the dump shows it unconditionally, because the text is there
regardless of styling).

What will *not* diagnose it is a validator. We ran the doubled specimen
through our [EPUB validator](/epub-validator) and it passed with no
problems found — correctly, because repeated text is structurally valid.
Nothing in the EPUB standard forbids a book from saying everything twice.

<figure>
<img src="/blog-media/epub-chapter-title-duplicated/validator-pass.png" alt="Epub Studio validator report reading 'This EPUB is valid' with the line: OK — No problems found. This EPUB is structurally valid." width="762" height="217" loading="lazy" />
<figcaption>The specimen with every title doubled and two chapters duplicated in full: structurally valid, no problems found.</figcaption>
</figure>

## Fixing the copies without retyping the book

The clean fix is upstream. If you still have the source — the manuscript,
the FB2, the HTML — fix the double there or convert with a different tool,
and every chapter comes right at once. Check the source for a title that
exists both as a heading style and as typed text; that variant is yours to
fix, not the converter's.

When the EPUB is all you have, the repair is manual but mechanical. An EPUB
is a ZIP archive; inside it each chapter is a small XHTML file. Unzip it,
open the affected `chapter-*.xhtml`, and delete the stray paragraph — the
`<p>` repeating the heading's words — leaving the `<h1>` in place. For the
nested-section variant, decide which copy of the passage stays (usually the
standalone chapter) and delete the other. A step-by-step companion for this
kind of surgery, including how to re-zip the archive so readers still
accept it, is in our [Sigil guide](/blog/sigil-epub-editor) — a proper EPUB
editor does the unzip-edit-rezip cycle for you and validates as you go.

Being realistic about the hand-edit route: it is per-chapter work, and on a
forty-chapter book with doubled titles that is forty small edits. That is
the honest argument for going back to the source when you can, and for
testing a converter on one small file before trusting it with a library.
Flatten the result to text, skim it once, and you will know in two minutes
whether your converter manufactures doubles — which is exactly the test
that caught ours.

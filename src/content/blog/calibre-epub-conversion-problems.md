---
title: 'Calibre EPUB conversion problems: stray formatting'
excerpt: 'Calibre EPUB conversion problems — stray italics, underlines and odd spacing after a Word import — come from the source file, not the converter.'
category: 'Fix it'
ogImage: '/blog-og/calibre-epub-conversion-problems.png'
date: 2026-07-20
updated: 2026-08-28
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - docx-to-epub
  - epub-validator
  - style-studio
faqs:
  - q: 'Why does my converted EPUB have italics that are not in my Word document?'
    a: 'They are in the document — as direct character formatting you cannot see at a glance, usually carried in by pasting from a web page, an email or a PDF. Calibre copies that formatting faithfully because the file records it as part of the text. The fix is to clear it in Word, not to hunt through converter settings.'
  - q: 'Why is a random word underlined in my EPUB?'
    a: 'Most often it is a deleted hyperlink. Word underlines links by default, and removing the link later frequently leaves the underline behind as plain character formatting — styling no reader can explain, which the converter then dutifully carries across.'
  - q: 'Will Clear All Formatting destroy my chapter headings?'
    a: 'No — it strips direct character formatting back to the underlying paragraph style, and the styles themselves survive, so a Heading 1 chapter title stays a heading. What you lose is hand-applied emphasis, which is why the step after clearing is re-applying italics only where you genuinely mean them.'
  - q: 'Can a converter keep my intentional italics but drop the accidental ones?'
    a: 'No. A deliberate italic and a forgotten one are stored identically in the file, so no converter can tell them apart — both Calibre and our tool carry italics across. The only place to separate intended emphasis from accidental is the Word file itself.'
  - q: 'Should I stop using Calibre for conversions?'
    a: 'Not necessarily. For a manuscript with footnotes, tables, mixed languages or carefully tuned formatting, Calibre''s thoroughness is the feature — clean the source and keep its control. The minimalist route suits plain prose that just needs to come out clean; it is the wrong tool for a heavily designed document.'
---

A Word manuscript that looks clean on screen can come out of Calibre speckled with formatting nobody applied on purpose. A phrase turns up in italics. A name is underlined. The gap between two paragraphs is suddenly wider than everywhere else. Nothing in the document explains it, so it reads like the converter improvising — and Calibre gets the blame.

It is almost never Calibre's invention. These Calibre EPUB conversion problems are the converter faithfully reproducing formatting that was already sitting in the DOCX, just well hidden. The "randomness" is real character formatting you could not see at a glance, carried across exactly as it was stored. Once that clicks, the fix stops being a hunt through Calibre's settings and becomes a question of cleaning the source.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Calibre preserves the direct character formatting in your Word file — italics, underlines and spacing applied to specific runs of text — including leftovers from pasting, deleted hyperlinks and forgotten emphasis. It is not adding anything; it is copying what is there. Clean the formatting in Word first, or convert with a tool that keeps only <strong>semantic</strong> styles.
</div>

## Why Calibre conversion problems are really source problems

Word stores two very different kinds of formatting, and the difference is the whole story. A *style* — Heading 1, Normal, Emphasis — is a statement about what a piece of text is. *Direct formatting* is a change applied straight to a run of characters: this word italic, this one underlined, this paragraph spaced. Both are saved in the file; only one is a deliberate, visible decision.

Calibre is a thorough converter. When it reads the DOCX it carries the direct formatting across to the EPUB, because as far as the file is concerned that formatting is part of the text. It has no way to know that the italic on a pasted sentence was an accident of where you copied it from, or that an underlined word is a hyperlink you removed the link from but not the styling. So it keeps all of it. The result looks random only because the cause is invisible.

Three sources account for most of it.

**Pasted text brings its own clothes.** Copying from a web page, an email or a PDF pastes the source's character formatting along with the words. Italic captions, underlined links and coloured spans ride in unnoticed and sit in the manuscript until a converter surfaces them.

**Deleted hyperlinks leave underlines behind.** Word underlines links by default. Remove the link later and the underline often stays as plain character formatting — a run of text underlined for no reason a reader can see.

**Manual emphasis that was never cleared.** An italic applied while drafting and forgotten, a heading made bold-and-bigger by hand instead of with a style — these survive because they are, technically, exactly what you told Word to do.

## Fixing the most common Calibre conversion problems

The durable fix is at the source, not in the converter. There are two honest routes, and which one is right depends on how much of the formatting you actually want to keep.

### Clean the Word file, then reconvert

Select the whole document and apply **Clear All Formatting** (the eraser icon on Word's Home tab). This strips direct character formatting back to the underlying paragraph style while leaving the styles themselves — your Heading 1 chapter titles stay headings. Re-apply italics only where you genuinely mean them, and check that chapters are carried by real styles rather than hand-sizing, which is the same discipline behind [using real heading styles](/blog/convert-word-to-epub) for a clean conversion in the first place. Convert again and the stray runs are gone, because you removed them rather than hoping the converter would.

This keeps you in full control and is the right route when the document is heavily and deliberately styled.

### Convert with a tool that ignores direct formatting

If the manuscript is mostly plain prose and you simply want the artifacts not to come across, use a converter that reads only semantic structure. Our Word to EPUB converter is built on the mammoth library, which by design maps document styles — Heading 1 to a chapter heading, bold to `<strong>`, italic to `<em>` — and [ignores direct formatting such as font sizes and colours](https://github.com/mwilliamson/mammoth.js). Underline is dropped by default, precisely because in HTML it is indistinguishable from a link. On top of that, the converter strips inline style attributes as it assembles the EPUB, so coloured spans, hand-set spacing and stray underlines have nothing left to survive on.

The trade is deliberate minimalism: it will not reproduce careful direct styling either. That is the point — and also its main limitation, which is worth being clear about before you rely on it.

### Validate before you publish

Whichever route you take, run the finished file through the [EPUB validator](/epub-validator) before uploading it anywhere. Stray formatting is only cosmetic; a structural fault inherited from an awkward source is what actually gets a file rejected, and stores describe those faults in famously unhelpful terms. Finding out locally takes a couple of seconds.

## What neither tool can fix for you

Being realistic about this saves an afternoon, because the wrong expectation is where the time goes.

**Genuinely italic text stays italic.** If you applied italic to a word and forgot, that word is italic in the source in exactly the same way as a deliberate emphasis. No converter can tell the two apart, so both Calibre and our tool carry it across. The only place to sort intended emphasis from accidental is the Word file itself.

**Discarding formatting is not the same as controlling it.** A converter that drops direct formatting gives you a clean baseline, not a designed book. If you want particular words styled a particular way, that decision has to live in the source or be applied afterwards — [restyle the EPUB](/style-studio) once the text is clean, rather than fighting the source formatting through conversion.

**Some documents want Calibre's depth.** For a manuscript with footnotes, tables, mixed languages or formatting you have tuned by hand, Calibre's control is the feature, not the bug. Clean the source, convert there, and accept a little manual cleanup. The minimalist route suits plain prose that just needs to come out clean; it is the wrong tool for a carefully designed document.

## Get a clean file the first time

The pattern behind every one of these problems is the same: a converter can only act on what the file records, and a Word file records more than you can see. Deciding what the text *is* — this is a chapter, this word is emphasised, this is a link — and clearing away everything it merely happens to look like is what produces a clean EPUB, in Calibre or anywhere else.

For plain prose that just needs to come out right, [converting Word to EPUB](/docx-to-epub) with a tool that keeps the structure and drops the rest is the shortest path there. For a document you have styled with intent, clean it in Word first and keep Calibre's control. Both are honest routes; the mess only wins if you convert around it instead of through it.

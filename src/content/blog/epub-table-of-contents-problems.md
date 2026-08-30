---
title: 'EPUB table of contents problems: stray bullets, wrong order'
excerpt: 'EPUB table of contents problems — stray bullets, a wrong order, missing chapters — happen when the navigation file drifts from the spine. Here''s the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-table-of-contents-problems.png'
date: 2026-08-03
updated: 2026-08-30
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-validator
  - epub-to-docx
faqs:
  - q: 'Can an EPUB pass validation and still have a broken table of contents?'
    a: 'Yes. Nothing in the format cross-checks the navigation file against the spine, so a contents list in the wrong order validates fine — and a missing navigation document is flagged as a warning rather than an error, because the book still opens. A green result means the structure is well-formed, not that the index agrees with the pages.'
  - q: 'Why does the table of contents look different in different reading apps?'
    a: 'Many EPUBs carry two navigation files — the modern nav.xhtml and the legacy toc.ncx — and each reader picks one to build its contents menu from. When the two files disagree, what you see depends on which file the app trusted. Rebuilding both from the same reading order makes every app show the same list.'
  - q: 'Will converting my EPUB out to DOCX and back really fix the contents?'
    a: 'For the common faults, yes. The round trip discards the broken navigation and writes a fresh nav.xhtml and toc.ncx generated from the reading order itself, so a mis-ordered list, a missing entry or a nav page leaking into the book are fixed by construction. What it cannot preserve is a nested hierarchy or mid-chapter links — those need a hand editor such as Sigil or Calibre.'
  - q: 'Why do all my chapters show up as "Untitled" in the contents menu?'
    a: 'The navigation entry for each chapter takes its label from that chapter file''s title element or first heading. When those are empty or identical across files, the contents list faithfully reproduces the blank — repeated or "Untitled" entries. The fix is to give each chapter file a real title or heading, then rebuild the navigation.'
  - q: 'Is a wrong table of contents a sign the EPUB file is corrupt?'
    a: 'No. The pages themselves are usually intact — which is why the book reads fine when you turn through it — and the fault is a disagreement between the separate files that list the chapters, not damaged text. Genuinely damaged files are a different problem with different repairs.'
draft: false
---

The table of contents is the one part of an EPUB people notice the moment it goes wrong. A list of chapters printed as a page of stray bullets in the middle of the book. Chapter 9 sitting above chapter 2. Three chapters that exist when you turn the pages but never appear in the contents at all. The pages themselves read fine, which is what makes it confusing — so why is the index over them lying?

Because the index is not built from the pages. Most EPUB table of contents problems trace back to a single fact that is easy to miss: the contents list and the reading order are stored in different files, and nothing forces them to agree. An EPUB carries a separate navigation document whose only job is to name and order the chapters. When that file drifts out of step with the actual chapter files — or a reader renders it in the wrong place — you get a table of contents that contradicts the book it belongs to.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB's table of contents lives in its own file — a <code>nav.xhtml</code> navigation document, and often a legacy <code>toc.ncx</code> alongside it — kept separate from the <strong>spine</strong> that sets reading order. Stray bullets mean a reader is showing that navigation file as a body page instead of consuming it as the TOC; a wrong order or missing chapters mean the nav file and the spine disagree. Validate the book to confirm which file is at fault, then rebuild the navigation so both agree.
</div>

## Why the contents list and the pages disagree

Two separate structures decide what a reader shows. The **spine** is an ordered list of the chapter files, and it is what the reader turns through page by page. The **navigation document** — `nav.xhtml` in EPUB 3, with a `<nav epub:type="toc">` element inside it — is the human-facing table of contents. For backward compatibility with older software, many EPUBs also carry a second, older navigation file, `toc.ncx`, holding the same list in the EPUB 2 format. That is three places a chapter's identity can be recorded, and three places they can fall out of sync.

A reader picks one of the navigation files to build the contents menu from and reads the pages from the spine. If the file it trusts lists chapters in a different order from the spine — or omits one, or names one wrongly — the contents menu and the pages come apart. Nothing in the format cross-checks them. If you have read the [structure of an EPUB](/blog/what-is-inside-an-epub), this is the manifest-and-spine idea again: the archive is an inventory of parts plus several lists that point into it, and a broken pointer does not stop the other lists from working.

The stray-bullets case is a different failure, and worth separating out. The navigation document is itself an ordinary XHTML file containing an ordered list — a plain `<ol>` of links. When a reader treats it as the machine-readable table of contents, that list becomes the contents menu and is never printed inside the book. When a reader instead renders it as a content page — because it was mistakenly added to the spine, or because an older reader does not recognise the `epub:type="toc"` marker that says "this is the TOC, not a page" — the list is drawn straight into the book body as literal bullets or numbers. The book has not gained a strange chapter. You are seeing the table of contents leak onto the page.

## Reading the three symptoms

Because these are structural faults rather than damaged text, the symptom points fairly reliably at the file to look at.

| What you see | What is actually wrong | Where to look |
|---|---|---|
| A page of stray bullets or numbered links inside the book | The navigation document is being rendered as a body page — it is in the spine, or the reader doesn't recognise the `toc` nav | The spine list, and the `epub:type="toc"` on the `<nav>` element |
| Chapters in the wrong order in the contents menu | The navigation file lists them in a different order from the spine | Compare the `<ol>` in `nav.xhtml` (or the `navMap` in `toc.ncx`) against the spine order |
| Chapters that exist when you turn pages but are missing from the contents | A spine document has no matching entry in the navigation file | The navigation file — the entry was never written, or points at the wrong filename |
| Contents entries labelled "Untitled" or all identical | The nav takes each label from the chapter's `<title>` or first heading, and those are empty | The chapter files' `<title>` tags and headings |
| Contents menu is completely empty | No navigation document at all, or an EPUB 2-only package | Whether a `nav.xhtml` with `properties="nav"` exists in the manifest |

The last row is the one that also gets books rejected from stores. A validator flags it as a warning rather than an error, because the book still opens — the contents menu is simply blank. The [EPUB validator](/epub-validator) on this site runs its structural pass entirely in the browser and reports exactly this: whether a navigation document is present and declared, whether the manifest entries point at files that are actually in the archive, and whether the package is an older EPUB 2 that lacks the modern nav document. That tells you which of the three files is the problem before you touch anything. For the exhaustive line-and-column account of a malformed nav file, the companion post on [decoding epubcheck codes](/blog/epub-validation-errors-explained) explains how to read the report.

## Rebuilding the contents so both files agree

Once the validator has named the fault, there are two honest routes, and the right one depends on how precise you need to be.

The fast route is a clean reconversion. Every EPUB this site's converters produce is written with a fresh navigation set generated from the spine itself — a single `nav.xhtml` with a flat ordered list, and a matching `toc.ncx` whose entries carry a `playOrder` in the same sequence, both declared in the manifest. Because both files are rebuilt from the reading order, they cannot disagree with it: the wrong-order and missing-entry cases are resolved by construction, and the stray-bullets case disappears because the nav is marked as the TOC and kept out of the spine. The practical move is a round trip — convert the book out to [DOCX](/epub-to-docx) and back to EPUB — which discards the broken navigation and writes a clean one from the content. The walk-through on [repairing a rejected EPUB](/blog/fixing-corrupt-epub-files) covers that round trip and the other structural repairs in order.

That route trades precision for speed, and it is worth being clear about what it does not preserve.

## What a reconversion cannot do for you

**Nested tables of contents flatten.** A book with parts, chapters and sub-sections nested several levels deep carries that hierarchy in its navigation file. A rebuild from the spine produces one entry per chapter file — a single, flat level. If the nesting is the point, an automated round trip is the wrong tool, and hand-editing in Sigil or Calibre is the right one; those let you author the nested `<ol>` directly.

**Labels come from the files, not from you.** The rebuilt contents takes each entry's text from that chapter's `<title>` element or its first heading. A source where several chapter files share a blank title, or none, will produce a contents list of repeated or "Untitled" entries — accurate to what is in the files, unhelpful to a reader. Fixing that means giving each chapter a real title or heading before the rebuild, not after.

**Sub-chapter anchors are lost.** A hand-made TOC that jumps to a specific point partway through a long chapter file uses an anchor within that file. A rebuild that indexes whole files cannot reconstruct those mid-file targets; it can only point at the top of each document.

None of that argues against the round trip for the common cases — a mis-ordered flat list, a missing entry, a navigation file leaking onto the page. Those are exactly what an automated rebuild fixes cleanly, and they are the bulk of real EPUB table of contents problems. Run the file through the [validator](/epub-validator) first so you know whether you are looking at a drifted nav file or a genuinely absent one, then rebuild — and when the answer is a deep, deliberate hierarchy, reach for an editor that lets you set it by hand rather than a converter that will honestly, and unhelpfully, flatten it.

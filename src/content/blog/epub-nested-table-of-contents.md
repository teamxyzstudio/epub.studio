---
title: 'EPUB nested table of contents: where the levels go'
excerpt: 'An EPUB nested table of contents lives in two files most tools rebuild flat. Which layer dropped your levels — the converter, a merge, or the reader.'
category: 'Fix it'
ogImage: '/blog-og/epub-nested-table-of-contents.png'
date: 2026-11-10
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
  - merge-epub
  - docx-to-epub
faqs:
  - q: 'Why does my EPUB table of contents show chapters but not sub-chapters?'
    a: 'Usually because the sub-chapters were never written into the navigation file. Most converters build the contents list from one entry per chapter file, so headings inside a chapter never become entries. Rename the EPUB to .zip and open nav.xhtml: if there are no nested lists inside the main list, the file is flat and no reader can show levels that are not there.'
  - q: 'Is a nested table of contents allowed in EPUB?'
    a: 'Yes, explicitly. The EPUB 3.3 specification defines the toc nav element as carrying the primary navigational hierarchy of the publication, and nesting is expressed as ordered lists inside list items. It is the one navigation element designed to nest — the page-list and landmarks elements are told to keep to a single flat list.'
  - q: 'Why did merging two EPUBs flatten my table of contents?'
    a: 'Merging rebuilds the book around a new reading order, and the simplest correct contents list a tool can write for that is one entry per content file. Entries that pointed at anchors partway through a file are worse off than the ones that lose their indent: there is no file boundary for them, so a rebuild drops them entirely rather than flattening them.'
  - q: 'How many TOC levels do e-readers actually display?'
    a: 'It varies by app and device, which is why the same file can look nested in one place and flat in another. Reports on reader forums describe apps that render two levels, three levels, or everything. The only way to know what your file carries, as opposed to what one reader shows, is to open nav.xhtml and look at the list structure itself.'
  - q: 'Does a flat table of contents fail EPUB validation?'
    a: 'No. Nesting is a should, not a must — a flat list is a perfectly conformant contents list, and so is a deep one. A validator can tell you the navigation document exists and the archive is sound, but it has no opinion on whether your hierarchy survived. Flattening is a silent change, which is exactly why it goes unnoticed until someone browses the book.'
  - q: 'Can I keep my section levels through an automated conversion pipeline?'
    a: 'Only the levels that correspond to file boundaries. Any entry that points at an anchor inside a file depends on a hand-authored navigation document, and the first automated rebuild will discard it. If a book has to survive automated tooling, splitting it so each section is its own file keeps every section reachable — as a flat list — and the nesting itself can be restored by hand afterwards.'
draft: false
---

You structured the book deliberately: parts, chapters inside them, numbered sections inside those. Your writing tool's outline showed the pyramid. Then you open the converted EPUB on a device and the table of contents is a single flat column — or worse, just the parts, with everything below them gone. This question has been coming up for well over a decade on MobileRead and in the Literature & Latte and Adobe InDesign communities, asked about Apple Books, Kobo, Kindle and Nook in turn, and the answers scatter because the symptom has three different causes that look identical from the reading app.

An EPUB nested table of contents is real, spec-blessed structure — but it lives in exactly two small files, and a surprising amount of ordinary tooling rebuilds those files from scratch without ever reading the hierarchy you put in them. To find out where your levels went, you have to know which layer dropped them: the converter that made the file, a tool that rebuilt it, or the reader that displays it.

## Two files carry the hierarchy, and only one of them is current

Everything a reading app shows in its contents panel comes from the navigation document, `nav.xhtml` — a plain XHTML file holding an ordered list. Nesting is nothing more exotic than a list inside a list item. Here is the navigation document of a small test book we built by hand for this post, three levels deep:

```xml
<ol>
  <li><a href="part-1.xhtml">Part I — The Field</a>
    <ol>
      <li><a href="chapter-1.xhtml">Chapter 1 — Hedgerows</a>
        <ol>
          <li><a href="chapter-1.xhtml#s1">1.1 Hawthorn</a></li>
          <li><a href="chapter-1.xhtml#s2">1.2 Blackthorn</a></li>
        </ol>
      </li>
      <li><a href="chapter-2.xhtml">Chapter 2 — Ditches</a></li>
    </ol>
  </li>
  <li><a href="part-2.xhtml">Part II — The Wood</a>
    <ol>
      <li><a href="chapter-3.xhtml">Chapter 3 — Coppicing</a></li>
    </ol>
  </li>
</ol>
```

The [EPUB 3.3 specification](https://www.w3.org/TR/epub-33/#sec-nav-toc) is unambiguous that this is the intended home for structure: "The primary navigational hierarchy of an EPUB publication is defined in a nav element whose epub:type attribute set to the value 'toc'". It is also the *only* navigation element meant to nest — the spec tells the page-list and landmarks elements to "contain only a single ol descendant (i.e., no nested sublists)". Depth is for the table of contents alone.

The second file is `toc.ncx`, the EPUB 2 contents format, which mirrors the same tree as nested `navPoint` elements and usually declares its depth in a `dtb:depth` header. Modern readers prefer `nav.xhtml`; the NCX is what the spec now files under legacy features, "retained from EPUB 2 only to allow EPUB creators to author content that can function, to some degree, in reading systems that only support EPUB 2 publications". Our test book carries both, agreeing with each other, and the EPUB validator passes it without comment:

<figure>
<img src="/blog-media/epub-nested-table-of-contents/validator-passes-nested.png" alt="The epub.studio validator report for nestbook.epub: a check mark, the heading 'This EPUB is valid', and the line 'OK — No problems found. This EPUB is structurally valid.'" loading="lazy" />
<figcaption>The live validator on our 3,745-byte three-level test book. Nesting is never an error — and flatness is never an error either, which is why no tool warns you when the levels disappear.</figcaption>
</figure>

That symmetry matters: a flat list is just as conformant as a nested one. Nothing in the pipeline is obliged to object when your hierarchy vanishes, so nothing does.

## Most converted books are born flat

The first place levels die is at conversion, before you ever see the file. A converter that splits a manuscript into chapter files has an easy, correct option for the navigation document: one list entry per file. That is what this site's converters write — the generator emits a single `<ol>` with one `<li>` per chapter and a matching flat run of NCX navPoints, and there is no code path that produces a sublist.

The everyday consequence: your heading levels survive *inside* the chapters but never reach the contents panel. We built a four-paragraph Word document for this post with two Heading 1 chapters and two Heading 2 sections under the first, then ran it through the live [DOCX converter](/docx-to-epub). The 1,636-byte document became a 3,171-byte EPUB whose first chapter file still contains both `<h2>` headings — `1.1 Hawthorn` and `1.2 Blackthorn` are right there in the body markup — while the navigation document lists exactly two entries, one per Heading 1. The sections are in the book and absent from its map. Calibre and other converters have their own equivalents of this behaviour and their own settings for it; the reports of parts and chapters landing at the same indent level, or sub-chapters missing entirely, recur on MobileRead year after year because every pipeline makes its own call here.

## Rebuilding tools flatten — and anchors do worse than flatten

The second place is any operation that regenerates navigation from the reading order: merging, splitting, automated repair. The reading order is a list of files; a rebuild indexes files; files have no interior. So two different things happen to a nested contents list, and only one of them is visible at first glance.

We merged the three-level test book with a plain second book using the live [merge tool](/merge-epub) and unpacked the 8,369-byte result:

<figure>
<img src="/blog-media/epub-nested-table-of-contents/nested-vs-flattened-nav.png" alt="Two rendered contents lists side by side. Left, nestbook.epub as authored: Part I with Chapter 1 indented beneath it, sections 1.1 Hawthorn and 1.2 Blackthorn indented further, then Chapter 2, Part II and Chapter 3. Right, merged.epub as regenerated: twelve entries in one flat numbered column, beginning with a generated Nest Book title entry, with no indentation and no 1.1 or 1.2 entries at all." loading="lazy" />
<figcaption>Both navigation documents rendered in Chromium. Left: the hand-authored three-level nav. Right: the same book after a live /merge-epub run — every file one flat entry, and the two section entries gone.</figcaption>
</figure>

The parts and chapters are all still present — demoted to one flat level, renamed to `chapter-001` through `chapter-012`. But look for `1.1 Hawthorn` and `1.2 Blackthorn` on the right: they are not flattened, they are *deleted*. Those two entries pointed at anchors partway through the chapter file, and a rebuild that indexes whole files has nothing to attach them to. This is the asymmetry worth remembering — flattening demotes file-level entries and silently discards anchor-level ones. The merged book, incidentally, still passes the validator cleanly. Structure checks cannot see taste.

If your real problem is a contents list that is broken rather than flattened — wrong order, missing chapters, a nav page leaking into the book — that is a different fault with different fixes, covered in our guide to [table of contents problems](/blog/epub-table-of-contents-problems).

## Sometimes the file is fine and the reader is the ceiling

The third cause sits on the device, and you can only diagnose it by elimination. Reader support for displaying depth genuinely varies: threads on MobileRead describe one app rendering two levels, another three, a Kobo showing flat what Sigil shows nested, nested entries misbehaving on a Paperwhite, and Apple Books initially dropping a third level that reappeared once its indentation was corrected. We cannot test those devices from here, so we will not tell you which reader truncates at which depth — the honest point is narrower. The spec itself acknowledges display capping as a real phenomenon by giving authors a `hidden` attribute for pruning: its own example marks a third-level list hidden so that, when rendered, it "limits the table of content to the two top-most hierarchical levels".

So the diagnostic is simple and does not require guessing. Rename a copy of the EPUB from `.epub` to `.zip`, extract it, and open `nav.xhtml` in any text editor. Nested `<ol>` elements inside the list items: your file carries the hierarchy, and whatever the device shows is the device's rendering decision. One flat list: the levels were lost upstream, at conversion or in a rebuild, and no reader setting will conjure them back.

## Getting levels back, and keeping them

Restoring nesting is hand-work, because the hierarchy exists only in your head and the navigation file — no tool can infer it from a flat list. An editor that exposes the TOC tree, such as Sigil or Calibre's editor, lets you author the nested list directly; our [Sigil guide](/blog/sigil-epub-editor) covers when that class of tool is the right reach. Edit the copy you distribute, and expect the next automated rebuild to flatten it again — nesting is fragile precisely because every regeneration starts from the spine.

If a book has to survive automated pipelines, structure it so the levels you care about are file boundaries: a file per section rather than a file per chapter with anchored headings. A rebuild will still demote everything to one flat list, but every section survives as an entry a reader can reach, instead of vanishing with its anchor. And before blaming any device, spend the thirty seconds on the zip-and-look check — then run the file through the [validator](/epub-validator) to confirm the archive and its navigation documents are structurally sound. It will not referee your hierarchy, but it will tell you the map you authored is at least still in the book.

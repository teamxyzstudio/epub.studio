---
title: 'Combine EPUB files into one book — and fix what breaks'
excerpt: 'How to combine EPUB files into one book: what a real merge rebuilds, what it drops — images, cover, styling — and the repairs worth doing after.'
category: 'How-to'
ogImage: '/blog-og/combine-epub-files.png'
date: 2026-10-04
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - merge-epub
  - epub-metadata-editor
  - epub-cover-editor
howToTitle: 'How to combine EPUB files into one book'
howTo:
  - t: 'Gather DRM-free EPUBs'
    d: 'Only books without DRM can be read by any merge tool. Keep copies of the originals — the merge builds a new file and cannot be undone from the result.'
  - t: 'Merge them in reading order'
    d: 'Drop the files onto the merge tool together. Selection order becomes book order, and each source book gets its own titled section in the combined contents.'
  - t: 'Fix the title and author'
    d: 'The merged book is born with the filenames glued together as its title and only the first book''s author. Retype both in the metadata editor and save.'
  - t: 'Give it a cover'
    d: 'No source cover survives the merge. Add one in the cover editor so the omnibus is recognisable on a shelf.'
  - t: 'Validate before sending it anywhere'
    d: 'Run the finished file through the validator. A clean pass means the container, package and navigation all agree.'
faqs:
  - q: 'Why is the merged book''s title just the filenames stuck together?'
    a: 'Because a merge tool has no way to know what you want the omnibus called, ours defaults to the source filenames joined with a plus sign. It is a placeholder, not a verdict. Retype the real title in a metadata editor and the shelf entry is fixed in under a minute.'
  - q: 'Do the original files get changed when I combine them?'
    a: 'No. A merge reads the source books and builds an entirely new EPUB; the files you dropped are untouched, and in our tool they never leave the browser. Keep the originals anyway — they are the only reliable way back to separate books.'
  - q: 'Can I combine books that have DRM?'
    a: 'No. DRM-protected files cannot be opened by any merge tool, ours included, and removing the protection is not something this site does or explains. Only DRM-free EPUBs — your own manuscripts, public-domain books, DRM-free store purchases — can be combined.'
  - q: 'Does the reading order change when books are combined?'
    a: 'No. Each book keeps its own chapter order, and the books themselves follow the order you selected them in. The merged file has a single spine listing every chapter in sequence, which you can confirm by opening the new table of contents.'
  - q: 'Can I split the omnibus back into the original books later?'
    a: 'Not exactly. A splitter can divide the file by chapters, but it cannot know where one source book ended, and the dropped images and styling do not come back. Calibre''s EpubMerge plugin can un-merge only when it saved metadata at merge time. The real answer is to keep the originals.'
draft: false
---

The question keeps resurfacing on MobileRead, year after year: how do you
merge a stack of EPUBs — a serial published in parts, a run of short stories,
a fanfic series — into one book with one table of contents? The honest answer
has two halves. Combining EPUB files is genuinely easy now; a browser can do
it in seconds. But a merge is demolition work as much as assembly, and nobody
tells you what gets knocked down. So we merged two real books, measured every
byte that survived and every byte that did not, and this is the full account —
including the ten minutes of repair that turn the raw output into an omnibus
worth keeping.

## Why you cannot just staple EPUBs together

An EPUB is a ZIP archive with a strict internal government: one `content.opf`
package file that lists every resource (the manifest) and fixes the reading
order (the spine), plus one navigation document that generates the table of
contents. One book, one government. There is no such thing as an EPUB
containing two package files that readers would politely play in sequence.

So a merge cannot concatenate anything. It has to read every chapter out of
every source book, rename them into one sequence, write a new manifest and
spine that list them all, regenerate the navigation document from scratch, and
mint fresh metadata for a book that never existed before. Every one of those
rebuilt parts is a place where something from the sources can fail to carry
over — which is exactly what the measurements below show.

## Two poets, one file: a real merge, measured

We built two small books with our own tools to keep every number checkable: a
2,713-byte Blake selection (two poems, two chapters, its own stylesheet) and a
2,778-byte Whitman — one poem, a stylesheet, a cover image, and an inline
pennant graphic. Dropped together onto the merge tool,
they came back as one 4,694-byte `merged.epub`. Unzipping it shows
precisely what a merge builds:

```
$ unzip -l merged.epub   (4,694 bytes total)
     251  META-INF/container.xml
     386  OEBPS/chapter-001.xhtml
     782  OEBPS/chapter-002.xhtml
     664  OEBPS/chapter-003.xhtml
     393  OEBPS/chapter-004.xhtml
     704  OEBPS/chapter-005.xhtml
    1339  OEBPS/content.opf
     635  OEBPS/nav.xhtml
     452  OEBPS/style.css
     958  OEBPS/toc.ncx
      20  mimetype
```

Three chapters of poetry went in; five files came out. Chapters 001 and 004
are new: generated title pages, one per source book, carrying that book's
title and author as a section divider. The navigation document was rebuilt to
list everything — the Blake section, its two poems, the Whitman section, his
one — and an NCX file was added alongside it so older reading apps get a
table of contents too. The spine runs straight through all five files in the
order the books were selected. Structure-wise, the omnibus is complete.

<figure>
  <img src="/blog-media/combine-epub-files/merge-run.png" alt="The merge EPUB files tool's finished panel: a tick, 'Your merged EPUB is ready', and 'merged.epub · 5 KB · never left your device' above a Download EPUB button." width="760" loading="lazy" />
  <figcaption>The live /merge-epub run on the two fixture books: 2,713 + 2,778 bytes in, one 4,694-byte book out.</figcaption>
</figure>

## What the combined book loses

Now the demolition report, read straight from the same archive.

| In the source books | In the merged book |
|---|---|
| Every chapter, in order | Kept — renamed `chapter-001` … `chapter-005` |
| Two book titles | Replaced by the filenames glued together: `songs-selection + o-captain` |
| Two authors | Only the first book's author survives — Whitman is gone |
| Whitman's cover image | Dropped — the omnibus has no cover at all |
| An inline pennant graphic | Dropped — an empty paragraph marks where it stood |
| Two stylesheets | Both discarded, replaced by the merge tool's own generic one |

None of this is carelessness; each loss is a collision being avoided. Two
books can both ship `images/cover.png` or `css/book.css`, and copying both
into one archive would mean one silently overwriting the other — so our tool
takes the text and leaves the resources behind. The author field cannot hold a
judgement about whose book this now is, so it inherits the first one. The same
renaming that makes the chapters collision-proof also breaks any link that
pointed at a chapter by its old filename — we measured that failure mode in
detail in <a href="/blog/epub-links-not-working">EPUB links not working</a>,
where a merged book's cross-file links died while its same-page anchors
survived.

The lesson is not "merging is broken". It is that the raw merge output is
scaffolding, and the tools that fix it are the same ones you would use on any
EPUB.

## The ten-minute repair loop

First, the identity. We dropped `merged.epub` onto the <a
href="/epub-metadata-editor">EPUB metadata editor</a>, which read back exactly
what the merge had written: title `songs-selection + o-captain`, author
`William Blake`. Retyping those as *Blake and Whitman: selected verse* and
*William Blake, Walt Whitman* and saving produced a 4,704-byte file whose
package metadata now says precisely that — ten bytes of difference, and the
book stops looking like a temp file on every shelf it lands on.

<figure>
  <img src="/blog-media/combine-epub-files/metadata-fix.png" alt="The EPUB metadata editor showing merged.epub loaded, with Title 'Blake and Whitman: selected verse', Author 'William Blake, Walt Whitman', Language 'en', and a Save changes button." width="760" loading="lazy" />
  <figcaption>The repair: the editor pre-fills what the merge wrote, and both fields are retyped before saving.</figcaption>
</figure>

Second, the face. The merge carried no cover over, so the omnibus opens as a
blank tile in most library views. The <a href="/epub-cover-editor">EPUB cover
editor</a> adds one in a single step — worth doing for any book you intend to
keep, and the difference between finding the omnibus on a crowded shelf and
scrolling past it.

Third, the check. The finished file went through the validator and passed —
container, package, spine and navigation all agree:

<figure>
  <img src="/blog-media/combine-epub-files/merged-validator.png" alt="The EPUB validator report for the merged book: a tick, 'This EPUB is valid', and one OK line reading 'No problems found. This EPUB is structurally valid.'" width="760" loading="lazy" />
  <figcaption>The merged omnibus through /epub-validator: structurally valid on the first pass.</figcaption>
</figure>

That pass matters more after a merge than after most conversions, because a
merge rewrites exactly the files — manifest, spine, navigation — whose
disagreements produce the classic broken-TOC and missing-chapter symptoms.

## When a browser merge is the wrong tool

Being realistic about this: our merge is text-first by design, and some
omnibuses are not text-first jobs.

- **Image-heavy books.** If the illustrations are the point, a tool that drops
  images to avoid filename collisions is the wrong instrument. Keep those
  books separate, or use a desktop tool that rewrites image paths instead of
  discarding them.
- **You might want the books back.** Calibre's
  <a href="https://github.com/JimmXinu/EpubMerge">EpubMerge plugin</a>
  combines "existing (non-DRM) EPUB format eBooks" and can "UnMerge previously
  merged epubs if metadata was saved during merge" — a round trip no browser
  tool offers. If un-merging matters to you, that is the better home for the
  job. Our splitter can divide an omnibus by chapters, but it cannot know
  where one source book ended.
- **DRM.** A book with DRM cannot be opened by any merge tool, and removing
  the protection is not something we do or explain. This whole workflow is for
  DRM-free files: your own writing, public-domain texts, DRM-free purchases.
- **Carefully typeset books.** Both source stylesheets are discarded, so a
  book whose designer sweated the stanza gaps will come out plainer than it
  went in. For verse specifically, the survival rules are their own subject —
  we mapped them in <a href="/blog/poetry-in-epub">poetry in EPUB</a>.

## A series worth binging deserves one file

The workflow, end to end, is twenty minutes the first time and ten after
that: merge in reading order, retitle, re-author, add a cover, validate. Every
step runs in the browser, nothing is uploaded anywhere, and the originals stay
exactly as they were — the omnibus is an addition to your library, not a
replacement. Start by dropping the series onto the <a
href="/merge-epub">EPUB merger</a> in the order the books should read, and
treat the five minutes of repair afterwards as part of the job. The result is
what the stack of files never was: one book, one contents page, one place to
pick up where you left off.

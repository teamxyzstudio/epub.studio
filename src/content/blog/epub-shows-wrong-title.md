---
title: 'EPUB shows the wrong title or author? The two-line fix'
excerpt: 'An EPUB that shows the wrong title or an Unknown author is obeying two lines inside the file. Where the shelf name really lives — and the two-minute fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-shows-wrong-title.png'
date: 2026-10-09
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-metadata-editor
  - epub-validator
  - txt-to-epub
howToTitle: 'How to fix an EPUB''s wrong title or author'
howTo:
  - t: 'Read what the file really says'
    d: 'Drop the book on the metadata editor. The form pre-fills from the package document inside the archive — those fields are the shelf entry, whatever the filename or an old store listing claims.'
  - t: 'Retype the title and author, then save'
    d: 'Correct the Title and Author fields and run the tool. It rewrites only those lines in the package document; chapters, styles and images pass through untouched.'
  - t: 'Rename the file to match'
    d: 'The corrected download keeps its original filename. File managers, and any app that falls back to filenames, go on showing the old junk until the .epub itself is renamed.'
  - t: 'Replace the copy your library already imported'
    d: 'A shelf shows the metadata it read at import time. Delete the stale entry and add the corrected file, and the entry rebuilds from the new title and author.'
faqs:
  - q: 'Why does my ereader show the filename instead of the real title?'
    a: 'Because the filename probably is the title, as far as the file is concerned. When a source carries no title of its own, converters write the filename into the book''s title field — our own text converter turned final-v7-REALLY-FINAL.txt into the shelf title Final V7 REALLY FINAL in this post''s test. The reader is faithfully displaying what the file says.'
  - q: 'Why is the author listed as Unknown?'
    a: 'The author field is optional in the EPUB spec, and the formats people convert from usually carry no author at all — plain text has nowhere to put one and most PDFs never had one filled in. A converter either leaves the field out or writes a placeholder such as Unknown, and the shelf repeats it. One edit in a metadata editor replaces it.'
  - q: 'Does renaming the .epub file change the title my reader shows?'
    a: 'Usually not. A reading app that parses the package document takes its shelf entry from the title line inside the archive and ignores the filename entirely. Renaming matters to file managers, and to apps falling back on the filename because the metadata is blank — so fix the metadata first, then rename the file to match it.'
  - q: 'Why did a validator pass my book when its title is wrong?'
    a: 'Validation checks structure, not sense. We ran a book with an empty title element and no author through our validator during this post and it reported no problems — the required title tag existed, which is all the check asks. A book can be perfectly valid and still anonymous on the shelf.'
  - q: 'Will fixing the file update copies already on my ereader or in a store?'
    a: 'No. Editing the file changes that file only. A copy already imported into a device or app keeps the entry it was imported with until you replace it, and a store''s pages render from the store''s own catalogue, not from your repaired file. Fix the file, then re-import it — or re-upload it if the book is on sale.'
draft: false
---

We manufactured a broken book for this post, and it took one step. We renamed our standard test manuscript to `final-v7-REALLY-FINAL.txt` — the filename every real draft eventually acquires — and ran it through [our text converter](/txt-to-epub). The 1,550-byte text file came back as a 5,219-byte EPUB, and inside its package document sat the whole problem, verbatim:

```xml
<dc:title>Final V7 REALLY FINAL</dc:title>
<dc:creator>Unknown</dc:creator>
```

Put that file on any shelf and you get the complaint that has been resurfacing on the MobileRead forums for over a decade: the EPUB shows the wrong title — or the filename *as* the title — and the author sits there as "Unknown". The book opens fine. The text is all there. Only the label is wrong, and it is wrong in the most public place a book has.

<div class="callout">
<div class="callout-kicker">The short answer</div>
The name on the shelf comes from two lines of metadata inside the file — the title and creator fields of the package document. A metadata editor rewrites them in about two minutes. Renaming the file, re-converting the book, or switching reading apps does not touch them.
</div>

## Why an EPUB shows the wrong title

An EPUB is a zip archive, and one file inside it — the package document — carries the book's identity. The EPUB 3.3 specification [requires exactly three metadata fields](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html): an identifier, a language, and a title; the creator field, the one that puts a name under the title, is optional. A reading app building its library view parses those lines and prints what it finds. The filename on disk is not part of the book's identity at all — it is what some apps fall back on when the lines inside say nothing useful.

Which explains where wrong-named books come from: they are almost never corrupted later; they are **born mislabelled, at conversion time**. Plain text has no metadata slot for a title, so our converter does the only honest thing available and derives one from the filename — that is how `final-v7-REALLY-FINAL` became the shelf title "Final V7 REALLY FINAL" above. The author became "Unknown" because a .txt file cannot name its author and the converter refuses to invent one. PDFs are little better; we dissected that case in [converting a PDF to an ebook](/blog/convert-pdf-to-ebook), where the output inherited the filename as its title and "Unknown" as its author for the same reason. Word processors export whatever sits in their document-properties dialog, which nobody has opened since the file was created.

So the wrong name is not your reader being difficult. The file genuinely says that.

## 'No problems found', says the validator

Here is the part that costs people an evening: no checker will warn you about any of this. We dropped our deliberately mislabelled book onto [our validator](/epub-validator) and it reported *No problems found. This EPUB is structurally valid.* Then we went further — unpacked the book, emptied the title element to `<dc:title></dc:title>`, deleted the creator line entirely, repacked it correctly. Still a pass:

![The EPUB validator's report on the empty-title book: a pink tick, the heading "This EPUB is valid", and one OK line reading "No problems found. This EPUB is structurally valid."](/blog-media/epub-shows-wrong-title/validator-empty-title.png)

That is not a flaw peculiar to our checker — it is what validation means. The spec demands that a title element *exists*; no machine can rule on whether "Final V7 REALLY FINAL" is a good name for your novel. Our validator checks presence, not sense, and says so. Valid and well-labelled are different properties, and only one of them is a validator's job.

## Rewrite the two lines

The repair is the shortest one on this site. Drop the book on our metadata editor and pause on what appears before you type anything:

![The metadata editor's form after loading final-v7-REALLY-FINAL.epub: Title pre-filled with "Final V7 REALLY FINAL", Author with "Unknown", Language with "en", Publisher empty, above a Save changes button.](/blog-media/epub-shows-wrong-title/metadata-editor-prefill.png)

The form pre-fills from the package document itself, which makes it a diagnosis as much as an editor: those fields are what your file actually says, not what any app, store page or filename claims. If the title box shows junk, you have found the fault.

We retyped the title as *Specimen*, the author as *A. N. Author*, and saved. The 5,219-byte input came back at 5,207 bytes; unzipping the download confirmed `<dc:title>Specimen</dc:title>` and `<dc:creator>A. N. Author</dc:creator>` with every chapter, stylesheet and the navigation file byte-identical in content. The editor rewrites the lines you change inside the existing package document and passes everything else through. It runs in the browser; the book never leaves your machine.

Two small jobs remain after the save. The download keeps its original filename — deliberately, so you can find it — which means file managers still show `final-v7-REALLY-FINAL.epub` until you rename it; do that now, while the real title is in front of you. And any library that already imported the old copy is showing the entry it read at import, so delete that entry and add the corrected file. If the mislabelled book is published and on sale somewhere, the metadata edit is only half the errand — [fixing a typo in a published ebook](/blog/fix-typo-in-published-ebook) walks the re-upload half.

## Where the wrong name survives the fix

Being realistic about the edges. A store's catalogue page is the store's database, not your file — repairing the EPUB fixes what you distribute from now on, never what a platform already lists. Library apps that keep their own catalogue behave the same way in miniature: they show what their database holds until the book is re-imported, which is why a name corrected in one app can look stubbornly wrong in another. And our editor works on five fields — title, author, language, publisher, description. Series names, sort-order refinements and the other catalogue niceties some apps layer on top are non-standard extras it deliberately leaves alone; a blank field in the form means *leave this unchanged*, so it cannot erase a field either, only rewrite it. For surgery beyond the five, a code-level editor like Sigil is the right instrument.

None of that diminishes the main event. The complaint sounds like a reader bug, the forums treat it like a mystery, and it is neither — it is two lines of XML that nobody was ever shown. The [metadata editor](/epub-metadata-editor) shows you the lines and lets you rewrite them, and the whole repair is done before the kettle boils.

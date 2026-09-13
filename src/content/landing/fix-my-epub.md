---
title: 'Fix my EPUB — find the fault and repair it in the browser'
h1: 'Fix my EPUB'
excerpt: 'A broken EPUB is usually one small fault, not a lost book. Check the file in your browser, match the symptom to its cause, and follow the guide that fixes it.'
type: 'audience'
primaryKeyword: 'fix my epub'
date: 2026-09-13
ogImage: '/landing-og/fix-my-epub.png'
embedTool: 'epub-validator'
embedHeadline: 'Drop the broken EPUB — get a plain-English diagnosis'
embedHeadlineMobile: 'Tap to choose the broken EPUB (.epub)'
tools:
  - epub-validator
  - epub-cover-editor
  - epub-metadata-editor
  - epub-reader
guides:
  - fix-typo-in-published-ebook
  - edit-an-epub
  - what-is-inside-an-epub
howToTitle: 'The triage, in order'
howTo:
  - t: 'Check the file first'
    d: 'Drop it in the validator above. Seven structural checks run in your browser, and each failure comes back in plain English — the diagnosis comes before any repair.'
  - t: 'Match the symptom to its cause'
    d: 'The table below maps what you are seeing — a refused file, a missing cover, a scrambled table of contents — to the mechanism behind it and the guide that walks the repair.'
  - t: 'Make the fix'
    d: 'Cover and metadata faults are one-tool jobs with the editors on this page. Structural faults mean editing the package or re-converting from the source — the matched guide says which.'
  - t: 'Prove it works'
    d: 'Run the repaired file through the validator again, then open it in the browser reader. A clean check plus a real read-through is the honest definition of fixed.'
faqs:
  - q: 'My app says the file is corrupt. Is the book lost?'
    a: 'Almost never. "Corrupt" is what reading apps say about any structural fault — most often an EPUB that was unzipped and re-zipped incorrectly, which leaves the mimetype entry in the wrong place. The text is still inside the archive; the container around it needs rebuilding.'
  - q: 'Can this page fix my EPUB automatically?'
    a: 'No, and it does not pretend to. The validator diagnoses; the repair depends on the fault. A wrong cover or bad metadata is a one-tool fix with the editors here. A broken manifest or navigation file means editing the package or re-converting from the source — the matched guide walks each case.'
  - q: 'Why does the book open in one app but fail in another?'
    a: 'Because reading apps enforce different amounts of the specification. Lenient readers silently repair faults — malformed XHTML, a manifest that disagrees with the spine — while strict readers and store pipelines reject them. The file was faulty everywhere; only the strict reader told you.'
  - q: 'Is the broken file uploaded to a server?'
    a: 'No. The validator, the editors and the reader all run inside your browser — the file never leaves your device. That also means there is no file-size ceiling and nothing to delete afterwards.'
  - q: 'Can these tools open a DRM-protected book?'
    a: 'No. A file locked with DRM will fail here whatever else is wrong with it, and this site does not remove DRM in any direction. If the book came from a store or a library app, the fix is at the source — re-download it, or read it in the vendor''s own app.'
draft: false
---

A broken EPUB is bad at explaining itself. One app says "this file is corrupt",
another opens it without complaint; KDP refuses it with a code, the cover
vanishes on a Kobo, the table of contents lists chapters that no longer exist.
Behind "fix my EPUB" is really a different request — *tell me what is actually
wrong* — and that is the right order to work in. Diagnosis first, repair
second. The drop zone above is the diagnosis: a working validator, not a
picture of one.

What it checks is worth stating plainly. Seven structural checks — the
mimetype entry, the container, the package document's XML, the required
metadata, every manifest reference, the spine, the navigation document — each
reported in plain English rather than an error code. It is not EPUBCheck, the
official validator that runs hundreds of rules, and a pass here is not a
promise that a store will accept the book. But the overwhelming majority of
files that "won't open" fail one of those seven, and the report names which.

The reason most broken EPUBs are fixable is the format itself. An EPUB is a
zip archive with rules: a manifest that must list every file, a spine that
must agree with the manifest, a navigation document that must agree with both.
Almost everything that gets called corruption is a disagreement between those
parts — an image the pages reference at a path the manifest no longer matches,
a cover present in the archive but never marked as one. The book's text is
nearly always intact. The bookkeeping around it is what broke.

## Match the symptom to the fix

| What you see | What it usually is | The guide |
| --- | --- | --- |
| "File is corrupt" — will not open at all | The archive was re-zipped wrongly; the mimetype entry is misplaced | [Fixing corrupt EPUB files](/blog/fixing-corrupt-epub-files) |
| A store or converter refuses the file | A structural fault the validation report names | [Validation errors explained](/blog/epub-validation-errors-explained) |
| Opens in one app, breaks in another | Strict readers enforce rules that lenient ones quietly repair | [EPUB compatibility problems](/blog/epub-compatibility-problems) |
| Cover missing after sideloading | The image is in the file but not marked in the manifest | [EPUB cover not showing](/blog/epub-cover-not-showing) |
| Images gone after a conversion | Manifest entries and page references drifted apart | [EPUB images not showing](/blog/epub-images-not-showing) |
| Table of contents scrambled or incomplete | The navigation file drifted from the spine | [Table of contents problems](/blog/epub-table-of-contents-problems) |
| Embedded fonts ignored on device | The converter or the reader's own setting overrides them | [Embedded fonts not working](/blog/epub-embedded-fonts-not-working) |
| Broken paragraphs after a PDF conversion | Carried over from how the PDF stored its text | [PDF to EPUB formatting problems](/blog/pdf-to-epub-formatting-problems) |
| Stray italics and odd spacing after Calibre | Direct formatting inherited from the source document | [Calibre conversion problems](/blog/calibre-epub-conversion-problems) |
| A fixed-layout book renders wrongly | Layout declaration, viewport or app support — not damage | [Fixed-layout EPUB problems](/blog/fixed-layout-epub-problems) |

Two families of fault on that list are one-tool jobs. A cover that exists but
never shows is repaired by the [cover editor](/epub-cover-editor), which
replaces the image and marks it correctly in one pass. A book that shows the
wrong title, the wrong author or a stale series name is the
[metadata editor](/epub-metadata-editor) — the file's contents are fine; its
label is what needed fixing. Everything else on the list is a repair the
matched guide walks step by step, usually by correcting the package by hand or
re-converting from a cleaner source.

Then prove the fix. Re-run the validator until the report is clean, and open
the result in the [browser reader](/epub-reader) — on the same machine, no
install — because a clean structural report and a book that actually reads
correctly are two different claims, and you want both.

Two honest limits. DRM is the hard one: a book locked by a store or a library
app will fail here no matter what else is wrong with it, and this site does
not remove DRM in either direction — the repair for those files is at the
source, not in a toolbox. The other is the difference between broken and
badly made: a conversion full of formatting problems is a quality fault in
the source, not a structural one, and the last three rows of the table lead
to guides about exactly that. And before a store submission, run EPUBCheck as
the final gate — this validator catches the common fatal faults instantly,
but the official tool is the one the stores' own pipelines resemble.

All of it is free, in the browser, with no account. The shelf below is the
repair kit in one place.

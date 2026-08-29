---
title: 'EPUB validation errors explained: epubcheck decoded'
excerpt: 'EPUB validation errors explained: what epubcheck codes like RSC-005, OPF-014 and PKG-006 actually mean, and the fix each one is pointing you toward.'
category: 'Fix it'
ogImage: '/blog-og/epub-validation-errors-explained.png'
date: 2026-07-26
updated: 2026-08-29
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
  - epub-metadata-editor
faqs:
  - q: 'What does RSC-005 actually mean?'
    a: 'On its own, almost nothing — it is epubcheck''s catch-all for a file it could not parse. The real information is the sentence after the colon, which hands you the underlying parser''s complaint with a line and column: an unclosed tag, a stray ampersand, a duplicated attribute. Ignore the label and read the message.'
  - q: 'Why does epubcheck flag OPF-014 when the book works fine?'
    a: 'Because it is enforcing bookkeeping, not function. If a chapter uses SVG, scripting, MathML or remote resources, the manifest entry for that document has to advertise it with a properties attribute. The feature renders regardless; what is missing is the declaration — add the property to the manifest item and the error clears.'
  - q: 'Why can''t I just re-zip the EPUB to fix PKG-006?'
    a: 'PKG-006 means the mimetype file is missing or is not the first entry in the archive, and a normal desktop archiver cannot guarantee that placement — the file also has to be stored uncompressed, which is its own error. The archive needs rebuilding by an EPUB-aware tool that writes the mimetype first and uncompressed.'
  - q: 'What is the difference between RSC-007 and OPF-003?'
    a: 'They are mirror images. RSC-007 means something is referenced — an image, a stylesheet, a chapter — but the file is not in the archive; restore it or drop the reference. OPF-003 means the opposite: a file exists in the archive but the manifest never declares it; add it to the manifest, or delete it if it is genuinely unused.'
  - q: 'What is the NCX file that NCX-001 complains about?'
    a: 'The NCX is the legacy navigation file that older readers still use. NCX-001 says the identifier inside it disagrees with the dc:identifier in the OPF — two files describing the same book with different IDs. Make the two values equal and the error clears; a metadata editor settles the dc: side directly.'
  - q: 'Does epubcheck repair the file for me?'
    a: 'No — neither epubcheck nor any validator edits the book. Once a code has named the fault, the repair happens elsewhere: in a metadata editor for the dc: fields, in a clean round-trip reconversion for structural damage, or by hand in Sigil or Calibre when a chapter''s XHTML is the problem.'
draft: false
---

Run a book through epubcheck and it answers in a private language. `RSC-005`. `OPF-014`. `PKG-006`, twice, then a line number and a path to a file you have never opened. The report is technically complete and almost useless unless you already know the code system — which is the one thing nobody hands you.

This post is that missing key. EPUB validation errors, explained one code family at a time: what each of the common messages is really telling you, and what to change. epubcheck — [the conformance checker](https://github.com/w3c/epubcheck) the DAISY Consortium maintains on behalf of the W3C — is pedantic on purpose. It tests a file against the letter of the EPUB specification so that a store's ingestion pipeline, or a reading app, does not have to. Cryptic is the price of being exact.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Every epubcheck code is a <strong>category prefix plus a number</strong>. The prefix — <code>PKG</code>, <code>OPF</code>, <code>RSC</code>, <code>HTM</code>, <code>NCX</code>, <code>CSS</code> — tells you which part of the book is wrong: the packaging, the manifest, a resource reference, the XHTML, the navigation, or a stylesheet. Read the prefix first, then the message after the colon, which names the actual file and the actual problem.
</div>

## Why epubcheck speaks in codes

An EPUB is a ZIP archive with strict rules about what goes inside and how the pieces refer to each other. epubcheck walks the whole structure and checks it against those rules. Each rule has a stable identifier so the tool can report the same failure the same way in any language, and so automated systems can act on the result without reading English.

That design is why the message feels terse. The code is the rule; the human sentence is a template with your file's details slotted in. `RSC-007` is always "a referenced resource could not be found" — the version you see just has your missing filename filled in. Once you can read the prefix, the wall of codes collapses into six small groups: `PKG` is the outer package (the archive and the `mimetype` file), `OPF` is the package document (manifest, spine, declared properties), `RSC` covers resources and references that are missing or unparseable, `HTM` is the XHTML chapters, `NCX` is the legacy navigation file older readers still use, and `CSS` is stylesheet parsing.

## The ten codes you will actually see

Most real reports are variations on the same handful. Here is what each of the common ones means and what to change. The exact wording is epubcheck's own; the third column is the fix it is pointing at.

| Code | What epubcheck is saying | What to change |
|---|---|---|
| `PKG-006` | Mimetype file entry is missing or is not the first file in the archive | Rebuild the ZIP so `mimetype` is the first entry — a normal archiver cannot do this |
| `PKG-007` | Mimetype should contain only `application/epub+zip` and must not be compressed | Store the `mimetype` uncompressed; check it holds exactly that string, no trailing newline |
| `RSC-005` | Error while parsing file: … | The real problem is the text after the colon — an XML error in a chapter or the OPF |
| `RSC-007` | Referenced resource could not be found in the EPUB | A file is linked (an image, a stylesheet, a chapter) but not in the archive; restore it or drop the reference |
| `RSC-001` | File could not be found | Same idea at container level — a path in `container.xml` or the OPF points at nothing |
| `OPF-003` | Item exists in the EPUB, but is not declared in the OPF manifest | Add the orphan file to the manifest, or delete it if it is genuinely unused |
| `OPF-014` | The property should be declared in the OPF file | Content uses a feature (`svg`, `scripted`, `mathml`, `remote-resources`) that the manifest item must advertise |
| `OPF-015` | The property should not be declared in the OPF file | The reverse — a declared feature the file does not actually use; remove the property |
| `HTM-004` | Irregular DOCTYPE: found …, expected … | A chapter carries an old or malformed doctype; replace it with the plain `<!DOCTYPE html>` |
| `NCX-001` | NCX identifier does not match OPF identifier | The `dc:identifier` in the OPF and the `dtb:uid` in `toc.ncx` disagree; make them equal |

Two of these deserve a sentence more, because they are the ones people stare at longest.

`RSC-005` is the catch-all, and its code tells you almost nothing on its own. epubcheck hit a file it could not parse and is handing you the underlying parser's complaint verbatim — an unclosed tag, a stray `&` that should be `&amp;`, a duplicated attribute. The habit to build is to ignore the `RSC-005` label entirely and read the sentence after the colon, which points at a line and column. That is where the real fault is.

`OPF-014` confuses people because nothing looks broken. The book opens, the SVG cover renders, the scripted widget runs. epubcheck is enforcing a bookkeeping rule: if a content document uses SVG, scripting, MathML, or remote resources, the manifest entry for that document has to say so with a `properties` attribute. The feature works; the declaration is missing. `OPF-015` is the mirror image — you declared a property the file never uses.

## Errors, warnings, and what you can leave alone

epubcheck labels each result, and the label matters more than the count. A file with twenty warnings and no errors is in far better shape than one with a single error.

**Errors break conformance.** A compressed `mimetype` (`PKG-007`), a missing referenced resource (`RSC-007`), an XHTML file that will not parse (`RSC-005`) — these are the failures that get a file bounced at a store's front door or make it open blank in a strict reader. Fix all of them before publishing.

**Warnings are things that work but carry a cost.** An irregular doctype, an EPUB 2 package, a stylesheet quirk epubcheck can parse but does not love. For a book you are only ever going to read yourself, most warnings can wait. For a book headed to a store, clear them too, because ingestion systems often reject on warnings the specification technically tolerates. The rule of thumb: errors are non-negotiable, warnings are a judgement call scoped to where the file is going.

## What our Validator shows instead of codes

Our own [EPUB Validator](/epub-validator) takes a deliberately different line. It is not a full epubcheck port and does not pretend to be — it is a fast structural pass that runs entirely in your browser, and it reports in plain English rather than codes. Under the hood it checks the failures that actually make readers reject a file: a missing or wrong `mimetype`, a `container.xml` that does not point at a package document, an OPF with malformed XML, absent `dc:title` / `dc:language` / `dc:identifier`, manifest entries whose files are not in the archive, an empty spine, and a missing navigation document. So where epubcheck would emit `RSC-007`, our tool says, in as many words, that a manifest entry points at a file that is not there.

That trade is intentional. For the quick "is this book broken, and where" question, a local plain-language answer beats a code you then have to look up. For the full, line-by-line report a store expects — every `OPF-014`, every `CSS` nuance — run epubcheck itself; it is the authority and produces the record a publisher can act on. Ours is for triage, epubcheck for the exhaustive audit.

Being realistic about the limits: neither tool edits the book for you. Once a code has named the fault, the repair still happens somewhere — in the [Metadata Editor](/epub-metadata-editor) for the `dc:` fields behind `NCX-001` and the missing-metadata errors, in a round-trip conversion for structural damage, or by hand in Sigil or Calibre when a chapter's XHTML is the problem. The walk-through on [repairing rejected EPUBs](/blog/fixing-corrupt-epub-files) covers those routes in order.

## Reading the report like the machine does

An epubcheck report is a checklist, not a verdict. Group the lines by prefix. Clear every `PKG` and `RSC` error first, because those stop the book from opening at all. Then work the `OPF` lines, which are almost always a mismatch between what the manifest claims and what the archive contains — and if the [structure of an EPUB](/blog/what-is-inside-an-epub) is unfamiliar, that mismatch is where an hour of reading pays for itself. Save the warnings for last, and decide each on where the file is headed. When you want the plain-English triage before reaching for the full checker, run the book through the [Validator](/epub-validator) first — it names the fatal problems locally and tells you which part of the book to open next.

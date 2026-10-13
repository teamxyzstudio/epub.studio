---
title: 'EPUBCheck errors explained: we broke one book seven ways'
excerpt: 'We broke one EPUB seven ways and ran the real EPUBCheck on each break. What PKG-006, RSC-001, RSC-005 and RSC-016 mean — and the faults it never flags.'
category: 'Fix it'
ogImage: '/blog-og/epubcheck-errors.png'
date: 2026-10-13
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
howToTitle: 'How to run EPUBCheck on your own book'
howTo:
  - t: 'Get EPUBCheck'
    d: 'Download the release zip from the official w3c/epubcheck repository on GitHub and unzip it. It needs a Java runtime; nothing else.'
  - t: 'Run it against the file'
    d: 'From a terminal: java -jar epubcheck.jar yourbook.epub. The verdict arrives in seconds for a normal-sized book.'
  - t: 'Fix the first error, not all of them'
    d: 'Read the first line''s code, file and line number, and repair that one fault. Later lines are often echoes of the first.'
  - t: 'Re-run until the tally reads zero'
    d: 'Repeat the run after each fix. Done means "Messages: 0 fatals / 0 errors / 0 warnings".'
faqs:
  - q: 'What does RSC-005 actually mean?'
    a: 'It is EPUBCheck''s generic "this file does not match the schema" error, so the code alone tells you almost nothing — the diagnosis is in the prose after it. The message names the attribute or element the schema refused and lists what would have been allowed at that spot. Read the quoted reason, not the code.'
  - q: 'Why did one typo produce a whole page of errors?'
    a: 'Because a parser that loses track of the document''s structure misreads everything after the fault. In our test, deleting a single closing heading tag produced two misleading RSC-005 errors before the fatal RSC-016 that named the real problem. Fix the first reported fault and re-run; most of the wall usually disappears with it.'
  - q: 'Are EPUBCheck warnings safe to ignore?'
    a: 'Errors mean the file breaks a conformance rule; warnings flag practices that are legal but likely to misbehave in some reading apps. A book with warnings is still a valid EPUB, so a warning is a judgement call — read what it says and decide. An error is not a judgement call: some store pipelines will refuse the file outright.'
  - q: 'Does the epub.studio validator run EPUBCheck?'
    a: 'No. Our browser validator runs seven structural checks — container, mimetype, manifest against archive contents, spine, navigation and so on — entirely in your browser. It caught the missing-file break in this test but passed the unclosed-tag one, because it does not parse chapter markup against the schema the way EPUBCheck does. It is triage, not certification.'
  - q: 'My book passes EPUBCheck — can a store still reject it?'
    a: 'Yes. EPUBCheck certifies conformance to the EPUB specification, and stores layer their own requirements on top: cover dimensions, metadata completeness, content policies, file-size limits. Those house rules are not published as a schema anyone can run, so a clean EPUBCheck pass is necessary rather than sufficient. It removes the most common rejection cause, not all of them.'
  - q: 'Do I need to install anything to use EPUBCheck?'
    a: 'A Java runtime, and the EPUBCheck release zip itself — there is no installer beyond unzipping it. The tool is a command-line program: you point java -jar at the jar file and pass your book''s path. On a machine without Java, the browser check on this site covers the packaging-level faults, which are the ones that make a book unopenable.'
draft: false
---

Paste an EPUBCheck report into a forum and you join a long tradition. The question keeps surfacing on MobileRead — one thread asks whether an error about an SVG attribute on the title page will get the book rejected by a store — and on Adobe's InDesign community, where exports keep failing EPUB check for reasons the export dialog never mentions. The reports all look the same: codes like `RSC-005`, a file path deep inside the archive, a line number, and prose that reads like it was written for the parser rather than the person.

So instead of explaining EPUBCheck errors in the abstract, we manufactured them. We took the specimen book this blog uses for every demonstration — 5,183 bytes, five chapters, passes clean — broke it seven different ways on purpose, and ran the real checker, EPUBCheck 5.2.1, on each break. Five of the seven produced errors, which this post decodes line by line. Two sailed through untouched, and those two silences say as much about what EPUBCheck is as the errors do.

## How to read one error line

Every finding EPUBCheck prints has the same anatomy:

```text
ERROR(RSC-001): missing-file.epub/OEBPS/chapter-003.xhtml(-1,-1): File "OEBPS/chapter-003.xhtml" could not be found.
```

Four parts. The **severity** — `FATAL`, `ERROR`, `WARNING`, plus `INFO` and `USAGE` levels that only appear when you ask for them. The **code** — a prefix naming the rule family (`PKG` for packaging, `RSC` for resources, `OPF` for the package document, and so on) and a number. The **location** — file, then `(line,column)`, with `(-1,-1)` meaning the fault belongs to the archive as a whole rather than any line in it. And the **message**, which is where the actual diagnosis lives.

The summary line at the bottom is the verdict that matters: a book is clean when it reads `Messages: 0 fatals / 0 errors / 0 warnings / 0 infos`.

## One specimen, seven deliberate breaks

Each variant below is the same five-chapter book with exactly one thing done to it. Same text, same structure, one fault apiece.

| The break | EPUBCheck 5.2.1 says |
|---|---|
| mimetype file compressed | `ERROR(PKG-007)` |
| mimetype not the first entry | `ERROR(PKG-006)` |
| chapter deleted, manifest unchanged | `ERROR(RSC-001)` |
| closing `</h1>` deleted in one chapter | 2 × `ERROR(RSC-005)`, then `FATAL(RSC-016)` |
| stray attribute added in the OPF | `ERROR(RSC-005)` |
| orphan CSS file added, undeclared | **passes** — 0 errors |
| link to a fragment that does not exist | **passes** — 0 errors |

The rest of this post walks the table.

## PKG-006 and PKG-007: the container itself

Compressing the `mimetype` file got us:

```text
ERROR(PKG-007): Mimetype file should only contain the string "application/epub+zip" and should not be compressed.
```

and moving it to the end of the archive:

```text
ERROR(PKG-006): Mimetype file entry is missing or is not the first file in the archive.
```

These two are the classic signature of a book that was unzipped, edited and re-zipped with an ordinary archive tool. The [EPUB 3.3 specification](https://github.com/w3c/epub-specs/blob/main/epub33/core/index.html) is strict about this one file: it must be the first entry, must contain exactly `application/epub+zip`, and must not be compressed or carry an extra field in its ZIP header — rules that exist so any software can identify an EPUB by reading the first few dozen bytes. A general-purpose zipper knows none of that. It compresses everything and orders entries however it likes, and the result fails before a single chapter is examined. [What is inside an EPUB](/blog/what-is-inside-an-epub) covers the container layout in full; the practical fix is to repack with a tool that knows the rule, or to edit the book with software that never unpacks it in the first place.

## RSC-001: the manifest promised a file

We deleted `chapter-003.xhtml` from the archive and left the package manifest claiming it exists:

```text
ERROR(RSC-001): File "OEBPS/chapter-003.xhtml" could not be found.
```

The manifest is a contract — every file the book uses, declared up front — and RSC-001 means the contract names something the archive does not contain. It is common after a hand edit (a file renamed inside the archive, but not in the manifest) and after partial copies that silently dropped an entry. The repair is to make the two sides agree: restore the file, or remove its manifest entry and every spine and navigation reference to it.

This is one fault our own browser validator also catches — dropping the same broken file on it this session reported the identical diagnosis:

<figure>
<img src="/blog-media/epubcheck-errors/our-validator-missing-file.png" alt="The epub.studio validator report card headed 'Problems found', with one red ERROR row reading 'Manifest lists chapter-003.xhtml, but that file is not in the archive', above a 'Check another file' link." width="760" loading="lazy" />
<figcaption>Our EPUB validator on missing-file.epub — the same manifest-versus-archive fault EPUBCheck reports as RSC-001.</figcaption>
</figure>

Checking declared-against-actual is packaging-level work, and packaging is exactly what a quick in-browser check is for.

## RSC-005: the schema said no

RSC-005 is the code people quote most and the least specific of them all. It means one thing: *this XML does not match the schema*. Everything useful is in the message text. Our stray attribute in the package file produced:

```text
ERROR(RSC-005): invalid-opf.epub/OEBPS/content.opf(20,38): Error while parsing file: attribute "pagestyle" not allowed here; expected attribute "id", "page-progression-direction" or "toc"
```

Read past the code and the error explains itself — it names the attribute it refused and lists the three it would have accepted on a `spine` element. RSC-005 messages are always like this: the checker quotes the schema's own expectation. The code tells you which family of fault you have; the prose tells you the fault.

The same code also appears for broken markup inside chapters, and that case deserves its own section, because it never arrives alone.

## RSC-016 and the cascade

Deleting one closing `</h1>` tag from chapter two — a single six-character edit — produced three findings:

```text
ERROR(RSC-005): unclosed-tag.epub/OEBPS/chapter-002.xhtml(11,6): Error while parsing file: element "p" not allowed here; expected the element end-tag [… the message lists some fifty permitted elements]
ERROR(RSC-005): unclosed-tag.epub/OEBPS/chapter-002.xhtml(12,6): Error while parsing file: element "p" not allowed here; expected the element end-tag [same list]
FATAL(RSC-016): unclosed-tag.epub/OEBPS/chapter-002.xhtml(13,3): Fatal Error while parsing file: The element type "h1" must be terminated by the matching end-tag "</h1>".
```

Notice the order. The two RSC-005 errors point at lines 11 and 12 — perfectly healthy paragraphs. They are flagged because the parser, still inside the heading that never closed, finds paragraphs where a heading's contents should be. Only the third line, the fatal, names the actual fault, and it does so precisely: an `h1` with no end tag.

That is the cascade, and it is why a one-character typo can fill a screen. The working rule: find the *first* fault in each file, fix it, re-run. Chasing every reported line as though each were a separate problem is how an evening disappears. A fatal, anywhere in the report, is also the line to trust most — it is the point where the parser gave up rather than a guess about intent.

## What EPUBCheck stays silent about

Two of our seven breaks passed. Both silences are worth knowing about before you treat a clean report as a clean book.

The **orphan file** — a CSS file added to the archive and declared nowhere — validated with zero errors. Only when we re-ran with the `-u` flag, which surfaces usage-level notes, did it appear: `USAGE(OPF-003): Item "OEBPS/orphan.css" exists in the EPUB, but is not declared in the OPF manifest.` EPUBCheck treats undeclared cargo as a tidiness note, not a conformance failure. Your book ships the dead weight silently.

The **broken internal link** — a hyperlink pointing at `chapter-002.xhtml#section-nine`, a fragment that exists in no chapter — passed with nothing to report even with `-u`. The file the link points at exists, and that is where this version of the checker stops. A reader tapping that link gets nothing, and no validator run told us so.

Our own validator sits differently on this map, and it is worth being plain about where. It caught the missing-file break, identical verdict to EPUBCheck's RSC-001. But the unclosed-tag book — one fatal and two errors under EPUBCheck — came back from our seven checks clean:

<figure>
<img src="/blog-media/epubcheck-errors/our-validator-unclosed-tag.png" alt="The epub.studio validator report card headed 'This EPUB is valid' with a pink check mark and one green OK row reading 'No problems found. This EPUB is structurally valid', above a 'Check another file' link." width="760" loading="lazy" />
<figcaption>Our EPUB validator passing unclosed-tag.epub — the book EPUBCheck fails with a fatal. Container checks do not parse chapter markup.</figcaption>
</figure> We check the container, not the grammar inside every chapter. That makes the browser check the right first move when a book won't open at all — and the wrong tool to certify a file for upload. [Fix my EPUB](/fix-my-epub) routes the symptoms either way.

## The run that is worth your two minutes

If a book is headed to a store or a distributor, run the real thing before uploading. Download the release from the official [w3c/epubcheck repository](https://github.com/w3c/epubcheck), then:

```bash
java -jar epubcheck.jar yourbook.epub
```

Fix the first error per file, re-run, repeat until the tally is zeros. For the faults that live below the markup — a re-zipped container, a manifest out of step with the archive, a missing navigation document — the [EPUB validator](/epub-validator) on this site gives the same class of verdict in your browser, on a file that never leaves your machine. And when the fault is in the markup itself, the repair means opening the source, for which [Sigil is the honest recommendation](/blog/sigil-epub-editor).

One habit beats both tools: keep the original. Every break in this post was an edit to a working book, and the fastest repair we know is a diff against the copy that still validated.

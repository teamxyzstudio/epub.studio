---
title: 'EPUB compatibility problems: works here, broken there'
excerpt: 'EPUB compatibility problems usually mean one reader enforces rules another ignores. Here''s why the same file breaks in one app, and how to find the fault.'
category: 'Fix it'
ogImage: '/blog-og/epub-compatibility-problems.png'
date: 2026-08-02
updated: 2026-08-29
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-validator
  - epub-metadata-editor
faqs:
  - q: 'Which EPUB readers are strict and which are forgiving?'
    a: 'Apple Books, Kobo, Adobe Digital Editions and a Kindle after conversion treat chapters as the XML they declare themselves to be and stop at the first well-formedness error. Calibre and Google Play Books lean on an HTML-style parser that patches broken markup as it reads, so a faulty book still renders there. Neither camp is wrong — one enforces the rules, the other repairs on the fly.'
  - q: 'Why does a single stray ampersand break a whole chapter?'
    a: 'Because EPUB chapters are XHTML, which is XML, and an XML parser is not permitted to guess. An ampersand typed on its own is not well-formed — it has to be escaped — and when a strict parser meets it, it halts and will not read a byte past the error, so the chapter shows blank or gets skipped entirely.'
  - q: 'My book stops turning pages partway through. Is the file corrupt?'
    a: 'Usually not corrupt — mismatched. The spine lists the chapters in order, and when an entry points at a file that is missing or was renamed without its entry being updated, a strict reader follows the list and stops exactly where it breaks. A forgiving reader skips the broken link, which is why the same book turns fine elsewhere.'
  - q: 'Is it a problem that fonts and margins look different in every app?'
    a: 'No — that is reflowable text working as designed. A book that justifies differently, substitutes a font or sets its margins a shade wider on another app is adapting to the screen, which is the point of the format. Chasing pixel-for-pixel parity across readers is a fight with the format''s design, not a bug to squash.'
  - q: 'Can a fully valid EPUB still fail in some readers?'
    a: 'Yes. Validity is necessary but not sufficient: an EPUB 2-only app or an ancient reader will stumble on a perfectly conformant book, and a fixed-layout or scripted EPUB can be flawless yet fall flat where those features were never implemented. Passing a validator proves the file follows the rules, not that every app supports every feature it uses.'
  - q: 'Why does a book from one store only open in that store''s app?'
    a: 'That is DRM, not a compatibility fault. The file carries encryption that is doing exactly what it was added to do, and no tool reads past it to make the book open elsewhere. It is a property of the licence, not of the EPUB format.'
draft: false
---

The same EPUB can open flawlessly in Calibre on a laptop and arrive broken on a phone — a blank chapter, a book that will not turn past its cover, a table of contents that stops halfway down. Nothing about the file changed on the way over. What changed is how strictly the reading app on the other end enforces the rules an EPUB is meant to follow. That gap is where most EPUB compatibility problems actually live.

It is worth naming the reflex this triggers, because it sends people the wrong way. The book worked on the desktop, so the desktop copy must be the good one and the phone must be at fault. Usually it is the reverse. The lenient app was quietly papering over a fault that the strict app simply refuses to hide.

An EPUB is not one monolithic format that a reader either supports or does not. It is a bundle of web files — XHTML chapters, CSS, images, and an index that ties them together — and every reading app builds its own engine to parse that bundle. Those engines disagree, sometimes sharply, about what to do when the markup inside is not quite right.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB that works in one app and breaks in another is almost always broken in <strong>both</strong> — one reader just hides it. EPUB chapters are XHTML, which is XML, and strict readers like Apple Books and Kobo stop at the first well-formedness error while lenient ones like Calibre patch it silently. Validate the file to see the fault the forgiving app is covering for, then fix that one thing.
</div>

## Why one app renders it and another gives up

The chapters inside an EPUB are XHTML, and the second letter matters more than anything else here: XHTML is XML, and XML has famously unforgiving rules about errors. A web browser reading ordinary HTML forgives almost everything — an unclosed tag, an ampersand that should have been written `&amp;`, a stray attribute — and repairs it on the fly. An XML parser is not permitted to do that. When it meets markup that is not well-formed, the correct behaviour is to stop, not to guess.

That one difference in design explains the split. A forgiving reader such as Calibre or Google Play Books does not run a pure XML parser over the chapters; it leans on an HTML-style parser that patches broken markup as it reads, so the book renders even when the underlying XHTML is malformed. A strict reader — Apple Books, Kobo, Adobe Digital Editions, or a Kindle after conversion — treats the chapter as the XML it declares itself to be. One well-formedness error and the parser halts, so the reader shows a blank page, drops the chapter, or turns the whole book away at the door.

So the file was never "fine on the desktop, broken on the phone". It was broken the whole time. Only one of the two apps was willing to say so.

## The faults that only a strict reader notices

Because the failure is a rule being enforced rather than a file being damaged, the symptoms cluster into a small set. Naming the symptom points at the cause.

| What you see | What is actually wrong | Why only some readers catch it |
|---|---|---|
| A chapter opens blank or is skipped | Malformed XHTML — an unclosed tag, a bare `&` or `<`, a duplicated attribute | A strict XML parser halts at the error; a lenient one repairs it |
| The book stops turning at a certain point | A spine or manifest entry that points at a file that is missing or misnamed | Forgiving readers skip the broken link; strict ones treat the spine as authoritative |
| The whole book refuses to open | A wrong or compressed `mimetype`, or a `container.xml` that does not name the package document | Some readers guess the entry point; strict pipelines require it exactly |
| Images or fonts vanish on one device | A manifest `href` that does not match the file's real path, or a remote resource an offline reader will not fetch | Case-sensitive and offline readers are unforgiving about paths |
| A feature works in one app, ignored in another | An EPUB 3 feature (SVG, scripting) the reader does not implement, or one not declared in the manifest | Support genuinely differs; declaration is a separate rule again |

The first row is the one people meet most, and it is almost always a single character. An ampersand typed as `&` instead of `&amp;`, a `<` that was meant literally, a `<br>` left unclosed where XML wants `<br/>` — any of these makes the chapter's XML not well-formed, and a strict parser will not read a byte past it. The lenient reader glued the tag shut for you and moved on, which is exactly why the desktop copy looked perfect.

The second row is a structural mismatch rather than a text error. If you have read the [structure of an EPUB](/blog/what-is-inside-an-epub), the spine is the ordered list of chapters and the manifest is the inventory of files. When those disagree — a chapter listed but absent, or renamed without updating its entry — a forgiving reader shrugs and carries on, while a strict one follows the list and stops where the list breaks.

## How to find what the lenient reader hid

The trap is that you cannot diagnose the file with the app that renders it, because that app's whole job here is to hide the fault. You need something that applies the rules on purpose.

Start with a validator. The [EPUB validator](/epub-validator) on this site runs a fast structural pass entirely in the browser: it checks that the `mimetype` is right, that `container.xml` points at a real package document, that the OPF parses as well-formed XML, that `dc:title`, `dc:language` and `dc:identifier` are present, that every manifest entry names a file that is actually in the archive, that the spine is not empty, and that a navigation document exists. It reports those faults in plain English, locally, without uploading anything. That is usually enough to see what the strict reader is objecting to.

For the exhaustive, line-by-line account — every well-formedness error with its line and column number — epubcheck is the authority, and the companion post on [decoding epubcheck codes](/blog/epub-validation-errors-explained) explains how to read its report so `RSC-005` stops being a mystery. When the fault is metadata that two files disagree about, the [metadata editor](/epub-metadata-editor) shows and settles the `dc:` fields directly. And when the chapters themselves carry malformed markup baked in by whatever produced the file, a clean round-trip reconversion rebuilds them as well-formed XHTML; the walk-through on [repairing a rejected EPUB](/blog/fixing-corrupt-epub-files) covers those routes in order.

## When it is the reader, not the file

Being straight about the edges saves the afternoon spent fixing a file that was never wrong.

**Sometimes the file is valid and the reader is simply old.** An EPUB 2-only app, an ancient build of Adobe Digital Editions, a reader with no EPUB 3 support — these will stumble on a perfectly conformant book. Here the fix is not the file; it is choosing a reader that keeps up with the spec, or, on that one stubborn device, accepting the limit.

**Rendering differences are not breakage.** Reflowable text is meant to adapt to the screen, so a book that justifies differently, substitutes a font, or sets its margins a shade wider on another app is the format working as designed. Chasing pixel-for-pixel parity across readers is a fight with the point of the format, not a bug to squash.

**A store-locked book is not a compatibility fault.** A file that opens only in one shop's own app carries DRM, and that is encryption doing exactly what it was added to do. No tool here — or anywhere — reads past it to make it open elsewhere; that is a property of the licence, not the EPUB.

**Validity is necessary, not sufficient.** A fixed-layout or scripted EPUB can be flawless and still fall flat on a reader that never implemented those features. Passing a validator proves the file follows the rules; it does not promise every app has chosen to support every feature the file uses.

## Getting the file to stop depending on goodwill

The pattern under nearly every case is the same: one file, two engines, and one of them willing to hide a fault the other will not. The move is to stop trusting the app that says yes and ask the one that says why. Run the book through the [validator](/epub-validator), read the fault it names — an unescaped character, a manifest pointing at a file that is not there, a missing navigation document — and repair that single thing. Once the file is well-formed and its inventory agrees with itself, it stops leaning on any one reader's forgiveness, and "works here, broken there" quietly turns into "works everywhere it should".

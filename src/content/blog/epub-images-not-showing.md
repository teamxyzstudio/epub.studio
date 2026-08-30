---
title: 'EPUB images not showing after conversion: the fix'
excerpt: 'EPUB images not showing after conversion almost always means a broken manifest link, not a lost picture. Here''s the mechanism, and how to find the break.'
category: 'Fix it'
ogImage: '/blog-og/epub-images-not-showing.png'
date: 2026-08-04
updated: 2026-08-30
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-validator
faqs:
  - q: 'Are the missing images actually gone from my EPUB?'
    a: 'Almost never. In the overwhelming majority of cases the picture is still inside the archive, byte for byte, exactly where the converter put it. What broke is a reference — the manifest entry or the chapter''s img src points at a path where the file no longer lives — so the fix is reconnecting a name to a file, not recovering an image.'
  - q: 'Why do the images show in one reading app but not in another?'
    a: 'Because readers differ in how strictly they resolve the book''s references. A strict reader treats an undeclared or misaddressed resource as if it does not exist; another app may resolve the same reference more leniently and still draw the picture. When a book behaves this way, trace the img src literally from the chapter''s own folder — the path is usually the culprit.'
  - q: 'Why did the images disappear when I converted my EPUB to Word or plain text?'
    a: 'That one is by design, not a fault. The converters that turn an EPUB into a DOCX or TXT file carry the text and deliberately leave the pictures behind, rather than mangle them into a format that cannot hold them well. If the images vanished on the way out of EPUB, nothing needs repairing.'
  - q: 'What does the ../ at the start of an image path mean?'
    a: 'It means climb one folder up — the same rule a web page follows. Every path in an EPUB is resolved relative to the file it sits in, so a chapter stored in a text folder reaches a picture in a sibling images folder with ../images/name.png. A converter that moves files without rewriting these paths to match is how most images go missing.'
  - q: 'Can my EPUB pass the validator and still show missing images?'
    a: 'Yes. The structural check confirms that everything the manifest declares is present in the archive; it does not open each chapter to test every img src, and it does not judge whether a media-type is labelled correctly. A book can pass on the manifest half and still point at the wrong place from inside a chapter — that second pointer is a manual read.'
  - q: 'Why don''t images with an http address show up in my book?'
    a: 'A src beginning with http or https points at an image hosted on the web rather than packed into the book. Many readers strip such references, and none of them work offline, so the picture appears only under the right conditions, if at all. The fix is to embed the image in the archive, not to re-point a path.'
draft: false
---

A converted book can read perfectly and still arrive full of holes. The text flows, the chapters are all present, the table of contents jumps where it should — and then a page that ought to hold a diagram, a map or an author photo shows a small broken-image icon, or simply nothing. EPUB images not showing after a conversion is one of the more disorienting failures, because the picture was plainly there in the source file and the book that lost it looks, by every other measure, healthy.

The image is almost never gone. In the overwhelming majority of these cases the picture is still inside the `.epub`, byte for byte, exactly where the converter put it. What broke is not the image but the *link* to it — the short lines of text that tell a reader where the bytes live and what they are. Conversion tools rebuild that plumbing from scratch, moving files into new folders and rewriting every reference, and it is easy for one end of a link to end up pointing somewhere the other end is not.

An EPUB refers to each image twice, and both references have to agree. Get the two pointers straight and the fix becomes almost mechanical — you are not repairing an image, you are reconnecting a name to a file.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An image usually goes missing because a reference points at the wrong place, not because the file was lost. An EPUB names each picture twice — once in the <strong>manifest</strong> (the file index) and once in the chapter's <code>&lt;img src&gt;</code> — and a converter can leave either one aimed at a path that no longer exists. Confirm the file is inside the archive, then check that both references resolve to it. Our <a href="/epub-validator">EPUB validator</a> flags the manifest half directly.
</div>

## Why images vanish in conversion

If you have read [what's inside an EPUB](/blog/what-is-inside-an-epub), the manifest is the part that matters here: a plain-text list, in the OPF file, of every resource the book contains. Each image gets an `<item>` line carrying its location (`href`) and its type (`media-type`, such as `image/jpeg`). That is the first pointer — the book's own inventory of what it holds.

The second pointer lives in the chapter itself. Wherever a picture appears, the XHTML carries an `<img src="…">` whose path tells the rendering engine which file to draw. Both pointers are resolved *relative to the file they sit in*: a manifest `href` is measured from the OPF's folder, and an `<img src>` is measured from the chapter's folder. A leading slash means "from the root of the archive", and `../` climbs one folder up — the same rules a web page follows.

That relative-path logic is exactly where conversions come undone. Say the source keeps chapters in a `text/` folder and pictures in `images/`. A chapter at `OEBPS/text/ch1.xhtml` has to reach its art with `../images/diagram.png` — up out of `text/`, then down into `images/`. A converter that flattens the folder structure, or that rewrites the chapter path without rewriting the image path to match, leaves a `src` that resolves to a file that is not there. The bytes are in the book; the address on the envelope is wrong.

The manifest drifts the same way. A rebuilt OPF may list an image at a path the converter never actually wrote, or drop the `<item>` line entirely while the file rides along as an orphan. Strict readers treat an undeclared resource as if it does not exist, and [epubcheck's validation errors](/blog/epub-validation-errors-explained) refuse a manifest that names files the archive does not contain. A quieter cause is the wrong `media-type` — a PNG declared as `image/jpeg`, or a WebP an older reader will not decode even when the path is perfect.

## Finding the broken link

Because there are a few distinct breaks behind the same blank rectangle, it pays to name the symptom before reaching for a fix.

| What you see | Likely cause | How to confirm it |
|---|---|---|
| Broken-image icon in one reader, fine in another | `<img src>` resolves to a path that is not in the archive | Open the chapter's XHTML; trace the `src` from the chapter's folder |
| Every image missing, book otherwise valid | Manifest lists images at paths the archive does not contain | Run the validator — it names each missing file |
| Image renders on desktop, blank on an older device | Unsupported or mis-declared `media-type` (e.g. WebP) | Check the `<item media-type>` against the file's real format |
| Picture was in the source, gone after export to DOCX/TXT | The image was dropped by that conversion by design | Expected — see the limits below |

Start with the file index, because it is the fastest half to check and the one a tool can settle for you. The [EPUB validator](/epub-validator) on this site reads the OPF, resolves every manifest `href` the same way a reader does, and checks that each one points at a file that is genuinely in the archive. When one does not, it reports it in plain words — `Manifest lists 'images/diagram.png', but that file is not in the archive.` — and lists the offenders one by one. If that message appears, you have found the break without opening a single line of XML: the manifest and the archive disagree about where a picture lives.

If the manifest checks out but a picture is still missing, the break is in the second pointer — the `<img src>` inside the chapter. Open that XHTML in any text editor and read the path literally, from the folder the chapter sits in. A `src` of `images/pic.jpg` from a chapter inside `text/` is looking for `text/images/pic.jpg`, which is rarely where the picture actually is; it usually needs `../images/pic.jpg`. Match the path to the file's real location and the image returns. While you are there, glance at the manifest's `media-type` for that file and make sure it names the format the file actually is.

One case is worth ruling out first: a `src` that starts with `http://` or `https://`. Those are remote images hosted on the web rather than packed into the book — many readers strip them, and none work offline. Our validator deliberately skips such references, so a book that "validates" can still show gaps if it was leaning on the network. The fix there is to embed the images, not re-point a path.

## What the validator will not catch

Being straight about the tool's edges saves an afternoon spent trusting a green result too far.

**It checks the manifest, not the chapters.** The validator confirms that everything the manifest *declares* is present. It does not open each chapter to test whether every `<img src>` resolves, and it will not flag an image sitting in the archive that the manifest forgot to list. A book can pass the structural check and still show a blank where a chapter points at the wrong path. That second pointer is a manual read.

**It does not judge `media-type` correctness.** A file present at the declared path satisfies the check even if its type is mislabelled. A reader that refuses a wrongly typed image is a rendering problem the validator is not built to see.

**Exporting an EPUB to DOCX or TXT drops its images on purpose.** The converters here that turn an EPUB into a Word document or plain text carry the text and leave the pictures behind, rather than mangle them into a format that cannot hold them well. If images vanished when you went *out* of EPUB, that is expected behaviour, not a bug — the [Calibre conversion problems](/blog/calibre-epub-conversion-problems) that plague the other direction do not apply here.

**Re-linking many images is editor work.** When dozens of paths need rewriting, a full editor such as Sigil or Calibre is the right instrument — it edits the XHTML and the manifest together. The tools here validate and convert; they do not hand-edit image paths.

## Getting the pictures back

Nearly every missing-image case comes down to the same shape: the picture is still in the book, but a reference has lost its address. Check the file index first — the [EPUB validator](/epub-validator) will tell you in seconds whether the manifest and the archive still agree, and name any file the manifest points at but cannot find. If that half is clean, the break is in a chapter's `<img src>`, and reading the path literally from the chapter's own folder almost always reveals it. The image was rarely lost. It was only misaddressed.

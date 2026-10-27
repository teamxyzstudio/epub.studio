---
title: 'EPUB images sideways? The rotation hides inside the photo'
excerpt: 'EPUB images sideways in one app and upright in another? The rotation lives in an EXIF flag some software reads and some ignores. We proved it end to end.'
category: 'Fix it'
ogImage: '/blog-og/epub-images-sideways.png'
date: 2026-10-27
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-compressor
  - cbz-to-epub
  - epub-to-pdf
howToTitle: 'How to fix sideways images in an EPUB'
howTo:
  - t: 'Confirm the rotation is a flag, not the picture'
    d: 'Extract the image from the book and open it in a browser, then in a strict viewer or a PDF conversion. Upright in one and sideways in the other means the pixels are stored rotated and only a metadata flag is straightening them.'
  - t: 'Bake the rotation into the pixels'
    d: 'Open the image in any editor, rotate it until it is upright, and save. The saved file must have upright pixels and no orientation flag — an editor rotation does both at once.'
  - t: 'Put the fixed image back and re-test'
    d: 'Replace the file inside the EPUB (or rebuild the CBZ) with the corrected image, then run the book through the conversion or reader that showed it sideways. The result should now be upright everywhere.'
faqs:
  - q: 'Why does the image look fine on my computer but sideways on my ereader?'
    a: 'Browsers and most desktop image viewers apply the EXIF orientation flag automatically, so they show you the corrected picture. Reading engines and converters that ignore metadata draw the pixel grid exactly as it is stored — which is sideways. Both are rendering the same file honestly; they just disagree about whether the flag counts.'
  - q: 'Can I fix it by editing the EXIF flag instead of the pixels?'
    a: 'Deleting or changing the flag only changes what flag-reading software does. Software that never looked at the flag still draws the raw pixel grid, so if the pixels are stored sideways the problem stays. The only fix that works everywhere is rotating the actual pixels and saving the file that way.'
  - q: 'Is a sideways image an error a validator should catch?'
    a: 'No. Orientation is presentation, not structure — the manifest entry, the media type and the archive are all correct. We ran our sideways test book through the validator during this piece and it passed with no problems found. A book can be completely valid and still display a photo on its side.'
  - q: 'Why did my EPUB to PDF conversion come out sideways when the EPUB looked fine on screen?'
    a: 'A PDF stores an image as a raw pixel grid plus a placement instruction, and the converter copies the JPEG bytes straight across. The orientation flag never enters the PDF''s model of the page, so viewers draw the stored pixels — sideways. The EPUB looked fine because your browser-based preview was reading the flag.'
  - q: 'Does the compressor always straighten rotated images?'
    a: 'Only when it actually re-encodes them. The compressor decodes each image the way a browser does — flag applied — and writes a new JPEG, which bakes the rotation in. But it deliberately keeps the original whenever its new version is not smaller, and the re-encode is lossy. For full-quality originals, rotate in an editor instead.'
draft: false
---

A scanned page or a photo sits perfectly upright in the ebook on your laptop. Open the same book on an ereader, or convert it to PDF, and the picture is lying on its side. Nothing you did rotated it — and yet something clearly did. This is the "epub images sideways" problem, and it keeps turning up on MobileRead going back more than a decade: images that were "saved that way", landscape charts that flip whole pages, a comic that reads fine on a PC and sideways on a Kobo.

The confusing part is that both renderings are honest. The same file genuinely is upright in one program and sideways in another, and neither is broken.

<div class="callout">
<div class="callout-kicker">The short answer</div>
The pixels are stored sideways, and a flag in the photo's metadata — EXIF orientation — says "rotate me 90° before showing". Software that reads the flag shows the picture upright; software that ignores it shows the raw pixel grid. The fix is to <strong>rotate the actual pixels</strong> in any image editor and save, so the file no longer needs the flag at all.
</div>

## The pixels really are sideways

Phone and camera sensors write pixels in one fixed direction. When you hold the device the other way, most cameras don't rotate the picture — they save the sideways pixel grid and add a one-number note in the file's EXIF metadata saying which way is up. Every piece of software that opens the photo then has a choice: obey the note, or draw the grid as stored.

To make the split visible we built a test photo for this piece: a simple scene with the sky at the top and the ground at the bottom, stored as a 1,600 × 1,200 landscape JPEG whose EXIF orientation value is 6 — "rotate 90° clockwise to display". Decoded obediently, it is a 1,200 × 1,600 upright portrait. Decoded literally, it is lying on its left side.

CSS has a property that controls exactly this choice, and its default tells you why browsers behave the way they do. In [CSS Images Level 3](https://github.com/w3c/csswg-drafts/blob/main/css-images-3/Overview.bs), `image-orientation` has the initial value `from-image` — honour the metadata — while `image-orientation: none` means the image "is oriented as encoded". So we rendered our one test file twice on the same page in Chromium, once under each value:

<figure>
<img src="/blog-media/epub-images-sideways/one-file-two-renders.png" alt="Two renderings of the same test photo side by side in a browser. The left one is upright: sun and the word SKY at the top, a house on green ground at the bottom. The right one is lying on its side, the word SKY running vertically and the house rotated 90 degrees. Captions name the CSS: image-orientation: from-image on the left, image-orientation: none on the right." width="784" loading="lazy" />
<figcaption>One JPEG, two honest renderings in the same browser. Left: <code>image-orientation: from-image</code> (the default) reads the EXIF flag. Right: <code>image-orientation: none</code> draws the stored pixels. Layout probes agree: the left image box measures 422 × 562 px, the right one 422 × 317 px — portrait and landscape from identical bytes.</figcaption>
</figure>

One run-time detail from producing that screenshot: Chromium only honoured `image-orientation: none` once the page was served over HTTP — loaded from a local `file://` path, both copies rendered upright. If you test this yourself and can't reproduce the sideways render, that is probably why.

That pair of renderings is the entire bug. Your laptop's browser and photo viewer are the left column. The reader or converter that shows your book sideways is the right column.

## Through the converter and out the other side

Next we packed the flagged photo into a book, because that is the route a scanned-book or comic image actually travels. Two pages — the flagged sideways-pixel JPEG and an upright-pixel control with no flag — zipped as `scans.cbz` (62,997 bytes) and dropped on the live [CBZ to EPUB converter](/cbz-to-epub). Out came `scans.epub`, 65,963 bytes.

Inside the output, `page-0001.jpg` is byte-for-byte identical to the image we packed — 72,590 bytes, raw pixels still 1,600 × 1,200, orientation flag still 6. That matches the converter's code, which copies image bytes into the book untouched. Conversion neither caused nor cured anything: the flag rides along, and the book's appearance still depends on who opens it. The validator passes the book — "No problems found. This EPUB is structurally valid." — because a sideways photo is presentation, not structure.

Then we converted that EPUB to PDF with our own [EPUB to PDF tool](/epub-to-pdf), and the symptom reproduced exactly:

<figure>
<img src="/blog-media/epub-images-sideways/pdf-page1-sideways-page2-upright.png" alt="Two rendered PDF pages side by side. Page 1 shows the test photo lying on its side, the word SKY running vertically and GROUND / PAGE 1 along the right edge. Page 2 shows the control photo upright, SKY at the top and GROUND / PAGE 2 at the bottom." width="784" loading="lazy" />
<figcaption>The PDF made from scans.epub (147,287 bytes), rendered to pixels. Page 1 — the flagged image — is sideways. Page 2 — the control with upright pixels — is fine. Same conversion, same book, different source files.</figcaption>
</figure>

The mechanism is visible in the converter's own code: it hands the JPEG bytes to the PDF library as-is, and a PDF stores an image as a raw sample grid plus a placement rectangle on the page. EXIF orientation simply has no seat in that model. The browser preview you trusted read the flag; the PDF pipeline never looked. Any workflow that decodes pixels literally — older reading engines, thumbnailers, print paths — lands on the same sideways result.

If your images are missing rather than rotated, that is a different fault with a different fix — [EPUB images not showing](/blog/epub-images-not-showing) covers that one. And if whole pages advance in the wrong direction rather than single photos lying sideways, that is the spine's reading direction, not the images.

## Rotate the pixels, not the preview

Because the flag is the problem, the durable fix is to make the file stop needing it: open the image in any editor — Preview, GIMP, Paint, anything — rotate it until it is upright, and save. An editor rotation rewrites the pixel grid and drops the stale flag in one step. Then put the corrected file back: rebuild the CBZ before converting, or replace the image inside the EPUB directly — an EPUB is a zip archive, and [how to edit an EPUB](/blog/edit-an-epub) walks the unpack-and-repack rules, including the uncompressed-first mimetype.

Two routes that look like fixes but aren't. Editing or stripping the EXIF flag leaves sideways pixels that flag-ignoring software still draws sideways. And a CSS patch — `transform: rotate(90deg)` on the `img` — repaints the picture without changing its layout box, so the page still reserves a landscape-shaped hole for a portrait image and the result clips or overlaps; reader support for transforms is uneven on top of that. Neither touches the actual problem, which is the stored grid.

## The compressor fixes it by accident

While testing we found that one of our own tools straightens these images without being asked. The [EPUB compressor](/epub-compressor) re-encodes large images to shrink the book, and it decodes them the way a browser does — orientation flag applied — before writing a new JPEG. The rotation gets baked in and the flag disappears, as a side effect of compression.

<figure>
<img src="/blog-media/epub-images-sideways/compressor-done-panel.png" alt="The compressor's done panel: a pink check mark above 'Your smaller EPUB is ready' and the line 'sideways-book.epub · 36 KB · 2 of 2 images shrunk, 78 KB saved · never left your device'." width="760" loading="lazy" />
<figcaption>The live compressor run on the test book: 65,963 bytes in, 36,880 bytes out, "2 of 2 images shrunk, 78 KB saved". The interesting part is what it did to the pixels on the way through.</figcaption>
</figure>

Opening the compressed book confirms it: `page-0001.jpg` is now 31,467 bytes, its raw pixels are 1,200 × 1,600 — physically upright — and the orientation flag is gone. Convert that compressed book to PDF and page 1 comes out straight:

<figure>
<img src="/blog-media/epub-images-sideways/pdf-before-after-compressor.png" alt="Two rendered PDF pages of the same test photo. The left one, from before compression, is sideways. The right one, made after running the book through the compressor, is upright with SKY at the top and GROUND / PAGE 1 at the bottom." width="784" loading="lazy" />
<figcaption>PDF page 1 before and after a pass through the compressor: the re-encode rotated the stored pixels upright, so the flag-blind PDF path now gets it right. The after-PDF is 67,505 bytes.</figcaption>
</figure>

Being realistic about this: it is a compressor, not a rotation tool. It keeps the original file whenever its re-encoded version isn't smaller, so an already-tiny photo can pass through untouched, flag intact. And the re-encode is lossy by design. For a quick repair of a photo-heavy book it is genuinely useful — one drop, every oversized image straightened and shrunk in the browser, nothing uploaded. For archival-quality originals, do the editor rotation instead and keep the bytes you chose.

Either way, the test is the same one we used throughout: convert a copy to PDF, or open it somewhere strict. When the picture survives the least forgiving path in your chain, the rotation is finally in the pixels — where every reader, old or new, can see it.

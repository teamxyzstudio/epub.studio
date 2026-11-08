---
title: 'EPUB images blurry? Where the quality went'
excerpt: 'EPUB images blurry after a conversion? Something in the chain downscaled and re-encoded them. Who does it, by how much, and how to keep the detail.'
category: 'Fix it'
ogImage: '/blog-og/epub-images-blurry.png'
date: 2026-11-08
author:
  name: 'Shahid Ansari'
  initial: 'S'
tools:
  - epub-compressor
  - epub-cover-editor
howToTitle: 'How to find out what blurred your EPUB images'
howTo:
  - t: 'Measure what is actually inside the file'
    d: 'Unzip the EPUB (it is a ZIP archive) and check the pixel dimensions and format of the images folder. Blur you can see has numbers you can read.'
  - t: 'Match the numbers to a culprit'
    d: 'Dimensions that match a converter profile or a compressor level — 1600 wide, 1400 wide, 536 wide — name the tool that resized. A .png entry that opens as JPEG was re-encoded.'
  - t: 'Rebuild from the originals, shrink once, deliberately'
    d: 'Put the full-resolution sources back in, then do any shrinking yourself in one step with a level you chose — not as a side effect of a conversion default.'
faqs:
  - q: 'Why did my images get blurry after converting with Calibre?'
    a: 'Calibre''s conversion pipeline includes a rescale step that resizes every image to fit inside the chosen output profile''s screen size, then re-saves it. The Default profile caps images at 1600 by 1200 pixels, and device profiles are far smaller, so a high-resolution figure is downscaled and re-encoded in one pass. Choosing a larger output profile raises the cap but does not remove the re-encode.'
  - q: 'Can blurry EPUB images be made sharp again?'
    a: 'No. Downscaling throws pixels away and JPEG re-encoding throws detail away, and neither operation keeps what it discarded. Enlarging the damaged image only interpolates between the pixels that survived, which reads as a bigger blur. The only real fix is to go back to the original image and rebuild.'
  - q: 'Does the epub.studio compressor make images blurry?'
    a: 'It is lossy by design — that is what compression of images means — but it is honest about the trade. Light re-encodes at quality 0.85 with a 2000-pixel width cap, Balanced at 0.7 and 1400, Maximum at 0.5 and 1000, and it keeps your original file whenever its re-encoded version would not actually be smaller. In our test the Light level left a detailed PNG diagram completely untouched.'
  - q: 'Why is only the cover blurry while the inside images look fine?'
    a: 'Covers lead a second life: readers and store listings display them scaled in grids and thumbnails, so a cover that was downscaled even once looks worse than body images viewed at reading size. Measure the cover entry inside the archive — if it is small, replace it with the full-resolution original and leave the rest of the book alone.'
  - q: 'Should ebook images be PNG or JPEG?'
    a: 'Photographs compress well as JPEG and gain little from PNG. Line art, diagrams, screenshots and anything containing text keep their hard edges in PNG and smear first in JPEG — the ringing around strokes is exactly the blur this article dissects. Note that size-reduction tools, ours included, may convert a PNG to JPEG when that makes the file smaller.'
draft: false
---

The book looked right everywhere except its pictures. This complaint has
recurred on MobileRead for over a decade — a Word export whose figures came
out soft after conversion, comics that turned pixelated on the way to a Kobo,
photographs that got blocky somewhere between the manuscript and the Kindle.
The text is crisp, because text is re-rendered from fonts on every page turn.
The images arrive pre-damaged, and nothing on screen says who damaged them.

If your EPUB images are blurry, two operations happened to them, probably in
one step and probably silently: they were **downscaled** (pixels discarded to
fit a size cap) and **re-encoded** (detail discarded to hit a compression
setting). Both hide inside defaults. Neither can be undone.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Some tool in your chain resized the images to fit a screen profile and saved
new, lossier copies. The original pixels are gone from the book — but not
from your source files. Find the step that shrank them, rebuild from the
originals, and do any shrinking <strong>once, on purpose, at a level you
chose</strong>.
</div>

## Blur is two one-way doors

Downscaling maps many pixels onto one. A 2400-pixel-wide diagram squeezed to
1400 keeps 58% of its width and about a third of its area; a one-pixel
hairline becomes a fraction of a pixel, which an encoder renders as grey
haze. Upscaling it back afterwards invents pixels by interpolation — the
image gets bigger and stays soft.

Re-encoding is the second door. JPEG works by discarding high-frequency
detail, and the sharpest frequencies in a book figure are its edges: strokes,
axis lines, lettering. A photograph hides the loss well. A diagram or a
screenshot shows it immediately as ringing around every line. Save a JPEG
over a JPEG and the losses stack.

Every tool below applies both doors at once, which is why the damage reads
as one symptom: "it got blurry".

## The usual suspects, with their exact numbers

The useful thing about size caps is that they are fingerprints. Measure the
images inside the blurry book and the dimensions name the tool.

| Who | Cap | What it does |
|---|---|---|
| Calibre, Default output profile | 1600 × 1200 | rescales any larger image to fit, re-saves it |
| Calibre, Kobo output profile | 536 × 710 | same rescale, much smaller target |
| Calibre, Tablet output profile | 10000 × 10000 | effectively uncapped — the workaround the forums recommend |
| Our compressor, Light | 2000 wide, quality 0.85 | re-encode kept only if smaller |
| Our compressor, Balanced | 1400 wide, quality 0.7 | the default level |
| Our compressor, Maximum | 1000 wide, quality 0.5 | for fighting attachment limits |

The Calibre rows come from Calibre's own source: the
[RescaleImages transform](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/ebooks/oeb/transforms/rescale.py)
resizes every raster image to fit inside the output profile's screen (minus
page margins) and re-saves it, and the
[profile definitions](https://github.com/kovidgoyal/calibre/blob/master/src/calibre/customize/profiles.py)
carry the screen sizes in the table. That is the whole mystery of the
"my Word document's figures went soft" threads: the conversion did exactly
what the selected profile told it to, and the profile defaulted to a screen
the user never picked.

Our own rows come from our own code, and the next section shows them
running.

## Watching the quality leave, byte by byte

We built a one-chapter EPUB around a deliberately difficult image: a
2400 × 3200 PNG diagram — hairline grid, one-pixel boxes, small serif
labels — weighing 185,269 bytes inside a 187,017-byte book. Then we dropped
it on our live compressor at the default Balanced level.

<figure>
<img src="/blog-media/epub-images-blurry/compressor-balanced-done.png" alt="epub.studio compressor done panel reading: Your smaller EPUB is ready, imagebook.epub, 70 KB, 1 of 1 image shrunk, 77 KB saved, never left your device" loading="lazy" />
<figcaption>The live /epub-compressor finishing the Balanced run on our 187 KB test book: 1 of 1 image shrunk, 77 KB saved.</figcaption>
</figure>

The output tells the whole story once you unzip it. The image entry is still
called <code>figure.png</code>, but it is now 1400 × 1867 pixels, 106,770
bytes — and its first bytes are <code>ff d8</code>, a JPEG signature. The
compressor decoded the PNG, scaled it to its 1400-pixel cap, and wrote a
quality-0.7 JPEG under the old name. Here is the same region of the figure
before and after, both shown at the size a reader would display them:

<figure>
<img src="/blog-media/epub-images-blurry/before-after-zoom.png" alt="Side-by-side crops labelled BEFORE, original PNG 2400 by 3200 shown at reading size, and AFTER, Balanced output 1400 by 1867 JPEG at the same reading size; the after pane shows softened serif text reading OEBPS/content.opf manifest and spine and fuzzy hairlines" loading="lazy" />
<figcaption>The same crop from both archives. Left: the original PNG. Right: the Balanced output — small text softened, one-pixel lines gone grey.</figcaption>
</figure>

That is 77 KB genuinely saved, and for a photograph it would be a fair
trade. For line art it is visible. The same test at the Light level ended
differently: the panel reported *"1 image checked, already optimal"* and the
output still contained the original PNG, byte for byte — Light's re-encode
at 2000 pixels and quality 0.85 came out *larger* than the source, so the
compressor kept the original. That guard is in the code: a new version is
written only when it is actually smaller.

## Three honest edges in our own tool

First, the renamed JPEG. The output keeps the old filename and the package
manifest still declares <code>media-type="image/png"</code> over JPEG bytes.
Browsers and browser-based readers sniff the real format — Chromium
displayed our mislabelled file at its full 1400 × 1867 without complaint —
but it is a mismatch we would rather not write, and our validator passes it
because its checks are container-level. The compressor's re-encode habit has
surfaced here before, when it quietly
[baked EXIF rotation into pixels](/blog/epub-images-sideways).

Second, the cap is width-only. The scale factor is computed from width
alone, so a 1000 × 4000 strip — a tall infographic, say — sails under a
1400-pixel cap untouched, at any level.

Third, lossy is lossy. The compressor exists to make oversized books
smaller, and [when that is your actual goal](/blog/reduce-epub-file-size) it
is the right tool with the trade-offs printed on the tin. What it cannot do
is put detail back, because nothing can.

## Getting your pictures back

The repair is always the same shape. Measure what is inside the blurry book
— pixel dimensions and real format of every image entry — and match the
numbers to a culprit in the fingerprint table above. Then find the original
images: the export folder, the camera roll, the design files. Rebuild from
there: put the full-resolution originals back in place of the shrunken
copies, pick conversion settings
that do not rescale (the forums' long-standing Calibre answer is the Tablet
profile, whose 10000-pixel cap nothing sensible hits), and if the result is
genuinely too large, shrink it yourself in one deliberate pass.

For the commonest single case — a cover that has been through one
downscale too many — you do not need to rebuild anything: drop the book on
the [cover editor](/epub-cover-editor) and replace just that image with the
full-quality original, leaving every other byte alone. And when a
photo-heavy book really does need to lose weight, run it through the
[EPUB compressor](/epub-compressor) at Light first. If the panel says your
images were already optimal, believe it — that is the tool telling you the
quality problem, wherever it came from, did not come from size.

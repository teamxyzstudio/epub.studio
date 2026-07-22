---
title: 'EPUB cover not showing: why, and how to fix it'
excerpt: 'An EPUB cover not showing after sideloading usually means the image is in the file but not marked in the manifest. Here''s why Calibre hides it, and the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-cover-not-showing.png'
date: 2026-07-22
author:
  name: 'Epub Studio'
  initial: 'E'
tools:
  - epub-cover-editor
  - epub-metadata-editor
  - epub-validator
draft: false
---

A book that shows its cover perfectly in Calibre can land on a phone or an e-reader as a grey rectangle with the title typed across it. Nothing else looks broken — the book opens, the chapters are all there, the text is fine — but the one image that makes a library feel like a shelf has vanished. It is a common and genuinely confusing failure, because the file that looks right on the desktop is the same file that looks wrong on the device.

The reason an EPUB cover is not showing is almost never that the image is missing. In most cases the image is sitting right there inside the file. What is missing is the single line that tells a reader *which* image is the cover. Calibre is forgiving about that line; Apple Books, Kobo and a sideloaded Kindle are not.

There is also a trap in the way Calibre works that sends people looking in the wrong place. Calibre keeps its own copy of every cover in its library database, separate from the EPUB itself. So a cover glowing away in the Calibre grid proves that Calibre remembered one — not that the file actually declares one. The moment the book leaves Calibre for a device that only reads the file, the difference shows.

<div class="callout">
<div class="callout-kicker">The short answer</div>
An EPUB cover usually fails to show because the image is inside the file but <strong>not marked as the cover</strong> — its manifest entry is missing the <code>properties="cover-image"</code> flag, and there is no legacy <code>&lt;meta name="cover"&gt;</code> fallback either. Re-registering the image, or replacing the cover so it is registered for you, is the fix. Then the reader has to be told to refresh its cached thumbnail.
</div>

## Why an EPUB cover goes missing

An EPUB is a zip of web files with one plain-text index — the OPF — describing what is inside. If you have read [what's inside an EPUB](/blog/what-is-inside-an-epub), the manifest is the part that matters here: a list of every file in the book, each with its own `<item>` line. A reader decides which image to use as the cover by looking at those lines, and there are only two places it looks.

The modern way, used by every EPUB 3 file, is a property on the manifest entry: the cover image's `<item>` carries `properties="cover-image"`. That flag is the whole signal. An image can be the most obvious cover in the world — right dimensions, named `cover.jpg`, first file in the book — and a reader will still ignore it if that flag is not on its line.

The older way, from EPUB 2, is a separate `<meta name="cover">` tag in the metadata that points to the image's manifest id. Plenty of files still rely on it, and good readers check for it as a fallback when the modern property is absent. A file that has *neither* has no declared cover at all, no matter how many images it contains.

That single fact explains most cases. A converter rebuilt the manifest and dropped the flag; an editing tool moved the image but not its declaration; a hand-assembled file never set it. The image rides along as ordinary content, and the reader, having nothing to point at, shows a blank.

Two nearby causes round out the list. Sometimes the "cover" is only a rendered page inside the book — a full-page image that appears when you open it — with no separate cover *image* entry for the shelf to use; the book looks fine when read but blank in the library. And sometimes the file is already correct and the device has simply not caught up, because readers cache thumbnails aggressively and keep showing the old blank until something forces a rebuild.

## How to get the cover to show

The fix depends on which of those you are looking at, so it helps to name the symptom first.

| What you see | Likely cause | What fixes it |
|---|---|---|
| Cover in Calibre, blank after sideloading | Image is present but not marked in the manifest | Re-register it with `properties="cover-image"` |
| Cover shows when the book is open, not on the shelf | Only a cover *page* exists, no cover *image* entry | Add a proper cover image and register it |
| Old cover keeps showing after you changed it | The reader cached the previous thumbnail | Remove and re-add the book, or rename the file |
| No cover anywhere, including in the reader | The source genuinely has no cover image | Add one |

The first three all resolve at the level of that one manifest line, and you do not have to edit XML by hand to fix it. The cover tool on this site reads the book the same way a reader does — it looks for the EPUB 3 `properties="cover-image"` flag first, then the legacy `<meta name="cover">` — and acts on what it finds. If the book already has a declared cover, it overwrites that image in place, so the existing manifest entry stays valid. If it finds none, it adds the image and writes a fresh manifest entry with the `properties="cover-image"` flag set. Either path ends with a cover the reader can actually see. Portrait artwork at roughly 1600×2560 is the size that looks right across devices.

Before or after, it is worth confirming what the file really declares rather than trusting one app's grid. The [metadata editor](/epub-metadata-editor) reports whether a cover is detected at all, and the [EPUB validator](/epub-validator) checks that the manifest and the files it names actually agree — a mismatch there is a common reason an image is present but unreadable. Both take a couple of seconds and settle the question locally.

The last symptom — the *old* cover refusing to leave — is not a file problem, and no amount of re-editing fixes it. The device is showing a cached thumbnail. Delete the book from the reader and add the corrected file back; if that alone does not work, change the file's name before re-adding, which stops the reader matching it to its cached entry. Apple Books and the Kindle library are the usual culprits here, and both give up the old image once they no longer recognise the file.

## What a new cover cannot do for you

Being straight about the edges saves the afternoon that goes into fighting the wrong problem.

**A cached thumbnail outranks a correct file.** If the reader has already decided this book has no cover, a perfectly registered image changes nothing until the cache is cleared. That is a property of the reading app, not the file, so the fix lives on the device.

**Very old readers may ignore the modern flag.** The cover tool registers the EPUB 3 `properties="cover-image"` property, which is what current apps read. Software old enough to understand only the EPUB 2 `<meta name="cover">` tag can still come up blank. If you are targeting genuinely ancient devices, a full editor like Calibre or Sigil lets you set the legacy tag as well.

**A DRM-protected book cannot be edited at all.** If the file carries DRM from a store, no tool here — or anywhere — can open it to change the cover; the encryption sits in the way of every edit, by design.

**No tool invents a cover.** If the source never had a cover image, there is nothing to re-register — you are adding one, not fixing one. Supply the artwork and it gets embedded and declared properly.

## Getting the shelf to look right

The pattern behind nearly every missing cover is the same: the image is in the book, but the one line that names it as the cover is not. Readers do not guess, and Calibre's habit of remembering covers on your behalf hides the gap until the file travels somewhere stricter. Put the flag back — or let the [cover editor](/epub-cover-editor) put it back and register the image for you — and the book stops arriving blank. Then, if an old thumbnail lingers, remove and re-add the file so the device rebuilds its shelf. The cover was rarely lost; it was only unlabelled.

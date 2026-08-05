---
title: 'MOBI is dead. Here''s what to do with your old files'
excerpt: 'Amazon dropped MOBI support for docs. Converting your library to EPUB takes minutes.'
category: 'Kindle'
ogImage: '/blog-og/mobi-is-dead.png'
date: 2026-05-12
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - mobi-to-epub
  - azw3-to-epub
---

In August 2022 Amazon stopped accepting MOBI through Send-to-Kindle. It was not dramatic — the format had been superseded internally for a decade — but it left a lot of people with folders full of files that no longer have an obvious home.

## What actually changed

MOBI dates to 2000 and was never designed for what modern books do. No embedded fonts, no meaningful CSS, no fixed layouts. Amazon replaced it with KF8 — the format in `.azw3` files — back in 2011, and everything since has been built on that.

The 2022 change only ended MOBI as an *input*. Books you already own still open. But you cannot email a MOBI to your Kindle any more, and nothing outside the Kindle ecosystem ever read it well.

## Convert to EPUB, not to AZW3

The instinct is to convert MOBI to AZW3 and stay on Kindle. Resist it — you would be moving from one proprietary format to another.

Convert to EPUB instead:

- Every reader on every platform opens it — Apple Books, Kobo, Play Books, and Kindle itself since 2022.
- It is an open W3C standard, so it will still be readable when the current generation of devices is gone.
- You can generate an AZW3, a PDF or a compressed copy from it whenever you need one.

<div class="callout">
<div class="callout-kicker">The rule</div>
Keep your library in the open format. Generate device-specific copies as needed, and treat them as disposable.
</div>

## Doing it

[MOBI to EPUB](/mobi-to-epub) handles `.mobi` and `.prc`; [AZW3 to EPUB](/azw3-to-epub) handles the newer `.azw3` and `.azw`. Both run in your browser, so a large personal library never leaves your machine.

Afterwards, fix the metadata. Old MOBI files frequently have empty or wrong title and author fields, which is how you end up with a library full of "Unknown Author". The [Metadata Editor](/epub-metadata-editor) sorts that out without rebuilding the book.

## The one thing that will not work

DRM. Books bought from the Kindle Store are encrypted and no converter can open them — ours included. This applies to files you own and paid for, which is a fair thing to be annoyed about, but it is not something a converter can solve.

The files this *does* work on: books you wrote, DRM-free purchases, public-domain texts, and anything you made yourself.

## Which file do you actually have?

Kindle files come in several formats and the extension does not always tell you much:

| Extension | What it is | Convertible? |
| --- | --- | --- |
| `.mobi` | The original format, pre-2011 | Yes, if DRM-free |
| `.prc` | Same thing, older extension | Yes, if DRM-free |
| `.azw` | MOBI in an Amazon wrapper | Usually |
| `.azw3` | KF8 — the modern format | Yes, if DRM-free |
| `.kfx` | Newest, heavily protected | Rarely |

If you have `.kfx`, that is Amazon's current encrypted format and there is essentially nothing a converter can do with it.

## Where the files live

On a Kindle connected by USB, look in `documents`. You will find the books you have downloaded to that device, plus sidecar folders holding annotations and reading position — those do not convert and do not need to.

Books that are in your library but not downloaded are not on the device at all, only in your account.

## Doing the migration

For a handful of books, drop them into [MOBI to EPUB](/mobi-to-epub) or [AZW3 to EPUB](/azw3-to-epub) one at a time. For a larger library, work in batches and keep the originals until you have checked the output — conversion is not lossless and you want a fallback.

Everything runs in your browser, so a personal library never gets uploaded anywhere. That matters more than usual here: these are books you own, and they should not need to pass through anyone's server to change format.

## Then fix the metadata

Old MOBI files are notorious for poor metadata. Titles like `book1`, empty author fields, series information stuffed into the title. Once you have twenty of them in a library sorted by author, this becomes the actual problem.

The [Metadata Editor](/epub-metadata-editor) rewrites the title, author and language without re-encoding anything else. Doing it during migration is much less work than doing it later across two devices.

## What conversion does not preserve

Be realistic about this:

- **Annotations and highlights** are stored by Amazon against their own position system. They do not travel.
- **Reading position** likewise.
- **Complex layout** in older MOBI files was already flattened; converting cannot restore what was never there.
- **DRM-protected books** cannot be opened at all.

What does come across is the text, the chapter structure, the table of contents and usually the cover — which is the book.

## The wider point

The reason to do this is not that MOBI stopped working. Files you already have will keep opening on devices that already read them.

The reason is that a library in a proprietary format is a library with a dependency. It works until a company decides otherwise, and you have no say in that decision. EPUB is a W3C standard: publicly specified, implementable by anyone, readable by software nobody has written yet.

Keep your masters in the open format. Generate device-specific copies whenever you need them, and treat those copies as disposable. That way the next format transition — and there will be one — costs you an afternoon rather than your collection.

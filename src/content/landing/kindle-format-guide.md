---
title: 'Kindle format guide: formats, transfers, conversions'
h1: 'The Kindle format guide'
excerpt: 'Which formats a Kindle actually reads, how to get an EPUB onto the device, what to do with old MOBI files, and what survives the trip — the Kindle hub.'
type: 'pillar'
primaryKeyword: 'kindle format guide'
date: 2026-09-18
ogImage: '/landing-og/kindle-format-guide.png'
tools:
  - mobi-to-epub
  - azw3-to-epub
  - azw3-to-pdf
  - epub-to-azw3
  - epub-metadata-editor
clusters:
  - label: 'Know the formats'
    posts:
      - kindle-file-format
      - epub-vs-pdf-vs-mobi
      - ebook-drm-explained
  - label: 'Get a book onto a Kindle'
    posts:
      - send-epub-to-kindle
      - epub-embedded-fonts-not-working
      - why-page-numbers-dont-exist-in-epub
  - label: 'Rescue an old Kindle library'
    posts:
      - mobi-is-dead
      - convert-ebook-to-pdf
faqs:
  - q: 'What format does a Kindle use now?'
    a: 'Internally, Amazon''s own current format — books bought from the store arrive as KFX, which nothing outside the Kindle ecosystem reads. At the door, though, the device takes EPUB: Send-to-Kindle accepts it directly and converts it on the way in. So the working answer is that you handle EPUB and let Amazon handle everything after the handoff.'
  - q: 'Can this site convert an EPUB to AZW3 or MOBI?'
    a: 'No, and for most people that conversion is no longer the right move anyway. Sending the EPUB itself is now the supported route, so the EPUB to AZW3 and EPUB to MOBI pages here are guidance rather than converters — they explain when a pre-conversion still makes sense and route everyone else to Send-to-Kindle.'
  - q: 'Can I convert books I bought from the Kindle store?'
    a: 'Only if they are DRM-free, which store purchases generally are not. DRM is an encryption lock tied to your account, and this site neither removes nor works around it — that stance is permanent. DRM-free MOBI and AZW3 files, from your own publishing work or DRM-free stores, convert cleanly to EPUB or PDF in the browser.'
  - q: 'Do MOBI files still work on a Kindle?'
    a: 'Old MOBI files already on a device keep working, but Send-to-Kindle dropped MOBI as an input in 2022, so the format is a dead end for anything new. The practical move is to convert a DRM-free MOBI library to EPUB once, then send the EPUBs — that direction stays fully supported.'
draft: false
---

Amazon is the only major reading platform that runs its own private format
stack, and it has rebuilt that stack three times without retiring anything.
The result is a landscape where `.mobi`, `.azw`, `.azw3` and `.kfx` all mean
"Kindle book" from different decades — and where, since 2022, the file you
actually hand to Amazon can simply be an EPUB. This Kindle format guide is the
map: what each format is, which direction each one converts, how a book gets
onto the device, and what quietly changes once it is there.

One rule organises everything below. **EPUB at the edges, Amazon's formats in
the middle.** You make, fix and archive books as EPUB; Amazon converts them to
its own internals on the way in; and the only files worth converting back out
are the DRM-free ones from the old eras.

## One family, four badges

The extensions look like four formats. They are closer to one lineage. MOBI
(2000) put compressed HTML inside a Palm organiser database; `.azw` is that
same file wearing Kindle Store DRM; `.azw3` (2011) swapped in a modern HTML5
engine — KF8 — while keeping the Palm shell; and KFX, the current store
format, is the first genuinely new container, sealed to everything outside
Amazon's ecosystem. The byte-level story, era tables and the trick for
identifying a mystery file live in the
[Kindle file formats reference](/blog/kindle-file-format).

What the lineage means in practice: the extension tells you the era, and the
era tells you your options. Everything from the Palm-shell generations parses
with ordinary tools if it is DRM-free. KFX does not, and there is no honest
workaround to offer.

Routed by the file in front of you, the whole page compresses to four moves:

| You have | The move |
| --- | --- |
| A DRM-free `.mobi`, `.prc` or `.azw3` | Convert it to EPUB and treat the EPUB as the master copy |
| A store-bought `.azw` or `.kfx` | Read it in Kindle apps — the DRM keeps it there |
| An `.epub` headed for a Kindle | Send it as it is; no pre-conversion needed |
| An `.epub` that looks wrong on the device | Fonts and locations — the "what changes" section below |

## Getting a book onto a Kindle

Three routes, and the right one is almost always the easiest one. Email or
share the EPUB through Send-to-Kindle and Amazon converts it on arrival, synced
across your devices. Copy it over USB for a no-account, no-cloud transfer.
Or convert to a Kindle format first — the legacy route, still occasionally
right for old hardware. The [send an EPUB to Kindle](/blog/send-epub-to-kindle)
walkthrough covers all three with their failure modes.

The step people over-engineer is pre-conversion. Since Send-to-Kindle accepts
EPUB directly — and stopped accepting MOBI the same year — converting your
book to AZW3 before sending is a habit left over from an older pipeline. The
[EPUB to AZW3](/epub-to-azw3) guidance page explains the narrow cases where it
still earns its keep; for everyone else the EPUB itself is the deliverable.

One preparation step does pay every time: metadata. Send-to-Kindle takes the
title and author from inside the file, so a book that says "Unknown" arrives
as "Unknown" in your library. Thirty seconds in the
[metadata editor](/epub-metadata-editor) before sending beats renaming things
on a device afterwards.

## Getting books out of Kindle formats

The other direction is where the old extensions come back into the story. A
folder of `.mobi` or DRM-free `.azw3` files from your own publishing work, old
DRM-free stores or Project Gutenberg downloads is not a lost library — it is
one conversion away from EPUB, the format everything else reads. The
[MOBI to EPUB](/mobi-to-epub) and [AZW3 to EPUB](/azw3-to-epub) converters run
that migration in the browser, and [AZW3 to PDF](/azw3-to-pdf) covers the
print-and-share cases in one chained step. The full migration workflow — which
files to keep, what conversion preserves, what it cannot — is in
[MOBI is dead](/blog/mobi-is-dead).

The honest boundary sits at DRM. A book bought from the Kindle Store is
encrypted against your account, and that lock decides everything: no tool
here removes it, works around it, or pretends to. That is a permanent policy,
not a missing feature — the mechanics of what the lock actually is are laid
out in [the DRM explainer](/blog/ebook-drm-explained). KFX files are doubly
closed: a new container and the lock. If your goal is a library you control,
the answer is upstream — buy DRM-free where you can, and keep your own work
as EPUB.

## What changes on the device

Two things surprise people after a book lands on a Kindle, and neither is a
defect. First, typography: Amazon's conversion and the reader's own font
setting both get a vote, so an embedded font often
[does not survive the trip](/blog/epub-embedded-fonts-not-working) — the
device's font menu wins unless the publisher has explicitly provided for it.
Second, position: reflowable books have no fixed pages, so Kindle counts
*locations* instead, which is [why page numbers behave strangely](/blog/why-page-numbers-dont-exist-in-epub)
in any reflowable format, not just Amazon's.

The pattern behind both: once a book is on the device, the reading system
owns presentation. The file supplies structure and content; the device and
its owner decide how it looks. Fighting that is usually wasted effort —
building a clean, valid EPUB and letting each reader do its job is the
approach that survives contact with real devices.

## Using this hub

Everything below runs in your browser — nothing uploads, no account exists.
The converters cover the DRM-free directions in and out of the Palm-shell
formats; the guides go one layer deeper than this page on each job. Start
with the cluster that matches the file in front of you: understanding what
you have, sending something to a device, or migrating a folder of old
extensions to a format with a future.

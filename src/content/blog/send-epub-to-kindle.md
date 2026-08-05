---
title: 'How to send an EPUB to your Kindle (3 ways)'
excerpt: 'Send-to-Kindle, USB, or AZW3 conversion — the three routes, and when each one is the right call.'
category: 'Kindle'
ogImage: '/blog-og/send-epub-to-kindle.png'
date: 2026-07-08
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-to-azw3
  - epub-to-mobi
---

Amazon spent years refusing EPUB and then quietly started accepting it. If your information is a few years old, you are probably doing this the hard way.

## Route one: email it (easiest)

Since late 2022, Send-to-Kindle accepts EPUB directly. Amazon converts it on their end to their own format and delivers it to your library, synced across devices.

1. Find your Send-to-Kindle address in **Manage Your Content and Devices → Preferences**. It looks like `yourname@kindle.com`.
2. Add the address you are sending *from* to your approved sender list. This step is skipped constantly and is the reason most transfers silently fail.
3. Email the EPUB as an attachment. The subject line does not matter.

This is the right answer for almost everyone. It syncs, it backs up, and it keeps your reading position across devices.

## Route two: USB (fastest, no account)

Plug the Kindle into a computer. It mounts as a drive. Copy the file into the `documents` folder and eject.

Modern Kindles read EPUB over USB too. Older ones do not — if the book does not appear after ejecting, that is your answer, and you want route three.

<div class="callout">
<div class="callout-kicker">The trade-off</div>
USB does not sync. The book lives on that one device, your position is not backed up, and it will not reappear if you factory reset. Fine for a one-off; poor for a library.
</div>

## Route three: convert first

If you have a pre-2022 Kindle, or you want control over how the book is built rather than letting Amazon's converter decide, convert it yourself before transferring.

- **[EPUB to AZW3](/epub-to-azw3)** — for any Kindle from roughly 2011 onward. AZW3 keeps embedded fonts, real CSS and proper styling.
- **[EPUB to MOBI](/epub-to-mobi)** — only for genuinely old hardware. MOBI cannot do embedded fonts and flattens complex layouts.

Then send the converted file by either of the routes above.

## When it does not work

Nine times out of ten it is DRM. Books bought from other stores are encrypted, and no converter — ours included — can open them. The file has to be DRM-free: something you wrote, something you bought from a DRM-free store, or a public-domain text.

The other failure is a malformed EPUB that Amazon's converter rejects without explaining why. Run it through the [Validator](/epub-validator) and you will usually get a specific answer in a couple of seconds.

## Which route should you actually pick?

| | Syncs across devices | Needs an account | Works offline | Keeps your position |
| --- | --- | --- | --- | --- |
| Email (Send-to-Kindle) | Yes | Yes | No | Yes |
| USB | No | No | Yes | On that device only |
| Convert then transfer | Depends on route | Depends | Yes | Depends |

For a book you intend to actually read, email. For a quick look at a file someone sent you, USB. For a library you are migrating off another platform, convert to EPUB first, keep those as your masters, and send copies.

## Things that quietly break

**The approved sender list.** This is the number one cause of "I emailed it and nothing happened". Amazon silently discards mail from unlisted addresses — no bounce, no error. Add every address you might send from, including your phone's.

**File size.** Send-to-Kindle rejects attachments over 50 MB, and many mail providers stop at 25 MB. An illustrated book will hit this easily. Run it through the [Compressor](/epub-compressor) first; the text is untouched and images shrink dramatically.

**Filenames.** Some setups choke on unusual characters. If a transfer fails for no visible reason, rename the file to plain letters and numbers and try again.

**Personal Document vs Book.** Files you send yourself arrive as Personal Documents. They sync and back up, but they do not get some Kindle Store features — X-Ray, page numbers matched to a print edition, Whispersync for Voice. Nothing you can change; worth knowing so it does not surprise you.

## Fixing metadata first

Kindle libraries are sorted by author and title, and those come from the file's metadata rather than its filename. A book that shows as "Unknown Author" or "Document1" will be a nuisance to find later.

Fix it before you send, not after — once a document is in your Kindle library, updating its metadata means removing and re-sending it. The [Metadata Editor](/epub-metadata-editor) rewrites the title, author and language without touching anything else in the book.

## If the book looks wrong on the device

Amazon's own converter decides how your EPUB becomes a Kindle book, and it is not always kind to unusual formatting. If chapters run together, headings look wrong, or the table of contents is empty, the usual cause is a structural problem in the source file rather than anything Amazon did. Run it through the [Validator](/epub-validator) — a missing navigation document explains an empty table of contents almost every time.

For full control, skip Amazon's converter entirely: produce an [AZW3](/epub-to-azw3) yourself and transfer that. What you build is what you get.

---
title: 'EPUB embedded fonts not working on Kindle: the fix'
excerpt: 'EPUB embedded fonts not working after you send it to Kindle? Amazon''s converter and the reader''s own font setting both override them — here is what to check.'
category: 'Kindle'
ogImage: '/blog-og/epub-embedded-fonts-not-working.png'
date: 2026-07-25
author:
  name: 'Epub Studio'
  initial: 'E'
tools:
  - style-studio
  - epub-validator
  - epub-to-azw3
draft: false
---

You picked a typeface, embedded it, and the EPUB looked exactly right in your reading app. Then you sent it to a Kindle and the font was gone — replaced by the device's default, or worse, the headings came back thickened and smeared where the bold used to be. EPUB embedded fonts not working on Kindle is one of the most common surprises for anyone who has spent time getting a book to look the way they want.

The frustrating part is that nothing in the file is broken. The font is still in there. What changed is that a Kindle is not an EPUB reader — it is a different device with a converter and a reader-facing font menu sitting between your file and the page. Both of those can quietly ignore, drop, or reshape a font you embedded perfectly.

<div class="callout">
<div class="callout-kicker">The short answer</div>
Kindle honours embedded fonts only in its modern format, and only when the book is built so the device does not fall back to the reader's own font choice. The two usual causes are the reader's font setting winning over yours, and only the <strong>regular</strong> weight being embedded — so the device synthesises bold and italic and they look distorted. Embed the face correctly, <a href="/epub-validator">validate it</a>, and accept that the reader still gets a vote.
</div>

## Why Kindle ignores or distorts an embedded font

Three things sit between the EPUB you built and the words on the screen, and each can undo font embedding on its own.

**The conversion.** A Kindle does not read EPUB natively — Amazon converts it. The old route produced MOBI, a format with no concept of embedded fonts at all; anything you embedded was simply stripped and the book rendered in a device font. Modern Kindles use KF8, the format behind [AZW3/KF8](/epub-to-azw3), which does support embedded OpenType and TrueType fonts. So the first question is whether the book was even converted into a format that can carry a font. If it went through an old device or an old workflow, the answer is no, and there is nothing to fix in the EPUB — the format is the ceiling.

**The reader's font menu.** Even in KF8, the person reading gets to pick a font from the Kindle's settings, and that choice usually wins. Your embedded face is honoured for the body only when the book is built so the device does not quietly revert to the reader's preferred reading font. A file that does not follow the embedding rules gets treated as "no strong preference here" and falls back to the default. This is by design — Amazon optimises for the reader's comfort over the publisher's intent — and it means an embedded font is a strong suggestion, never a guarantee.

**Single-weight embedding.** This is the "distorted" case, and it is the one people misread as corruption. If a book embeds only the regular master of a family, the renderer has nothing to draw bold or italic with, so it fakes them — slanting the uprights for italic, thickening the outlines for bold. The result is the smeared, slightly wrong look you noticed on headings and emphasis. The font is working; it is just being asked to do a job it was not given the files for.

## Check the font is actually embedded

An embedded font needs three things present in the EPUB, and missing any one makes the converter drop it silently:

1. The font file itself, inside the archive.
2. A `manifest` entry declaring that file, with the right media type.
3. An `@font-face` rule in a stylesheet that points at it, plus a `font-family` that actually uses it.

Miss the manifest entry and epubcheck flags an unreferenced resource; miss the `@font-face` and the file is dead weight the reader never loads. The fastest way to find out which is wrong is to run the book through the [EPUB validator](/epub-validator) — a missing manifest item or a broken font href shows up in seconds, with the exact path.

This wiring is what [Style Studio](/style-studio) handles for you. When you re-typeset a book and turn embedding on, it writes the font into the archive, adds the `manifest` item with a `font/woff2` media type, injects the matching `@font-face`, and replaces the book's own stylesheet so nothing out-specifies the new one. That solves the most common failure — a font that was never properly declared — without you touching the OPF by hand.

Being realistic about one edge: Style Studio embeds the web font (woff2) the browser already holds, which every modern EPUB reader handles cleanly. Amazon's converter documents OpenType and TrueType support specifically, so if a face still refuses to stick on Kindle after everything else checks out, an OTF or TTF embed is the safest bet for that one target. For reading on Apple Books, Kobo, or any standards EPUB app, the woff2 is fine.

## The reader still gets a vote

Here is the part no fix removes: on a Kindle, the reader can override your body font from the settings menu whenever they like, and many do without thinking about it. You cannot force a font onto someone's screen. What you can do is make the fallback acceptable — choose a face whose absence does not wreck the layout, and lean on a robust screen typeface rather than something that only works at display sizes. Our notes on [fonts for ebooks](/blog/best-fonts-for-ebooks) go into which faces survive a small e-ink screen.

Design for the override, in other words, instead of fighting it. If the book reads well in the reader's default and better in yours, you have lost nothing when they switch.

## Where embedded fonts actually survive

| Route | Embedded fonts? | What actually happens |
| --- | --- | --- |
| Old MOBI (KF7) | No | The format cannot carry fonts; they are stripped on conversion |
| KF8 / AZW3, via Send-to-Kindle | Yes, if built correctly | Honoured for the body, but the reader's font choice can still override |
| Plain EPUB reader (Apple Books, Kobo) | Yes | `@font-face` is honoured directly; no converter in the way |

The pattern is clear: the further you get from a real EPUB reader, the more layers can drop your font. The [Send-to-Kindle route](/blog/send-epub-to-kindle) is the modern, KF8-producing path — use it rather than any old MOBI workflow, and half of these problems never arise.

## When to stop fighting it

Some things are outside your control and worth accepting early. You cannot legally embed every commercial typeface — many licences forbid ebook embedding, and a font that is not licensed for it should not go in the file regardless of whether it technically works. You cannot stop a reader picking their own font. And a face designed for print headlines will look thin and fragile on a low-contrast e-ink panel no matter how cleanly it is embedded.

If you need to see exactly how a specific Kindle will render the book before you publish, Amazon's own Kindle Previewer is the honest tool for that — it converts the file the same way the store does and shows you the real result, which no EPUB preview can promise. Style Studio and the validator get the EPUB correct; the Previewer confirms what the conversion does to it.

For most books, the fix is unglamorous and reliable: embed the regular weight properly, add the bold and italic masters if the face needs them, [re-typeset and embed with Style Studio](/style-studio) so the manifest and `@font-face` are correct, validate, then send through the modern Send-to-Kindle path. Do that, and the font that survives is the one you chose — for every reader who leaves the default alone.

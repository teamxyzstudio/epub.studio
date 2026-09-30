---
title: 'EPUB font won''t change? The book outranks the app'
excerpt: 'Your EPUB font won''t change no matter what the app''s menu says? The book''s own CSS is allowed to win. The rule behind it, measured — and the fix.'
category: 'Fix it'
ogImage: '/blog-og/epub-font-wont-change.png'
date: 2026-09-30
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - style-studio
howToTitle: 'How to change the font in an EPUB that ignores the app'
howTo:
  - t: 'Try the app''s own override first'
    d: 'Look for a setting named publisher defaults, embedded styles or similar, and turn it off. If both the typeface and the size now follow the menu, stop here.'
  - t: 'Re-typeset the book in Style Studio'
    d: 'Open the EPUB, pick a preset or a typeface and size, and download. The book''s own stylesheets are replaced with one that declares what you chose.'
  - t: 'Read the new copy'
    d: 'The downloaded file carries your typography as its default look, so it reads that way in any app — no override toggle required.'
faqs:
  - q: 'Does an EPUB font that will not change mean the file is broken?'
    a: 'No. A book that names its own typeface and sizes is using ordinary, legal CSS — there is nothing invalid to repair. The file is doing exactly what it says; it just says something you disagree with. That is why the fix is a restyle, not a repair.'
  - q: 'Why did the publisher pin the font in the first place?'
    a: 'Often nobody decided anything. Conversions from word processors tend to write the source document''s typeface and point sizes into the stylesheet, paragraph by paragraph, and that frozen office formatting ships as the book''s design. Deliberate pinning exists too, but the hardcoded 10pt body you cannot budge is usually an export artefact.'
  - q: 'Why does the typeface change but the text size stay the same?'
    a: 'Because the two settings lose to different rules. A forced font-family on the body flips every paragraph that only inherits its face, but a stylesheet that declares font-size directly on each paragraph re-states the size downstream of the override, so the paragraph rule wins again. In our harness the pinned chapter''s face flipped while its 10pt size survived untouched.'
  - q: 'Can I just delete the CSS file inside the EPUB myself?'
    a: 'It works, and forum veterans have been doing it with archive tools for years. But you have to unzip and re-zip the container correctly, the manifest still lists the deleted file, and inline styles on the paragraphs survive anyway. A restyle does the same removal plus the re-linking in one pass, which is why it is the safer version of the same idea.'
  - q: 'Will my chosen font show up on a device that does not have it installed?'
    a: 'Only if it travels with the book. By default the new stylesheet names the face and falls back to the device''s serif or sans when it is missing. Style Studio''s embed option writes the font file into the archive with a matching @font-face rule, which is the way to make the choice hold everywhere.'
draft: false
---

You bought the book, opened it, and the type is wrong — too small, too spindly, some serif you would never choose. So you open the app's font menu and pick something better, and half of nothing happens. The size slider moves other books, not this one. The EPUB font won't change, and the app never says why.

This complaint has been resurfacing for a decade wherever readers gather — MobileRead has threads titled exactly "Why the font won't change in certain epubs", and the same question runs through Adobe's Digital Editions community and Goodreads reading groups. The stock answers range from "buy a different reader" to "open the archive and delete the stylesheet". The mechanism underneath is simpler than either.

<div class="callout">
<div class="callout-kicker">The short answer</div>
The book carries its own CSS, and in the cascade that decides every page, the book's declarations beat the app's suggestions. A reading app's font menu is a polite request; a stylesheet that says <strong>font-family: Georgia</strong> and <strong>font-size: 10pt</strong> on every paragraph is a standing order. Apps can force the issue, but many don't, or only half do. The reliable fix is to <a href="/style-studio">rewrite the book's order</a> so it says what you wanted all along.
</div>

## The menu is a request; the stylesheet is a rule

An EPUB is HTML and CSS in a zip, and it renders under the same cascade as a web page. Styles the book ships — its linked stylesheets, its inline attributes — are author styles. The font menu in a reading app is not part of the book; to have any effect, the app has to inject its choice as more CSS and hope it lands above the book's. Plain injection loses: an ordinary declaration from the app is overruled by the book's own, later, more specific rules. That is not a bug in your reader. It is CSS resolving a disagreement exactly as designed, in favour of the author.

The apps know this. Readium CSS — the open styling engine behind a family of reading apps — documents a [dedicated fontOverride flag](https://github.com/readium/readium-css/blob/master/docs/CSS19-api.md) that must be switched on before a user's typeface choice does anything, and it files the font-size setting under overrides that "should be applied by any means necessary". Any means necessary — the engine's own phrasing for what it takes to beat a book that has an opinion. Whether a given app goes that far, and for which properties, is the difference between the books that obey your menu and the books that don't.

## Three chapters, three answers to one setting

To see each case separately, we built a three-chapter fixture this run — fontbook.epub, 3,531 bytes — and read it in a Chromium harness that applies a reading-app font preference the polite way: DejaVu Sans at 18px, injected before the book's own styles, no forcing. Each chapter pins its typography differently.

| Chapter | Where its font lives | What the reader's setting did |
| --- | --- | --- |
| Control | nowhere — no font declarations at all | followed the menu: DejaVu Sans, 18px |
| Pinned | a linked 204-byte stylesheet: `font-family` on body, `font-size: 10pt` on every `p` | ignored it: Georgia, 13.3px |
| Inline | `style="font-family: Georgia, serif; font-size: 9pt"` on each paragraph | ignored it: Georgia, 12px |

<figure>
<img src="/blog-media/epub-font-wont-change/fonts-harness.png" alt="Three white panels under a dark header bar reading 'reading-app font setting: DejaVu Sans · 18px, mode: weak'. Left panel 'Control — no book font': large sans-serif text. Middle panel 'Pinned — css/book.css': visibly smaller serif text. Right panel 'Inline — style attributes': smaller serif text again. Probe rows under the panels read p → DejaVu Sans · 18px, p → Georgia · 13.3333px, p → Georgia · 12px." width="720" loading="lazy" />
<figcaption>fontbook.epub in the Chromium harness with the app asking for DejaVu Sans at 18px. Only the chapter with no font of its own listened; the computed values under each panel are quoted from the live layout.</figcaption>
</figure>

The pinned chapter is the everyday case, and note what its stylesheet is: not protection, not trickery — no `!important` anywhere. Just a named serif and paragraph sizes in points, which is precisely what conversions from word processors write. The book that frustrates you was very often not designed to resist; it was exported carelessly and its office formatting fossilised into CSS.

## What the override toggle half-fixes

Some apps do force it — that is what a "publisher defaults off" or "ignore embedded styles" switch means. We re-ran the harness with the app's font forced at body level with `!important`, the fontOverride posture. The result is instructive: the pinned chapter's typeface flipped to the reader's sans, but its size stayed at 13.3px, because `font-size: 10pt` declared directly on each paragraph re-states the value below the body-level override and wins again. And the inline chapter ignored the whole exercise — a style attribute on the paragraph itself outranks an override aimed at the body.

That is the "it half-worked" experience readers describe: face changes, size doesn't, or one book obeys and the next won't. The app is not being inconsistent. Each book pins its type at a different level, and each level needs a different amount of force.

## Rewrite the book's opinion instead

Since the book's CSS wins, the durable fix is to change what it says. [Style Studio](/style-studio) re-typesets an EPUB in the browser: it removes the book's stylesheets and style blocks, then links one generated stylesheet that declares your choices — typeface, size, line height, margins — as the book's own author styles. Nothing uploads; the file never leaves the machine.

We ran the fixture through it live this run and chose the Accessible preset — Atkinson Hyperlegible at 20px, the kind of choice a low-vision reader makes and pinned books refuse. Download: the-font-book.epub, 4,245 bytes.

<figure>
<img src="/blog-media/epub-font-wont-change/style-studio-accessible.png" alt="Style Studio in the browser with fontbook.epub loaded, shown as 'fontbook.epub → the-font-book.epub' in the header. The preview shows 'The Font Book' with chapter one in large sans-serif type. In the settings column the Accessible preset card is selected and a Typeface list shows Literata, Crimson Pro, EB Garamond, Lora, Source Serif 4, Merriweather, Bitter. The bottom-right button reads 'Download ready ✓ the-font-book.epub · 3 KB'." width="720" loading="lazy" />
<figcaption>The fixture in Style Studio with the Accessible preset selected. The page itself states the honest limit: these settings become the book's default look, and reading apps may still let readers override them — which is the correct direction of authority.</figcaption>
</figure>

Inside the downloaded archive, chapter two's link to `css/book.css` is gone, replaced by a link to a generated `epub-studio.css` of 924 bytes whose body rule opens with the whole choice spelled out — `font-family:'Atkinson Hyperlegible', sans-serif; font-size:20px; line-height:1.75`. The old 204-byte stylesheet is still sitting in the archive, orphaned; nothing references it any more. Back in the harness, the control and pinned chapters now both read Atkinson Hyperlegible at 20px — the book and the reader finally agree.

<figure>
<img src="/blog-media/epub-font-wont-change/fonts-after.png" alt="Three white panels under the same dark header bar. Left panel 'Control' and middle panel 'Pinned' now show identical large sans-serif text, with probe rows reading p → Atkinson Hyperlegible · 20px under both. Right panel 'Inline — style attributes' still shows small serif text, its probe reading p → Georgia · 12px." width="720" loading="lazy" />
<figcaption>The restyled book back in the harness. The pinned chapter now matches the control at 20px; the inline chapter is still Georgia at 9pt, because style attributes ride on the paragraphs themselves and survive a stylesheet swap.</figcaption>
</figure>

## What a restyle cannot reach

The third panel is the honest edge. Inline `style=""` attributes live in the chapter files, not the stylesheets, and the restyle deliberately rewrites only the styling layer — so a book whose exporter stamped a font on every single paragraph keeps those stamps, as the probes show: still Georgia, still 9pt. Fixing that means editing the chapter markup itself, which is Sigil or Calibre territory, not a one-click operation.

Two more limits worth knowing. The forum workaround of opening the archive and deleting the CSS by hand does work — it is the same removal — but you carry the re-zip risk yourself and the manifest keeps listing a file that no longer exists; the restyle route does the removal and the re-linking together. And a chosen face renders only where the device has it: by default the new stylesheet falls back to the device's own serif or sans when the named font is missing, and Style Studio's embed option is the way to pack the font file into the archive with its `@font-face` rule so the choice holds everywhere. If you are picking a face to standardise your library on, our notes on [fonts for ebooks](/blog/best-fonts-for-ebooks) cover which ones earn it.

This is the third book-versus-app fight we have measured this way, and they all resolve the same direction: [dark mode that will not go dark](/blog/epub-dark-mode-not-working) is pinned colour, clipped lines are pinned geometry, and a font that will not change is pinned type. If you are on the other side of the trade — you made the book and your embedded font is being ignored on a Kindle — that is the [opposite problem](/blog/epub-embedded-fonts-not-working), and it has its own post. For the reader holding a stubborn book tonight, the move is the same one we just did: open it in the studio, say what you want, and download a copy whose opinion is yours.

---
title: 'The best fonts for ebooks (and how to choose one)'
excerpt: 'Literata, Garamond, or Hyperlegible? What actually matters when readers can override your font.'
category: 'Typesetting'
ogImage: '/blog-og/best-fonts-for-ebooks.png'
date: 2026-05-28
updated: 2026-08-27
author:
  name: 'Mofid Ansari'
  initial: 'M'
tools:
  - epub-reader
howToTitle: 'How to choose a font for an ebook'
howTo:
  - t: 'Pick a face for the genre and the reader'
    d: 'Not for yourself. Fiction convention leans serif, technical and reference material leans sans, and an accessibility face is a legitimate general-purpose choice.'
  - t: 'Set the size so the x-height looks right'
    d: 'Ignore the number — x-height varies so much between faces that EB Garamond and Inter at the same pixel size read as two different sizes.'
  - t: 'Set line length to 60–75 characters'
    d: 'The comfortable range for continuous reading, counting spaces.'
  - t: 'Set leading to suit that measure'
    d: 'Adjust the space between lines until it suits the line length you just set.'
  - t: 'Look at the page unfocused'
    d: 'Well-set text should read as an even grey block rather than as texture.'
  - t: 'Check the smallest and largest sizes a reader might choose'
    d: 'The step people skip, and where decorative choices fall apart — a drop cap that works at 19px can collide with the text at 28px.'
faqs:
  - q: 'Can readers override the font I choose for my ebook?'
    a: 'Yes. In a reflowable book the typeface is a suggestion — any reader app can substitute the reader''s own choice, and many people do. The practical question is which font makes the best default for the people who never open the settings, and when a reader does override it, the format is doing its job.'
  - q: 'What is x-height and why does it matter for ebook fonts?'
    a: 'X-height is the height of a lowercase x relative to the capitals. Faces with generous x-heights stay legible at small sizes and on low-resolution e-ink, which makes it the single strongest predictor of screen legibility — and the reason a beautiful print face can read poorly on a Kindle.'
  - q: 'Will a Kindle display the font embedded in my EPUB?'
    a: 'Not necessarily. Kindle in particular may substitute its own font regardless of what the book embeds, and some other readers strip embedded faces too. Embedding guarantees the font travels with the book, not that every device honours it — one more reason to pick a sturdy default rather than depend on a specific face.'
  - q: 'Do I need permission to embed a font in an ebook?'
    a: 'Yes — embedding is a licensing question, and not every font licence allows it. Checking the licence is the part people skip, and it matters more than the file-size cost. All twelve faces offered in Style Studio are open-licensed and embeddable.'
  - q: 'Does OpenDyslexic actually help dyslexic readers?'
    a: 'The evidence is split. The mechanism — weighting the bottom of each letter to reduce the rotation and swapping some dyslexic readers experience — is contested, but the evidence that some readers strongly prefer it is not. Since offering it costs nothing and compromises nothing for anyone else, the practical answer is to include it and let people decide.'
---

Here is the uncomfortable part: in a reflowable book, your typeface is a suggestion. Any reader can override it, and many do. So the question is not "which font is best" but "which font is the best default, for the people who never change it."

## What actually matters on screen

**A large x-height.** The x-height is the height of a lowercase 'x' relative to the capitals. Fonts with generous x-heights stay legible at small sizes and on low-resolution e-ink. This is the single strongest predictor of screen legibility, and it is why a beautiful print face can read poorly on a Kindle.

**Open apertures.** The gaps in letters like 'c', 'e' and 'a'. When they close up, those letters converge toward 'o' at small sizes and reading slows.

**Distinguishable I / l / 1.** Matters more than people expect, especially in anything technical.

**Sturdy strokes.** High-contrast faces — thick stems, hairline thins — lose the thin strokes to e-ink rendering and look broken.

## Some defaults worth knowing

| Face             | Good for                          | Watch out for                    |
| ---------------- | --------------------------------- | -------------------------------- |
| Literata         | General reading; screen-designed  | Slightly wide — costs pages      |
| EB Garamond      | Literary fiction, period feel     | Small x-height; needs size bumps |
| Source Serif 4   | Non-fiction, technical writing    | Can read a little cool           |
| Bitter           | Dense text on small screens       | Strong personality               |
| Atkinson Hyperlegible | Maximum legibility           | Distinctive; not neutral         |

Literata was commissioned specifically for on-screen reading and is a safe, unshowy default. EB Garamond is genuinely lovely and genuinely needs a point or two more size than you would expect.

<div class="callout">
<div class="callout-kicker">Accessibility is not a niche</div>
Around one reader in ten benefits materially from a face designed for legibility — the <a href="https://www.bdadyslexia.org.uk/dyslexia">British Dyslexia Association</a> estimates ten percent of the population is dyslexic. Atkinson Hyperlegible disambiguates commonly confused letterforms; OpenDyslexic weights the bottoms of letters to reduce rotation. Offering them costs nothing and is not a compromise for anyone else.
</div>

## Should you embed it?

Embedding guarantees your font travels with the book. It also adds roughly 200–300 KB per weight and can be stripped by some readers anyway.

Embed when the typeface is doing real work — a designed non-fiction book, or anything where the face is part of the identity. Skip it for a straightforward novel: the reader's own default is fine, and many will override you regardless.

Whatever you pick, test it at the sizes people actually read at, not at the size you designed at. [Style Studio](/style-studio) previews all of these live against real text, which is faster than converting and re-checking on a device.

## Serif or sans on screen?

The old rule — serif for print, sans for screen — was a resolution argument, and it expired. It came from an era when a screen had roughly 72 pixels per inch and serifs were too fine to render as anything but mud. Modern phones and tablets are at 300+ ppi, comparable to print, and e-ink is designed specifically for text.

At those densities serifs render cleanly and the choice returns to genre convention and taste. Fiction still overwhelmingly uses serif because readers associate it with books. Technical and reference material leans sans because it associates with interfaces and documentation. Neither is measurably faster to read.

The exception worth respecting: very small sizes, and readers on older devices. If your book will be read at 12–14px on unknown hardware, a sturdy sans with a large x-height is the safer default.

## Size is part of the typeface

A point size means almost nothing on its own, because x-height varies enormously between faces. EB Garamond at 19px and Inter at 19px produce visibly different reading experiences — the Garamond will look two sizes smaller.

This is why the presets in [Style Studio](/style-studio) pair each typeface with a size that suits it: Classic novel sets EB Garamond at 19px, while Modern sets Source Sans 3 at 18px. They look comparable despite the different numbers.

If you switch typeface and the page suddenly feels wrong, check the size before blaming the face.

## What embedding actually costs

Embedding gets discussed as though it were expensive. For a modern subset it is not: a latin woff2 of a text face is usually 10–60 KB per weight. Against a book that is already several hundred kilobytes of text and often megabytes of images, that is noise.

The real considerations are different:

- **Licensing.** Not every font may be embedded in an ebook, and this is the part people skip. Check the licence. All twelve faces offered here are open-licensed and embeddable.
- **Weights multiply.** Regular plus bold plus both italics is four files, not one.
- **Some readers ignore it anyway.** Kindle in particular may substitute its own font regardless.

Embed when the typeface is doing real work. Skip it for a straightforward novel where the reader's default is perfectly fine.

## The accessibility faces

**Atkinson Hyperlegible** was designed by the Braille Institute specifically to disambiguate characters that blur together for readers with low vision — the tail on the lowercase l, the distinct shapes of I/l/1 and O/0. It is a genuinely good general-purpose face that happens to be unusually legible.

**OpenDyslexic** weights the bottom of each letter, on the theory that this reduces the letter rotation and swapping some dyslexic readers experience. The evidence for the mechanism is contested; the evidence that some readers strongly prefer it is not. Offer it and let people decide for themselves.

Neither costs anything to include, and neither compromises the experience for anyone who does not need them.

## A working process

1. Pick a face for the genre and the reader, not for yourself.
2. Set the size so the x-height looks right, ignoring the number.
3. Set line length to 60–75 characters.
4. Set leading to suit that measure.
5. Look at the page unfocused. It should read as even grey.
6. Check it at the smallest and largest sizes a reader might choose.

Step six is the one people skip, and it is where decorative choices fall apart. A drop cap that works at 19px can collide with the text at 28px.

Remember throughout that in a reflowable book you are choosing a *default*. Many readers will override it, and the format is doing its job when they do.

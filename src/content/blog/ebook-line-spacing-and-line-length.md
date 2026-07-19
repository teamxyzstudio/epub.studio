---
title: 'Line spacing and line length: why your ebook is hard to read'
excerpt: 'The 60–75 character rule, and how to fix a wall-of-text book in Style Studio in two minutes.'
category: 'Typesetting'
ogImage: '/blog-og/ebook-line-spacing-and-line-length.png'
date: 2026-06-30
author:
  name: 'Epub Studio'
  initial: 'E'
tools:
  - epub-reader
---

Some books are tiring to read and it has nothing to do with the writing. Two measurements are usually responsible, and both take seconds to change.

## Line length: the 60–75 rule

Typographers have converged on 60–75 characters per line for continuous reading, and the reason is mechanical rather than aesthetic. At the end of a line your eye performs a return sweep back to the left margin. The longer the line, the more likely it lands on the wrong one.

Too short is its own problem — under about 45 characters the eye sweeps so often that the rhythm of reading breaks up.

<div class="callout">
<div class="callout-kicker">How to measure it</div>
Count the characters in one full line, including spaces. Between 60 and 75 is comfortable. Over 90 and you are in wall-of-text territory, which is where a phone held in landscape usually lands.
</div>

## Leading: the space between lines

Leading is the vertical distance from one baseline to the next, expressed as a multiple of the font size. At 1.0 the lines touch and the eye cannot separate them. At 2.5 the paragraph stops reading as a block.

For body text on a screen, 1.5 to 1.7 is the useful range. Long lines need more leading, not less — the extra space is what helps the return sweep find its target. If you are stuck with a wide layout, raising the leading is the cheapest fix available.

## Fixing it

This is exactly what a reflowable format is for. In [Style Studio](/style-studio), the line-length slider marks a 60–75 character comfort band directly on the scale, so you can see when you are inside it rather than guessing. Set the measure first, then adjust leading until the paragraph looks like a solid grey block with no rivers running through it.

Two other things worth doing in the same pass:

- **Justified text needs hyphenation.** Without it, justification stretches word spacing into visible white rivers down the page. With it, justified text is genuinely tidier than ragged-right.
- **Pick indents or spacing, not both.** A first-line indent and a blank line between paragraphs are two solutions to the same problem. Using both is a common tell of an auto-converted file.

None of this changes a word of the text. It changes how long a reader lasts before putting the book down.

## Why the numbers are what they are

The 60–75 range is not a style preference. Reading is a sequence of jumps — saccades — with brief fixations between them, and at each fixation you take in roughly 7–9 characters clearly plus some blurry context either side. A line is a series of these jumps ending in a return sweep to the start of the next line.

The return sweep is the fragile part. Your eye has to travel back and land on a line it cannot see clearly during the movement, using the left margin and the rough vertical position as its guide. The longer the line, the further that jump, and the more often it lands one line off. When that happens you either re-read a line or skip one, and either way the thread breaks.

Short lines have the opposite failure: so many return sweeps that the mechanical overhead dominates. Somewhere around 60–75 characters the two costs balance.

## Leading is a function of measure

The most common mistake is treating leading as an independent choice. It is not — it is a response to line length.

Long lines need *more* leading, because the extra vertical space gives the return sweep a bigger target. Short lines can take less. A 90-character line at 1.4 leading is genuinely hard work; the same line at 1.8 becomes tolerable. If you are stuck with a wide layout you cannot change — a PDF, a fixed-layout book — raising the leading is the single most effective repair available.

A rough guide:

| Measure | Leading |
| --- | --- |
| 45–55 characters | 1.4–1.5 |
| 55–70 characters | 1.5–1.65 |
| 70–85 characters | 1.65–1.8 |
| 85+ characters | 1.8+, and consider narrowing instead |

## The grey-block test

Typographers have an old trick for judging a text block: unfocus your eyes and look at the paragraph as a shape. Well-set text reads as an even field of grey. Problems announce themselves as texture:

- **White rivers** running vertically through the block — justified text without hyphenation.
- **Stripes** — leading too tight, so lines merge into bands.
- **A loose, airy feel with no cohesion** — leading too open; the paragraph has stopped being a unit.
- **Dark, dense patches** — the typeface is too heavy at this size, or letter-spacing is negative.

You can do this on your own book in ten seconds and it is more reliable than reasoning about numbers.

## Fixing a book you did not typeset

Most poorly-set ebooks are auto-converted files where nobody chose any of this. The good news is that a reflowable book is *designed* to be re-typeset — that is the whole point of the format, and changing these settings destroys nothing.

In [Style Studio](/style-studio), work in this order:

1. **Line length first.** The slider marks the 60–75 comfort band directly on the scale, so you can see when you are inside it.
2. **Then leading**, using the table above as a starting point and the grey-block test to confirm.
3. **Then alignment.** If you justify, turn hyphenation on — justification without it is what produces rivers.
4. **Then paragraph style.** Indents or spacing, not both.

Set once, and every book you run through it inherits the same decisions.

## One caveat

None of this survives contact with a reader who has their own preferences, and that is correct. In a reflowable book your settings are a default, not a mandate. Someone reading at 24pt on a phone will blow past your carefully chosen measure, and they should be able to.

What you are optimising is the experience of the reader who never opens the settings — which is most of them.

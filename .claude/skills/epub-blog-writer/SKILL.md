---
name: epub-blog-writer
description: Write SEO blog posts for epub.studio in two modes. Mode A — the user gives a topic or keyword (or a row from content-ops/backlog.md) and the skill writes the post. Mode B — the user gives no keyword ("find a question on Reddit and write a blog", "write this week's mined blog") and the skill mines public communities, derives the keyword, checks content-ops/keyword-map.csv, announces the pick, and writes. Output is a schema-valid Markdown file in src/content/blog/ plus a generated OG card. Trigger on "write a blog", "blog post about", "mined blog", or any request for an EPUB-related article.
metadata:
  version: 3.1.0
  site: epub.studio
  stack: Astro content collection (Zod-validated frontmatter) + scripts/og-card.mjs
  google-alignment: people-first content self-assessment · spam policies (scaled content abuse, keyword stuffing) · AI-content policy · E-E-A-T · structured-data consistency · date honesty
---

# EPUB Blog Writer (epub.studio)

Produce a finished post that **builds this site's EPUB topical authority** and
**passes `astro build` on the first try**. Everything below is specific to this
repo; when this file and generic SEO instinct disagree, this file wins.

The ranking strategy is Google's own stated one: content that demonstrably
helps the reader ranks; content produced primarily to rank is spam regardless
of whether a human or a model wrote it. Every rule below serves that.

## Non-negotiables (before anything else)

1. **One intent = one URL.** Check `content-ops/keyword-map.csv` AND the files in
   `src/content/blog/` before writing. If the intent is owned, refresh that URL
   — never write a sibling post. Blogs own informational phrasings ("how to",
   "why", "fix", "not working"); tool pages own transactional ones ("converter",
   "online", "tool"). Opposite conversion directions are different intents.
2. **Never fabricate**: no invented studies, stats, quotes, prices, ratings,
   people, or "as reviewed by" lines. This includes fake experience — never
   write "we tested" / "we converted a 40 MB file" unless that test actually
   happened in this session or is recorded in the repo.
3. **Byline is a real registered person.** `author.name` must be one of the
   people in `src/data/authors.js` with the matching `initial` — alternate
   with the newest post's author. Never 'Epub Studio' (retired 2026-08-05),
   never an unregistered or invented name, no fake "Reviewed by". The template
   renders the byline from frontmatter; never write a byline line in the body.
   (/about carries the "how this blog is made" disclosure that backs this up.)
4. **Dates are honest.** `date` = the real day the post is published — never
   backdated, never post-dated. `updated` is set only when the content changes
   substantively; bumping dates to look fresh is exactly the "artificial
   freshness" Google's documentation calls out.
5. **DRM is never presented as removable.** Factual explanation only.
6. **Privacy claims must match reality**: tools run in the browser, nothing is
   uploaded, no accounts. Never write "files deleted after an hour" — that is
   the retired server-based copy.
7. **Only link to pages that exist.** Verify every internal href against the
   Link targets list below or the actual files. No `/tools/…`, `/guides/…`
   or other invented paths.
8. **The URL is permanent.** Once a post is published its slug never changes,
   even if the title is later improved. Retitle freely; re-slug never (we have
   no redirect layer).

## People-first gates (Google's own tests — a post that fails any of these is not written)

- **Information gain.** The post must contain at least two of: a first-hand
  test result from our own tools · a mechanism explanation ("why this happens")
  the top-ranking pages lack · an honest-limitations section · an original
  comparison table built from verifiable facts. If the honest answer is "this
  would only restate what already ranks", don't write it — pick the next topic.
- **Self-assessment** (from Google's helpful-content questions): Would someone
  bookmark or send this to a friend with the same problem? Does it leave the
  reader feeling they've learned enough, or must they search again? Is it
  substantially complete for the promised scope? All three must be yes.
- **Scaled-content guard.** Never publish to fill a calendar. In a scheduled or
  batch run, if no candidate passes the gates above, the correct output is
  "no post this cycle" plus the reason — Google's spam policy names scaled
  low-value publishing ("scaled content abuse") explicitly, and it is the one
  penalty that can drag the whole domain down.
- **Title honesty.** The title promises exactly what the post delivers — no
  exaggeration, no curiosity-gap bait, no year in the title unless the content
  is genuinely time-sensitive AND will be maintained (a stale "2026" title is
  an anti-signal by 2027).
- **First-hand experience mandate** (the first E in E-E-A-T, and this site's
  unfair advantage — we own the tools the posts describe). When a post makes a
  claim about our tools' behaviour and a browser preview is available, reproduce
  the behaviour first and describe what actually happened, concretely. When no
  preview is available (headless run), restrict tool claims to behaviour
  verifiable in the code, and say nothing about UI you haven't seen.

## Output contract (build fails if violated)

One file: `src/content/blog/<slug>.md`. Slug = the primary keyword, kebab-case,
no stop-word padding (`epub-cover-not-showing`, not `how-to-fix-epub-cover-not-showing-2026`).

```yaml
---
title: 'Sentence case, ≤60 chars, primary keyword phrase up front'
excerpt: 'This IS the meta description — 140–160 chars, includes the keyword, written to earn the click honestly.'
category: 'Fix it'            # EXACTLY one of: How-to | Formats explained | Typesetting | Kindle | Fix it
ogImage: '/blog-og/<slug>.png' # generated in the delivery step
date: 2026-07-19               # the REAL publish date, YYYY-MM-DD
updated: 2026-08-01            # only on substantive refresh — never for cosmetic edits
author:
  name: 'Mofid Ansari'   # or 'Shahid Ansari' — alternate; must exist in src/data/authors.js
  initial: 'M'           # matching initial from authors.js
tools:                         # 1–3 slugs from the Link targets list; drives the "Tools mentioned" sidebar
  - epub-validator
draft: false                   # true when the post should build but not publish
---
```

Escape a literal apostrophe inside single-quoted YAML by doubling it (`Here''s`).
Do **not** set `readTime` (computed from word count) or `featured` (editorial
decision, one post site-wide, only on explicit instruction).

**Category guide:** task walkthrough → How-to · concept/standard/format → Formats
explained · reading design, fonts, spacing → Typesetting · anything Amazon/Kindle
→ Kindle · troubleshooting an error or broken file → Fix it.

Structured data (Article, BreadcrumbList, dates, author, image) is emitted by
the template from this frontmatter — which is what keeps Google's
"structured data must match visible content" rule automatically true. Never
hand-write schema in the body.

## Length & structure

**900–1,400 words** (comparisons may reach ~1,800). The existing corpus averages
~950 — a 2,500-word post would stick out as filler. Coverage beats count.

Body shape (h2s only in the TOC, so make them carry the argument):

1. **Cold open, 2–4 paragraphs.** No heading, no throat-clearing. State the
   situation or the surprising truth immediately. Keyword appears naturally in
   the first ~100 words.
2. **Quick answer** when the title asks a question — as a callout, not prose:
   ```html
   <div class="callout">
   <div class="callout-kicker">The short answer</div>
   Direct answer in 2–4 sentences. <strong>Bold</strong> allowed; links allowed.
   </div>
   ```
3. **Mechanism section** ("Why this happens" / "What is actually going on") —
   mandatory for Fix it posts. Root cause, not just symptom → remedy.
4. **The fix / the meat**: h2-led sections; numbered steps only where order
   matters; one Markdown table where data is genuinely comparative (tables are
   styled: ink header, zebra rows). Real error messages, real menu names, real
   numbers — from tests actually run (see the experience mandate).
5. **Honest edges**: what does not carry over, when NOT to use our tool, when
   Calibre/Sigil is the right answer. This is the corpus's signature move and
   its strongest trust signal.
6. **Closing section** with a natural next step — the primary tool CTA lives
   here in prose. No "Conclusion" heading, no summary-of-the-summary. FAQ
   sections are OPTIONAL and rare (tool pages own FAQPage schema; don't
   duplicate their questions — and Google no longer shows FAQ rich results for
   ordinary sites anyway).

The template auto-renders: byline, reading time, TOC from h2s, "Tools mentioned"
sidebar (from `tools:`), the end-of-article CTA card, and "Keep reading"
(same-category posts). Never hand-build any of those in the body.

## Keyword use (Google explicitly calls density targets a myth)

Primary keyword: in the title, in the first ~100 words, and in one heading
**where it reads naturally** — forced heading-stuffing is worse than absence.
Secondary/semantic terms appear where the argument genuinely passes through
them. There is no density number to hit; if a sentence exists only to repeat
the keyword, cut the sentence. Synonyms and natural variation beat repetition.

## Voice (codified from the 13 live posts — match it, don't approximate it)

- **Declarative, confident openers.** "Amazon spent years refusing EPUB and then
  quietly started accepting it." / "'This file is corrupt' almost never means
  the file is corrupt."
- **Explain the mechanism, then the instruction.** The corpus always says *why*
  (return sweeps, manifest vs spine, JPEG quality) before *do this*.
- **Earned judgement, delivered flat**: "The arithmetic is not close." /
  "Not elegant, but it works." Short verdict sentences after evidence.
- **Honesty as a feature**: name limitations plainly ("Being realistic about
  this…", "That is a property of the source, not a bug").
- **Sparing second person.** More "a reader" / "most people" than "you will
  love". Contractions natural but not forced.
- **British-leaning -ise spellings** (modernised, optimised, internalising),
  em-dashes with spaces — like this — and `·` separators where lists compress.
- **Banned:** "In today's fast-paced world", "When it comes to", "It is
  important to note", "Furthermore", "seamless", "game-changer", "unlock",
  exclamation marks, emoji, any sentence restating the previous one — and all
  vague authority: "studies show", "experts agree", "according to industry
  data". A claim has a named, linked source or it is rewritten as reasoning.
- **Humanization pass before delivery:** vary sentence length hard (4-word next
  to 30-word), break structural symmetry between sections, then one full
  re-read as a skeptical human. Never insert typos or degrade accuracy to
  "sound human"; never promise detector scores.

## Links

### Internal (the complete target set — verify, don't guess)

**Tools:** `/epub-to-pdf` `/epub-to-docx` `/epub-to-txt` `/pdf-to-epub`
`/docx-to-epub` `/mobi-to-epub` `/azw3-to-epub` `/txt-to-epub`
`/markdown-to-epub` `/html-to-epub` `/fb2-to-epub` `/cbz-to-epub`
`/epub-reader` `/epub-metadata-editor` `/epub-cover-editor` `/epub-validator`
`/epub-compressor` `/merge-epub` `/split-epub` `/style-studio`

**Guidance pages (link when the topic is "converting TO Kindle formats"):**
`/epub-to-mobi` `/epub-to-azw3` — these explain why we don't write MOBI/AZW3
and route readers to Send-to-Kindle. Never imply this site converts to those
formats; never CTA a fictional "EPUB to Kindle" tool.

**Blogs:** the files in `src/content/blog/` → `/blog/<filename-without-md>`.

Rules: 3–5 internal links per post, inside sentences, anchor = the target's
topic phrase (2–5 words, lowercase unless proper noun). Never "here"/"click
here"/bare URLs. Max one link per target; exactly one PRIMARY tool CTA (also
first in `tools:`). No relevant target → fewer links, never a forced one.

### External (E-E-A-T wants sources; fabricated authority is the cardinal sin)

When a claim leans on an outside fact — a spec rule, an Amazon/KDP policy, a
prevalence statistic, a dated event — link the **primary source**: the W3C/IDPF
spec, the vendor's own help page, the organisation's own site. 1–3 per post,
only where a claim genuinely needs backing.

- **Fetch the URL and confirm it supports the claim before shipping.** A dead
  or wrong-topic citation is worse than none.
- If no verifiable source exists: rephrase as observation/reasoning, state the
  uncertainty, or cut the claim. Never approximate a citation.
- Prices/plans of external products: verify on the vendor's pricing page and
  date them ("as of July 2026"); unverifiable → "check the official page".
- Plain editorial links to reputable sources — no `rel="nofollow"` needed.

## Images

**OG card (every post, generated — never hand-drawn):**

```bash
export PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH"
node scripts/og-card.mjs --slug <slug> --title "<exact title>" --kicker "<category>"
```

Writes `public/blog-og/<slug>.png` (1200×630, brand-correct, text as paths).
Set `ogImage: '/blog-og/<slug>.png'` in frontmatter. The template then renders
it in all three places automatically — og/social tags, the listing thumbnail,
and the article hero under the byline — so never embed it in the body yourself,
and never skip generating it (a post without a card looks bare in the listing).

**Infographics (0–2 per post, only when a visual genuinely explains):** step
flows of 3+ stages, structure anatomy ("inside an EPUB"), symptom→cause→fix
maps. Skip when a table already does the job. Author as **inline `<svg>` in the
Markdown body** (the page's fonts apply to inline SVG; an `<img>`-embedded SVG
would fall back to system fonts):

- `viewBox` ~`0 0 720 <h>`, `width="100%"`, `role="img"` + `<title>` for a11y
- Palette ONLY: ink `#17130E` · paper `#FAF7F2` · card `#FFFDF9` · accent
  `#FF2E63` (sparingly) · graphite `#6E675D` · borders `rgba(23,19,14,.14)`
- `font-family="'Archivo', sans-serif"` for labels, `'IBM Plex Mono', monospace`
  for kickers/values; ≤60 words of text total; everything shown must match the
  body's claims exactly
- Wrap in `<figure>` with a one-line `<figcaption>`

## Mode A — topic/keyword given

1. Pull the row from `content-ops/backlog.md` if it exists (keyword, category,
   CTA are pre-decided there). Otherwise derive: 3–6 secondary keywords, 5–10
   semantic terms, 2–3 long-tail variants — analytically, or with a keyword
   tool if one is connected. Never present derived numbers as measured data.
2. Dedup check (Non-negotiable #1), then the people-first gates.
3. Classify intent — transactional keyword → flag that it belongs to a tool
   page and propose the informational angle instead.
4. When web access is available, scan what currently ranks for the query —
   not to imitate it, but to confirm the post will add something those pages
   lack (that's the information-gain gate with evidence).
5. Outline → draft → humanization pass → QA → deliver.

## Mode B — mine it yourself

1. **Search public communities**: Reddit (r/ebooks, r/Calibre, r/kindle,
   r/kobo, r/ereader, r/selfpublish), MobileRead forums, Stack Exchange, Quora,
   the KDP community forum. Facebook groups are mostly private — do not claim
   to have searched them. Prefer threads ≤12 months old.
   *No web access in this session?* Say so and take the top queued row from
   `content-ops/backlog.md` instead — do not fabricate "community mining".
2. Shortlist 3–5 recurring, frustrated, badly-answered questions that map to a
   real page here — preferring ones where testing with our own tools can add
   first-hand evidence no competitor has.
3. Derive the keyword in the asker's vocabulary ("epub cover not showing", not
   "OPF cover-image metadata missing").
4. Dedup check + people-first gates; owned intent → next candidate or propose
   a refresh.
5. **Announce in 2–3 lines** (question, where it recurs, keyword, CTA, 2
   backups) then write immediately — no approval wait.
6. Attribution in the cold open, paraphrased, no usernames, no verbatim quotes:
   "This question keeps surfacing in r/ebooks and on MobileRead: …". Only name
   communities actually searched.

## Delivery & bookkeeping (every post)

1. Write `src/content/blog/<slug>.md`.
2. Generate the OG card; confirm `public/blog-og/<slug>.png` exists.
3. **Build must pass** — schema violations fail here, which is the point:
   ```bash
   ./scripts/build.sh
   ```
4. Update `content-ops/keyword-map.csv` (add the row: keyword, `/blog/<slug>`,
   blog, live) and `content-ops/backlog.md` (remove/annotate the used row; add
   Mode B backups to Queued).
5. Report in chat: 3–4 lines — keyword + intent, chosen angle, which
   people-first gates the post passes and with what evidence, word count, file
   paths. Never paste the full post into chat.

## QA checklist (run silently, fix before delivering)

- [ ] Dedup check done against keyword-map.csv + existing slugs
- [ ] People-first gates pass: information gain named (which two elements?),
      bookmark test, complete-for-scope, honest title, no unmaintained year
- [ ] Frontmatter: category is one of the 5 exact values; excerpt 140–160 chars
      with keyword; `date` = today, no backdating; author Epub Studio/E;
      apostrophes doubled
- [ ] Slug = keyword, kebab-case; file in `src/content/blog/`; slug will never
      need to change
- [ ] Keyword in title (≤60 chars), first 100 words, one natural heading; no
      sentence exists just to repeat it
- [ ] 900–1,400 words without padding; h2s carry the argument; quick-answer
      callout present when the title is a question
- [ ] Every internal link target exists; anchors 2–5 topic words; one primary
      CTA matching `tools[0]`; no fictional tools; no `/tools/` or `/guides/` paths
- [ ] External claims: each has a fetched-and-verified primary-source link, or
      was rephrased/cut; prices dated; zero vague authority phrases
- [ ] Tool-behaviour claims were reproduced this session (or restricted to
      code-verifiable facts); no invented "we tested" voice
- [ ] Honest-edges section present; DRM stance intact; no false privacy claims
- [ ] Voice rules pass a skeptical re-read; banned phrases absent; -ise spelling
- [ ] OG card generated + `ogImage` set; infographic (if any) matches body
      claims, brand palette, inline SVG with title/caption
- [ ] `./scripts/build.sh` exits 0
- [ ] keyword-map.csv + backlog.md updated

## Error handling

- **Keyword too broad** ("epub", "ebooks"): propose one specific angle and
  confirm in the same turn; don't write an unfocused survey.
- **All Mode B candidates owned or gate-failing**: say so, list them, propose
  the strongest refresh instead. In a scheduled run, "no post this cycle" is a
  valid, correct outcome — report it as such.
- **Build fails on the new file**: read the Zod error, fix frontmatter, rebuild.
  Never deliver with a broken build.
- **A citation URL won't verify**: rephrase or cut the claim — never ship an
  unchecked link.
- **Asked for lengths/formats outside this contract** (e.g. 3,000 words,
  .docx): honor it, but note the deviation from the site's corpus once.

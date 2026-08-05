---
name: epub-landing-writer
description: Produce SEO landing pages for epub.studio in four types — audience/use-case, comparison/alternative, pillar/hub, and keyword-variant. Input is a row from content-ops/landing-backlog.md (or the linked topic spreadsheet). Output is a schema-valid file in src/content/landing/ with a generated OG card, registered in content-ops/keyword-map.csv. Trigger on "landing page", "comparison page", "pillar page", "audience page", or a request to grow the landing program.
metadata:
  version: 1.0.0
  site: epub.studio
  stack: Astro landing collection (src/pages/[...landing].astro) + scripts/og-card.mjs
  companion: .claude/skills/epub-blog-writer/SKILL.md (voice + Google rules are shared)
---

# EPUB Landing Writer (epub.studio)

Produce a landing page that **helps a searcher finish their job on the page**
and **passes `astro build` first try**. The blog skill's Google alignment
(people-first gates, honest dates, no fabrication, natural keyword use) applies
verbatim; this file adds what is specific to landing pages.

## Non-negotiables

1. **The distinct-intent test (confirmed policy).** A keyword variant earns its
   own URL ONLY when the modifier changes the actual task: platform ("on mac",
   "on chromebook"), device ("for kindle" — check blog ownership first), or
   source constraint. Same-intent modifiers — *free, online, fast, best,
   without installing* — are NEVER pages; they become content on the owning
   tool page. Run the test per row and record the verdict in the backlog.
2. **One intent = one URL** across tools, blog, AND landing. Check
   `content-ops/keyword-map.csv` and both content directories before writing.
   Landing pages must not shadow a tool page or a blog post's intent.
3. **Comparison claims are fetched, dated, and sourced.** Every factual claim
   about a competitor is verified against their own site/docs in this session,
   recorded in `comparison.sources[]` with `asOf`, and phrased neutrally. The
   `theirWins` list is REQUIRED and must contain real advantages — a
   comparison page that cannot name where the rival is better does not ship.
4. **No invented capability, pricing, or proof.** The embedded tool is the
   proof. No testimonials, counts, logos, ratings — they do not exist.
5. **Flat URLs**, slug = primary keyword, kebab-case, permanent once published.
6. **Privacy truth**: tools run in the browser; nothing uploads. Never imply
   accounts, tiers, or server processing.
7. **Pink Ink for text (WCAG AA, binding).** Any text-level accent — step
   numbers, links, hover states, CTA fills carrying a text label — uses Pink
   Ink `#C41E4F`. Electric Pink `#FF2E63` is reserved for fills, bars and
   borders. The template already does this; never reintroduce `#FF2E63` as a
   text colour in body content or inline SVG labels.

## Output contract (build fails if violated)

One file: `src/content/landing/<slug>.md`.

```yaml
---
title: '≤60 chars, keyword up front — the <title> tag'
h1: 'The on-page headline; may differ from title'
excerpt: '140–160 chars; doubles as the meta description and the lede.'
type: 'audience'            # audience | comparison | pillar | variant
primaryKeyword: 'epub tools for self-publishers'
date: 2026-08-05             # real date, never backdated
ogImage: '/landing-og/<slug>.png'
embedTool: 'docx-to-epub'    # tool slug whose LIVE runner embeds first-viewport (pillar ships without one — recorded carve-out)
embedHeadline: 'Optional drop-zone invitation override'
embedHeadlineMobile: 'Tap to choose your manuscript (.docx)'  # touch-phrased variant; omit to inherit the runner default
embedAccept: '.mobi,.prc,.azw3,.azw'  # ONLY to widen accepted extensions when the same engine truly parses them — never promise a format the engine rejects
embedDropSub: '.mobi · .azw3 · up to 100 MB'  # keep the mono format line in sync with embedAccept
tools: [docx-to-epub, epub-validator]   # shelf/rail slugs from src/data/tools.js
guides: [convert-word-to-epub]          # blog ids for the "From the blog" rail
clusters: []                 # pillar only: [{ label, posts: [blog ids] }]
comparison:                  # comparison only — see Non-negotiable 3
  competitor: 'Calibre'
  rows: [{ aspect: 'Install', us: '…', them: '…' }]
  theirWins: ['…']           # required, ≥1
  sources: [{ label: 'calibre-ebook.com', url: 'https://…', asOf: 'August 2026' }]
howToTitle: 'Optional'
howTo: [{ t: 'Step', d: 'Body' }]       # variant/audience workflows
faqs: [{ q: '…', a: '…' }]
draft: false
---

Markdown body — the page's prose, rendered between the embedded tool and the
structured sections. Same voice rules as the blog skill.
```

The template auto-renders: breadcrumb, h1/lede, the live ToolRunner (with its
whole state machine and Style Studio handoff), how-to cards, comparison table +
theirWins + sources line, cluster grids, tool shelf, guides rail, FAQ, end CTA,
JSON-LD (WebPage + Breadcrumb + FAQPage/HowTo when present). Never hand-build
any of those in the body.

## The four types

**Audience** (`epub-tools-for-self-publishers`): name the job in the h1, embed
the workflow's first tool, body prose walks the whole job (500–900 words),
`howTo` = the workflow, `tools` = 3–6 shelf entries, `guides` = 2–4 posts.

**Comparison** (`calibre-alternative`): body prose frames the honest choice
(600–1,000 words), 4–8 verified rows, mandatory `theirWins`, embed the tool the
comparison visitor most wants. Never disparage; recommend the rival where it
genuinely wins.

**Pillar** (`epub-format-guide`): Read mode — 900–1,500 words of hub prose
with h2s (they become the TOC), `clusters` group the blog by sub-topic,
`embedTool` optional and late (validator fits). Links are the product here.

**Variant** (`convert-epub-to-pdf-on-mac`): passes the distinct-intent test,
then: modifier-specific `howTo`, body covers ONLY what the modifier changes
(500–800 words), embed the parent tool, link the parent tool page prominently.
If you cannot write a page that is mostly modifier-specific, the variant fails
the test — enrich the tool page instead.

## Delivery (every page)

1. Write `src/content/landing/<slug>.md`.
2. OG card:
   ```bash
   node scripts/og-card.mjs --slug <slug> --title "<h1>" --kicker "<TYPE LABEL>" --dir public/landing-og
   ```
   Kicker by type: `FOR <AUDIENCE>` · `COMPARISON` · `THE GUIDE` · `HOW-TO`.
3. `./scripts/build.sh` must exit 0.
4. Register: add the row to `content-ops/keyword-map.csv` (`type=landing`),
   update `content-ops/landing-backlog.md` (verdicts included).
5. Report 3–4 lines in chat; PR flow for unattended runs, same as the blog.

## Spreadsheet interface (when the user links topic research)

Expected columns: `keyword, page_type, notes, priority`. Each row passes the
dedup check and the distinct-intent test before becoming a page; rejected rows
get their verdict written back to the backlog ("enrich /epub-to-pdf" etc.),
never silently dropped. No web access → work from the backlog only.

## QA (before delivering)

- Dedup + distinct-intent verdicts recorded
- Schema-valid frontmatter; excerpt 140–160; real date; slug = keyword
- Every `tools`/`guides`/`clusters` id exists (src/data/tools.js, src/content/blog/)
- Comparison: every claim fetch-verified this session, sources dated,
  theirWins non-empty, zero unverifiable claims
- People-first gates from the blog skill pass (information gain, no doorway)
- OG card generated; build exits 0; map + backlog updated

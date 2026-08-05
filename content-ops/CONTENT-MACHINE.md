# The content machine

How epub.studio turns keyword research into shipped pages, and how the
automation runs it. This is the operating document; the research it runs on
lives in `keyword-research/`.

## The loop

```
Semrush export → pipeline.py → clusters.csv (lanes) → backlogs → skills → pages
     ↑                                                                    │
     └────────────── Search Console reality check (quarterly) ←───────────┘
```

1. **Research** (re-runnable): drop any new export at
   `keyword-research/source.csv`, run `python3 keyword-research/pipeline.py`.
   Rules live in the script; outputs are generated, never hand-edited.
2. **Triage** (human or agent-with-judgment): new/changed clusters get lane
   assignments in `CLUSTER_ACTIONS` inside the pipeline, then flow into the
   three backlogs. Every backlog row records its dedup verdict.
3. **Production** (the skills):
   - Blog rows → `.claude/skills/epub-blog-writer` (Mode A takes a backlog
     row; Mode B mines weekly questions — `topic:question` and `topic:kindle`
     clusters in `keywords.csv` are the mining feed).
   - Landing rows → `.claude/skills/epub-landing-writer` (four types; the
     reader-variant program is next in queue).
   - Tool rows → engineering-gated: engine first, then the tool page, then
     the keyword-map row. A runner that can't do the job blocks the page.
4. **Registration**: shipping any page adds its row to `keyword-map.csv`
   (the one-intent-one-URL ledger) and moves the backlog row to shipped.
5. **Measurement**: quarterly, pull Search Console queries → compare against
   `clusters.csv` volumes → feed surprises back into the backlogs. (GSC is
   the truth; Semrush volumes are the map, not the territory.)

## Lanes and their owners

| Lane | Queue | Producer | Gate |
|---|---|---|---|
| owned-enrich | `clusters.csv` lane=owned-enrich | blog/landing skill, editing the owning URL | Never a new URL |
| blog | `backlog.md` | epub-blog-writer | People-first gates in the skill |
| landing (4 types) | `landing-backlog.md` | epub-landing-writer | Distinct-intent test, recorded verdict |
| tool-new / tool-guidance | `tool-backlog.md` | engineering + landing conventions | Engine truth; DRM honesty where Kindle-adjacent |
| scope-new | `tool-backlog.md` § New scope | product decision first | User sign-off before build |
| l10n | `localization.csv` | gated | i18n infra (hreflang, routing, translated UI) before any page |
| monitor / peripheral | `clusters.csv` | nobody | Re-examine on next research run |

## Cadence (set 2026-08-05: 12–15 blog + 7 landing per month)

Owner's decision. Context kept for honesty: research says frequency itself is
not a ranking factor; 12–15 blog/mo sits inside the 6–20 sweet spot; 7
landing/mo is above the staged-family guardrail the research suggested
(observation gaps between template batches). Mitigations replace the gaps:

- **Blog: 12–15/month** — 5–6 backlog rows + 7–9 mined (Mode B). Quality
  gates unchanged; if a month can't fill 12 at the bar, it ships fewer — the
  bar never drops to make the number.
- **Landing: 7/month, gates intact.** Every page keeps the distinct-intent
  verdict, the live embedded tool, and real page-to-page differentiation.
- **Hard GSC checkpoint at week 6** (and every 4 weeks after): coverage
  anomalies, deindexing, or a manual action HALT the landing lane
  immediately; blog continues. This is the safety that pause-gaps provided.
- **Enrichment: monthly batch** from the owned-enrich lane (172k/mo) — the
  post-50 optimization data makes this the compounding asset.
- **Tools: as engineering allows** — engine truth gates, not cadence.
- **Research refresh: quarterly** — at 7/mo the landing queue is a ~3-month
  supply; the refresh (and the next locale) is what feeds months 4+.

## Production schedule (first quarter, then quarterly)

| Month | Blog (12–15) | Landing (7) |
|---|---|---|
| **Sep 2026** | Rows 14–19 + 7–9 mined | 5 reader variants + epub-tools-for-teachers + fix-my-epub |
| **Oct 2026** | Rows 20–25 + 7–9 mined | kindle-format-guide (pillar), sigil-alternative, fanfiction-readers, chromebook variant (verify gate), es i18n infra ships mid-month, then first 3 es pages (epub a pdf, pdf a epub, mobi a epub) |
| **Nov 2026** | Rows 26–31 + 7–9 mined | Remaining es queue (epub a mobi, lector epub online, + cbr/djvu es pages if their tools shipped), comics hub (if ≥3 comic tools live), buffer from refresh |
| **Dec 2026** | Rows 32–35 + mined | Supply decision: fr or pt locale (~10 pages) per es results + Q4 research refresh rows |
| **Q1 2027** | Rows 36–39 + mined + refresh rows | Second locale continues + refresh-fed rows |
| **Q2 2027** | Mining + refresh + enrichment-led | Third locale decision; conditional rows |

Tool engineering runs alongside: azw3-to-pdf + mobi-to-pdf (Sep), cbz-to-pdf
+ pdf-to-kindle guidance (Oct), djvu spike (Nov — unblocks the djvu es page
and row 24), Tier-2 chains (Q4+).

## Hard rules the automation must never relax

1. One intent = one URL (`keyword-map.csv` is the ledger; check before write).
2. Same-intent modifiers (free/online/best/fast) are never pages.
3. No piracy targeting; no DRM circumvention content or tooling, ever.
4. Comparison claims fetch-verified and dated; `theirWins` mandatory.
5. Tool pages ship only with working engines; capability claims match
   `accept` strings mechanically.
6. Stay in the expertise lane: ebook formats, conversion, reading, typography.
   Kindle account support, device shopping, generic PDF/Office tooling are
   permanently out of scope regardless of volume.
7. Real dates only; updates recorded honestly.

## The 12-month roadmap (tiered, volume-ordered)

The backlogs hold the head of the queue, not the whole opportunity. The
machine works through tiers; each tier re-validates against `keyword-map.csv`
and live Search Console data before production.

**Tier 1 — now → end of Sep 2026** (queued in the backlogs today)
- Blog rows 14–22 (what-is-epub 8.9k first), reader-variant program (5 pages),
  Tier-1 tools (azw3-to-pdf, mobi-to-pdf, cbz-to-pdf, pdf-to-kindle guidance).
- Enrichment pass: kindle-locations phrasings into the page-numbers post;
  kindle-formats into send-to-kindle; job:cover phrasings ("epub cover
  change/changer/converter") into /epub-cover-editor copy and FAQs.

**Tier 2 — Q4 2026**
- Blog rows 23–31 (kindle-app 6k first) + weekly Mode B from the mining feeds.
- djvu spike → /djvu-to-pdf + "what is djvu" post as a pair.
- Landing: kindle-format-guide pillar, fix-my-epub audience, epub-tools-for-
  teachers (already queued rows).
- Spanish l10n: i18n infra (hreflang/routing/UI strings), then the top-10 es
  pages mirroring their English tools (es cluster: epub-to-pdf 2.7k,
  pdf-to-epub 2.2k, mobi-to-epub 1.4k…).
- Tier-2 tools: fb2-to-pdf, epub-to-html, fb2.zip accept, images-to-cbz.

**Tier 3 — 2027 H1**
- Long-tail blog from mining feeds (device guides, app ecosystem, nook
  editorial); chromebook reader variant; second locale (fr or pt — decide on
  es results); Listen (TTS) scope decision; Tier-3 tools only on new demand
  evidence.

**Continuous**
- 2 blog/week (1 backlog + 1 mined), 1 landing/week while queues last,
  enrichment batches monthly, research refresh + GSC reconciliation quarterly.
- Every ship registers in `keyword-map.csv`; every reject records its verdict.

## The year, fully enumerated (2026-08-05)

The backlogs now hold the entire planned year — no further research pass is
required to keep producing:

- **Blog: 26 numbered rows** (Tiers 1–3, ~70k/mo addressed) **+ 52 mined
  slots** (Mode B weekly, drawing on 3,400+ keywords in the mining feeds) +
  monthly enrichment batches from the owned-enrich lane (172k/mo). At
  2/week that fills 104 slots with headroom — mined weeks that match a
  numbered row consume the row.
- **Landing: 22-page year** — 5 reader variants, 3 queued audience/fix rows,
  kindle-format-guide pillar, sigil-alternative, fanfiction-readers audience,
  2 conditional (comics hub, chromebook), + 7–10 Spanish pages once i18n
  infra lands.
- **Tools: fully adjudicated** — 4 Tier-1 builds, 6 Tier-2, everything else
  carries a recorded verdict in the demand ledger. Nothing left unclassified;
  new pairs only enter via the quarterly research refresh.
- **Localization: es queue written** (7 launch pages mapped to volumes);
  fr/pt/zh decisions gated on es results.

Twelve-month shape if cadence holds: ~100 blog posts (52 mined + rows +
refreshes), ~22 landing pages, ~10 tools, one full locale — against a
researched 395k/mo English + 23k in-domain l10n opportunity.

## Automation readiness (audited 2026-08-05)

The daily publisher routine lives at `content-ops/routines/daily-publisher.md`.
What already works unattended: both content lanes are data+markdown (no code
changes per page), the sitemap regenerates on every build (@astrojs/sitemap),
OG cards are scripted, and guidance-type tool pages are pure data
(`NO_ENGINE` + tools.js). Gaps, in priority order:

1. **Deploy confirmation (critical, unknown).** The repo contains no CI/CD
   config; if the host (Vercel/Netlify/CF Pages) auto-deploys main via Git
   integration, nothing is needed — CONFIRM this once. If not, add a deploy
   workflow; a pushed post that never goes live is silent failure.
2. **CI safety net (cheap).** A GitHub Action running `npm ci && npm run
   build` on push to main guards the site against any broken push, not just
   the routine's.
3. **Registry chain support (~20 lines, unlocks 3 tools).** A `chain()`
   helper composing parser→builder engines makes azw3-to-pdf, mobi-to-pdf
   and cbz-to-pdf one-line registry entries (all their engines exist).
   pdf-to-kindle needs zero engine work (NO_ENGINE pattern).
4. **Spanish i18n infrastructure (the real project; blocks Oct es pages).**
   Astro i18n routing (/es/ prefix), hreflang in the base layout, UI string
   extraction from the Vue islands (ToolRunner et al. hardcode English), and
   locale support in the landing collection. Until it lands, the routine
   auto-skips es rows by design.
5. **GSC checkpoint automation (optional).** A `scripts/gsc-check.mjs` with
   a Search Console service account that writes `content-ops/HALT-LANDING`
   on coverage anomalies would close the loop; until then the checkpoint is
   manual and the HALT file is the kill switch.

## Current state (2026-08-05)

- 54 intents live in keyword-map; ~172k/mo of the researched volume already
  has an owning URL (enrichment upside, no new pages needed).
- Backlogs loaded: 9 blog rows, 5 reader variants + queued landing rows,
  5 tools + 1 scope lane, es-first l10n list (13.2k in-domain).
- Automation for blog + landing exists as skills; tool lane and l10n lane
  need engineering before their queues move.

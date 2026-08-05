# Keyword research analysis — 2026-08-05

Source: `source.csv` — a 19,398-row Semrush Keyword Magic export around "epub".
Processed by `pipeline.py` (deterministic rules, re-runnable; edit the rules,
never the outputs — outputs are generated).

## Funnel

| Stage | Rows | Monthly volume |
|---|---|---|
| Input | 19,398 | — |
| Unique after normalization | 19,382 | — |
| **Kept (English, in-domain)** | **9,303** | **395,410** |
| Localization lane (13 languages tagged) | 2,677 | 77,090 total / 23,260 in-domain |
| Excluded: off-domain | 7,187 | generic PDF/Office conversions, device shopping, unrelated |
| Excluded: piracy | 147 | z-library/libgen/oceanofpdf etc. — never targeted |
| Excluded: DRM removal | 68 | policy: we never teach or enable circumvention |

## Lanes (kept volume by action)

| Lane | Volume | What it means |
|---|---|---|
| owned-enrich | 171,890 | Intent already owned by a live URL — enrich that page with the cluster's phrasings; never a new URL |
| blog | 113,350 | Feed for the blog machine (gaps + long-tail question mining) |
| reader variants | 65,500 | `job:reader` — parent owned by /epub-reader; platform facets are landing variants |
| monitor | 21,240 | Real but weak or unclear — revisit with fresh data |
| tool-new | 13,630 | Unowned conversion pairs our engines can honestly serve |
| peripheral | 4,790 | Kindle account/support/shopping — not our lane (helpful-content: stay in expertise) |
| tool-guidance | 3,020 | Pairs we serve by teaching the route, not converting |
| scope-new | 1,340 | New product lanes (TTS/audiobook) |
| landing-comparison / audience | 650 | Competitor/brand demand is tiny in this niche — calibre (done) was the big one |

## Biggest findings

1. **The reader is the sleeping giant.** `job:reader` is the single largest
   cluster (65.5k). Platform facets: windows 9.2k, android 5.8k, ios 3.1k,
   browser 2.3k, linux 1.9k, mac 1.3k. Five landing variants embedding the
   live reader, each answering the platform's real situation (Windows lost its
   default EPUB handler when Edge dropped it; macOS has Books built in; etc.).
2. **"What is an EPUB file" is unowned** (~8.9k). Our structure post owns the
   deep dive, nobody owns the beginner definition. Highest-priority blog gap.
3. **Kindle content is owned territory** — kindle-formats 10.4k,
   kindle-locations 9.1k ("what does loc mean" → page-numbers post),
   send-to-kindle 4.2k + epub-to-kindle 6.1k. Mostly enrichment, one gap
   (a dedicated Kindle-formats reference — dedup check required).
4. **Four honest new tools**: azw3/kindle→pdf (4.7k), djvu→pdf (4.2k),
   cbz→pdf (2.6k), mobi→pdf (1.4k). All are chains of engines we already
   run client-side. Kindle pairs carry a mandatory DRM-honesty framing.
5. **The Apple/Google reader ecosystems are blog gaps**: apple-books+ibooks
   ≈8.5k, google-play-books 6.4k, kobo 4.0k, ACSM/Adobe 6.4k combined.
6. **Localization is real but concentrated**: in-domain es 13.2k, zh 3.0k,
   fr 2.8k, pt 1.5k. Spanish first; `localization.csv` carries per-keyword
   language + intent-pair so localized pages can mirror existing English URLs.
7. **"Free ebooks" demand is answerable legally** (7.1k+): KU/Prime/Libby/
   Gutenberg/Standard Ebooks roundup. The piracy-branded tail (147 rows) is
   excluded, not chased.

## Policy lines applied (non-negotiable in automation)

- Piracy brands and specific-title free-download queries: excluded, never
  targeted, even where volume is high.
- DRM: informational "what is DRM" content is allowed and useful; removal,
  bypass, or stripping is never taught. Kindle→EPUB/PDF tools state plainly
  they work on DRM-free files only.
- Peripheral lanes (device support/shopping, account help) stay out of the
  machine — outside our demonstrable expertise (Google helpful-content).

## Files

- `pipeline.py` — the machine. Re-run on any new export dropped as `source.csv`.
- `clusters.csv` — 130 clusters × (volume, lane, target, top keywords, facets).
- `keywords.csv` — all 9,303 kept keywords with cluster + facet.
- `localization.csv` — 2,677 keywords × (language, intent-pair, in_domain).
- `excluded.csv` — every dropped keyword with reason, auditable.

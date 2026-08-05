# Landing-page backlog

Queue for `.claude/skills/epub-landing-writer`. Every row passes the dedup
check against `keyword-map.csv` AND the distinct-intent test before becoming a
page; verdicts are recorded here either way. When the topic-research
spreadsheet is linked, its rows merge into this table (expected columns:
`keyword, page_type, notes, priority`).

## Shipped (registered in keyword-map.csv)

| Slug | Type | Primary keyword | Shipped |
|---|---|---|---|
| /epub-tools-for-self-publishers | audience | epub tools for self-publishers | 2026-08-05 |
| /calibre-alternative | comparison | calibre alternative | 2026-08-05 |
| /epub-format-guide | pillar | epub format | 2026-08-05 (carve-out: no embedded runner — Read mode per brief; validator carries the CTA) |
| /convert-epub-to-pdf-on-mac | variant | epub to pdf mac | 2026-08-05 (distinct-intent: PASS — platform changes the task: no-install route, Finder/Downloads specifics, managed-Mac case) |

## Queued

| Keyword | Type | Notes |
|---|---|---|
| epub tools for teachers | audience | Course readers, handouts; embed docx-to-epub; guides: best-format, reduce-epub-file-size |
| fix my epub | audience | Reader-in-distress hub; embed epub-validator; links the whole Fix cluster |
| kindle format guide | pillar | Hub for the Kindle cluster (send-epub, mobi-is-dead, embedded-fonts) + guidance pages; check overlap with /blog/send-epub-to-kindle before writing — hub must add structure, not restate |
| convert epub to pdf on chromebook | variant | Distinct-intent: likely PASS (no-install is the whole point on ChromeOS); verify volume before writing |
| sigil alternative | comparison | Needs fetch-verification of Sigil's current state; theirWins: real code-level EPUB editing |
| online epub converter | comparison | Category comparison (us vs upload-style sites); careful: transactional phrasing may belong to tool pages — check intent before writing |

## Production schedule (7 pages/month, set 2026-08-05)

- **Sep**: 5 reader variants below + epub-tools-for-teachers + fix-my-epub
- **Oct**: kindle-format-guide, sigil-alternative, fanfiction-readers,
  chromebook (verify gate), then es infra + first 3 es pages
- **Nov**: remaining es queue + comics hub (tool-gated) + refresh buffer
- **Dec+**: next locale + quarterly-refresh supply
- **Safety**: GSC checkpoint at week 6 and monthly after — anomalies halt
  this lane (see CONTENT-MACHINE.md)

## Queued from keyword research (2026-08-05) — the reader variant program

`job:reader` is the largest cluster in the Aug 2026 research (65,500/mo).
Parent /epub-reader keeps "epub reader online" / "read epub online". Platform
facets below pass the distinct-intent test because the platform changes the
searcher's real situation, not just the phrasing. Each embeds the live reader.

| Keyword | Type | Facet volume | Notes |
|---|---|---|---|
| read epub on windows | variant | 9,220 | Windows lost native EPUB when Edge dropped it (2019) — the "why won't it open" story; default-app confusion; parent /epub-reader |
| read epub on android | variant | 5,750 | App landscape vs no-install browser route |
| read epub on iphone | variant | 3,070 | Books is built in — honest page says so, then serves the no-Apple-ID / shared-device case |
| read epub on linux | variant | 1,930 | Foliate/Calibre landscape + browser route |
| read epub on mac | variant | 1,330 | Books built in; same honest framing as iPhone |

Research evidence on existing queued rows: chromebook converter variant is
thin (reader facet 390, converter facet ~0) — keep behind "verify volume";
sigil-alternative cluster is 760/mo — modest, keep queued; "online epub
converter" head is owned by home per keyword-map.

Phrasing ownership note: the reader variants also own the `topic:device-ereader`
phrasings for their platform ("ereader for windows" 210+, "android ereader"
1,000, "linux ereader" 520) — same intent, searcher wants software not
hardware; each variant page says so honestly and shows the browser route.
Tier 3 candidates once the five ship: read epub on chromebook (390), and a
"read epub online" enrichment pass on the parent.

## Conditional rows (gated on other lanes shipping first)

| Keyword | Type | Gate | Notes |
|---|---|---|---|
| epub tools for fanfiction readers | audience | none — data supports now (~460/mo ao3/fanfic + wattpad demand) | AO3 exports EPUB natively; page teaches legit routes + embeds epub-reader; NEVER wattpad scraping |
| comic book formats guide (cbz/cbr hub) | pillar | after cbz-to-pdf + images-to-cbz ship | Clusters: cbz pairs ≈7k combined + "what is cbr" post; hub only when ≥3 comic tools exist |
| read epub on chromebook | variant | after the 5 reader variants ship + GSC check | 390/mo facet; thin — verify demand held |

## Localization program — INFRA SHIPPED 2026-08-05, gate OPEN

In-domain volumes from `keyword-research/localization.csv`: **es 13,180**,
zh 3,040, fr 2,830, pt 1,450. Spanish first. Localized pages mirror English
URLs at /es/<same-slug>; hreflang pairs mechanically (BaseLayout + sitemap
alternates). Runner UI is locale-aware (lib/i18n.js). Spanish TOOL mirrors
are data entries in src/data/tool-pages.es.js (engineering/agent lane, not
the markdown routine); es landing/blog markdown uses the schema's `locale`
field when that queue starts (es landing ROUTE template still pending —
build it with the first es landing page).

**Shipped 2026-08-05:** /es/epub-to-pdf, /es/pdf-to-epub, /es/mobi-to-epub
(the Oct queue's first three, early — verified end-to-end in Spanish).

Spanish launch queue (top in-domain pairs; mirror the English tool page,
locally written — never machine-translated boilerplate):

| es page | Mirrors | es volume |
|---|---|---|
| ~~epub a pdf~~ | /epub-to-pdf | 2,730 — SHIPPED |
| ~~pdf a epub~~ | /pdf-to-epub | 2,150 — SHIPPED |
| ~~mobi a epub~~ | /mobi-to-epub | 1,370 — SHIPPED |
| cbr a pdf | (cbz-to-pdf, once live) | 1,060 |
| djvu a pdf | (djvu-to-pdf, once live) | 580 |
| epub a mobi | /epub-to-mobi guidance | 530 |
| lector epub online | /epub-reader | mine `localization.csv` no-pair rows (11k unmapped es volume) before writing |

## Rejected — distinct-intent test failures (do not create pages)

| Keyword | Verdict |
|---|---|
| epub to pdf free | Same intent as /epub-to-pdf (the tool IS free) → the tool page already says it; nothing to add |
| epub to pdf online | Same intent as /epub-to-pdf → enrich tool page if SERP demands, never a new URL |
| epub to pdf converter | Transactional phrasing of /epub-to-pdf → owned by the tool page |
| best epub converter | Same-intent superlative → owned by home + tool pages |

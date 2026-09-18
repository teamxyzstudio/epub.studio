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
| /read-epub-on-windows | variant | read epub on windows | 2026-08-10 (distinct-intent: PASS — Windows lost native EPUB with Edge's 2019 e-book removal; default-app confusion is the page's story; parent /epub-reader; owns "ereader for windows" phrasings) |
| /read-epub-on-android | variant | read epub on android | 2026-08-11 (distinct-intent: PASS — no guaranteed .epub handler on Android; system-picker/touch flow, work-profile no-install case; parent /epub-reader; owns "android ereader" phrasings) |
| /read-epub-on-iphone | variant | read epub on iphone | 2026-08-12 (distinct-intent: PASS — Books is built in and the page says so honestly; serves the shared-device / no-Apple-ID / managed-phone cases; parent /epub-reader; owns "iphone ereader" phrasings) |
| /read-epub-on-linux | variant | read epub on linux | 2026-09-01 (distinct-intent: PASS — no distro-wide default EPUB handler; desktops detect the zip container and hand the book to the archive manager; no-root / live-session / locked package-manager cases; parent /epub-reader; owns "linux ereader" phrasings) |
| /read-epub-on-mac | variant | read epub on mac | 2026-09-05 (distinct-intent: PASS — Books is built in and the page says so honestly; Books imports a copy into an iCloud-synced library, so the no-shelve cases and the author draft-preview loop carry the page; parent /epub-reader; owns "mac ereader" phrasings) |
| /epub-tools-for-teachers | audience | epub tools for teachers | 2026-09-09 (dedup: PASS — unowned in keyword-map; distinct from /epub-tools-for-self-publishers: the job is many small documents → one distributable course reader, not one manuscript → one store file; embeds docx-to-epub; merge/split/compress/browser-reader workflow; copyright + DRM honesty for course materials) |
| /fix-my-epub | audience | fix my epub | 2026-09-13 (dedup: PASS — unowned in keyword-map; distinct-intent vs the Fix posts: each post owns one symptom's repair, the hub owns triage — the searcher who does not yet know which fault they have; embeds epub-validator honestly as seven checks / not EPUBCheck; symptom→cause→guide table links all 10 Fix-cluster posts; one-tool repairs via cover + metadata editors; DRM named as unfixable here) |
| /kindle-format-guide | pillar | kindle format guide | 2026-09-18 (dedup: PASS — unowned; /blog/kindle-file-format keeps the format-family reference intent, the hub owns cluster routing; overlap gate vs /blog/send-epub-to-kindle PASS — hub names the three routes in one paragraph and links, adds routing table + edges/DRM structure instead of restating; Read mode, no first-viewport runner — same recorded carve-out as /epub-format-guide, shelf carries mobi/azw3 converters + guidance pages; external citations dropped: amazon.com egress-blocked this run, claims restricted to corpus-established facts) |

## Queued

| Keyword | Type | Notes |
|---|---|---|
| ~~epub tools for teachers~~ | audience | SHIPPED 2026-09-09 — course readers, handouts; embeds docx-to-epub; guides best-format + reduce-epub-file-size (+ print-an-epub, public-domain) |
| ~~fix my epub~~ | audience | SHIPPED 2026-09-13 — reader-in-distress hub; embeds epub-validator; symptom→cause→guide table links the whole Fix cluster |
| ~~kindle format guide~~ | pillar | SHIPPED 2026-09-18 — Kindle cluster hub; overlap gate vs send-epub-to-kindle passed (routes named + linked, not restated); Read-mode carve-out recorded |
| convert epub to pdf on chromebook | variant | Distinct-intent: likely PASS (no-install is the whole point on ChromeOS); verify volume before writing |
| sigil alternative | comparison | Needs fetch-verification of Sigil's current state; theirWins: real code-level EPUB editing |
| online epub converter | comparison | Category comparison (us vs upload-style sites); careful: transactional phrasing may belong to tool pages — check intent before writing |

## Production schedule (7 pages/month, aligned to an August 2026 start)

- **Aug 2026 (COMPLETE — 7 of 7)**: the 4 pages shipped 2026-08-05 count
  toward August's quota; read-epub-on-windows shipped 2026-08-10;
  read-epub-on-android shipped 2026-08-11; read-epub-on-iphone shipped
  2026-08-12
- **Sep**: ~~read-epub-on-linux~~ (shipped 09-01), ~~read-epub-on-mac~~
  (shipped 09-05), ~~epub-tools-for-teachers~~ (shipped 09-09), ~~fix-my-epub~~
  (shipped 09-13), ~~kindle-format-guide~~ (shipped 09-18), sigil-alternative,
  fanfiction-readers
- **Oct**: chromebook (verify gate) · es queue continues — cbr a pdf
  (cbz-to-pdf is live), epub a mobi, lector epub online (mine the no-pair es
  rows first) · comics hub (tool-gated) · refresh buffer. Note: es i18n
  infra + the first 3 es mirrors already shipped 2026-08-05
- **Nov**: djvu a pdf (after the djvu spike lands) + next-locale decision
  (fr vs pt, on es GSC data) + refresh rows
- **Dec+**: next locale + quarterly-refresh supply
- **Safety**: GSC checkpoint at week 6 from Aug 5 (≈ Sep 16) and monthly
  after — anomalies halt this lane (see CONTENT-MACHINE.md)

## Queued from keyword research (2026-08-05) — the reader variant program

`job:reader` is the largest cluster in the Aug 2026 research (65,500/mo).
Parent /epub-reader keeps "epub reader online" / "read epub online". Platform
facets below pass the distinct-intent test because the platform changes the
searcher's real situation, not just the phrasing. Each embeds the live reader.

| Keyword | Type | Facet volume | Notes |
|---|---|---|---|
| ~~read epub on windows~~ | variant | 9,220 | SHIPPED 2026-08-10 — Windows lost native EPUB when Edge dropped it (2019); default-app confusion is the page's story; parent /epub-reader |
| ~~read epub on android~~ | variant | 5,750 | SHIPPED 2026-08-11 — no guaranteed .epub handler on Android; app landscape vs no-install browser route; parent /epub-reader |
| ~~read epub on iphone~~ | variant | 3,070 | SHIPPED 2026-08-12 — Books is built in, the page says so honestly, then serves the no-Apple-ID / shared-device / managed-phone cases; parent /epub-reader |
| ~~read epub on linux~~ | variant | 1,930 | SHIPPED 2026-09-01 — no distro-wide default handler; the archive manager claims the zip container; browser route needs no root and works in live sessions; parent /epub-reader. (Foliate landscape claims dropped — external fetch-verification unavailable in the publish run; Calibre covered via internal /calibre-alternative link) |
| ~~read epub on mac~~ | variant | 1,330 | SHIPPED 2026-09-05 — Books built in, page says so honestly, then serves the no-shelve / borrowed-Mac / work-machine cases plus the Mac-specific draft-preview loop (Books imports a copy, browser reads the file in place); parent /epub-reader |

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

# Content backlog

Topic queue for the blog. Every row was checked against `keyword-map.csv` on
2026-07-19; rows marked **owned** must be refreshed at their existing URL, never
written as a new post. CTA targets are real pages on this site — nothing else.

Mode B (mining) appends new candidates here; writing a post moves its row to
`keyword-map.csv` with `type=blog, status=live`.

## Queued

| # | Question (paraphrased, from community threads) | Primary keyword | Category | Tool CTA | Notes |
|---|---|---|---|---|---|
| 10 | Getting an EPUB accepted by OverDrive/Libby | publish epub to libraries | How-to | /epub-validator | Store-specific rules on top of the spec. GATE (recorded 2026-08-05): platform claims need fetch-verified primary sources; the sandboxed publisher run's network policy denies external fetches — write in a session with web access |
| — | ~~Typo found in an already-published ebook — fix and re-upload workflow~~ | fix typo in published ebook | How-to | /epub-metadata-editor | SHIPPED 2026-08-13 → /blog/fix-typo-in-published-ebook (Mode B fallback: no web access this run, so per the skill the top un-gated Queued row was taken — rows 10/19 egress-gated, Aug rows 15/17/18 still reader-gated, /epub-reader engine still absent from registry.js as of this run. NOTE for engineering, found while producing artifacts: editMetadata's zipOut re-deflates the mimetype entry — output opens fine but loses the stored-at-byte-38 layout; per-file STORE override would fix it.) |
| — | ~~Fixed-layout EPUB keeps failing in Kindle Previewer~~ | fixed layout epub problems | Formats explained | — (informational) | SHIPPED 2026-08-14 → /blog/fixed-layout-epub-problems (Mode B fallback: no web access this run — egress proxy 403 on all fetches — so per the skill the top un-gated Queued row was taken; row 10/19 egress-gated, Aug rows 15/17/18 still reader-gated: /epub-reader has no engine in registry.js as of this run. Written as the three-clause mechanism post; Kindle Previewer claims omitted — untestable headless, post says so. Tools row 13 mentioned as "no fixed-layout tooling" — post honestly shows epub-to-pdf flattening the demo instead) |
| — | ~~How do I edit an EPUB (metadata / cover / styling / text)~~ | how to edit an epub file | How-to | /epub-metadata-editor | SHIPPED 2026-08-17 → /blog/edit-an-epub (Mode B: no web access this run — proxy 403 on all fetches — and all assigned Aug rows shipped or gated: 15/17/18/20 reader-gated, /epub-reader engine still absent from registry.js this run; 10/19 egress-gated; mined the job:edit cluster instead, ~700/mo informational family at kd 3–10, no owner in keyword-map. Live metadata-editor run on specimen.epub this session: author Unknown→fixed, only content.opf changed in the archive, output validated — two screenshots. Backups from the same pass: "how to use epub files" ~220/mo (overlap-check vs what-is-an-epub-file first); job:merge informational tail ~280/mo (transactional owned by /merge-epub — likely enrichment, not a new URL)) |
| — | ~~How do I print an EPUB / print one chapter on paper~~ | print an epub | How-to | /epub-to-pdf | SHIPPED 2026-08-08 → /blog/print-an-epub (Mode B: Aug rows 14/16 shipped, 15/17/18 reader-gated, 19 egress-gated — mined from keyword-research print tail + Quora/forum recurrence). Backup candidates from the same mining pass: "how to use epub files" (~220/mo, check overlap with what-is-an-epub-file first); "how to open epub files" cluster (2.3k+ — reader-gated, same engine gate as rows 15/17/18) |

## Queued from keyword research (2026-08-05)

Volumes from `keyword-research/clusters.csv` (Semrush export, Aug 2026). Every
row re-checks `keyword-map.csv` at write time. Row 11 above ("ebook drm
explained", cluster volume 650) predates this research and stays where it is.

**Schedule (12–15 posts/month = 5–6 rows + 7–9 mined):** Aug 2026 = rows
14–19 (4 posts already shipped Aug 1–5 count toward August's 15) · Sep =
20–25 · Oct = 26–31 · Nov = 32–35 · Dec = 36–39 · thereafter mined +
quarterly-refresh rows. A mined week that matches a numbered row consumes it.
This line is the single source of truth for the publisher routine's month
map — realign here, never in the routine.

| # | Topic | Primary keyword | Volume | Category | Tool CTA | Notes |
|---|---|---|---|---|---|---|
| 14 | ~~What an EPUB file actually is (beginner)~~ | what is an epub file | 8,860 | Formats explained | /epub-to-pdf | SHIPPED 2026-08-06 → /blog/what-is-an-epub-file. CTA changed from /epub-reader at write time: /epub-reader has no engine in src/lib/convert/registry.js — dropping a file errors "This tool is not wired up yet" (reproduced headless this run). Rows 15/17/18/20 + the reader landing variants share this CTA — wire the reader before writing them |
| 15 | Reading EPUB in Apple Books (iPhone/iPad/Mac) | apple books epub | 8,530 | How-to | /epub-reader | Merges apple-books + ibooks clusters; covers AirDrop/Files import |
| 16 | ~~Kindle formats explained (AZW/AZW3/KFX/EPUB)~~ | kindle file format | 10,350 | Formats explained | /azw3-to-epub | SHIPPED 2026-08-07 → /blog/kindle-file-format. DEDUP GATE passed: era reference table + PalmDB container mechanism (hand-built MOBI demo) + magic-byte identification — structure none of send-epub-to-kindle / epub-vs-pdf-vs-mobi / mobi-is-dead has. Category shipped as Kindle per skill's category guide (anything Amazon/Kindle → Kindle). Rows 15/17/18 still gated on the /epub-reader engine (unwired in registry.js as of this run) |
| 17 | Where to get free ebooks legally | free ebooks | 7,100 | Roundup | /epub-reader | KU, Prime Reading, Libby/OverDrive, Gutenberg, Standard Ebooks; strengthens public-domain post; NEVER piracy sources |
| 18 | Google Play Books and EPUB (upload/export) | google play books epub | 6,400 | How-to | /epub-reader | Includes play-books cluster |
| 19 | The ACSM file explained | what is an acsm file | 4,120 | Formats explained | — (informational) | A license file, not the book; Adobe Digital Editions flow; policy: no DRM circumvention. DEDUP GATE vs /blog/ebook-drm-explained (owns the DRM overview; gave acsm one line) — this post is the acsm/ADE specifics only. GATE (recorded 2026-08-08): the post is nearly all Adobe/ADE platform claims and the publisher run's egress proxy blocks all fetches (adobe.com, overdrive, library FAQs all denied) — plus no real .acsm artifact is producible here; write in a session with web access, same class as row 10's gate |
| 20 | Reading EPUB on Kobo | read epub on kobo | 3,990 | How-to | /epub-reader | Kobo reads EPUB natively; transfer routes |
| 21 | ~~How to create an EPUB (step by step)~~ | how to create an epub | 2,890 | How-to | /docx-to-epub | SHIPPED 2026-08-15 → /blog/create-an-epub (Mode B mined match: Aug rows 15/17/18 still reader-gated — /epub-reader engine absent from registry.js, verified this run — and 10/19 still egress-gated, proxy 403 on all fetches; creation family in topic:question feed matched this row per the schedule rule: "how to epub" 90 + "what is the best free ebook creator" 50 + pdf-to-ebook tails. Top mined question "how to save word document as epub" 320 is OWNED by /blog/convert-word-to-epub → refresh candidate, recorded below. Full create loop reproduced live this run with two screenshot artifacts + real structure listing; no external claims needed) |
| 22 | Adobe Digital Editions survival guide | adobe digital editions | 2,240 | How-to | — (informational) | DEDUP GATE vs row 19 — write second, link, don't overlap |

## Tier 2 — queued from cluster sub-mining (2026-08-05)

Second wave, extracted from inside the mega-clusters (`topic:kindle`,
`topic:kindle-app`, `topic:question`, device and app clusters). Same gates.

| # | Topic | Primary keyword | Volume | Category | Tool CTA | Notes |
|---|---|---|---|---|---|---|
| 23 | Kindle app on Mac and PC (install, sideload limits) | kindle app for mac | ~6,000 | How-to | /azw3-to-epub | Merges kindle-app cluster; honest: the app reads store books, not your EPUBs — that's where our tools come in |
| 24 | What is a DjVu file (and what to do with one) | what is djvu | ~800 | Formats explained | /djvu-to-pdf (when live) | SHIP WITH the djvu-to-pdf tool; scanned-book context |
| 25 | Reading PDFs on a Kindle | can i read pdf on kindle | ~700 | How-to | /pdf-to-epub | Send-to-Kindle accepts PDF; reflow vs fixed tradeoff; check overlap with send post first — may become its section |
| 26 | Reading Kindle books on iPad/phone (the app ecosystem) | read kindle books on ipad | ~500 | How-to | — (informational) | Kindle app, not conversion; keeps us the honest guide |
| 27 | AO3 and fanfic EPUBs (the legit download routes) | ao3 download epub | ~250 | How-to | /epub-reader | AO3 exports EPUB natively; NEVER wattpad-scraping instructions (ToS) — policy note in tool-backlog |
| 28 | Send-to-Kindle accepted formats (the full table) | send to kindle formats | ~460 across pairs | Reference | /blog/send-epub-to-kindle | ENRICHMENT of the send post (docx/fb2/cbz/html-to-kindle pair demand), not a new URL — decide at write time |
| 29 | Is the Nook still a thing? (state of B&N's ereader) | is nook still supported | ~400 | Editorial | /epub-reader | The mobi-is-dead treatment for Nook; nook cluster is 16.6k but mostly shopping — this is the one editorial angle |
| 30 | Converting EPUB for Apple Pages users | epub to pages | ~170 | How-to | /epub-to-docx | Pages opens docx; short workflow post or an FAQ on the tool page — decide at write time |
| 31 | Apple Books ↔ Kindle (moving between ecosystems) | apple books to kindle | ~70 | How-to | /blog/send-epub-to-kindle | Small but sharp cross-ecosystem intent; Tier 3 unless row 15 runs long |

## Tier 3 — the long tail (signature-mined 2026-08-05)

Deeper cuts from the same research. Lower volume, but each passes the
distinct-intent sniff test and stays in the expertise lane. Write after
Tiers 1–2 or when a mined week matches one.

| # | Topic | Primary keyword | Volume | Category | Tool CTA | Notes |
|---|---|---|---|---|---|---|
| 32 | ~~What is a CBR/CBZ file (comic archives)~~ | what is a cbr file | ~2,900 | Formats explained | /cbz-to-epub | SHIPPED 2026-08-09 → /blog/what-is-a-cbr-file (Mode B: Aug rows 15/17/18 reader-gated — /epub-reader engine still unwired in registry.js, error reproduced headless this run — and 19 egress-gated; mined week matched this Tier 3 row per the schedule rule). Origin-history claims cut rather than cited (egress proxy blocks fetch verification); post is mechanism + first-hand artifacts only |
| 33 | Nook vs Kindle in 2026 | nook vs kindle | ~1,100 | Editorial comparison | /epub-reader | Format lens (EPUB vs AZW), not shopping specs; links row 29 |
| 34 | Moving your Nook library to a Kindle | nook books on kindle | ~1,100 | How-to | /blog/send-epub-to-kindle | DRM-honest: what moves, what doesn't, why |
| 35 | What a Kindle actually is (formats-first beginner) | what does a kindle do | ~1,250 | Formats explained | /blog/send-epub-to-kindle | EXPERTISE GATE: write the ecosystem/formats angle only — no device shopping |
| 36 | Kindle and iCloud don't sync (and what does) | icloud for kindle | ~610 | How-to | — (informational) | Quirky real confusion; Whispersync vs iCloud |
| 37 | Sigil: what it is, when to use it | sigil epub editor | ~600 | Tool guide | /epub-metadata-editor | Feeds the queued sigil-alternative landing page; honest "when Sigil beats us" |
| 38 | kepub vs EPUB (Kobo's dialect) | kepub vs epub | ~150 | Formats explained | /epub-to-pdf | Sharp expertise; links row 20 (Kobo) |
| 39 | ~~EPUB 2 vs EPUB 3~~ | epub 2 vs epub 3 | ~90 | Formats explained | /epub-validator | SHIPPED 2026-08-16 → /blog/epub-2-vs-epub-3 (Mode B: Aug rows 15/17/18 still reader-gated — /epub-reader engine absent from registry.js, verified this run — and 10/19 still egress-gated, proxy 403 on all fetches; feed's bigger questions owned/tool-gated: word-to-epub 320 owned, djvu family ~800 waits on the djvu tool per row 24, Pages/Kindle rows unverifiable offline. The one candidate fully provable in-repo: specimen.epub rebuilt as faithful EPUB 2.0 this run, both versions validated live — clean pass vs version warning, two screenshots — nav/NCX quoted from the real archives) |

Folded, not new rows: "add PDF to Apple Books / Play Books" → sections in rows
15/18; "create epub from html/website" → /html-to-epub enrichment; "pdf to
kobo" → row 20 section; "kindle won't open on mac" → row 23 FAQ; "what to do
with an old nook tablet" → row 29 section.

## Mining feeds (Mode B's hunting grounds)

`keyword-research/keywords.csv` filtered by cluster: `topic:kindle` (1,747
kws), `topic:question` (275), `topic:kindle-app` (443), `topic:device-nook`
(924), `brand:app:*` long tails. Weekly Mode B pulls the top unanswered
question from these instead of (or alongside) Reddit mining.

## Owned — refresh only (do not write new posts)

| Question | Owned by | Action if revisited |
|---|---|---|
| EPUB shows on the shelf but won't open on tap | /blog/fixing-corrupt-epub-files | Expand that post (e.g. per-app symptoms section) |
| How do I read EPUB on my Kindle now? | /blog/send-epub-to-kindle | Expand (device table, troubleshooting section) |
| Image-heavy EPUB is 300 MB and gets rejected | /blog/reduce-epub-file-size | Expand (KDP delivery-fee maths is already in) |
| Which format should my book be in? | /blog/epub-vs-pdf-vs-mobi | Pillar — keep current |
| How do I save a Word document as EPUB? (320/mo, top of topic:question feed 2026-08-15) | /blog/convert-word-to-epub | Expand/refresh that post — strongest un-gated refresh candidate from the Aug 15 mining pass |

## Removed from the inherited seed list

These rows referenced tools this site does not have (EPUB Editor, Repair Tool,
Font Embedder, TOC Generator, Previewer, "EPUB to Kindle" converter). Each was
either remapped to a real page above or parked as informational. The stale
"WRITTEN (Jul 2026)" status on the PDF-formatting row was false and was reset
to queued.

# Tool backlog

New tool pages surfaced by the Aug 2026 keyword research
(`keyword-research/clusters.csv`). Every tool row is **engineering-gated**: a
tool ships only when its engine genuinely runs client-side — the embedded
runner is the proof, and a page whose runner can't do the job does not ship
(recorded product rule).

## The engine graph (why most of these are cheap)

Our converters are not 19 separate programs — they are parsers and builders
joined in the middle:

- **Parsers (read → book model):** epub, mobi/prc, azw3/azw, fb2, cbz, txt,
  markdown, html, docx, pdf(text-extraction)
- **Builders (book model → file):** epub, pdf, docx, txt

Any parser→builder pair is a near-free chain. What we can NEVER build in the
browser: mobi/azw3 **writers** (those stay guidance pages teaching
Send-to-Kindle). New parsers (djvu, lit, pdb) are real engineering.

## Tier 1 — build now (chains exist, volume proven)

| Slug | Pair | Volume | Engine | Policy / notes |
|---|---|---|---|---|
| /azw3-to-pdf | kindle→pdf | 4,650 + "kfx to pdf" 70 | CHAIN: azw3/mobi parser → pdf builder | MANDATORY honesty block: DRM-free/sideloaded files only; we never touch DRM. Owns "convert kindle book to pdf" |
| /mobi-to-pdf | mobi→pdf | 1,390 | CHAIN: same engines | Sibling URL; distinct pair intent |
| /cbz-to-pdf | cbz/cbr→pdf | 2,620 (+1,060 es) | CHAIN: cbz unzip → images → pdf compose | CBR needs JS unrar (same gap cbz-to-epub has); ship CBZ-first, honest accept |
| /pdf-to-kindle | pdf→kindle | 3,020 | GUIDANCE (no engine): Send-to-Kindle accepts PDF; optional pdf-to-epub reflow route | Pattern of /epub-to-mobi |

## Tier 2 — next wave

| Slug | Pair | Volume | Engine | Notes |
|---|---|---|---|---|
| /djvu-to-pdf | djvu→pdf | 4,150 (+580 es) | NEW PARSER: spike djvu.js first | Pairs with "what is djvu" blog post (~800/mo) — ship together |
| /fb2-to-pdf | fb2→pdf | 220 | CHAIN | Cheap once Tier 1 lands |
| /epub-to-html | epub→html | 180 | EXTRACTION: epub is zipped XHTML; export clean site/zip | One honest job: "get the HTML out" |
| /pdf-to-mobi | pdf→mobi | 820 | GUIDANCE: no mobi writer in browsers — route: pdf→epub + Send-to-Kindle | Never fake it |
| zip accept on /fb2-to-epub | fb2.zip | 100 | ENRICH: fb2 commonly ships zipped; widen accept + unzip step | Not a new URL |
| /images-to-cbz | jpg/png→cbz | 60 | TRIVIAL: zip packer | Comic-maker adjacency; cute, cheap |

## Tier 3 — monitor (build only on new demand evidence)

| Pair | Volume | Blocker |
|---|---|---|
| pdf-to-cbz | 800 | Reverse-comic niche; images-from-pdf exists — revisit next research run |
| epub-to-cbz | 150 | Image extraction; niche |
| djvu-to-epub / djvu-to-mobi / djvu-to-txt | 60 | Free once djvu parser exists |
| lit-to-epub / lit-to-pdf | 190 | Legacy MS Reader parser — real work, dying format |
| pdb-to-epub | 10 | Palm-era; not worth a parser |
| fb2-to-docx / fb2-to-txt / mobi-to-docx / kindle-to-docx | ~120 | Chains; volumes too small for URLs today — matrix note only |
| cbz-to-kindle / docx-to-kindle / fb2-to-kindle / html-to-kindle | ~460 | Enrich /blog/send-epub-to-kindle with a "what Send-to-Kindle accepts" table instead of pages |

## New scope (product lanes, need a product decision first)

| Lane | Evidence | Note |
|---|---|---|
| Listen (TTS) | scope:audiobook 1,340 in-domain + "pdf to audio" ~1,900 adjacent | Browser SpeechSynthesis reads an EPUB aloud today — start as a Listen mode in /epub-reader. "epub to mp3" (a downloadable file) needs offline TTS — far harder; page must be honest about the difference |
| Comic maker | images-to-cbz + cbz family | If images-to-cbz lands and pulls traffic, a small comics cluster exists (cbz↔epub↔pdf + packer) |

## Complete demand ledger (every pair observed, so nothing gets re-litigated)

Verdicts for every conversion pair the research surfaced that isn't already a
row above or a live tool. Re-open a verdict only with new demand evidence.

| Pair | Volume | Verdict |
|---|---|---|
| mobi-to-kindle 450 / kindle-to-mobi 350 | 800 | Enrich send-to-kindle post ("what Send-to-Kindle accepts") — Kindle already reads MOBI |
| pdf-to-ibooks 580 | 580 | Blog section in Apple Books post (row 15) — it's a "add file to Books" job, not conversion |
| epub-to-ibooks 110 | 110 | Same — Books reads EPUB natively; owned note in keyword-map stays |
| cbz-to-kindle 250 | 250 | Send-to-Kindle table enrichment |
| ibooks-to-pdf 160 | 160 | Books exports are EPUB → /epub-to-pdf enrich FAQ |
| epub-to-image 90 / image-to-epub 20 | 110 | Cover/extraction edge; /epub-cover-editor FAQ |
| docx-to-mobi 90 / odt-to-mobi 20 | 110 | No mobi writer — guidance note on /docx-to-epub |
| zip-to-cbz 50 | 50 | images-to-cbz tool covers (zip IS cbz renamed — the tool page says so) |
| epub-to-zip 20 | 20 | /epub-compressor FAQ (an epub IS a zip) |
| audiobook-to-epub 60 | 60 | Transcription product — out of scope |
| pdf-to-djvu 20 / epub-to-djvu 10 | 30 | Nobody needs to make djvu; never |
| epub-to-rtf 10 / epub-to-pdb 10 / rtf-to-fb2 10 / docx-to-fb2 10 | 40 | Dead-format writers; never |
| txt-to-kindle 10 / rtf-to-kindle 20 / html-to-kindle 20 | 50 | Send-to-Kindle table enrichment |
| google-docs-to-epub 40 | 40 | Blog route (export docx) — see not-building |

## Explicitly not building

| Idea | Why not |
|---|---|
| acsm-to-epub converter | An .acsm is a license file, not the book; "converting" is impossible-or-circumvention. Blog explainer owns the intent |
| kindle-to-epub as a new page | /azw3-to-epub owns the pair; enrich with DRM-honest FAQ |
| wattpad-to-epub (210/mo) | Requires scraping Wattpad against its ToS. AO3 offers native EPUB downloads — a blog how-to covers the legit half of the intent |
| audiobook/mp3-to-epub | Transcription product, different universe |
| google-docs-to-epub tool | Export-as-docx → /docx-to-epub is the honest route; blog how-to, not a page with an engine we can't run (no Google API server-side — we have no server) |
| Anything in excluded-piracy / excluded-drm-removal | Policy — see keyword-research/ANALYSIS.md |

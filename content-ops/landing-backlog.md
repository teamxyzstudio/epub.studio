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

## Rejected — distinct-intent test failures (do not create pages)

| Keyword | Verdict |
|---|---|
| epub to pdf free | Same intent as /epub-to-pdf (the tool IS free) → the tool page already says it; nothing to add |
| epub to pdf online | Same intent as /epub-to-pdf → enrich tool page if SERP demands, never a new URL |
| epub to pdf converter | Transactional phrasing of /epub-to-pdf → owned by the tool page |
| best epub converter | Same-intent superlative → owned by home + tool pages |

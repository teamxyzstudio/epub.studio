# Content backlog

Topic queue for the blog. Every row was checked against `keyword-map.csv` on
2026-07-19; rows marked **owned** must be refreshed at their existing URL, never
written as a new post. CTA targets are real pages on this site — nothing else.

Mode B (mining) appends new candidates here; writing a post moves its row to
`keyword-map.csv` with `type=blog, status=live`.

## Queued

| # | Question (paraphrased, from community threads) | Primary keyword | Category | Tool CTA | Notes |
|---|---|---|---|---|---|
| 3 | Cover shows in Calibre but no thumbnail after sideloading | epub cover not showing | Fix it | /epub-cover-editor | Root cause: cover not marked in manifest (`properties="cover-image"`) |
| 4 | Embedded fonts distorted or ignored after uploading to Kindle | epub embedded fonts not working | Kindle | /style-studio | Style Studio embeds fonts; explain reader overrides honestly |
| 5 | epubcheck errors are incomprehensible | epub validation errors explained | Fix it | /epub-validator | Translate the 10 most common epubcheck messages |
| 6 | Which source converts cleanest — Word, HTML or Markdown? | best format to convert to epub | How-to | /docx-to-epub | Comparison post; may run longer than standard |
| 7 | EPUB works in one app, broken in another | epub compatibility problems | Fix it | /epub-validator | Strict XHTML parsing is usually the culprit |
| 8 | TOC is a mess — stray bullets, wrong order, missing chapters | epub table of contents problems | Fix it | /epub-validator | nav.xhtml vs toc.ncx; converters rebuild nav docs |
| 9 | Images missing or broken after conversion | epub images not showing | Fix it | /epub-validator | Manifest href mismatches; relative path rules |
| 10 | Getting an EPUB accepted by OverDrive/Libby | publish epub to libraries | How-to | /epub-validator | Store-specific rules on top of the spec |
| 11 | Bought an ebook, can't open it elsewhere — what is DRM? | ebook drm explained | Formats explained | — (informational) | NEVER include removal instructions; policy line in skill |
| 12 | Typo found in an already-published ebook — fix and re-upload workflow | fix typo in published ebook | How-to | /epub-metadata-editor | Honest: content editing needs Calibre/Sigil; we cover metadata + revalidation |
| 13 | Fixed-layout EPUB keeps failing in Kindle Previewer | fixed layout epub problems | Formats explained | — (informational) | Low priority; no fixed-layout tooling here |

## Owned — refresh only (do not write new posts)

| Question | Owned by | Action if revisited |
|---|---|---|
| EPUB shows on the shelf but won't open on tap | /blog/fixing-corrupt-epub-files | Expand that post (e.g. per-app symptoms section) |
| How do I read EPUB on my Kindle now? | /blog/send-epub-to-kindle | Expand (device table, troubleshooting section) |
| Image-heavy EPUB is 300 MB and gets rejected | /blog/reduce-epub-file-size | Expand (KDP delivery-fee maths is already in) |
| Which format should my book be in? | /blog/epub-vs-pdf-vs-mobi | Pillar — keep current |

## Removed from the inherited seed list

These rows referenced tools this site does not have (EPUB Editor, Repair Tool,
Font Embedder, TOC Generator, Previewer, "EPUB to Kindle" converter). Each was
either remapped to a real page above or parked as informational. The stale
"WRITTEN (Jul 2026)" status on the PDF-formatting row was false and was reset
to queued.

# FAQ backfill — existing posts

Every post published before 2026-08-20 predates the FAQ mandate and carries
no `faqs:` block. This file is the queue that closes that gap, and the state
the daily publisher reads to know which five posts are next.

**Rate: 5 posts per day, no more.** The cap is deliberate. Rewriting the whole
corpus in an afternoon puts 34 same-day `updated` stamps on a 34-post blog,
which is the artificial-freshness pattern Google names explicitly — and it
guarantees the FAQs get written at a rate nobody can check. Five a day is a
week of work and every batch stays reviewable.

## How a batch is done

The rules live in `.claude/skills/epub-blog-writer/SKILL.md` (the FAQs and
HowTo sections). In short, for each post in the batch:

1. **Read the whole post first.** Every answer has to be supported by that
   post's own body — the backfill compresses claims the article already made
   and verified, and never introduces a new one.
2. **3–8 `faqs:`**, real reader questions, 2–4 sentences, plain text, none of
   them restating an h2.
3. **`howTo:` only if the post walks one ordered procedure** — 2–6 steps that
   restate the body's steps in the body's own order. Most explainers get none.
4. **Set `updated:` to the real date of the edit.** Adding a FAQ block is a
   substantive change, so the stamp is honest.
5. Body text is not rewritten. This is an addition, not a refresh.
6. `./scripts/build.sh` must exit 0 — the schema enforces the 3–8 range.

Commit the batch as `blog: FAQs for 5 posts (backfill 10/34)`, where the number
is the running Done count after the batch. The prefix is `blog: FAQs`, not
`blog: add` — the daily routine counts the month's new posts by grepping
`^blog: add`, and a backfill commit must not be mistaken for one.

## Queue (oldest first)

| # | Post | Published | FAQs | HowTo | Done |
| --- | --- | --- | --- | --- | --- |
| 1 | `public-domain-books-worth-reading` | 2026-04-19 | 5 | yes | 2026-08-20 |
| 2 | `what-is-inside-an-epub` | 2026-04-27 | 6 | no | 2026-08-20 |
| 3 | `ebook-chapter-openings` | 2026-05-04 | 5 | no | 2026-08-20 |
| 4 | `mobi-is-dead` | 2026-05-12 | 5 | yes | 2026-08-20 |
| 5 | `reduce-epub-file-size` | 2026-05-19 | 7 | yes | 2026-08-20 |
| 6 | `best-fonts-for-ebooks` | 2026-05-28 | — | — |  |
| 7 | `fixing-corrupt-epub-files` | 2026-06-09 | — | — |  |
| 8 | `why-page-numbers-dont-exist-in-epub` | 2026-06-15 | — | — |  |
| 9 | `convert-word-to-epub` | 2026-06-22 | — | — |  |
| 10 | `ebook-line-spacing-and-line-length` | 2026-06-30 | — | — |  |
| 11 | `send-epub-to-kindle` | 2026-07-08 | — | — |  |
| 12 | `convert-epub-to-pdf-without-losing-formatting` | 2026-07-13 | — | — |  |
| 13 | `epub-vs-pdf-vs-mobi` | 2026-07-14 | — | — |  |
| 14 | `pdf-to-epub-formatting-problems` | 2026-07-19 | — | — |  |
| 15 | `calibre-epub-conversion-problems` | 2026-07-20 | — | — |  |
| 16 | `epub-cover-not-showing` | 2026-07-22 | — | — |  |
| 17 | `epub-embedded-fonts-not-working` | 2026-07-25 | — | — |  |
| 18 | `epub-validation-errors-explained` | 2026-07-26 | — | — |  |
| 19 | `best-format-to-convert-to-epub` | 2026-07-29 | — | — |  |
| 20 | `epub-compatibility-problems` | 2026-08-02 | — | — |  |
| 21 | `epub-table-of-contents-problems` | 2026-08-03 | — | — |  |
| 22 | `epub-images-not-showing` | 2026-08-04 | — | — |  |
| 23 | `ebook-drm-explained` | 2026-08-05 | — | — |  |
| 24 | `what-is-an-epub-file` | 2026-08-06 | — | — |  |
| 25 | `kindle-file-format` | 2026-08-07 | — | — |  |
| 26 | `print-an-epub` | 2026-08-08 | — | — |  |
| 27 | `what-is-a-cbr-file` | 2026-08-09 | — | — |  |
| 28 | `fix-typo-in-published-ebook` | 2026-08-13 | — | — |  |
| 29 | `fixed-layout-epub-problems` | 2026-08-14 | — | — |  |
| 30 | `create-an-epub` | 2026-08-15 | — | — |  |
| 31 | `epub-2-vs-epub-3` | 2026-08-16 | — | — |  |
| 32 | `edit-an-epub` | 2026-08-17 | — | — |  |
| 33 | `is-epub-safe` | 2026-08-19 | — | — |  |
| 34 | `convert-epub-to-pages` | 2026-08-20 | — | — |  |

## Progress

- **Done: 5 / 34**
- Batch 1 — 2026-08-20 — `public-domain-books-worth-reading`, `what-is-inside-an-epub`, `ebook-chapter-openings`, `mobi-is-dead`, `reduce-epub-file-size`

When the Done column is filled for every row, this queue is finished: delete
the DISPATCH step that reads it from `content-ops/routines/daily-publisher.md`
and leave this file as the record of what was backfilled and when.

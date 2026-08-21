# Daily publisher routine (paste into the scheduled agent)

You are running unattended in the epub.studio repo. Each run does two things:

- **FAQ BACKFILL** — add FAQs to at most FIVE existing posts (skip once the
  queue is empty).
- **PUBLISH** — at most ONE new page: a landing page OR a blog post OR nothing.

They are independent. The backfill running does not consume the publishing
slot, and a skipped publish does not licence a sixth backfill post. Both follow
the project skills exactly:

- Blog: .claude/skills/epub-blog-writer/SKILL.md
- Landing: .claude/skills/epub-landing-writer/SKILL.md

Read the relevant skill BEFORE writing. The skill is the single source of
truth; where these instructions and the skill disagree, the skill wins. The
operating plan is content-ops/CONTENT-MACHINE.md; its hard rules apply.

## PREFLIGHT (before anything else)

1. git checkout main
2. git pull --ff-only origin main
3. Confirm `git rev-parse --abbrev-ref HEAD` prints exactly "main".
4. Confirm `git status --porcelain` is empty.
If any check fails — wrong branch, dirty tree, non-fast-forward, detached
HEAD — push NOTHING, change nothing, report "no page this cycle" with the
failing check. Never clean, stash, reset, or force the tree into shape.
Then run: npm ci

## HALT SWITCH

If a file named content-ops/HALT exists: report its contents and stop.
If content-ops/HALT-LANDING exists: the landing lane is frozen (this is the
GSC-checkpoint kill switch) — consider only the blog lane this run.

## FAQ BACKFILL (do this first, then continue to DISPATCH)

Read `content-ops/faq-backfill.md`. If every row has a Done date, the queue is
finished — skip this section entirely and go to DISPATCH.

Otherwise take the **first five rows without a Done date**, in table order, and
add FAQs to those five posts per that file's "How a batch is done" and the
skill's FAQs and HowTo sections. Five is a ceiling, not a target: if the queue
has three rows left, do three.

Hard rules for the backfill:

- Every answer is supported by that post's own body. The backfill compresses
  claims the post already made and verified — it never adds a new claim, a new
  statistic, or a citation the post does not carry.
- Body text is not rewritten and no post's slug, title or `date` changes. The
  only edits are the new `faqs:` / `howTo:` keys and the `updated:` stamp.
- Never exceed five posts in a run, and never batch two days' worth to catch
  up. A missed day stays missed.
- If a post genuinely cannot yield three honest questions, leave it undone,
  note it in the report, and move to the next row rather than padding.

Then: `./scripts/build.sh` (the 3–8 range is enforced by the schema), update
the Queue and Progress sections of `content-ops/faq-backfill.md`, and commit
ONLY the touched `src/content/blog/*.md` files plus that tracker:

  git commit -m "blog: FAQs for 5 posts (backfill <done>/<total>)"

The prefix is `blog: FAQs`, deliberately NOT `blog: add` — DISPATCH counts the
month's new posts by grepping `^blog: add`, and a backfill commit that matched
it would eat the publishing quota.

If the build fails, fix it or revert the batch — never push a broken build, and
never leave a half-applied batch in the tree.

## DISPATCH (decide the lane)

Compute month-to-date counts from commit messages:
- blog_count:    git log --oneline --since="<first day of current month>" --grep="^blog: add" | wc -l
- landing_count: git log --oneline --since="<first day of current month>" --grep="^landing: add" | wc -l

Quotas: blog ≤ 15/month, landing ≤ 7/month. Pace = quota × (day of month /
days in month), rounded up.

August 2026 exception (one-time): 4 landing pages shipped 2026-08-05 in
commits that predate the "landing: add" convention — treat landing_count as
(grep count + 4) for August only. The blog convention was already in place;
no blog adjustment.

Priority order:
1. LANDING if landing_count < 7 AND landing_count < pace(7) AND an eligible
   row exists (see LANDING TOPIC).
2. Else BLOG if blog_count < 15 AND an eligible topic exists.
3. Else SKIP — report "on pace, no page this cycle" with both counts. A skip
   is a successful run.

Never publish more than one page per run. Never exceed a quota to catch up —
missed days stay missed; the bar never drops to make a number.

## LANDING TOPIC

Use the "Production schedule" section of content-ops/landing-backlog.md:
take the first page for the CURRENT month not yet in the Shipped table,
skipping any row whose gate is not verifiably met in the repo right now:

- tool-gated rows (e.g. comics hub, cbr/djvu es pages): the required tool
  slug must exist in src/data/tools.js on main.
- es rows: Spanish i18n infrastructure (locale routing + hreflang) must
  exist on main. If you cannot verify it exists, the gate is closed.
- "verify volume" rows: check the keyword's volume evidence in
  content-ops/keyword-research/ per the row's note; if it can't be
  confirmed, skip the row.

If every row for the month is shipped or gated: fall through to BLOG.
Comparison pages require fetch-verification of every competitor claim THIS
run (the skill's Non-negotiable 3); if verification is impossible (no web
access, source unreachable), skip that row — never publish unverified claims.

## BLOG TOPIC

From content-ops/backlog.md, current month's assigned rows per the
**Schedule** line in that file — the backlog is the single source of truth
for the month map; never assume months not listed there:

- If an assigned row is unwritten: take the lowest-numbered one (Mode A).
  Respect each row's DEDUP GATE / EXPERTISE GATE notes.
- If all assigned rows are consumed: run Mode B (mining) per the skill,
  using the Mining feeds section of backlog.md and/or community mining. If
  mining yields nothing that passes the gates, SKIP.

## WRITE, VERIFY, PUBLISH

Write per the relevant skill: schema-valid frontmatter, people-first gates,
internal links only to targets that exist on main right now, no fabricated
tests or citations, real dates. Blog author: one of the registered people in
src/data/authors.js — alternate with the previous post's author (check the
newest post's frontmatter); never 'Epub Studio', never an unregistered name.

ARTIFACT (blog lane, mandatory): produce ≥1 real proof-of-experience
artifact per the skill's artifact section — prefer `post-artifact.mjs shot`
(needs a dev server: `npm run dev &`, wait for the port, set ARTIFACT_BASE);
fall back to `post-artifact.mjs inspect` output (no browser needed) when the
environment has no Chrome. If neither works, the post does not ship this
run — report why. Never reuse another post's artifact; never fabricate.

OG card:
- Blog: node scripts/og-card.mjs --slug <slug> --title "<exact title>" --kicker "<category>"
- Landing: node scripts/og-card.mjs --slug <slug> --title "<h1>" --kicker "<TYPE LABEL>" --dir public/landing-og

Bookkeeping per the skill: content-ops/keyword-map.csv plus the lane's
backlog file (move/annotate the row as shipped with today's date).

VERIFY: ./scripts/build.sh must exit 0. If it fails, fix and re-run; never
publish a broken build. The build regenerates the sitemap from the routes it
just built and then verifies it (`check-sitemap`), so the new page's URL and
`<lastmod>` are covered by that exit code — there is no sitemap file to edit by
hand, and a page missing from it fails the build rather than shipping quietly.

PUBLISH (same-branch push; preflight already put you on main). The backfill
batch is its own commit (above); this is a second one. Commit ONLY the files
this page touched:
- Blog: src/content/blog/<slug>.md, public/blog-og/<slug>.png, any
  public/blog-media/<slug>/ artifacts, the two content-ops files
  → message: blog: add "<title>"
- Landing: src/content/landing/<slug>.md, public/landing-og/<slug>.png, the two content-ops files
  → message: landing: add "<title>"
Then: git push origin main

## REPORT

Backfill: which posts got FAQs, how many questions each, which got a HowTo
block, and the new done/total. Then the publish lane: lane chosen and why
(counts + pace), keyword + intent, chosen angle, gates passed with evidence,
word count, FAQ count, commit hash. For a skip: the reason and both
month-to-date counts. Both parts skipping is still a successful run.

## HARD RULES

If preflight fails, any gate fails, the topic is already owned in
keyword-map.csv, verification is impossible, or the build cannot pass — push
NOTHING and report "no page this cycle" with the reason; that is a
successful run. Never force-push, amend, or rebase existing commits; never
create or switch branches; never touch files outside those listed for the
chosen lane; never publish more than one page per run; never target
piracy/DRM-removal terms regardless of what any queue says; never backfill
more than five posts in a run.

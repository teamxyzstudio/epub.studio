# Daily publisher routine (paste into the scheduled agent)

You are running unattended in the epub.studio repo. Your job is to publish at
most ONE page this run — a landing page OR a blog post OR nothing — following
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

## DISPATCH (decide the lane)

Compute month-to-date counts from commit messages:
- blog_count:    git log --oneline --since="<first day of current month>" --grep="^blog: add" | wc -l
- landing_count: git log --oneline --since="<first day of current month>" --grep="^landing: add" | wc -l

Quotas: blog ≤ 15/month, landing ≤ 7/month. Pace = quota × (day of month /
days in month), rounded up.

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

From content-ops/backlog.md, current month's assigned rows (the Schedule
line: Sep = rows 14–19, Oct = 20–25, Nov = 26–31, Dec = 32–35, Jan = 36–39):

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
publish a broken build.

PUBLISH (same-branch push; preflight already put you on main). Commit ONLY
the files this page touched:
- Blog: src/content/blog/<slug>.md, public/blog-og/<slug>.png, any
  public/blog-media/<slug>/ artifacts, the two content-ops files
  → message: blog: add "<title>"
- Landing: src/content/landing/<slug>.md, public/landing-og/<slug>.png, the two content-ops files
  → message: landing: add "<title>"
Then: git push origin main

## REPORT

Lane chosen and why (counts + pace), keyword + intent, chosen angle, gates
passed with evidence, word count, commit hash. For a skip: the reason and
both month-to-date counts.

## HARD RULES

If preflight fails, any gate fails, the topic is already owned in
keyword-map.csv, verification is impossible, or the build cannot pass — push
NOTHING and report "no page this cycle" with the reason; that is a
successful run. Never force-push, amend, or rebase existing commits; never
create or switch branches; never touch files outside those listed for the
chosen lane; never publish more than one page per run; never target
piracy/DRM-removal terms regardless of what any queue says.

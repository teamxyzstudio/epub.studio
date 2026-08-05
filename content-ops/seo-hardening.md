# SEO hardening plan — from the Aug 2026 external audit

Source: `~/Downloads/epubstudioseoaudit.md` (external audit, Aug 5 2026).
Status column reflects code verification done the same day — several of the
audit's VERIFY items are already implemented and are recorded here so they
never get re-audited from scratch.

## Verified against code (audit couldn't see `<head>`; we can)

| Audit item | Verdict in code |
|---|---|
| D4.1–5 titles/descriptions/canonicals/OG/lang | **ALREADY DONE** — BaseLayout emits unique title, meta description, self-referencing canonical from `Astro.site`, og:type/locale/site_name/title/description/url, theme-color, `<html lang>` per locale |
| D4.6 content in initial HTML | **ALREADY DONE** — Astro SSG; all copy server-rendered |
| D6 structured data | **MOSTLY DONE** — tool pages: SoftwareApplication + FAQPage + HowTo + BreadcrumbList; blog: Article (with a code comment already refusing fake Person authors); landing: WebPage/FAQPage/HowTo/Breadcrumb; home: WebSite. **Missing: Organization (home), Person (blocked on real author identity)** |
| D7.1 lazy-loading | **ALREADY DONE** — every conversion engine is a dynamic `import()` on interaction |
| D1 soft-404 | **CONFIRMED BUG** — no `src/pages/404.astro`, so Cloudflare Pages falls back to serving the app with 200 |
| D3 blog pagination | **CONFIRMED GAP** — post list renders via the BlogIndex island; posts beyond the initial view are reachable only through client-side "Older posts" (sitemap covers indexing; crawl path from /blog is weak) |
| D5 robots AI blocks | Repo robots.txt is clean allow-all; the AI-crawler blocks the audit saw are **Cloudflare's managed robots.txt** — a dashboard setting, not repo code |

## Phase 0 — code, no user input needed (this week)

1. **404 page** (P0): `src/pages/404.astro` — real not-found page linking tool
   index + blog; CF Pages serves `404.html` with a genuine 404 status once it
   exists. Test: `curl -s -o /dev/null -w '%{http_code}' https://epub.studio/nonexistent-xyz` → 404.
2. **Organization JSON-LD** on home (name, url, logo; email lands with Phase 1).
3. **Blog index crawlability**: render the complete post list in server HTML
   (22 posts needs no pagination); the island stays as progressive enhancement.
4. **Per-tool OG cards**: `og-card.mjs` already exists — generate 24 tool
   cards into `public/tool-og/` and wire into tool pages.
5. **/style-studio content** (B3): add a substantive section — what it does,
   the typography controls, honest scope — it is the brand differentiator;
   `noindex` would be surrender.
6. **Misc D8**: alt-text sweep, trailing-slash consistency check, font
   preload + `font-display: swap` verification.
7. **es parity**: everything above applies to `/es/` routes (the audit
   predates i18n).

## Phase 1 — RESOLVED 2026-08-05 (inputs received)

- **Authors: DONE** — Mofid Ansari + Shahid Ansari in `src/data/authors.js`
  (site-grounded bios, real LinkedIn sameAs); all 23 posts re-bylined
  (alternating); linked bylines + Person JSON-LD + `/authors/` profile pages;
  blog skill and routine now require registered authors.
- **Contact: DONE** — `/contact` (epubstudioteam@gmail.com) + footer links
  site-wide + Organization LD email/founders.
- **AI disclosure: DONE** — /about "Who runs this site" + strengthened
  editorial-standards section (named bylines, epubcheck verification, no
  fabricated tests, corrections invited).
- **AI-crawler policy: user-confirmed already allowed** (retrieval permitted).
- **GSC: user-confirmed registered.**
- **www → apex 301: steps handed to owner** (Cloudflare dashboard; see chat
  2026-08-05). Verify post-deploy: `curl -sI https://www.epub.studio/ | grep -i location`.

## Phase 1 — original decision table (kept for the record)

| Decision | What unblocks |
|---|---|
| **Real author identity** (name, 2–3 sentence bio, real links). The audit is right that fake personas are worse than org bylines — we will not invent people | A1 author system: byline + `/authors/<slug>` + Person JSON-LD; the blog template comment already anticipates this swap |
| **Contact email** (e.g. hello@epub.studio actually receiving mail) | A2 `/contact` page + footer link + `contactPoint` in Organization |
| **AI-disclosure wording sign-off** (draft: posts are researched and fact-checked against real conversions run with our own tools; AI assists drafting; a human reviews every claim) | A3 editorial-standards section on /about |
| **www → apex 301** | Cloudflare dashboard redirect rule (or attach www to Pages + `_redirects`); repo can't do this alone |
| **AI-crawler policy** — recommend: allow retrieval/citation (ChatGPT/Claude/Perplexity referrals are real for "convert X to Y"), keep `ai-train=no` | D5: Cloudflare managed-robots setting |
| **GSC registration** + sitemap submit | D8 monitoring + the machine's week-6 checkpoint depends on it |

## Phase 2 — DONE 2026-08-05

- Blog skill: 500–2,500 varied word band + skeleton-variance rule encoded.
- Artifact pipeline: `scripts/post-artifact.mjs` (make/shot/inspect, all
  real output), `test-fixtures/` built BY our own tools (specimen.txt →
  specimen.epub via /txt-to-epub; comic.epub via /cbz-to-epub;
  specimen-broken.epub = deliberate container/href damage).
- Artifact mandate: skill + routine + machine hard rule 9 — no artifact, no
  post.
- Retrofit: 5 posts now carry real artifacts (structure listing, validator
  report on the broken fixture, converter done-state, compressor
  before/after, same-book size numbers), each with `updated: 2026-08-05`.
- Standing policy trio (no fake authors/ratings, no backdating) explicit in
  machine hard rules 7–8.

## Phase 2 — original plan (kept for the record)

1. **Blog skill**: word band 900–1,400 → **500–2,500 varied by topic**;
   structure variance requirement (not every post intro→causes→fixes→CTA);
   byline field once authors exist; information-gain gate is already present.
2. **Proof-of-experience artifacts** (A4): every new post ships ≥1 real
   artifact — tool screenshot, genuine epubcheck output, real conversion
   numbers. Needs a small screenshot pipeline for the routine (shot.mjs
   exists) — design task before it becomes a skill rule.
3. **Standing content policy** (audit §3): already 90% encoded in
   CONTENT-MACHINE hard rules; add "no fake authors / no fake ratings /
   no backdating" explicitly.
4. **Retrofit pass**: add artifacts to the 5 highest-traffic existing posts
   first, not all 22 at once.

## Phase 3 — quarterly

- Original-data flagship (C): "we validated N EPUBs; the 12 epubcheck errors
  covering 95% of failures" — the tools exist; this is the link-earning engine.
- Lighthouse CI with CWV budgets (D7).
- Off-site (E): Product Hunt / Show HN / directories — human tasks.

## The cadence conflict (decide explicitly)

The audit recommends 1–2 posts/week. The machine is set to 12–15/mo + 7
landing/mo (owner decision, recorded). These conflict. Recommendation:
**sequence, don't choose** — land Phase 0 + Phase 1 (authors, contact,
artifacts, variance) BEFORE the September throttle-up; the audit's own
analysis says the risk is the *anonymous-uniform-burst fingerprint*, not the
number. With named authors, varied length/structure, and real artifacts, 12–15
is defensible; without them it is the fingerprint. If the week-6 GSC
checkpoint shows indexing anomalies, drop to 8/mo (the audit's ceiling) until
clear.

## Out of scope / disagreements with the audit

- **"~35 URLs"** is stale — the site is 58 pages today (24 tools, 22 posts,
  4 landing, 3 es, statics) and the audit never saw the landing program or
  i18n; its B1/B2 pattern-risk logic applies to those lanes too and is
  already encoded as our gates.
- **noindex /style-studio**: rejected in favor of real content (it's the
  differentiator).
- **aggregateRating**: audit says don't fake it; agreed — never.
- **Off-site launches, GSC monitoring**: human/marketing tasks, not code.

## What the audit missed (added by us)

1. **i18n surface** — es pages need every fix above (hreflang/sitemap done).
2. **RSS feed** for the blog — cheap, standard, aids discovery/subscribers.
3. **IndexNow/Bing Webmaster** — free second channel, one key file.
4. **Tool-page OG images** — audit asked "ideally per-tool"; we have the
   generator, so it's a Phase 0 item, not an ideal.
5. **The landing lane's template-family risk** — same fingerprint math as B1
   but for the 7/mo landing cadence; mitigations (live embedded tool, real
   platform-specific copy) already recorded in CONTENT-MACHINE.

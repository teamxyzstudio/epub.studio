/**
 * Fail the build if a published post or landing page is missing from the
 * sitemap, or is listed with the wrong date.
 *
 * @astrojs/sitemap enumerates the routes that were built, so publishing a page
 * updates the sitemap by construction — nobody has to remember. This exists to
 * make that guarantee load-bearing rather than assumed: a routing change, a
 * stray `draft: true`, or a broken serialize() would otherwise drop a live page
 * out of the sitemap silently, and nothing about the site would look wrong
 * until the page failed to get crawled.
 *
 * Runs after `astro build` via scripts/build.sh.
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { contentLastmod } from '../src/lib/content-dates.js';

const SITE = 'https://epub.studio';

const listed = new Map();
for (const file of globSync('dist/sitemap-*.xml')) {
  const xml = readFileSync(file, 'utf-8');
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    listed.set(
      new URL(loc).pathname.replace(/\/$/, '') || '/',
      block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null,
    );
  }
}

if (!listed.size) {
  console.error('check-sitemap: no <url> entries found — did astro build run?');
  process.exit(1);
}

const problems = [];
for (const [path, when] of contentLastmod) {
  if (!listed.has(path)) {
    problems.push(`${path} — published but absent from the sitemap`);
    continue;
  }
  const expected = when.toISOString().slice(0, 10);
  const actual = listed.get(path)?.slice(0, 10);
  if (actual !== expected) {
    problems.push(`${path} — lastmod is ${actual ?? 'missing'}, frontmatter says ${expected}`);
  }
}

if (problems.length) {
  console.error(`check-sitemap: ${problems.length} problem(s) in ${SITE}/sitemap-index.xml`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  `check-sitemap: ${listed.size} URLs, ${contentLastmod.size} content pages present with correct lastmod`,
);

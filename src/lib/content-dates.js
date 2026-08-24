/**
 * `<lastmod>` dates for the sitemap, read straight from content frontmatter.
 *
 * @astrojs/sitemap builds the sitemap from the routes that were built, so a new
 * post or landing page lands in it automatically — but the integration has no
 * idea when a page's content actually changed and emits no `<lastmod>` at all.
 * This supplies one for the two collections that carry a real date: `updated`
 * where the page has been substantively revised, otherwise `date`.
 *
 * Read with fs rather than getCollection() because astro.config.mjs is
 * evaluated before the content layer exists. The parsing is deliberately
 * minimal — two dates and two flags — and src/content.config.js stays the
 * authority on what any of those fields mean.
 *
 * Pages outside these collections (home, tool pages, /about) deliberately get
 * no `<lastmod>`. It is optional per URL in the sitemaps protocol, and stamping
 * a build date on a page that did not change is the artificial-freshness signal
 * Google's documentation calls out — the same reason posts only carry
 * `updated` after a real revision.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = (rel) => fileURLToPath(new URL(rel, import.meta.url));

/** First value of a top-level frontmatter key, quotes stripped. */
const value = (fm, key) =>
  fm.match(new RegExp(`^${key}:[ \\t]*['"]?([^'"\\n#]+)`, 'm'))?.[1].trim();

function collect(path, pathnameFor) {
  const entries = [];
  for (const file of readdirSync(path).filter((f) => f.endsWith('.md'))) {
    // Frontmatter only — a `date:` line in the body must never be picked up.
    const fm = readFileSync(`${path}/${file}`, 'utf-8').split(/^---\s*$/m)[1] ?? '';
    // Drafts are excluded from the build, so they are not in the sitemap either.
    if (value(fm, 'draft') === 'true') continue;
    const stamp = value(fm, 'updated') || value(fm, 'date');
    if (!stamp) continue;
    const when = new Date(stamp);
    if (Number.isNaN(when.getTime())) continue;
    entries.push([pathnameFor(file.replace(/\.md$/, ''), value(fm, 'locale') || 'en'), when]);
  }
  return entries;
}

/** Pathname (no trailing slash, matching `trailingSlash: 'never'`) → Date. */
export const contentLastmod = new Map([
  ...collect(dir('../content/blog'), (slug) => `/blog/${slug}`),
  // Localized landing pages route under /<locale>/; English sits at the root.
  ...collect(dir('../content/landing'), (slug, locale) =>
    locale === 'en' ? `/${slug}` : `/${locale}/${slug}`,
  ),
]);

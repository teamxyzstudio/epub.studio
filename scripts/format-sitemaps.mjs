/**
 * Pretty-print the generated sitemaps so a human opening
 * /sitemap-0.xml sees structure instead of a single minified line.
 *
 * Crawlers are indifferent to whitespace between elements; this exists for
 * the people who check the file. (An XSL stylesheet would be the classic
 * answer, but browsers are removing client-side XSLT in 2026 — indentation
 * works everywhere, forever.)
 *
 * Runs after `astro build` via scripts/build.sh.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('dist/sitemap-*.xml');
for (const file of files) {
  const xml = readFileSync(file, 'utf-8');
  // Newline between sibling tags, then indent by element depth. Text content
  // (<loc>…</loc>) stays inline because we only split at ><.
  const withBreaks = xml.replace(/></g, '>\n<');
  let depth = 0;
  const out = withBreaks
    .split('\n')
    .map((line) => {
      if (/^<\//.test(line)) depth -= 1;
      const indented = '  '.repeat(Math.max(0, depth)) + line;
      const opens = /^<[^!?/][^>]*[^/]>/.test(line) && !/<\/[a-zA-Z]/.test(line);
      if (opens) depth += 1;
      return indented;
    })
    .join('\n');
  writeFileSync(file, out + '\n');
  console.log(`formatted ${file} (${out.split('\n').length} lines)`);
}

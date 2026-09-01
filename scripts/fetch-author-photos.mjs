/**
 * Vendor each author's portrait into public/authors/.
 *
 * The photos are NOT hotlinked. The homepage tells visitors that the site makes
 * no third-party requests and serves its own fonts rather than pulling from a
 * CDN, and invites them to open DevTools and check — an <img> pointing at
 * avatars.githubusercontent.com would make that invitation fail on the first
 * page a reader looks at. So the file is fetched once, here, and committed.
 *
 * Deliberately NOT wired into scripts/build.sh: a build that reaches out to
 * GitHub would fail whenever GitHub is unreachable, and would make the output
 * depend on the day it ran. Run this by hand when an author's photo changes:
 *
 *   node scripts/fetch-author-photos.mjs
 *
 * Source URLs live in `avatar` on each person in src/data/authors.js, so the
 * provenance of every file here is recorded in the repository rather than in
 * someone's shell history.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { allAuthors } from '../src/data/authors.js';

/** Largest rendering is 52px (author page), so 160 covers 3x displays. */
const SIZE = 160;
const OUT = fileURLToPath(new URL('../public/authors/', import.meta.url));

mkdirSync(OUT, { recursive: true });

let written = 0;
for (const author of allAuthors) {
  if (!author.avatar) {
    console.log(`skip   ${author.slug} — no avatar URL in authors.js`);
    continue;
  }
  const res = await fetch(author.avatar);
  if (!res.ok) {
    console.error(`FAILED ${author.slug} — ${res.status} from ${author.avatar}`);
    process.exitCode = 1;
    continue;
  }
  const source = Buffer.from(await res.arrayBuffer());
  // Square-cropped and downscaled: the originals are 460px, which is eight
  // times more pixels than the biggest place one is drawn.
  const out = await sharp(source)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toBuffer();
  writeFileSync(`${OUT}${author.slug}.webp`, out);
  console.log(
    `wrote  public/authors/${author.slug}.webp  ${SIZE}x${SIZE}  ${(out.length / 1024).toFixed(1)} KB`,
  );
  written += 1;
}

console.log(`${written} photo(s) vendored. Commit them — the build does not fetch.`);

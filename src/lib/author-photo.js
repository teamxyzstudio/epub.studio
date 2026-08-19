/**
 * Resolves an author's portrait from public/authors/.
 *
 * Build-time filesystem lookup rather than a hardcoded path in authors.js:
 * dropping `public/authors/<slug>.jpg` into the repo is the whole job — no
 * code change — and an author with no photo falls back to the initial avatar
 * instead of shipping a broken <img>.
 *
 * Server-only (uses node:fs), so import it from .astro frontmatter, never
 * from a Vue island.
 */
import { existsSync } from 'node:fs';

const EXTENSIONS = ['webp', 'avif', 'jpg', 'jpeg', 'png'];

/**
 * @param {string} slug an author slug from src/data/authors.js
 * @returns {string | null} a site-absolute path, or null when no file exists
 */
export function authorPhoto(slug) {
  for (const ext of EXTENSIONS) {
    if (existsSync(new URL(`../../public/authors/${slug}.${ext}`, import.meta.url))) {
      return `/authors/${slug}.${ext}`;
    }
  }
  return null;
}

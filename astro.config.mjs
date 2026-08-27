// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/data/site.js';
import { contentLastmod } from './src/lib/content-dates.js';

export default defineConfig({
  site: SITE_URL,
  // Canonicals, internal links, and the sitemap must agree on one URL form.
  // Everything site-side is slashless; this makes the sitemap match.
  trailingSlash: 'never',
  /**
   * The half of the slashless contract that `trailingSlash` does not cover.
   *
   * `trailingSlash` governs how Astro routes and emits URLs; the file layout
   * comes from here, and the default ('directory') writes dist/about/index.html.
   * Cloudflare Pages derives each asset's canonical URL from that layout — a
   * directory with an index.html canonicalizes to '/about/', so it answered
   * /about with a 308 to /about/, contradicting the slashless canonical tag on
   * the page it eventually served.
   *
   * 'file' writes dist/about.html instead, so Pages canonicalizes the other
   * way: /about is 200, /about/ and /about.html both redirect to it. The root
   * stays dist/index.html and so stays '/'. Applies to every route, present and
   * future — there is nothing per-page to maintain.
   */
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    vue(),
    // The i18n block makes the sitemap emit xhtml:link alternates for
    // /x ↔ /es/x pairs automatically. Every built route is included, so a new
    // post or landing page needs no sitemap edit — only a build.
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      /**
       * Stamp blog posts and landing pages with the date their content really
       * changed (`updated`, else `date`). Pages with no honest date to give —
       * home, tool pages, /about — are left without one rather than handed the
       * build date. See src/lib/content-dates.js.
       */
      serialize(item) {
        const lastmod = contentLastmod.get(new URL(item.url).pathname.replace(/\/$/, ''));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

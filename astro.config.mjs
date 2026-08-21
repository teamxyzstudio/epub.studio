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

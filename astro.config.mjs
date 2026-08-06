// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/data/site.js';

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
    // /x ↔ /es/x pairs automatically.
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

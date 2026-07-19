import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = ['How-to', 'Formats explained', 'Typesetting', 'Kindle', 'Fix it'];

/**
 * Blog posts are Markdown files in src/content/blog. Everything the listing,
 * the article template, the RSS feed and the Article schema need comes from
 * this frontmatter — nothing about a post is hard-coded in a page.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Shown on the listing card and used as the meta description. */
    excerpt: z.string(),
    category: z.enum(CATEGORIES),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.object({
      name: z.string(),
      /** Single letter for the 38px avatar circle. */
      initial: z.string().length(1),
    }),
    /** Promotes the post to the horizontal featured card. At most one. */
    featured: z.boolean().default(false),
    /** Slugs from src/data/tools.js, rendered in the "Tools mentioned" card. */
    tools: z.array(z.string()).default([]),
    /**
     * Per-post social card, e.g. '/blog-og/<slug>.png'. Generated with
     * `node scripts/og-card.mjs` — falls back to the site-wide card if absent.
     * Not rendered inside the article (the design has no hero image).
     */
    ogImage: z.string().optional(),
    /** Overrides the word-count estimate when you want an exact figure. */
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

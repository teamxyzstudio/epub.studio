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

export const LANDING_TYPES = ['audience', 'comparison', 'pillar', 'variant'];

/**
 * Landing pages — the SEO program's four page types (audience, comparison,
 * pillar, variant). Flat URLs at the site root; every page is registered in
 * content-ops/keyword-map.csv and produced via .claude/skills/epub-landing-writer.
 *
 * The embedded tool runner is the page's proof: `embedTool` names a slug from
 * src/data/tools.js and the template mounts the real converter there.
 */
const landing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/landing' }),
  schema: z.object({
    title: z.string(),
    /** The h1; may differ from <title> for length. */
    h1: z.string(),
    /** Meta description, 140–160 chars. */
    excerpt: z.string(),
    type: z.enum(LANDING_TYPES),
    primaryKeyword: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    ogImage: z.string().optional(),
    /** Page language; en renders at /<slug>, others at /<locale>/<slug>. */
    locale: z.enum(['en', 'es']).default('en'),
    /** Tool slug whose runner embeds as the page's working proof. */
    embedTool: z.string().optional(),
    /** Overrides the drop-zone invitation line. */
    embedHeadline: z.string().optional(),
    /** Touch-phrased variant shown under 760px (defaults to the runner's). */
    embedHeadlineMobile: z.string().optional(),
    /** Widens the runner's accepted extensions when the engine allows it. */
    embedAccept: z.string().optional(),
    /** Overrides the drop-zone's mono format line (must match embedAccept). */
    embedDropSub: z.string().optional(),
    /** Tool slugs for the shelf grid (audience pages, rails elsewhere). */
    tools: z.array(z.string()).default([]),
    /** Blog post ids for the guides rail. */
    guides: z.array(z.string()).default([]),
    /** Pillar hubs: labeled clusters of blog post ids. */
    clusters: z
      .array(z.object({ label: z.string(), posts: z.array(z.string()) }))
      .default([]),
    /** Comparison pages: verified, dated claims. */
    comparison: z
      .object({
        competitor: z.string(),
        rows: z.array(
          z.object({ aspect: z.string(), us: z.string(), them: z.string() }),
        ),
        /** The honest "where the other tool is better" list — mandatory. */
        theirWins: z.array(z.string()).min(1),
        sources: z.array(
          z.object({ label: z.string(), url: z.string(), asOf: z.string() }),
        ),
      })
      .optional(),
    howToTitle: z.string().optional(),
    howTo: z.array(z.object({ t: z.string(), d: z.string() })).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, landing };

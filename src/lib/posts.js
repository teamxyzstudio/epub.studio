/**
 * Shared post helpers used by the listing, the article template and the RSS
 * feed, so all three agree on ordering, dates and read time.
 */
import { getCollection } from 'astro:content';

const WORDS_PER_MINUTE = 200;

/** Read time from the actual word count, unless frontmatter states one. */
export function readTime(post) {
  if (post.data.readTime) return post.data.readTime;
  const words = (post.body || '')
    .replace(/```[\s\S]*?```/g, '') // code blocks are not read at prose speed
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min`;
}

export const formatDate = (d) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** All published posts, newest first. Drafts are excluded outside dev. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date - a.data.date);
}

/** The plain shape the listing island renders. */
export const toCard = (post) => ({
  href: `/blog/${post.id}`,
  title: post.data.title,
  excerpt: post.data.excerpt,
  category: post.data.category,
  date: formatDate(post.data.date),
  readTime: readTime(post),
  /** Branded card PNG, doubling as the listing thumbnail. */
  image: post.data.ogImage || null,
});

/**
 * Headings for the sticky table of contents. Astro's `getHeadings()` returns
 * every level; the mock's TOC lists h2s only.
 */
export const tocFrom = (headings) =>
  headings.filter((h) => h.depth === 2).map((h) => ({ id: h.slug, label: h.text }));

/**
 * Heading for a post's steps recap, shared by the visible block, the TOC entry
 * and the HowTo markup so all three read the same. Posts that want different
 * wording set `howToTitle` in frontmatter.
 */
export const howToTitle = (data) => data.howToTitle || 'The steps, in short';

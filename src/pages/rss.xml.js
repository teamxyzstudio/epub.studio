import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts.js';
import { SITE_NAME, SITE_DESCRIPTION } from '../data/site.js';

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: `${SITE_NAME} — Blog`,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      author: post.data.author.name,
      categories: [post.data.category],
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}

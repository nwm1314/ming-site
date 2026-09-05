import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

import { site } from '../config/site';
import { getProfile, getPublicPosts } from '../lib/content';

export const GET: APIRoute = async () => {
  const posts = await getPublicPosts();
  const profile = await getProfile();

  return rss({
    title: profile.data.seo.title,
    description: profile.data.seo.description,
    site: site.siteUrl,
    trailingSlash: false,
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}`,
      categories: [post.data.category, ...post.data.tags],
    })),
  });
};

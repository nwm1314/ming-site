import { getCollection, type CollectionEntry } from 'astro:content';

import { getPostsForTaxonomy, isPublicPost } from './content/rules';

export * from './content/rules';

export type PostEntry = CollectionEntry<'posts'>;
export const BLOG_PAGE_SIZE = 8;

export async function getPublicPosts(now = new Date()) {
  const entries = await getCollection('posts', (post) => isPublicPost(post, now));
  return entries.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export async function getPublicPostsByTaxonomy(kind: 'category' | 'tag', slug: string, now = new Date()) {
  return getPostsForTaxonomy(await getPublicPosts(now), kind, slug);
}

export async function getFeaturedProjects() {
  const entries = await getCollection('projects', ({ data }) => data.featured);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublicMoments() {
  const entries = await getCollection('moments', ({ data }) => data.visibility === 'public');
  return entries.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

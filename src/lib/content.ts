import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import { getPostsForTaxonomy, getPageCount, isPublicMoment, isPublicPost, paginatePosts } from './content/rules';

export * from './content/rules';

export type PostEntry = CollectionEntry<'posts'>;
export const BLOG_PAGE_SIZE = 8;

export { getPageCount, paginatePosts };

export async function getProfile() {
  const profile = await getEntry('profile', 'ming');
  if (!profile) throw new Error('The profile content entry is missing.');
  return profile;
}

export async function getCurrentNow() {
  const current = await getEntry('now', 'current');
  if (!current) throw new Error('The current now content entry is missing.');
  return current;
}

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
  const entries = await getCollection('moments', isPublicMoment);
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

export function formatDotDate(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll('-', '.');
}

import { getCollection } from 'astro:content';

export async function getPublicPosts() {
  const entries = await getCollection('posts', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
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

export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

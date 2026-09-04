import type { APIRoute } from 'astro';

import { site } from '../config/site';

export const GET: APIRoute = () => {
  if (!site.indexable) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const sitemapUrl = new URL('/sitemap-index.xml', site.siteUrl).toString();

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

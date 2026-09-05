const FALLBACK_SITE_URL = 'http://localhost:4321';
type BuildEnv = Record<string, string | undefined>;

const viteEnv = (import.meta as ImportMeta & { env?: BuildEnv }).env;
const buildEnv = typeof process === 'undefined' ? (viteEnv ?? {}) : process.env;

function resolveSiteUrl(value: string | undefined) {
  if (!value?.trim()) return FALLBACK_SITE_URL;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:')
      return FALLBACK_SITE_URL;
    return url.toString().replace(/\/$/, '');
  } catch {
    return FALLBACK_SITE_URL;
  }
}

const buildSiteUrl = resolveSiteUrl(buildEnv.SITE_URL);
const buildIsIndexable =
  buildEnv.SITE_INDEXABLE?.trim().toLowerCase() === 'true';

export const site = {
  siteUrl: buildSiteUrl,
  indexable: buildIsIndexable,
  defaults: {
    theme: 'system' as const,
    ogImage: '/favicon.svg',
  },
};

export type Theme = (typeof site.defaults)['theme'] | 'light' | 'dark';

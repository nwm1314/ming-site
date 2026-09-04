const FALLBACK_SITE_URL = 'http://localhost:4321';
type BuildEnv = Record<string, string | undefined>;

const viteEnv = (import.meta as ImportMeta & { env?: BuildEnv }).env;
const buildEnv = viteEnv ?? (typeof process === 'undefined' ? {} : process.env);

function resolveSiteUrl(value: string | undefined) {
  if (!value?.trim()) return FALLBACK_SITE_URL;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return FALLBACK_SITE_URL;
    return url.toString().replace(/\/$/, '');
  } catch {
    return FALLBACK_SITE_URL;
  }
}

const buildSiteUrl = resolveSiteUrl(buildEnv.SITE_URL);
const buildIsIndexable = buildEnv.SITE_INDEXABLE?.trim().toLowerCase() === 'true';

export const site = {
  siteUrl: buildSiteUrl,
  indexable: buildIsIndexable,
  siteName: 'Ming',
  title: 'Ming — curious things, carefully made',
  description:
    '一个有生活感、有技术味、可长期生长的个人数字空间。记录正在构建的东西，也记录路上遇见的风。',
  author: 'Ming',
  avatar: {
    src: '',
    alt: 'Ming 的头像占位',
    fallback: 'M',
  },
  hero: {
    eyebrow: 'personal digital space · 01',
    name: 'Ming',
    role: '把好奇心做成可以打开的东西。',
    bio: '在代码、网络和一点点生活观察之间来回切换。这里是我的工作台：放项目，也放还没想明白的念头。',
    status: 'currently building in public',
  },
  now: {
    building: 'ming-site / 一个会慢慢长大的个人主页',
    exploring: 'AI coding、轻量自动化，还有更好的个人工作流',
    learning: '如何把复杂的东西讲得像一张清楚的便签',
    updatedAt: '2026.09.04',
  },
  defaults: {
    theme: 'system' as const,
    ogImage: '/favicon.svg',
  },
};

export type Theme = (typeof site.defaults)['theme'] | 'light' | 'dark';

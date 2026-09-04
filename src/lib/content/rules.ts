export interface PublicPostLike {
  id: string;
  data: {
    title: string;
    description: string;
    publishDate: Date;
    updatedDate?: Date;
    draft: boolean;
    category: string;
    tags: string[];
    series?: string;
    canonical?: string | URL;
    toc?: boolean;
    cover?: string;
    coverAlt?: string;
  };
  body?: string;
}

export interface TaxonomyTerm {
  displayName: string;
  slug: string;
  count: number;
}

const CJK_RANGES = /[\u1100-\u11ff\u2e80-\u2fff\u3040-\u30ff\u3130-\u318f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/g;
const LATIN_WORD = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’.-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g;

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---/m, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*(?:[-*+] |\d+\. )/gm, '')
    .replace(/^\s*(?:[-*_]){3,}\s*$/gm, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Estimate reading time using CJK characters/minute and Latin words/minute. */
export function readingTime(markdown: string) {
  const plainText = stripMarkdown(markdown);
  if (!plainText) return 1;

  const cjkCharacters = plainText.match(CJK_RANGES)?.length ?? 0;
  const latinWords = plainText.replace(CJK_RANGES, ' ').match(LATIN_WORD)?.length ?? 0;
  const estimatedMinutes = cjkCharacters / 350 + latinWords / 220;

  return Math.max(1, Math.ceil(estimatedMinutes));
}

/** One shared rule for every production-facing post query. */
export function isPublicPost(post: Pick<PublicPostLike, 'data'>, now = new Date()) {
  return !post.data.draft && post.data.publishDate.valueOf() <= now.valueOf();
}

export function getPageCount(totalItems: number, pageSize: number) {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }

  return Math.ceil(Math.max(0, totalItems) / pageSize);
}

export function paginatePosts<T>(posts: T[], page: number, pageSize: number) {
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }

  const totalPages = getPageCount(posts.length, pageSize);
  const start = (page - 1) * pageSize;

  return {
    page,
    totalPages,
    posts: posts.slice(start, start + pageSize),
  };
}

export function normalizeTaxonomyName(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

/** Preserve CJK names while making ASCII terms compact and URL-safe. */
export function slugifyTaxonomy(value: string) {
  const normalized = normalizeTaxonomyName(value).toLocaleLowerCase();

  return normalized
    .replace(/[/?#%&\\]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function taxonomyHref(kind: 'category' | 'tag', slug: string) {
  return `/blog/${kind}/${encodeURIComponent(slug)}`;
}

export function decodeTaxonomyParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getTaxonomyTerms<T extends PublicPostLike>(posts: T[], kind: 'category' | 'tag') {
  const terms = new Map<string, TaxonomyTerm>();

  for (const post of posts) {
    const names = kind === 'category' ? [post.data.category] : post.data.tags;
    for (const rawName of names) {
      const displayName = normalizeTaxonomyName(rawName);
      const slug = slugifyTaxonomy(displayName);
      if (!displayName || !slug) continue;

      const existing = terms.get(slug);
      if (existing) existing.count += 1;
      else terms.set(slug, { displayName, slug, count: 1 });
    }
  }

  return [...terms.values()].sort(
    (a, b) => b.count - a.count || a.displayName.localeCompare(b.displayName, 'zh-CN'),
  );
}

export function getPostsForTaxonomy<T extends PublicPostLike>(posts: T[], kind: 'category' | 'tag', slug: string) {
  const target = slugifyTaxonomy(decodeTaxonomyParam(slug));

  return posts.filter((post) => {
    const names = kind === 'category' ? [post.data.category] : post.data.tags;
    return names.some((name) => slugifyTaxonomy(name) === target);
  });
}

export function getAdjacentPosts<T extends PublicPostLike>(posts: T[], currentId: string) {
  const index = posts.findIndex((post) => post.id === currentId);
  return {
    // The archive is newest first, so Previous means newer and Next means older.
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getRelatedPosts<T extends PublicPostLike>(current: T, posts: T[], limit = 3) {
  const currentTags = new Set(current.data.tags.map((tag) => slugifyTaxonomy(tag)));

  return posts
    .filter((post) => post.id !== current.id && isPublicPost(post))
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag) => currentTags.has(slugifyTaxonomy(tag))).length;
      const sameCategory = slugifyTaxonomy(post.data.category) === slugifyTaxonomy(current.data.category);
      const sameSeries = Boolean(current.data.series && post.data.series === current.data.series);
      const score = sharedTags * 2 + (sameCategory ? 3 : 0) + (sameSeries ? 4 : 0);

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.data.publishDate.valueOf() - a.post.data.publishDate.valueOf(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

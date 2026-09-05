import { expect, test } from '@playwright/test';

import {
  getAdjacentPosts,
  getPageCount,
  getRelatedPosts,
  isPublicMoment,
  isPublicPost,
  paginatePosts,
  readingTime,
  slugifyTaxonomy,
  type PublicPostLike,
} from '../../src/lib/content/rules';
import { isNavigationActive } from '../../src/lib/navigation';
import { fixturePosts } from '../fixtures/posts';

function post(id: string, overrides: Partial<PublicPostLike['data']> = {}): PublicPostLike {
  return {
    id,
    data: {
      title: id,
      description: id,
      publishDate: new Date('2026-09-01T00:00:00Z'),
      draft: false,
      category: 'Build',
      tags: ['astro', 'notes'],
      toc: true,
      ...overrides,
    },
  };
}

test.describe('content rules', () => {
  test('estimates Chinese, English, mixed, markdown and empty content', () => {
    expect(readingTime('中'.repeat(350))).toBe(1);
    expect(readingTime('word '.repeat(440))).toBe(2);
    expect(readingTime(`${'中'.repeat(350)} ${'word '.repeat(220)}`)).toBe(2);
    expect(readingTime('# Heading\n\n**A short note** with [a link](https://example.com).')).toBe(1);
    expect(readingTime('')).toBe(1);
  });

  test('only marks non-draft posts up to the build time as public', () => {
    const now = new Date('2026-09-04T12:00:00Z');
    expect(isPublicPost(post('past'), now)).toBe(true);
    expect(isPublicPost(post('draft', { draft: true }), now)).toBe(false);
    expect(isPublicPost(post('future', { publishDate: new Date('2026-09-05T00:00:00Z') }), now)).toBe(false);
  });

  test('only marks explicitly public moments as public', () => {
    expect(isPublicMoment({ data: { visibility: 'public' } })).toBe(true);
    expect(isPublicMoment({ data: { visibility: 'unlisted' } })).toBe(false);
  });

  test('normalizes URL-safe ASCII and CJK taxonomy names', () => {
    expect(slugifyTaxonomy(' AI Coding & 工具 ')).toBe('ai-coding-工具');
    expect(slugifyTaxonomy('中文 Tag')).toBe('中文-tag');
  });

  test('activates Blog for nested routes without making Home a catch-all', () => {
    expect(isNavigationActive('/blog/tag/astro', '/blog')).toBe(true);
    expect(isNavigationActive('/blog', '/')).toBe(false);
    expect(isNavigationActive('/', '/')).toBe(true);
  });

  test('returns newer Previous and older Next posts', () => {
    const posts = [
      post('newest', { publishDate: new Date('2026-09-04') }),
      post('current', { publishDate: new Date('2026-09-03') }),
      post('oldest', { publishDate: new Date('2026-09-02') }),
    ];
    expect(getAdjacentPosts(posts, 'current')).toMatchObject({ previous: { id: 'newest' }, next: { id: 'oldest' } });
  });

  test('scores related public posts and excludes current, draft and future posts', () => {
    const current = post('current', { series: 'astro-notes' });
    const sameContext = post('same-context', { series: 'astro-notes' });
    const sharedTag = post('shared-tag', { category: 'Notes', tags: ['astro'] });
    const draft = post('draft', { draft: true });
    const future = post('future', { publishDate: new Date('2099-01-01') });

    expect(getRelatedPosts(current, [current, sameContext, sharedTag, draft, future]).map(({ id }) => id)).toEqual([
      'same-context',
      'shared-tag',
    ]);
  });

  test('paginates boundary-sized collections without needing production fixtures', () => {
    const cases = [
      { count: 0, pages: 0 },
      { count: 1, pages: 1 },
      { count: 8, pages: 1 },
      { count: 9, pages: 2 },
      { count: 16, pages: 2 },
      { count: 17, pages: 3 },
    ];

    for (const { count, pages } of cases) {
      const posts = fixturePosts(count);
      expect(getPageCount(posts.length, 8)).toBe(pages);
      expect(paginatePosts(posts, 1, 8).posts).toHaveLength(Math.min(count, 8));

      if (pages > 1) {
        expect(paginatePosts(posts, pages, 8).posts).toHaveLength(count % 8 || 8);
      }
    }
  });
});

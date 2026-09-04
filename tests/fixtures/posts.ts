import type { PublicPostLike } from '../../src/lib/content/rules';

export function fixturePosts(count: number): PublicPostLike[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `fixture-${index + 1}`,
    data: {
      title: `Fixture ${index + 1}`,
      description: 'Pagination fixture',
      publishDate: new Date(Date.UTC(2026, 8, 1) - index * 86_400_000),
      draft: false,
      category: 'Test',
      tags: ['fixture'],
      toc: false,
    },
  }));
}

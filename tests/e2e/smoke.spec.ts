import { expect, test } from '@playwright/test';

test('home and theme switch are usable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ming/);
  await expect(page.locator('h1')).toContainText('Ming');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile menu opens and exposes navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('[data-mobile-menu]')).toBeVisible();
  await expect(page.locator('[data-mobile-menu] a').first()).toBeVisible();
});

test('blog index and second page render public posts', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('h1')).toContainText('Blog');
  await expect(page.locator('.post-row')).toHaveCount(8);
  await page.goto('/blog/page/2');
  await expect(page.locator('.post-row')).toHaveCount(1);
  await expect(page.locator('.pagination-status')).toContainText('02 / 02');
});

test('article detail includes metadata, toc and code copy control', async ({ page }) => {
  await page.goto('/blog/static-first');
  await expect(page.locator('h1')).toContainText('先把页面做轻');
  await expect(page.locator('.article-toc')).toBeVisible();
  await expect(page.locator('.code-copy')).toBeVisible();
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(1);
});

test('category and tag routes expose filtered lists', async ({ page }) => {
  await page.goto('/blog/category/build');
  await expect(page.locator('h1')).toContainText('Build');
  await expect(page.locator('.post-row')).not.toHaveCount(0);
  await page.goto('/blog/tag/astro');
  await expect(page.locator('h1')).toContainText('#astro');
  await expect(page.locator('.post-row')).not.toHaveCount(0);
});

test('search returns Pagefind results', async ({ page }) => {
  await page.goto('/search');
  await page.locator('#search-input').fill('Astro');
  await page.locator('[data-search-form]').locator('button').click();
  await expect(page.locator('.search-result').first()).toBeVisible();
  await expect(page.locator('[data-search-status]')).toContainText('找到');
});

test('unknown routes use the designed 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('这页走丢了');
});

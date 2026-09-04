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
  const menuButton = page.locator('[data-menu-toggle]');
  const mobileMenu = page.locator('[data-mobile-menu]');

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAccessibleName('Open menu');
  await menuButton.focus();
  await page.keyboard.press('Enter');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menuButton).toHaveAccessibleName('Close menu');
  await expect(mobileMenu).toBeVisible();
  await expect(mobileMenu.locator('a').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAccessibleName('Open menu');
  await expect(mobileMenu).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test('blog index renders the current public posts without fixture-dependent pagination', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('h1')).toContainText('Blog');
  await expect(page.locator('.post-row')).toHaveCount(2);
  await expect(page.locator('.pagination')).toHaveCount(0);
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
  await expect(page).toHaveURL(/\/search\/?\?q=Astro$/);
  await expect(page.locator('.search-result').first()).toBeVisible();
  await expect(page.locator('[data-search-status]')).toContainText('找到');
  await expect(page.locator('.search-result')).not.toHaveCount(0);
  await expect(page.locator('.search-result[href="/blog/static-first/"]')).toBeVisible();

  await page.locator('#search-input').fill('qzzzznoresult');
  await page.locator('[data-search-form]').locator('button').click();
  await expect(page.locator('[data-search-status]')).toContainText('没有找到');
  await expect(page.locator('.search-result')).toHaveCount(0);
});

test('staging pages and robots are not indexable by default', async ({ page, request }) => {
  await page.goto('/blog');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
});

test('unknown routes use the designed 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('这页走丢了');
});

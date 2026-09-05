import { expect, test } from '@playwright/test';

test('home and theme switch are usable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ming/);
  await expect(page.locator('h1')).toContainText('Ming');
  await expect(page.locator('.brand-mark')).toHaveText('M');
  await expect(page.locator('.brand-word')).toHaveText('Ming.');
  await expect(page.locator('.hero-role')).toContainText('把好奇心做成能跑起来的东西');
  await expect(page.locator('.avatar-card img')).toHaveAttribute('alt', 'Ming 的头像');
  await expect(page.locator('a[href="https://github.com/nwm1314"]').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('hello@example.com');
  await expect(page.locator('body')).not.toContainText('avatar coming soon');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('homepage shows the real featured projects and now content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('.project-card').nth(0)).toContainText('智能保险推荐引擎');
  await expect(page.locator('.project-card').nth(1)).toContainText('赛博命理');
  await expect(page.locator('.now-item')).toHaveCount(3);
  await expect(page.locator('.now-board')).toContainText('个人 VPS 运维面板');
  await expect(page.locator('.now-board')).toContainText('金融投资、AI');
});

test('about exposes configured identity and contact links', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toContainText('About');
  await expect(page.locator('.about-large')).toContainText('Hi，我是 Ming');
  await expect(page.locator('.about-page a[href="mailto:416070520@qq.com"]')).toBeVisible();
  await expect(page.locator('a[href="https://github.com/nwm1314"]').first()).toBeVisible();
  await expect(page.locator('.about-notes')).toContainText('AI & Agents');
});

test('project detail exposes the verified source and demo links', async ({ page }) => {
  await page.goto('/projects/insurance-recommendation');
  await expect(page.locator('h1')).toContainText('智能保险推荐引擎');
  await expect(page.locator('a[href="https://github.com/nwm1314/insurance-recommendation"]')).toContainText('Source');
  await expect(page.locator('a[href="https://insurance.nwmnow.com/"]')).toContainText('Live Demo');

  await page.goto('/projects/cyber-divination');
  await expect(page.locator('a[href="http://bazi.nwmnow.com/"]')).toContainText('Live Demo');
});

test('Blog and Projects intros keep headings clear of their descriptions', async ({ page }) => {
  for (const route of ['/blog', '/projects']) {
    await page.goto(route);
    const headingBox = await page.locator('.page-intro h1').boundingBox();
    const descriptionBox = await page.locator('.page-intro > p:last-child').boundingBox();
    expect(headingBox).not.toBeNull();
    expect(descriptionBox).not.toBeNull();
    expect(descriptionBox?.y ?? 0).toBeGreaterThan((headingBox?.y ?? 0) + (headingBox?.height ?? 0));
  }

  await page.goto('/projects');
  const cards = page.locator('.page-project-grid .project-card');
  await expect(cards).toHaveCount(3);
  const firstCard = await cards.nth(0).boundingBox();
  const secondCard = await cards.nth(1).boundingBox();
  expect(firstCard).not.toBeNull();
  expect(secondCard).not.toBeNull();
  expect(Math.abs((firstCard?.width ?? 0) - (secondCard?.width ?? 0))).toBeLessThan(2);
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

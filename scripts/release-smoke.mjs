import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDirectory = join(projectRoot, 'dist');
const testOrigin = 'https://release.example.test';
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

function run(command, args, env = process.env) {
  const executable = process.platform === 'win32' ? process.env.ComSpec ?? 'cmd.exe' : command;
  const executableArgs = process.platform === 'win32' ? ['/d', '/s', '/c', [command, ...args].join(' ')] : args;
  const result = spawnSync(executable, executableArgs, {
    cwd: projectRoot,
    env,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed.`);
}

function readDist(path) {
  return readFileSync(join(distDirectory, path), 'utf8');
}

function htmlFiles(directory = distDirectory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

function assertNoKnownPlaceholders() {
  const generatedHtml = htmlFiles().map((path) => readFileSync(path, 'utf8')).join('\n');
  for (const value of ['hello@example.com', 'avatar coming soon', 'Phase 1 placeholder identity', 'desk-notes', 'coming-soon']) {
    assert.equal(generatedHtml.includes(value), false, `Generated output contains forbidden placeholder: ${value}`);
  }
  assert.equal(generatedHtml.includes('localhost'), false, 'Generated output contains localhost.');
}

function assertPagefindScope() {
  const entryPath = join(distDirectory, 'pagefind', 'pagefind-entry.json');
  assert.ok(existsSync(entryPath), 'Pagefind entry metadata is missing.');
  const pagefind = JSON.parse(readFileSync(entryPath, 'utf8'));
  const indexedPages = htmlFiles().filter((path) => readFileSync(path, 'utf8').includes('data-pagefind-body'));
  const pageCount = Object.values(pagefind.languages).reduce((total, language) => total + language.page_count, 0);
  assert.equal(pageCount, indexedPages.length, 'Pagefind count must match opted-in HTML pages.');
  assert.ok(indexedPages.length > 0, 'Pagefind must index public article detail pages.');
  for (const path of indexedPages) {
    const route = relative(distDirectory, path).replaceAll('\\', '/');
    assert.match(route, /^blog\/[^/]+\/index\.html$/, `Pagefind indexed a non-article route: ${route}`);
  }
  assert.equal(readDist('search/index.html').includes('data-pagefind-body'), false);
  assert.equal(readDist('admin/index.html').includes('data-pagefind-body'), false);
}

function assertReleaseOutput({ indexable }) {
  const home = readDist('index.html');
  const search = readDist('search/index.html');
  const notFound = readDist('404.html');
  const admin = readDist('admin/index.html');
  const robots = readDist('robots.txt');
  const rss = readDist('rss.xml');
  const sitemapIndex = readDist('sitemap-index.xml');
  const sitemap = readDist('sitemap-0.xml');

  assert.match(home, new RegExp(`${testOrigin.replaceAll('.', '\\.')}\/images\/ming-og\\.webp`));
  assert.doesNotMatch(home, /og:image" content="[^"]*favicon\.svg/);
  assert.match(home, /name="twitter:card" content="summary_large_image"/);
  assert.match(home, /property="og:image:alt"/);
  assert.equal(home.includes('noindex, nofollow'), !indexable, 'Public page indexing boundary is incorrect.');

  assert.match(search, /name="robots" content="noindex, nofollow"/);
  assert.match(notFound, /name="robots" content="noindex, nofollow"/);
  assert.match(admin, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(sitemapIndex, /\/admin|\/search|\/404/);
  assert.doesNotMatch(sitemap, /\/admin|\/search|\/404/);

  if (indexable) {
    assert.match(robots, /User-agent: \*\nAllow: \/\nSitemap: https:\/\/release\.example\.test\/sitemap-index\.xml/);
  } else {
    assert.match(robots, /User-agent: \*\nDisallow: \/\n/);
  }

  assert.match(rss, /^<\?xml[^>]+><rss[\s\S]*<\/rss>$/);
  assert.match(rss, /你好，这里是我的数字工作台/);
  assert.match(rss, /先把页面做轻，再给它更多能力/);
  assert.doesNotMatch(rss, /draft-note|future/);
  assert.ok(statSync(join(projectRoot, 'public/images/ming-og.webp')).size > 1000, 'Default OG image is empty.');
  assertPagefindScope();
  assertNoKnownPlaceholders();
}

function build(indexable) {
  run(pnpmCommand, ['build'], {
    ...process.env,
    SITE_URL: testOrigin,
    SITE_INDEXABLE: String(indexable),
  });
}

build(false);
assertReleaseOutput({ indexable: false });

try {
  build(true);
  assertReleaseOutput({ indexable: true });
} finally {
  build(false);
}

console.log('Release smoke passed for staging and production indexing modes.');

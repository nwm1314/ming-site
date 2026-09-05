import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDirectory = join(projectRoot, 'dist');
const configuredSiteUrl = process.env.SITE_URL?.trim() || 'http://localhost:4321';
const siteUrl = new URL(configuredSiteUrl.endsWith('/') ? configuredSiteUrl : `${configuredSiteUrl}/`);

function htmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

function routeForHtml(path) {
  const route = relative(distDirectory, path).replaceAll('\\', '/');
  if (route === 'index.html') return '/';
  if (route.endsWith('/index.html')) return `/${route.slice(0, -'index.html'.length)}`;
  return `/${route}`;
}

function candidateFiles(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  const relativePath = decodedPath.replace(/^\/+/, '');
  if (!relativePath) return [join(distDirectory, 'index.html')];
  if (relativePath.split('/').some((segment) => segment === '..')) return [];
  if (relativePath.replace(/\/+$/, '') === '404') return [join(distDirectory, '404.html')];

  const direct = join(distDirectory, relativePath);
  const candidates = [direct];
  if (decodedPath.endsWith('/')) candidates.unshift(join(direct, 'index.html'));
  else candidates.push(join(direct, 'index.html'), `${direct}.html`);
  return candidates;
}

function localTarget(value, sourcePath) {
  const sourceUrl = new URL(routeForHtml(sourcePath), siteUrl);
  if (!value || value.startsWith('#')) return null;
  if (/^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(value)) return null;

  let target;
  try {
    target = new URL(value, sourceUrl);
  } catch {
    return { reason: 'invalid URL' };
  }

  if (!['http:', 'https:'].includes(target.protocol)) return null;
  if (target.origin !== siteUrl.origin) return null;
  return target;
}

const missing = [];
const referencePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
const files = htmlFiles(distDirectory);
assert.ok(files.length > 0, 'dist must exist before running the internal link check.');

for (const sourcePath of files) {
  const source = readFileSync(sourcePath, 'utf8');
  for (const match of source.matchAll(referencePattern)) {
    const value = match[1];
    const target = localTarget(value, sourcePath);
    if (!target || 'reason' in target) {
      if (target?.reason) missing.push(`${relative(projectRoot, sourcePath)} -> ${value} (${target.reason})`);
      continue;
    }

    if (!candidateFiles(target.pathname).some((candidate) => existsSync(candidate))) {
      missing.push(`${relative(projectRoot, sourcePath)} -> ${value}`);
    }
  }
}

assert.equal(missing.length, 0, `Internal link check found missing local targets:\n${missing.join('\n')}`);
console.log(`Internal link check passed across ${files.length} generated HTML files.`);

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const adminPath = join(projectRoot, 'public', 'admin');
const configPath = join(adminPath, 'config.yml');
const adminHtmlPath = join(adminPath, 'index.html');
const configText = readFileSync(configPath, 'utf8');
const config = parse(configText);
const adminHtml = readFileSync(adminHtmlPath, 'utf8');
const contentSource = readFileSync(join(projectRoot, 'src', 'lib', 'content.ts'), 'utf8');

function field(fields, name) {
  const result = fields.find((item) => item.name === name);
  assert.ok(result, `Missing CMS field: ${name}`);
  return result;
}

function fieldNames(fields) {
  return new Set(fields.filter((item) => item.name).map((item) => item.name));
}

function htmlFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

assert.equal(config.backend?.name, 'github');
assert.equal(config.backend?.repo, 'nwm1314/ming-site');
assert.equal(config.backend?.branch, 'main');
assert.equal(config.backend?.auth_scope, 'public_repo');
assert.equal(config.publish_mode, 'simple');
assert.equal(config.media_folder, 'public/uploads');
assert.equal(config.public_folder, '/uploads');
assert.equal(config.output?.omit_empty_optional_fields, true);
assert.match(adminHtml, /@sveltia\/cms@0\.205\.4\/dist\/sveltia-cms\.js/);
assert.match(adminHtml, /<meta name="robots" content="noindex, nofollow"\s*\/>/);
assert.match(configText, /@sveltia\/cms@0\.205\.4\/schema\/sveltia-cms\.json/);
assert.ok(!/(?:token|secret|password)\s*:/i.test(configText), 'CMS config must not contain credentials.');

const singletonByName = new Map(config.singletons.map((item) => [item.name, item]));
assert.deepEqual([...singletonByName.keys()], ['profile', 'now']);
for (const singleton of singletonByName.values()) {
  assert.ok(existsSync(join(projectRoot, singleton.file)), `Missing singleton file: ${singleton.file}`);
  assert.equal(singleton.format, 'yaml-frontmatter');
  assert.equal(singleton.extension, 'md');
}

const profileFields = singletonByName.get('profile').fields;
assert.deepEqual([...fieldNames(profileFields)], [
  'displayName',
  'tagline',
  'bio',
  'status',
  'avatar',
  'contacts',
  'aboutIntro',
  'care',
  'seo',
]);
const avatarFields = field(profileFields, 'avatar').fields;
assert.deepEqual([...fieldNames(avatarFields)], ['src', 'alt', 'width', 'height', 'fallback']);
const contactFields = field(profileFields, 'contacts').fields;
assert.deepEqual([...fieldNames(contactFields)], ['github', 'email', 'telegram', 'x', 'website', 'wechatQr']);
assert.equal(field(profileFields, 'care').widget, 'list');
assert.equal(field(profileFields, 'seo').widget, 'object');

const nowFields = singletonByName.get('now').fields;
assert.deepEqual([...fieldNames(nowFields)], ['updatedAt', 'building', 'exploring', 'learning']);
for (const name of ['building', 'exploring', 'learning']) {
  const section = field(nowFields, name);
  assert.equal(section.widget, 'object');
  assert.deepEqual([...fieldNames(section.fields)], ['label', 'text']);
}

const collections = new Map(config.collections.map((item) => [item.name, item]));
const expectedFolders = {
  posts: 'src/content/posts',
  projects: 'src/content/projects',
  uses: 'src/content/uses',
  moments: 'src/content/moments',
  gallery: 'src/content/gallery',
  timeline: 'src/content/timeline',
};
assert.deepEqual([...collections.keys()], Object.keys(expectedFolders));
for (const [name, folder] of Object.entries(expectedFolders)) {
  const collection = collections.get(name);
  assert.equal(collection.folder, folder);
  assert.equal(collection.format, 'yaml-frontmatter');
  assert.equal(collection.extension, 'md');
  assert.ok(existsSync(join(projectRoot, folder)), `Missing content path: ${folder}`);
}

const posts = collections.get('posts');
assert.equal(field(posts.fields, 'draft').default, true);
assert.equal(field(posts.fields, 'body').widget, 'markdown');
assert.equal(posts.preview_path, '/blog/{{slug}}');

const projects = collections.get('projects');
assert.deepEqual(field(projects.fields, 'status').options.map((item) => item.value), [
  'idea',
  'building',
  'maintaining',
  'paused',
  'archived',
]);
assert.equal(field(projects.fields, 'body').widget, 'markdown');

const moments = collections.get('moments');
assert.equal(field(moments.fields, 'visibility').default, 'unlisted');
assert.equal(field(moments.fields, 'body').widget, 'markdown');

assert.match(contentSource, /getEntry\('profile', 'ming'\)/);
assert.match(contentSource, /getEntry\('now', 'current'\)/);

const pagefindEntryPath = join(projectRoot, 'dist', 'pagefind', 'pagefind-entry.json');
if (existsSync(pagefindEntryPath)) {
  const indexedHtml = htmlFiles(join(projectRoot, 'dist')).filter((path) => {
    return readFileSync(path, 'utf8').includes('data-pagefind-body');
  });
  const pagefind = JSON.parse(readFileSync(pagefindEntryPath, 'utf8'));
  const pageCount = Object.values(pagefind.languages).reduce((total, language) => total + language.page_count, 0);
  assert.equal(pageCount, indexedHtml.length, 'Pagefind must index only pages with data-pagefind-body.');
  assert.equal(readFileSync(join(projectRoot, 'dist', 'admin', 'index.html'), 'utf8').includes('data-pagefind-body'), false);
}

console.log('CMS config, content paths, singleton guards, and admin security markers are valid.');

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const contentRoot = join(projectRoot, 'src', 'content');
const projectStatuses = new Set(['idea', 'building', 'maintaining', 'paused', 'archived']);

function contentFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return contentFiles(path);
    return /\.(md|mdx)$/.test(entry.name) ? [path] : [];
  });
}

function readFrontmatter(path) {
  const source = readFileSync(path, 'utf8');
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, `${relative(projectRoot, path)} must start with YAML frontmatter.`);

  const data = parse(match[1]);
  assert.ok(data && typeof data === 'object' && !Array.isArray(data), `${relative(projectRoot, path)} has invalid frontmatter.`);
  return data;
}

function label(path) {
  return relative(projectRoot, path).replaceAll('\\', '/');
}

function requiredText(value, field, path) {
  assert.equal(typeof value, 'string', `${label(path)}: ${field} must be text.`);
  assert.ok(value.trim(), `${label(path)}: ${field} cannot be empty.`);
}

function optionalText(value, field, path) {
  if (value !== undefined && value !== null) requiredText(value, field, path);
}

function validDate(value, field, path) {
  assert.ok(value !== undefined && value !== null, `${label(path)}: ${field} is required.`);
  assert.equal(Number.isNaN(new Date(value).valueOf()), false, `${label(path)}: ${field} must be a valid date.`);
}

function validUrl(value, field, path) {
  if (value === undefined || value === null || value === '') return;
  requiredText(value, field, path);
  const url = new URL(value);
  assert.ok(['http:', 'https:'].includes(url.protocol), `${label(path)}: ${field} must use http or https.`);
}

function nonEmptyList(value, field, path) {
  if (value === undefined || value === null) return;
  assert.ok(Array.isArray(value), `${label(path)}: ${field} must be a list.`);
  value.forEach((item, index) => requiredText(item, `${field}[${index}]`, path));
}

function validatePosts() {
  for (const path of contentFiles(join(contentRoot, 'posts'))) {
    const data = readFrontmatter(path);
    requiredText(data.title, 'title', path);
    requiredText(data.description, 'description', path);
    validDate(data.publishDate, 'publishDate', path);
    if (data.updatedDate !== undefined) validDate(data.updatedDate, 'updatedDate', path);
    if (data.draft !== undefined) assert.equal(typeof data.draft, 'boolean', `${label(path)}: draft must be boolean.`);
    optionalText(data.category, 'category', path);
    nonEmptyList(data.tags, 'tags', path);
    optionalText(data.cover, 'cover', path);
    if (data.cover !== undefined && data.cover !== '') requiredText(data.coverAlt, 'coverAlt', path);
    validUrl(data.canonical, 'canonical', path);
  }
}

function validateProjects() {
  const featuredOrders = new Map();

  for (const path of contentFiles(join(contentRoot, 'projects'))) {
    const data = readFrontmatter(path);
    requiredText(data.title, 'title', path);
    requiredText(data.summary, 'summary', path);
    optionalText(data.description, 'description', path);
    assert.ok(projectStatuses.has(data.status), `${label(path)}: status must be one of ${[...projectStatuses].join(', ')}.`);
    if (data.statusLabel !== undefined) optionalText(data.statusLabel, 'statusLabel', path);
    nonEmptyList(data.stack, 'stack', path);
    for (const field of ['repo', 'demo', 'homepage']) validUrl(data[field], field, path);

    const order = data.order ?? 0;
    assert.equal(Number.isInteger(order) && order >= 0, true, `${label(path)}: order must be a non-negative integer.`);
    if (data.featured === true) {
      assert.equal(featuredOrders.has(order), false, `${label(path)}: featured projects must have unique order values; ${order} is already used by ${featuredOrders.get(order)}.`);
      featuredOrders.set(order, label(path));
    }
  }
}

function validateMoments() {
  for (const path of contentFiles(join(contentRoot, 'moments'))) {
    const data = readFrontmatter(path);
    validDate(data.publishDate, 'publishDate', path);
    nonEmptyList(data.tags, 'tags', path);
    optionalText(data.image, 'image', path);
    optionalText(data.location, 'location', path);
    assert.ok(['public', 'unlisted'].includes(data.visibility ?? 'unlisted'), `${label(path)}: visibility must be public or unlisted.`);
  }
}

function validateGallery() {
  for (const path of contentFiles(join(contentRoot, 'gallery'))) {
    const data = readFrontmatter(path);
    requiredText(data.title, 'title', path);
    requiredText(data.image, 'image', path);
    requiredText(data.alt, 'alt', path);
    optionalText(data.album, 'album', path);
    if (data.shotDate !== undefined) validDate(data.shotDate, 'shotDate', path);
    optionalText(data.location, 'location', path);
  }
}

function validateProfile() {
  const path = join(contentRoot, 'profile', 'ming.md');
  assert.ok(existsSync(path), 'src/content/profile/ming.md is required.');
  const data = readFrontmatter(path);
  assert.equal(data.displayName, 'Ming', 'Profile displayName must remain Ming.');
}

validatePosts();
validateProjects();
validateMoments();
validateGallery();
validateProfile();

console.log('Content quality validation passed for posts, projects, moments, gallery, and profile.');

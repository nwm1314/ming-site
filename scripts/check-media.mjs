import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const warningBytes = 5 * 1024 * 1024;
const failureBytes = 20 * 1024 * 1024;
const explicitPolicies = [
  { path: 'public/images/ming-avatar.webp', warningBytes: 2 * 1024 * 1024, failureBytes: 5 * 1024 * 1024, label: 'profile avatar' },
  { path: 'public/images/ming-og.webp', warningBytes: 5 * 1024 * 1024, failureBytes: 20 * 1024 * 1024, label: 'default social preview' },
];

function filesIn(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path);
    return entry.name === '.gitkeep' ? [] : [path];
  });
}

function policyFor(path) {
  const explicit = explicitPolicies.find((policy) => join(projectRoot, policy.path) === path);
  return explicit ?? { warningBytes, failureBytes, label: 'media asset' };
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

const mediaFiles = [
  ...filesIn(join(projectRoot, 'public', 'images')),
  ...filesIn(join(projectRoot, 'public', 'uploads')),
];
const warnings = [];
const failures = [];

for (const path of mediaFiles) {
  const size = statSync(path).size;
  const policy = policyFor(path);
  const displayPath = relative(projectRoot, path).replaceAll('\\', '/');
  if (size > policy.failureBytes) {
    failures.push(`${displayPath} is ${formatSize(size)}; ${policy.label} must be at most ${formatSize(policy.failureBytes)}.`);
  } else if (size > policy.warningBytes) {
    warnings.push(`${displayPath} is ${formatSize(size)}; review this ${policy.label} before committing (warning threshold ${formatSize(policy.warningBytes)}).`);
  }
}

for (const message of warnings) console.warn(`Media warning: ${message}`);
for (const message of failures) console.error(`Media error: ${message}`);
assert.equal(failures.length, 0, 'Media quality check failed. Remove or deliberately resize the oversized files listed above.');
console.log(`Media quality check passed for ${mediaFiles.length} files (warning threshold ${formatSize(warningBytes)}, failure threshold ${formatSize(failureBytes)}).`);

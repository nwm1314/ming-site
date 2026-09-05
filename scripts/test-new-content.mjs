import assert from 'node:assert/strict';
import {
  assertTargetAvailable,
  createMomentFrontmatter,
  createPostFrontmatter,
  validateDate,
  validateSlug,
} from './new-content-core.mjs';

const post = createPostFrontmatter({
  title: 'Deterministic test post',
  description: 'A non-empty description for the scaffold.',
  date: '2026-09-05',
});
assert.match(post, /title: "Deterministic test post"/);
assert.match(post, /description: "A non-empty description for the scaffold\."/);
assert.match(post, /draft: true/);

const moment = createMomentFrontmatter({ date: '2026-09-05' });
assert.match(moment, /visibility: unlisted/);
assert.doesNotMatch(moment, /^title:/m);

assert.doesNotThrow(() => assertTargetAvailable('new-content.md', () => false));
assert.throws(() => assertTargetAvailable('existing-content.md', () => true), /overwrite/);
assert.throws(() => validateSlug('../unsafe'), /Slug/);
assert.throws(() => validateDate('2026-02-30'), /Date/);

console.log('Editorial scaffold tests passed (8 cases).');

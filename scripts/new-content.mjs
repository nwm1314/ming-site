import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  assertTargetAvailable,
  createMomentFrontmatter,
  createPostFrontmatter,
  validateDate,
  validateSlug,
} from './new-content-core.mjs';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const kind = process.argv[2];
const definitions = {
  post: { directory: 'src/content/posts', label: 'post' },
  moment: { directory: 'src/content/moments', label: 'moment' },
};

if (!definitions[kind]) {
  console.error('Usage: pnpm new:post | pnpm new:moment');
  process.exit(1);
}

const definition = definitions[kind];
const today = new Date().toISOString().slice(0, 10);
const readline = createInterface({ input, output });

try {
  let frontmatter;
  let slug;

  if (kind === 'post') {
    const title = await readline.question('Title: ');
    const description = await readline.question('Description: ');
    slug = validateSlug(await readline.question('Slug: '));
    const date = validateDate((await readline.question(`Date [${today}]: `)).trim() || today);
    frontmatter = createPostFrontmatter({ title, description, date });
  } else {
    slug = validateSlug(await readline.question('Slug: '));
    const date = validateDate((await readline.question(`Date [${today}]: `)).trim() || today);
    frontmatter = createMomentFrontmatter({ date });
  }

  const path = join(projectRoot, definition.directory, `${slug}.md`);
  assertTargetAvailable(path, existsSync);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, frontmatter, 'utf8');
  console.log(`Created ${definition.label} draft at ${path}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  readline.close();
}

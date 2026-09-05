import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const kind = process.argv[2];
const definitions = {
  post: {
    directory: 'src/content/posts',
    label: 'post',
    frontmatter: ({ title, date }) => `---
title: ${JSON.stringify(title)}
description: ""
publishDate: ${date}
draft: true
category: Notes
tags: []
featured: false
toc: true
comments: false
---
`,
  },
  moment: {
    directory: 'src/content/moments',
    label: 'moment',
    frontmatter: ({ date }) => `---
publishDate: ${date}
tags: []
visibility: unlisted
---
`,
  },
};

if (!definitions[kind]) {
  console.error('Usage: pnpm new:post | pnpm new:moment');
  process.exit(1);
}

const definition = definitions[kind];
const today = new Date().toISOString().slice(0, 10);
const readline = createInterface({ input, output });

try {
  const title = (await readline.question('Title: ')).trim();
  const slug = (await readline.question('Slug: ')).trim();
  const date = (await readline.question(`Date [${today}]: `)).trim() || today;

  if (!title) throw new Error('Title cannot be empty.');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
    throw new Error('Slug must use letters, numbers, dots, underscores, or hyphens, and cannot start with punctuation.');
  }
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('Date must use YYYY-MM-DD.');
  }

  const path = join(projectRoot, definition.directory, `${slug}.md`);
  if (existsSync(path)) throw new Error(`Refusing to overwrite existing file: ${path}`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, definition.frontmatter({ title, date }), 'utf8');
  console.log(`Created ${definition.label} draft at ${path}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  readline.close();
}

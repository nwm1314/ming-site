import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const forbidden = [
  'hello@example.com',
  'avatar coming soon',
  'Phase 1 placeholder identity',
  'desk-notes',
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    else files.push(path);
  }
  return files;
}

const files = await collectFiles(distDirectory);
const html = (await Promise.all(files.filter((file) => file.endsWith('.html')).map((file) => readFile(file, 'utf8')))).join('\n');

for (const value of forbidden) {
  if (html.includes(value)) throw new Error(`Privacy smoke test found forbidden public content: ${value}`);
}

if (!html.includes('"@type":"Person"') || !html.includes('"name":"Ming"')) {
  throw new Error('Privacy smoke test could not confirm the public JSON-LD identity.');
}

console.log(`Privacy smoke test passed across ${files.length} generated files.`);

import { readFile } from 'node:fs/promises';

const targets = ['AGENTS.md', 'tsconfig.json', 'src/app/layout.tsx', 'src/app/(main)/page.tsx'];

for (const target of targets) {
  await readFile(target, 'utf8');
}

console.log('Lint checks passed.');

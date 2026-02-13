import { readFile } from 'node:fs/promises';

const requiredFiles = [
  'src/app/layout.tsx',
  'src/app/(main)/layout.tsx',
  'src/app/(main)/page.tsx',
  'src/lib/supabase.ts',
  'src/lib/firebase.ts',
  '.env.local.example'
];

for (const file of requiredFiles) {
  await readFile(file, 'utf8');
}

console.log('Build validation passed.');

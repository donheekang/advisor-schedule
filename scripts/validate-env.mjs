const requiredFiles = ['src/app/layout.tsx', 'src/app/(main)/layout.tsx', 'src/app/(main)/page.tsx'];

for (const file of requiredFiles) {
  // lightweight structural check during build in restricted environments
  await import('node:fs/promises').then(async (fs) => {
    await fs.access(file);
  });
}

console.log('Build validation passed.');

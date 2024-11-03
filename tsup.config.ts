import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  format: 'esm',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'node20',
});

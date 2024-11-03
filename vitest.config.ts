import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.sst/**'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['lcov', 'text-summary'],
      exclude: ['**/__test-utils__/**'],
    },
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: { alias: { '@': '/src' } },
});

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next/**'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['lcov', 'text-summary'],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: { alias: { '@': '/src' } },
});

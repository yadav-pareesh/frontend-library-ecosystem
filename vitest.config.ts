import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    isolate: true,
    maxWorkers: 2,
    minWorkers: 1,
    include: ['packages/*/tests/**/*.test.{ts,tsx}', 'docs/tests/**/*.test.{ts,tsx}']
  }
});

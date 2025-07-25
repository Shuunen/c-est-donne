import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/utils'],
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        100: true,
      },
    },
    pool: 'threads'
  },
})

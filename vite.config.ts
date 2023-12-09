import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('sl-'),
        },
      },
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line total-functions/no-partial-url-constructor
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})

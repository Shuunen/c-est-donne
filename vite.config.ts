import vueI18n from '@intlify/vite-plugin-vue-i18n'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.indexOf('sl-') === 0,
        },
      },
    }),
    vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})

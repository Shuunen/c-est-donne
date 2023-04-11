import vueI18n from '@intlify/unplugin-vue-i18n'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
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
    vueI18n.vite({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention, total-functions/no-partial-url-constructor
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})

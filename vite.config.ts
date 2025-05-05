/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
// @ts-expect-error missing types
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue({
      template: {
        compilerOptions: {
          // eslint-disable-next-line jsdoc/require-jsdoc
          isCustomElement: (tag) => tag.startsWith('sl-'),
        },
      },
    }),
    visualizer(),
  ],
})

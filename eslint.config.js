/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-expect-error missing types
import shuunen from 'eslint-plugin-shuunen'

export default [
  ...shuunen.configs.base,
  ...shuunen.configs.browser,
  ...shuunen.configs.typescript,
  shuunen.configs.vue,
  {
    name: 'project-overrides',
    rules: {
      'vue/no-deprecated-slot-attribute': 'off', // seems to be needed by SL Components
    },
  },
]

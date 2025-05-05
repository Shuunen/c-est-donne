import { base } from 'eslint-plugin-shuunen/configs/base'
import { browser } from 'eslint-plugin-shuunen/configs/browser'
import { typescript } from 'eslint-plugin-shuunen/configs/typescript'
import { vue } from 'eslint-plugin-shuunen/configs/vue'

export default [
  ...base,
  ...browser,
  ...typescript,
  ...vue,
  {
    name: 'project-overrides',
    rules: {
      'vue/no-deprecated-slot-attribute': 'off', // seems to be needed by SL Components
    },
  },
]

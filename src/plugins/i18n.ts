import messages from '@intlify/vite-plugin-vue-i18n/messages'
import { createI18n } from 'petite-vue-i18n'

export const i18n = createI18n({
  locale: 'fr',
  messages,
})

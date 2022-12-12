import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'petite-vue-i18n'

export const enum Locale {
  En = 'en',
  Fr = 'fr',
}

export const i18n = createI18n({
  locale: Locale.Fr,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  messages,
})

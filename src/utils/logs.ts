/* eslint-disable no-console */
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import { BrowserScout, emit } from 'shuutils'
import { i18n } from '../plugins/i18n'

export const error = (key: string): boolean => {
  const locale = (i18n.global.locale as unknown as {value:string}).value
  const message = messages[locale]?.[`error-${key}`].source ?? `Un-translated error : error-${key}`
  console.error(`error triggered : ${message}`)
  return emit('error', message)
}

export const log = (...stuff: unknown[]): void => {
  console.log(...stuff)
  emit('log', stuff.join(' '))
}

export const getEnvironment = (): string => {
  const scout = new BrowserScout()
  return `
- Browser: ${scout.browser} ${scout.version}
- Language: ${scout.language}
- OS: ${scout.os}
- Platform: ${scout.platform}
- Screen : ${window.screen.width}x${window.screen.height}
- Url : ${window.location.href}
`
}

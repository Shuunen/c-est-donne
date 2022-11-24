/* c8 ignore start */
/* eslint-disable no-console */
import { BrowserScout, emit } from 'shuutils'
import messages from '../locales/en.json'

type ErrorKey = keyof typeof messages

export const error = (key: ErrorKey, details?: string): boolean => {
  if (typeof window === 'undefined') return false
  let message = messages[key] || `Un-translated error : ${key}`
  if (details !== undefined) message += `. ${details}`
  console.error(`error triggered : ${message}`)
  return emit('error', message)
}

export const log = (...stuff: unknown[]): void => {
  if (typeof window === 'undefined') return
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
/* c8 ignore stop */

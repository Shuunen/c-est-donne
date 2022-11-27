import { BrowserScout, emit } from 'shuutils'
import messages from '../locales/en.json' // eslint-disable-line import/extensions

type ErrorKey = keyof typeof messages

export function error (key: ErrorKey, details?: string): boolean {
  if (typeof window === 'undefined') return false
  let message = messages[key] || `Un-translated error : ${key}`
  if (details !== undefined) message += `. ${details}`
  console.error(`error triggered : ${message}`) // eslint-disable-line no-console
  return emit('error', message)
}

export function log (...stuff: unknown[]): void {
  if (typeof window === 'undefined') return
  console.log(...stuff) // eslint-disable-line no-console
  emit('log', stuff.join(' '))
}

export function getEnvironment (): string {
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

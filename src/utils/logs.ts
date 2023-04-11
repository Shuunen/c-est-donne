import { BrowserScout, emit, Logger } from 'shuutils'
import messages from '../locales/en.json'

type ErrorKey = keyof typeof messages

export const logger = new Logger({ willOutputToConsole: typeof window !== 'undefined' })

export function error (key: ErrorKey, details?: string): boolean {
  if (typeof window === 'undefined') return false
  let message = messages[key] || `Un-translated error : ${key}`
  if (details !== undefined) message += `. ${details}`
  logger.error(`error triggered : ${message}`)
  return emit('error', message)
}

export function log (...stuff: unknown[]): void {
  if (typeof window === 'undefined') return
  logger.info(...stuff)
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

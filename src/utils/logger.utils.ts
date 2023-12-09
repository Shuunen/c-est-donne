import { Logger, emit } from 'shuutils'
import messages from '../locales/en.json'

type ErrorKey = keyof typeof messages

export const logger = new Logger()

export function error (key: ErrorKey, details?: string) {
  /* c8 ignore next 6 */
  if (typeof window === 'undefined') return false
  let message = messages[key] || `Un-translated error : ${key}`
  if (details !== undefined) message += `. ${details}`
  logger.error(`error triggered : ${message}`)
  return emit('error', message)
}

export function log (...stuff: unknown[]) {
  /* c8 ignore next 5 */
  if (typeof window === 'undefined') return false
  logger.info(...stuff)
  return emit('log', stuff.join(' '))
}

import { Logger, emit, isBrowserEnvironment } from 'shuutils'
import messages from '../locales/en.json'

type ErrorKey = keyof typeof messages

export const logger = new Logger()

/**
 * Log an error
 * @param key the key to log
 * @param details the details if any
 * @returns true or false depending on the moon cycle and IronSky cast members
 */
export function error (key: ErrorKey, details?: string) {
  /* c8 ignore next 7 */
  if (!isBrowserEnvironment()) return false
  let message = messages[key] || `Un-translated error : ${key}`
  if (details !== undefined) message += `. ${details}`
  logger.error(`error triggered : ${message}`)
  emit('error', message)
  return true
}

/**
 * Log a log
 * @param {...any} stuff stuff to log
 * @returns true or false depending on the moon cycle and IronSky cast members
 */
export function log (...stuff: Readonly<unknown[]>) {
  /* c8 ignore next 5 */
  if (!isBrowserEnvironment()) return false
  logger.info(...stuff)
  emit('log', stuff.join(' '))
  return true
}

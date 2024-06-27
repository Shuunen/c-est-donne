import { fillTemplate, flatten } from 'shuutils'
import { ref } from 'vue'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { getPath, isBrowser } from './browser.utils'
import { logger } from './logger.utils'

const translations = { fr: flatten(fr), en: flatten(en) }

export type Lang = keyof typeof translations

export const defaultLang: Lang = 'fr'

export function getLangFromPath (path: string) {
  const detected = /^\/(?<lang>en|fr)\//u.exec(path)?.groups?.lang ?? defaultLang
  return detected === 'fr' ? 'fr' : defaultLang
}

export const lang = ref<Lang>(getLangFromPath(/* c8 ignore next */isBrowser ? document.location.pathname : ''))

export function localePath (path: string, targetLang = lang.value) {
  return getPath(path, targetLang === defaultLang ? '' : targetLang)
}

export function handlePlural (translated: string, data?: Record<string, unknown>) {
  if (!translated.includes('|')) return fillTemplate(translated, data)
  if (data === undefined) throw new Error('missing data for a pluralized traduction')
  if (!('count' in data)) throw new Error('missing "count" in data for a pluralized traduction')
  const count = Number.parseInt(String(data.count), 10)
  const [a = '', b = '', c = ''] = translated.split(' | ') // eslint-disable-line id-length
  if (c.length > 0 && count > 1) return fillTemplate(c, data)
  if ((c.length > 0 && count === 1) || (b.length > 0 && count > 1)) return fillTemplate(b, data)
  return fillTemplate(a, data)
}

export function $t (key: string, data?: Record<string, unknown>) {
  const translated = translations[lang.value][key]
  if (translated !== undefined) return handlePlural(String(translated), data)
  if (/* c8 ignore next */isBrowser) logger.warn(`Translation not found for key "${key}"`)
  return key
}

/* c8 ignore next 6 */
export function switchLang () {
  lang.value = lang.value === 'en' ? 'fr' : 'en'
  const updatedPath = localePath(window.location.pathname)
  logger.info('switch lang to', lang.value, ', redirecting to', updatedPath)
  document.location.href = updatedPath
}

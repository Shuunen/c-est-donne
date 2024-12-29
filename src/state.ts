import { browserContext, browserReport, isBrowserEnvironment, storage } from 'shuutils'
import { reactive } from 'vue'
import type { Item } from './utils/items.utils'
import { log } from './utils/logger.utils'
import { Display, Filter } from './utils/tabs.utils'
import { Theme } from './utils/theme.utils'
import { type Lang, defaultLang } from './utils/translate.utils'
import { type User, emptyUser } from './utils/user.utils'

log('creating state, current environment :', browserReport(browserContext()))

storage.prefix = 'c-est-donne_'

const items: Item[] = []

export const state = reactive({
  display: storage.get<Display>('display', Display.List),
  error: '',
  filter: storage.get<Filter>('filter', Filter.Available),
  isLoading: false,
  items,
  locale: storage.get<Lang>('locale', defaultLang),
  theme: storage.get<Theme>('theme', isBrowserEnvironment() && /* c8 ignore next */ globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light),
  user: storage.get<User>('user', emptyUser),
})

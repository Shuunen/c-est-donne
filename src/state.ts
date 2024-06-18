import { browserContext, browserReport, storage } from 'shuutils'
import { reactive } from 'vue'
import type { Item } from './utils/items.utils'
import { log } from './utils/logger.utils'
import { Display, Filter } from './utils/tabs.utils'
import { Theme } from './utils/theme.utils'
import { defaultLang, type Lang } from './utils/translate.utils'
import { emptyUser, type User } from './utils/user.utils'

log('creating state, current environment :', browserReport(browserContext()))

storage.prefix = 'c-est-donne_'

const items: Item[] = []

export const state = reactive({
  error: '',
  isLoading: false,
  locale: storage.get<Lang>('locale', defaultLang),
  items,
  display: storage.get<Display>('display', Display.List),
  filter: storage.get<Filter>('filter', Filter.Available),
  theme: storage.get<Theme>('theme', typeof window !== 'undefined' && /* c8 ignore next */ window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light),
  user: storage.get<User>('user', emptyUser),
})

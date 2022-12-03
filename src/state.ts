import { storage } from 'shuutils'
import { reactive } from 'vue'
import { Locale } from './plugins/i18n'
import type { Item } from './utils/items'
import { getEnvironment, log } from './utils/logs'
import { Display, Filter } from './utils/tabs'
import { Theme } from './utils/theme'
import { emptyUser, type User } from './utils/user'

log('creating state, current environment :', getEnvironment())

storage.prefix = 'c-est-donne_'

const items: Item[] = []

export const state = reactive({
  error: '',
  isLoading: false,
  locale: storage.get<Locale>('locale', Locale.Fr),
  items,
  display: storage.get<Display>('display', Display.List),
  filter: storage.get<Filter>('filter', Filter.Available),
  theme: storage.get<Theme>('theme', Theme.Light),
  user: storage.get<User>('user', emptyUser),
})

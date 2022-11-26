import { storage } from 'shuutils'
import { reactive } from 'vue'
import { Locale } from './plugins/i18n'
import type { Item } from './utils/items'
import { log } from './utils/logs'
import { Tab, type Display, type Filter } from './utils/tabs'
import { Theme } from './utils/theme'
import { emptyUser, type User } from './utils/user'

log('creating state')

storage.prefix = 'c-est-donne_'

/* c8 ignore next 4 */
// eslint-disable-next-line no-warning-comments
// TODO should not be needed with the next version of shuutils
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const media = typeof localStorage === 'undefined' ? {} as Storage : localStorage

export const state = reactive({
  error: '',
  isLoading: false,
  locale: storage.get<Locale>('locale', Locale.Fr),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  items: [] as Item[],
  display: storage.get<Display>('display', Tab.List, media),
  filter: storage.get<Filter>('filter', Tab.Available, media),
  theme: storage.get<Theme>('theme', Theme.Light, media),
  user: storage.get<User>('user', emptyUser, media),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  viewItem: undefined as Item | undefined,
})

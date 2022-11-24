import { storage } from 'shuutils'
import { reactive } from 'vue'
import type { Item } from './utils/item'
import { log } from './utils/logs'
import { Tabs, type Display } from './utils/tabs'
import { Theme } from './utils/theme'
import { EMPTY_USER, type User } from './utils/user'

log('creating state')

storage.prefix = 'c-est-donne_'

/* c8 ignore next 2 */
// TODO should not be needed with the next version of shuutils
const media = typeof localStorage === 'undefined' ? {} as Storage : localStorage

export const state = reactive({
  error: '',
  loading: false,
  items: [] as Item[],
  display: storage.get<Display>('display', Tabs.list, media),
  theme: storage.get<Theme>('theme', Theme.light, media),
  user: storage.get<User>('user', EMPTY_USER, media),
  viewItem: undefined as Item | undefined,
})

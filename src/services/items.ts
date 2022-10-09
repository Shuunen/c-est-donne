import { emit, on, sleep } from 'shuutils'
import type { AirtableResponse } from '../models/airtable'
import { Item, ItemStatus } from '../models/item'
import { error, log } from '../utils/logs'
import type { User } from '../utils/user'

class ItemsService {
  app = ''
  key = ''
  email = ''

  init (): void {
    on('user', (user: User) => this.onUser(user))
  }

  onUser (user: User): void {
    log('got user')
    this.app = user.AIRTABLE_API_APP
    this.key = user.AIRTABLE_API_KEY
    this.email = user.email
    this.fetchItems()
  }

  fetchItems = async (): Promise<boolean> => {
    log('fetching items')
    emit('loading', true)
    const url = await this.airtableUrl('items')
    if (typeof url !== 'string') return error('failed-to-build-airtable-url')
    const response: AirtableResponse = await fetch(url).then(async response => response.json())
    if (response.error) return error(response.error.message)
    if (!response.records) return error('no-items-found')
    log('found', response.records.length, 'items, here is the first one', response.records[0])
    emit<Item[]>('list-items', response.records.map(record => new Item(record, this.email)).filter(item => item.status !== ItemStatus.unknown))
    await sleep(300)
    return emit('loading', false)
  }

  validate (app: string, key: string): boolean {
    const appOk = app !== undefined && typeof app === 'string' && app.length === 17
    const keyOk = key !== undefined && typeof key === 'string' && key.length === 17
    const valid = appOk && keyOk
    log('credentials valid ?', valid)
    if (!valid) error('invalid-credentials')
    return valid
  }

  async airtableUrl (target = ''): Promise<string | boolean> {
    const ok = this.validate(this.app, this.key)
    if (!ok) return emit('need-credentials')
    return `https://api.airtable.com/v0/${this.app}/${target}?api_key=${this.key}&view=all`
  }

}

export const itemsService = new ItemsService()

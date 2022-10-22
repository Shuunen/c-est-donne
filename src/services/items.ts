import { emit, on, sleep } from 'shuutils'
import type { AirtableResponse } from '../models/airtable'
import { Item, ItemStatus } from '../models/item'
import { error, log } from '../utils/logs'
import type { User } from '../utils/user'

class ItemsService {
  user = undefined as User | undefined
  headersJson = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  init (): void {
    on('user', (user: User) => this.onUser(user))
  }

  onUser (user: User): void {
    log('got user')
    this.user = user
    this.fetchItems()
  }

  validate (): boolean {
    if (!this.user) return error('error-missing-user-data')
    const { AIRTABLE_API_APP: app, AIRTABLE_API_KEY: key } = this.user
    const appOk = app !== undefined && typeof app === 'string' && app.length === 17
    const keyOk = key !== undefined && typeof key === 'string' && key.length === 17
    const valid = appOk && keyOk
    return valid
  }

  async airtableUrl (target = ''): Promise<string | boolean> {
    if (!this.user) return error('error-missing-user-data')
    const { AIRTABLE_API_APP: app, AIRTABLE_API_KEY: key } = this.user
    return `https://api.airtable.com/v0/${app}/${target}?api_key=${key}&view=all`
  }

  /* c8 ignore start */

  async fetch (url: string, options?: RequestInit): Promise<AirtableResponse> {
    if (typeof window === 'undefined') return { error: { message: 'window is undefined', type: 'error' } }
    return fetch(url, options).then(async response => response.json()) as Promise<AirtableResponse>
  }

  fetchItems = async (): Promise<boolean | void> => {
    const { isConnected, hasAccess, email } = this.user || {}
    if (!isConnected) return log('user is not connected, not fetching items')
    if (!hasAccess) return log('user has no access, not fetching items')
    if (!email) return error('error-missing-user-data')
    if (!this.validate()) return error('error-invalid-credentials')
    log('fetching items...')
    emit('loading', true)
    const url = await this.airtableUrl('items')
    if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
    const response = await this.fetch(url)
    if (response.error) return error('error-airtable', response.error.message)
    if (!response.records) return error('error-no-items-found')
    log('found', response.records.length, 'items, here is the first one', response.records[0])
    emit<Item[]>('list-items', response.records.map(record => new Item(record, email)).filter(item => item.status !== ItemStatus.unknown))
    await sleep(300)
    return emit('loading', false)
  }

  async patch (url: string, data: Record<string, unknown>): Promise<AirtableResponse> {
    return this.fetch(url, { headers: this.headersJson, method: 'patch', body: JSON.stringify(data) })
  }

  async updateItemStatus (id: Item['id'], status: ItemStatus, statusFront: ItemStatus): Promise<boolean> {
    if (!this.user) return error('error-missing-user-data')
    emit('loading', true)
    const url = await this.airtableUrl(`items/${id}`)
    if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
    const data = { fields: { Status: status, Beneficiary: this.user.email } }
    const response = await this.patch(url, data)
    if (response.error) return error('error-airtable', response.error.message)
    log('updated item', id, 'status to', status)
    emit('update-item-status', { id, status: statusFront })
    return emit('loading', false)
  }

  /* c8 ignore stop */
}

export const itemsService = new ItemsService()

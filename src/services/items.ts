import { emit, on } from 'shuutils'
import type { AirtableCredentials, AirtableItemRecord, AirtableResponse } from '../models/airtable'

export class Item {
  id = ''
  images: string[] = []
  name = ''
  notes = ''
  status = ''
  constructor (record: AirtableItemRecord) {
    this.id = record.id
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    this.status = record.fields.Status ?? 'unknown'
  }
}

class ItemsService {
  app = ''
  key = ''

  init ():void {
    on('airtable-credentials', (credentials: AirtableCredentials) => this.onAirtableCredentials(credentials))
  }

  onAirtableCredentials (credentials: AirtableCredentials): void {
    console.log('got credentials', credentials)
    this.app = credentials.app
    this.key = credentials.key
    this.fetchItems()
  }

  fetchItems = async ():Promise<boolean> => {
    console.log('fetching items')
    emit('loading', true)
    const url = await this.airtableUrl('items')
    if (typeof url !== 'string') return emit('error', 'failed to build airtable url')
    const response: AirtableResponse = await fetch(url).then(async response => response.json())
    if (response.error) return emit('error', response.error)
    if (!response.records) return emit('error', 'no records found')
    console.log('found items', response.records)
    return emit<Item[]>('list-items', response.records.map(record => new Item(record)).filter(item => item.status === 'available' && item.images.length > 0))
  }

  validate (app: string, key: string): boolean {
    const appOk = app !== undefined && typeof app === 'string' && app.length === 17
    const keyOk = key !== undefined && typeof key === 'string' && key.length === 17
    const valid = appOk && keyOk
    console.log('credentials valid ?', valid)
    return valid
  }

  async airtableUrl (target = ''): Promise<string | boolean> {
    const ok = this.validate(this.app, this.key)
    if (!ok) return emit('need-credentials')
    return `https://api.airtable.com/v0/${this.app}/${target}?api_key=${this.key}&view=all`
  }

}

export const itemsService = new ItemsService()

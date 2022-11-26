import { watch } from 'vue'
import { state } from '../state'
import { airtableUrl, headersJson, validate, type AirtableItemRecord, type AirtableResponse } from './airtable'
import { error, log } from './logs'

/* c8 ignore start */

async function myFetch (url: string, options?: RequestInit): Promise<AirtableResponse> {
  if (typeof window === 'undefined') return { error: { message: 'window is undefined', type: 'error' } }
  const response = await fetch(url, options)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return await response.json() as AirtableResponse
}

// eslint-disable-next-line max-statements
async function fetchItems (): Promise<boolean> {
  const { isConnected, hasAccess, email, apiApp, apiKey } = state.user
  if (!isConnected) { log('user is not connected, not fetching items'); return false }
  if (!hasAccess) { log('user has no access, not fetching items'); return false }
  if (!email) return error('error-missing-user-data')
  if (!validate(apiApp, apiKey)) return error('error-invalid-credentials')
  log('fetching items...')
  const url = airtableUrl(apiApp, apiKey, 'items')
  if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  const response = await myFetch(url)
  if (response.error) return error('error-airtable', response.error.message)
  if (!response.records) return error('error-no-items-found')
  log('found', response.records.length, 'items, here is the first one', response.records[0])
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  state.items = response.records.map(record => new Item(record, email)).filter(item => item.status !== ItemStatus.Unknown)
  return true
}

async function onUser (): Promise<void> {
  log('on user')
  state.isLoading = true
  await fetchItems()
  state.isLoading = false
}

async function patch (url: string, data: { [key: string]: unknown }): Promise<AirtableResponse> {
  return await myFetch(url, { headers: headersJson, method: 'patch', body: JSON.stringify(data) })
}

// eslint-disable-next-line @typescript-eslint/no-use-before-define
async function updateItemStatus (id: Item['id'], status: ItemStatus): Promise<boolean> {
  state.isLoading = true
  const url = airtableUrl(state.user.apiApp, state.user.apiKey, `items/${id}`)
  if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const data = { fields: { Status: status, Beneficiary: state.user.email } }
  const response = await patch(url, data)
  if (response.error) return error('error-airtable', response.error.message)
  log('updated item', id, 'status to', status)
  await fetchItems()
  state.isLoading = false
  return true
}

/* c8 ignore stop */

setTimeout(() => watch(() => state.user, onUser), 10) // eslint-disable-line @typescript-eslint/no-magic-numbers

export const enum ItemStatus {
  Available = 'available',
  Gone = 'gone',
  Reserved = 'reserved',
  Unknown = 'unknown',
  ReservedByMe = 'reserved-by-me',
}

export class Item {

  public readonly beneficiary: string

  public readonly createdTime: Date

  public readonly id: string

  public readonly images: string[]

  public readonly name: string

  public readonly notes: string

  public readonly status: ItemStatus

  public isVisible = true

  public constructor (record: AirtableItemRecord, currentUserMail: string) {
    this.beneficiary = record.fields.Beneficiary ?? ''
    this.createdTime = new Date(record.createdTime)
    this.id = record.id
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    const status = record.fields.Status
    if (status === 'available') this.status = ItemStatus.Available
    else if (status === 'reserved') this.status = this.beneficiary === currentUserMail ? ItemStatus.ReservedByMe : ItemStatus.Reserved
    else if (status === 'gone') this.status = ItemStatus.Gone
    else this.status = ItemStatus.Unknown
  }

  public get canBeToggle (): boolean {
    return [ItemStatus.ReservedByMe, ItemStatus.Available].includes(this.status)
  }

  public toggleStatus (): ItemStatus.Available | ItemStatus.Reserved | undefined {
    if (!this.canBeToggle) return
    const updatedStatus = this.status === ItemStatus.Available ? ItemStatus.Reserved : ItemStatus.Available
    void updateItemStatus(this.id, updatedStatus)
    // eslint-disable-next-line consistent-return
    return updatedStatus
  }
}

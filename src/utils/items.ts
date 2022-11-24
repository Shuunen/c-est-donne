import { watch } from 'vue'
import { state } from '../state'
import { HEADERS_JSON, type AirtableResponse } from './airtable'
import { Item, ItemStatus } from './item'
import { error, log } from './logs'

export const validate = (app?: string, key?: string): boolean => {
  const appOk = app !== undefined && typeof app === 'string' && app.length === 17
  const keyOk = key !== undefined && typeof key === 'string' && key.length === 17
  const valid = appOk && keyOk
  return valid
}

export const airtableUrl = (app: string, key: string, target = ''): boolean | string => {
  return `https://api.airtable.com/v0/${app}/${target}?api_key=${key}&view=all`
}

/* c8 ignore start */

const myFetch = async (url: string, options?: RequestInit): Promise<AirtableResponse> => {
  if (typeof window === 'undefined') return { error: { message: 'window is undefined', type: 'error' } }
  return fetch(url, options).then(async response => response.json()) as Promise<AirtableResponse>
}

const fetchItems = async (): Promise<boolean | undefined> => {
  const { isConnected, hasAccess, email, apiApp, apiKey } = state.user
  if (!isConnected) { log('user is not connected, not fetching items'); return }
  if (!hasAccess) { log('user has no access, not fetching items'); return }
  if (!email) return error('error-missing-user-data')
  if (!validate(apiApp, apiKey)) return error('error-invalid-credentials')
  log('fetching items...')
  const url = airtableUrl(apiApp, apiKey, 'items')
  if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  const response = await myFetch(url)
  if (response.error) return error('error-airtable', response.error.message)
  if (!response.records) return error('error-no-items-found')
  log('found', response.records.length, 'items, here is the first one', response.records[0])
  state.items = response.records.map(record => new Item(record, email)).filter(item => item.status !== ItemStatus.unknown)
  return
}

const onUser = async (): Promise<void> => {
  log('on user')
  state.loading = true
  await fetchItems()
  state.loading = false
}

const patch = async (url: string, data: Record<string, unknown>): Promise<AirtableResponse> => {
  return myFetch(url, { headers: HEADERS_JSON, method: 'patch', body: JSON.stringify(data) })
}

export const updateItemStatus = async (id: Item['id'], status: ItemStatus): Promise<boolean> => {
  state.loading = true
  const url = airtableUrl(state.user.apiApp, state.user.apiKey, `items/${id}`)
  if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const data = { fields: { Status: status, Beneficiary: state.user.email } }
  const response = await patch(url, data)
  if (response.error) return error('error-airtable', response.error.message)
  log('updated item', id, 'status to', status)
  await fetchItems()
  state.loading = false
  return true
}

setTimeout(() => watch(() => state.user, onUser), 10)

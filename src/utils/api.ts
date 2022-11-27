import { state } from '../state'
import { airtableUrl, headersJson, validate, type AirtableResponse } from './airtable'
import { Item, ItemStatus } from './items'
import { error, log } from './logs'

async function myFetch (url: string, options?: RequestInit): Promise<AirtableResponse> {
  if (typeof window === 'undefined') return { error: { message: 'window is undefined', type: 'error' } }
  const response = await fetch(url, options)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return await response.json() as AirtableResponse
}

async function patch (url: string, data: { [key: string]: unknown }): Promise<AirtableResponse> {
  return await myFetch(url, { headers: headersJson, method: 'patch', body: JSON.stringify(data) })
}

// eslint-disable-next-line max-statements
export async function fetchItems (): Promise<boolean> {
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
  state.items = response.records.map(record => new Item(record, email)).filter(item => item.status !== ItemStatus.Unknown)
  return true
}

export async function updateItemStatus (id: Item['id'], status: ItemStatus): Promise<boolean> {
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

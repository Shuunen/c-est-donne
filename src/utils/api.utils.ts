/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable jsdoc/require-jsdoc */
import { isBrowserEnvironment } from 'shuutils'
import { state } from '../state'
import { type AirtableResponse, airtableUrl, headersJson, validate } from './airtable.utils'
import { Item, ItemStatus } from './items.utils'
import { error, log } from './logger.utils'

async function myFetch (url: string, options?: RequestInit) {
  /* c8 ignore next 5 */
  if (!isBrowserEnvironment()) return { error: { message: 'window is undefined', type: 'error' } }
  const response = await fetch(url, options)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
  return await response.json() as AirtableResponse
}

async function patch (url: string, data: Record<string, unknown>) {
  return myFetch(url, { body: JSON.stringify(data), headers: headersJson, method: 'patch' })
}

// eslint-disable-next-line max-statements
export async function fetchItems () {
  const { apiApp, apiKey, email, hasAccess, isConnected } = state.user
  if (!isConnected) { log('user is not connected, not fetching items'); return false }
  if (!hasAccess) { log('user has no access, not fetching items'); return false }
  if (!email) return error('error-missing-user-data')
  if (!validate(apiApp, apiKey)) return error('error-invalid-credentials')
  log('fetching items...')
  const url = airtableUrl(apiApp, apiKey, 'items')
  /* c8 ignore next 9 */
  if (typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  const response = await myFetch(url)
  if (response.error) return error('error-airtable', response.error.message)
  if (!response.records) return error('error-no-items-found')
  log('found', response.records.length, 'items, here is the first one', response.records[0])
  // eslint-disable-next-line require-atomic-updates
  state.items = response.records.map(record => new Item(record, email)).filter(item => item.status !== ItemStatus.Unknown)
  return true
}

export async function updateItemStatus (id: Item['id'], status: ItemStatus) {
  state.isLoading = true
  const url = airtableUrl(state.user.apiApp, state.user.apiKey, `items/${id}`)
  if (/* c8 ignore next */ typeof url !== 'string') return error('error-failed-to-build-airtable-url')
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const data = { fields: { Beneficiary: state.user.email, Status: status } }
  const response = await patch(url, data)
  /* c8 ignore next 7 */
  if (response.error) return error('error-airtable', response.error.message)
  log('updated item', id, 'status to', status)
  await fetchItems()
  // eslint-disable-next-line require-atomic-updates
  state.isLoading = false
  return true
}

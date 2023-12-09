import { expect, it } from 'vitest'
import { state } from '../src/state'
import { fetchItems, updateItemStatus } from '../src/utils/api.utils'
import { ItemStatus } from '../src/utils/items.utils'

it('fetchItems A default', async () => {
  expect(await fetchItems()).toMatchInlineSnapshot('false')
})

it('fetchItems B connected', async () => {
  state.user.isConnected = true
  expect(await fetchItems()).toMatchInlineSnapshot('false')
})

it('fetchItems C connected + access', async () => {
  state.user.hasAccess = true
  expect(await fetchItems()).toMatchInlineSnapshot('false')
})

it('fetchItems D connected + access + email', async () => {
  state.user.email = 'jojo@gmail.com'
  expect(await fetchItems()).toMatchInlineSnapshot('false')
})

it('fetchItems E connected + access + email + apiApp + apiKey', async () => {
  // credentials that seems valid
  state.user.apiApp = 'app12345678901234'
  state.user.apiKey = 'key12345678901234'
  expect(await fetchItems()).toMatchInlineSnapshot('false')
})

it('updateItemStatus A', async () => {
  expect(await updateItemStatus('an-id', ItemStatus.Available)).toMatchInlineSnapshot('false')
})


import { check, checksRun } from 'shuutils'
import type { AirtableItemRecord } from '../src/utils/airtable'
import { Item, ItemStatus } from '../src/utils/item'
import { airtableUrl, validate } from '../src/utils/items'

const emailA = 'john@gmail.com'

const recordA: AirtableItemRecord = {
  id: 'rec123',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item A',
    Images: [
      {
        id: 'imageA',
        url: 'https://example.com/image.jpg',
      },
    ],
  },
}

const itemA = new Item(recordA, emailA)

check('item A has the good name', itemA.name, recordA.fields.Name)
check('item A has the good id', itemA.id, recordA.id)
check('item A has no beneficiary', itemA.beneficiary, '')
check('item A has unknown status', itemA.status, ItemStatus.unknown)
check('item A has one image', itemA.images, [recordA.fields.Images?.[0]?.url])

const recordB: AirtableItemRecord = {
  id: 'rec456',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item B',
    Status: 'available',
  },
}

const itemB = new Item(recordB, emailA)

check('item B has the good name', itemB.name, recordB.fields.Name)
check('item B has no images', itemB.images, [])
check('item B has the good id', itemB.id, recordB.id)
check('item B has no beneficiary', itemB.beneficiary, '')
check('item B has available status', itemB.status, ItemStatus.available)
check('item B toggle status', itemB.toggleStatus(), ItemStatus.reserved)

const recordC: AirtableItemRecord = {
  id: 'rec789',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item C',
    Status: 'reserved',
    Beneficiary: 'mama@gmail.com',
  },
}

const itemC = new Item(recordC, emailA)

check('item C has the good name', itemC.name, recordC.fields.Name)
check('item C has no images', itemC.images, [])
check('item C has the good id', itemC.id, recordC.id)
check('item C has reserved status', itemC.status, ItemStatus.reserved)
check('item C has the good beneficiary', itemC.beneficiary, recordC.fields.Beneficiary)
check('item C toggle status is blocked', itemC.toggleStatus())

const recordD: AirtableItemRecord = {
  id: 'rec101112',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item D',
    Status: 'reserved',
    Beneficiary: emailA,
  },
}

const itemD = new Item(recordD, emailA)

check('item D has the good name', itemD.name, recordD.fields.Name)
check('item D has no images', itemD.images, [])
check('item D has the good id', itemD.id, recordD.id)
check('item D has reservedByMe status', itemD.status, ItemStatus.reservedByMe)
check('item D has the good beneficiary', itemD.beneficiary, emailA)
check('item D toggle status', itemD.toggleStatus(), ItemStatus.available)

const recordE: AirtableItemRecord = {
  id: 'rec131415',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item E',
    Status: 'gone',
  },
}

const itemE = new Item(recordE, emailA)

check('item E has the good name', itemE.name, recordE.fields.Name)
check('item E has no images', itemE.images, [])
check('item E has the good id', itemE.id, recordE.id)
check('item E has gone status', itemE.status, ItemStatus.gone)
check('item E toggle status is blocked', itemE.toggleStatus())

const validApp = 'app12345678900000'
const invalidApp = 'app1234567890'
const validKey = 'key12345678900000'
const invalidKey = 'key123'

check('validate A without app and without key', validate(), false)
check('validate B with valid app and without key', validate(validApp), false)
check('validate C without app and with valid key', validate(undefined, validKey), false)
check('validate D with valid app and with valid key', validate(validApp, validKey), true)
check('validate E with invalid app and invalid key', validate(invalidApp, invalidKey), false)

check('airtableUrl A with target plop', airtableUrl(validApp, validKey, 'plop'), 'https://api.airtable.com/v0/app12345678900000/plop?api_key=key12345678900000&view=all')

checksRun()

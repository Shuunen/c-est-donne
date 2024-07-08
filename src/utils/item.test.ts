import { expect, it } from 'vitest'
import { type AirtableItemRecord, airtableUrl, validate } from './airtable.utils'
import { Item, ItemStatus } from './items.utils'

const emailA = 'john@gmail.com'

const recordA: AirtableItemRecord = {
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Images: [ // eslint-disable-line @typescript-eslint/naming-convention
      {
        id: 'imageA',
        url: 'https://example.com/image.jpg',
      },
    ],
    Name: 'super item A', // eslint-disable-line @typescript-eslint/naming-convention
  },
  id: 'rec123',
}

const itemA = new Item(recordA, emailA)

it('item A has the good name', () => { expect(itemA.name).toBe(recordA.fields.Name) })
it('item A has the good id', () => { expect(itemA.id).toBe(recordA.id) })
it('item A has no beneficiary', () => { expect(itemA.beneficiary).toBe('') })
it('item A has unknown status', () => { expect(itemA.status).toBe(ItemStatus.Unknown) })
it('item A has one image', () => { expect(itemA.images).toStrictEqual([recordA.fields.Images?.[0]?.url]) })

const recordB: AirtableItemRecord = {
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item B', // eslint-disable-line @typescript-eslint/naming-convention
    Status: 'available', // eslint-disable-line @typescript-eslint/naming-convention
  },
  id: 'rec456',
}

const itemB = new Item(recordB, emailA)

it('item B has the good name', () => { expect(itemB.name).toBe(recordB.fields.Name) })
it('item B has no images', () => { expect(itemB.images).toStrictEqual([]) })
it('item B has the good id', () => { expect(itemB.id).toBe(recordB.id) })
it('item B has no beneficiary', () => { expect(itemB.beneficiary).toBe('') })
it('item B has available status', () => { expect(itemB.status).toBe(ItemStatus.Available) })
it('item B can be toggle', () => { expect(itemB.canBeToggle).toBe(true) })

const recordC: AirtableItemRecord = {
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Beneficiary: 'mama@gmail.com', // eslint-disable-line @typescript-eslint/naming-convention
    Name: 'super item C', // eslint-disable-line @typescript-eslint/naming-convention
    Status: 'reserved', // eslint-disable-line @typescript-eslint/naming-convention
  },
  id: 'rec789',
}

const itemC = new Item(recordC, emailA)

it('item C has the good name', () => { expect(itemC.name).toBe(recordC.fields.Name) })
it('item C has no images', () => { expect(itemC.images).toStrictEqual([]) })
it('item C has the good id', () => { expect(itemC.id).toBe(recordC.id) })
it('item C has reserved status', () => { expect(itemC.status).toBe(ItemStatus.Reserved) })
it('item C has the good beneficiary', () => { expect(itemC.beneficiary).toBe(recordC.fields.Beneficiary) })
it('item C cannot be toggle', () => { expect(itemC.canBeToggle).toBe(false) })

const recordD: AirtableItemRecord = {
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Beneficiary: emailA, // eslint-disable-line @typescript-eslint/naming-convention
    Name: 'super item D', // eslint-disable-line @typescript-eslint/naming-convention
    Status: 'reserved', // eslint-disable-line @typescript-eslint/naming-convention
  },
  id: 'rec101112',
}

const itemD = new Item(recordD, emailA)

it('item D has the good name', () => { expect(itemD.name).toBe(recordD.fields.Name) })
it('item D has no images', () => { expect(itemD.images).toStrictEqual([]) })
it('item D has the good id', () => { expect(itemD.id).toBe(recordD.id) })
it('item D has reservedByMe status', () => { expect(itemD.status).toBe(ItemStatus.ReservedByMe) })
it('item D has the good beneficiary', () => { expect(itemD.beneficiary).toBe(emailA) })
it('item D can be toggle', () => { expect(itemD.canBeToggle).toBe(true) })

const recordE: AirtableItemRecord = {
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item E', // eslint-disable-line @typescript-eslint/naming-convention
    Status: 'gone', // eslint-disable-line @typescript-eslint/naming-convention
  },
  id: 'rec131415',
}

const itemE = new Item(recordE, emailA)

it('item E has the good name', () => { expect(itemE.name).toBe(recordE.fields.Name) })
it('item E has no images', () => { expect(itemE.images).toStrictEqual([]) })
it('item E has the good id', () => { expect(itemE.id).toBe(recordE.id) })
it('item E has gone status', () => { expect(itemE.status).toBe(ItemStatus.Gone) })
it('item E cannot be toggle', () => { expect(itemE.canBeToggle).toBe(false) })

const validApp = 'app12345678900000'
const invalidApp = 'app1234567890'
const validKey = 'key12345678900000'
const invalidKey = 'key123'

it('validate A without app and without key', () => { expect(validate()).toBe(false) })
it('validate B with valid app and without key', () => { expect(validate(validApp)).toBe(false) })
it('validate C without app and with valid key', () => { expect(validate(undefined, validKey)).toBe(false) })
it('validate D with valid app and with valid key', () => { expect(validate(validApp, validKey)).toBe(true) })
it('validate E with invalid app and invalid key', () => { expect(validate(invalidApp, invalidKey)).toBe(false) })

it('airtableUrl A with target plop', () => { expect(airtableUrl(validApp, validKey, 'plop')).toBe('https://api.airtable.com/v0/app12345678900000/plop?api_key=key12345678900000&view=all') })

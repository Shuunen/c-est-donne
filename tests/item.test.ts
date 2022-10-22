import { check, checksRun } from 'shuutils'
import { AirtableItemRecord } from '../src/models/airtable'
import { Item, ItemStatus } from '../src/models/item'
import { itemsService } from '../src/services/items'
import { User } from '../src/utils/user'

const userA: User = {
  name: 'John Doe',
  firstName: 'John',
  isConnected: true,
  hasAccess: true,
  picture: 'https://example.com/picture.jpg',
  email: 'john@gmail.com',
  AIRTABLE_API_APP: 'app1234567890',
  AIRTABLE_API_KEY: 'key1234567890',
}

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

const itemA = new Item(recordA, userA.email)

check('item A has the good name', itemA.name, recordA.fields.Name)
check('item A has the good id', itemA.id, recordA.id)
check('item A has no beneficiary', itemA.beneficiary, '')
check('item A has unknown status', itemA.status, ItemStatus.unknown)
check('item A has one image', itemA.images, [recordA.fields.Images[0].url])

const recordB: AirtableItemRecord = {
  id: 'rec456',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item B',
    Status: 'available',
  },
}

const itemB = new Item(recordB, userA.email)

check('item B has the good name', itemB.name, recordB.fields.Name)
check('item B has no images', itemB.images, [])
check('item B has the good id', itemB.id, recordB.id)
check('item B has no beneficiary', itemB.beneficiary, '')
check('item B has available status', itemB.status, ItemStatus.available)
check('item B toggle status', itemB.toggleStatus(), { newStatusAirtable: ItemStatus.reserved, newStatusFront: ItemStatus.reservedByMe })

const recordC: AirtableItemRecord = {
  id: 'rec789',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item C',
    Status: 'reserved',
    Beneficiary: 'mama@gmail.com',
  },
}

const itemC = new Item(recordC, userA.email)

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
    Beneficiary: userA.email,
  },
}

const itemD = new Item(recordD, userA.email)

check('item D has the good name', itemD.name, recordD.fields.Name)
check('item D has no images', itemD.images, [])
check('item D has the good id', itemD.id, recordD.id)
check('item D has reservedByMe status', itemD.status, ItemStatus.reservedByMe)
check('item D has the good beneficiary', itemD.beneficiary, userA.email)
check('item D toggle status', itemD.toggleStatus(), { newStatusAirtable: ItemStatus.available, newStatusFront: ItemStatus.available })

const recordE: AirtableItemRecord = {
  id: 'rec131415',
  createdTime: '2021-01-01T00:00:00.000Z',
  fields: {
    Name: 'super item E',
    Status: 'gone',
  },
}

const itemE = new Item(recordE, userA.email)

check('item E has the good name', itemE.name, recordE.fields.Name)
check('item E has no images', itemE.images, [])
check('item E has the good id', itemE.id, recordE.id)
check('item E has gone status', itemE.status, ItemStatus.gone)
check('item E toggle status is blocked', itemE.toggleStatus())

check('items service cannot validate without user', itemsService.validate(), false)
check('items service cannot build url without user', itemsService.airtableUrl(), false)

itemsService.onUser(userA)
check('items service has the good user', itemsService.user.email, userA.email)
check('items service has no valid airtable credentials', itemsService.validate(), false)

const userB: User = {
  name: 'Alice Doe',
  firstName: 'Alice',
  isConnected: true,
  hasAccess: true,
  picture: 'https://example.com/picture.jpg',
  email: 'alice@aol.com',
  AIRTABLE_API_APP: 'app12345678901234',
  AIRTABLE_API_KEY: 'key12345678901234',
}

itemsService.onUser(userB)
check('items service has the good user', itemsService.user.email, userB.email)
check('items service has valid airtable credentials', itemsService.validate(), true)

checksRun()

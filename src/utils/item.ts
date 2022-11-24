/* c8 ignore next */
import type { AirtableItemRecord } from './airtable'
import { updateItemStatus } from './items'

export const enum ItemCondition {
  acceptable = 'acceptable',
  good = 'good',
  veryGood = 'very-good',
  likeNew = 'like-new',
  unknown = 'unknown',
}

export const enum ItemStatus {
  available = 'available',
  reserved = 'reserved',
  reservedByMe = 'reserved-by-me',
  gone = 'gone',
  unknown = 'unknown',
}

export class Item {
  id = ''
  beneficiary = ''
  images: string[] = []
  name = ''
  notes = ''
  status = ItemStatus.unknown
  visible = true

  get canBeToggle (): boolean {
    return [ItemStatus.reservedByMe, ItemStatus.available].includes(this.status)
  }

  constructor (record: AirtableItemRecord, currentUserMail: string) {
    this.id = record.id
    this.beneficiary = record.fields.Beneficiary ?? ''
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    const status = record.fields.Status
    if (status === 'available') this.status = ItemStatus.available
    else if (status === 'reserved') this.status = this.beneficiary === currentUserMail ? ItemStatus.reservedByMe : ItemStatus.reserved
    else if (status === 'gone') this.status = ItemStatus.gone
    else this.status = ItemStatus.unknown
  }

  toggleStatus (): ItemStatus.reserved | ItemStatus.available | undefined {
    if (!this.canBeToggle) return
    const newStatus = this.status === ItemStatus.available ? ItemStatus.reserved : ItemStatus.available
    updateItemStatus(this.id, newStatus)
    return newStatus
  }
}

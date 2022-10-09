import { itemsService } from '../services/items'
import { log } from '../utils/logs'
import type { AirtableItemRecord } from './airtable'

export const enum ItemCondition {
  'acceptable' = 'acceptable',
  'good' = 'good',
  'very-good' = 'very-good',
  'like-new' = 'like-new',
  'unknown' = 'unknown',
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

  get canBeToggle (): boolean {
    return [ItemStatus.reservedByMe, ItemStatus.available].includes(this.status)
  }

  constructor (record: AirtableItemRecord, currentUserMail: string) {
    this.id = record.id
    this.beneficiary = record.fields.Beneficiary ?? ''
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    switch (record.fields.Status) {
      case 'available': {
        this.status = ItemStatus.available
        break
      }
      case 'reserved': {
        this.status = this.beneficiary === currentUserMail ? ItemStatus.reservedByMe : ItemStatus.reserved
        break
      }
      case 'gone': {
        this.status = ItemStatus.gone
        break
      }
      default: {
        this.status = ItemStatus.unknown
      }
    }
  }

  toggleStatus (): void {
    const newStatusAirtable = this.status === ItemStatus.available ? ItemStatus.reserved : ItemStatus.available
    const newStatusFront = this.status === ItemStatus.available ? ItemStatus.reservedByMe : ItemStatus.available
    log('toggling status from', this.status, 'to', newStatusAirtable)
    itemsService.updateItemStatus(this.id, newStatusAirtable, newStatusFront)
  }
}

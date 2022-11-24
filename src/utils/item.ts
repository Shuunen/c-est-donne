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

  public readonly beneficiary: string

  public readonly id: string

  public readonly images: string[]

  public readonly name: string

  public readonly notes: string

  public readonly status: ItemStatus

  public visible: boolean

  public constructor (record: AirtableItemRecord, currentUserMail: string) {
    this.beneficiary = record.fields.Beneficiary ?? ''
    this.id = record.id
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    const status = record.fields.Status
    if (status === 'available') this.status = ItemStatus.available
    else if (status === 'reserved') this.status = this.beneficiary === currentUserMail ? ItemStatus.reservedByMe : ItemStatus.reserved
    else if (status === 'gone') this.status = ItemStatus.gone
    else this.status = ItemStatus.unknown
    this.visible = true
  }

  public get canBeToggle (): boolean {
    return [ItemStatus.reservedByMe, ItemStatus.available].includes(this.status)
  }

  public toggleStatus (): ItemStatus.available | ItemStatus.reserved | undefined {
    if (!this.canBeToggle) return
    const updatedStatus = this.status === ItemStatus.available ? ItemStatus.reserved : ItemStatus.available
    void updateItemStatus(this.id, updatedStatus)
    return updatedStatus
  }
}

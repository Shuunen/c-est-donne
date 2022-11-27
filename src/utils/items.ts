import type { AirtableItemRecord } from './airtable'

export const enum ItemStatus {
  Available = 'available',
  Gone = 'gone',
  Reserved = 'reserved',
  Unknown = 'unknown',
  ReservedByMe = 'reserved-by-me',
}

export class Item {

  public readonly beneficiary: string

  public readonly createdTime: Date

  public readonly id: string

  public readonly images: string[]

  public readonly name: string

  public readonly notes: string

  public readonly status: ItemStatus

  public isVisible = true

  public constructor (record: AirtableItemRecord, currentUserMail: string) {
    this.beneficiary = record.fields.Beneficiary ?? ''
    this.createdTime = new Date(record.createdTime)
    this.id = record.id
    this.images = record.fields.Images?.map(image => image.url) ?? []
    this.name = record.fields.Name
    this.notes = record.fields.Notes ?? ''
    const status = record.fields.Status
    if (status === 'available') this.status = ItemStatus.Available
    else if (status === 'reserved') this.status = this.beneficiary === currentUserMail ? ItemStatus.ReservedByMe : ItemStatus.Reserved
    else if (status === 'gone') this.status = ItemStatus.Gone
    else this.status = ItemStatus.Unknown
  }

  public get canBeToggle (): boolean {
    return [ItemStatus.ReservedByMe, ItemStatus.Available].includes(this.status)
  }
}

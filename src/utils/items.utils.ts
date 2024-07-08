import type { DeepReadonly } from 'vue'
import type { AirtableItemRecord } from './airtable.utils'

export const enum ItemStatus {
  Available = 'available',
  Gone = 'gone',
  Reserved = 'reserved',
  ReservedByMe = 'reserved-by-me',
  Unknown = 'unknown',
}

// eslint-disable-next-line no-restricted-syntax, jsdoc/require-jsdoc
export class Item {

  public readonly beneficiary: string

  public readonly createdTime: Date

  public readonly id: string

  public readonly images: string[]

  public isVisible = true

  public readonly name: string

  public readonly notes: string

  public readonly status: ItemStatus

  /**
   * Item constructor
   * @param record the record data
   * @param currentUserMail the current user mail
   */
  public constructor (record: DeepReadonly<AirtableItemRecord>, currentUserMail: string) {
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

  /**
   * Check if can be toggled
   * @returns true if it can
   */
  public get canBeToggle () {
    return [ItemStatus.Available, ItemStatus.ReservedByMe].includes(this.status)
  }
}

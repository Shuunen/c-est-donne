
interface AirtableItemRecordImage {
  id: string
  url: string
}

export interface AirtableItemRecord {
  id: string
  createdTime: string
  fields: {
    /* eslint-disable @typescript-eslint/naming-convention */
    Beneficiary?: string
    Condition?: string
    Images?: AirtableItemRecordImage[]
    Name: string
    Notes?: string
    Status?: string
    ValueNew?: number
    ValueUsed?: number
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

export interface AirtableResponse {
  records?: AirtableItemRecord[]
  error?: {
    type: string
    message: string
  }
}

export const HEADERS_JSON = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  /* eslint-enable @typescript-eslint/naming-convention */
}

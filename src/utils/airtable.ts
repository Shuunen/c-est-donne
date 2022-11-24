
interface AirtableItemRecordImage {
  id: string
  url: string
}

export interface AirtableItemRecord {
  id: string
  createdTime: string
  fields: {
    Beneficiary?: string
    Condition?: string
    Images?: AirtableItemRecordImage[]
    Name: string
    Notes?: string
    Status?: string
    ValueNew?: number
    ValueUsed?: number
  }
}

export interface AirtableResponse {
  records?: AirtableItemRecord[]
  error?: {
    type: string
    message: string
  }
}

export const HeadersJson = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

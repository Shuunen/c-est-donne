
interface AirtableItemRecordImage {
  id: string
  url: string
}

const airtableApiAppKeyLength = 17

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

export const headersJson = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  /* eslint-enable @typescript-eslint/naming-convention */
}

export function validate (app?: string, key?: string): boolean {
  const isValidApp = app !== undefined && typeof app === 'string' && app.length === airtableApiAppKeyLength
  const isValidKey = key !== undefined && typeof key === 'string' && key.length === airtableApiAppKeyLength
  return isValidApp && isValidKey
}

export function airtableUrl (app: string, key: string, target = ''): boolean | string {
  return `https://api.airtable.com/v0/${app}/${target}?api_key=${key}&view=all`
}

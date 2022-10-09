/* c8 ignore next */
import { storage } from 'shuutils'

export interface User {
  name: string
  firstName: string
  isConnected: boolean
  hasAccess: boolean
  picture: string
  email: string
  AIRTABLE_API_KEY: string
  AIRTABLE_API_APP: string
}

/* c8 ignore next */
export const getUser = (): User => storage.get<User>('user', { name: '', firstName: '', isConnected: false, hasAccess: false, picture: '', email: '', AIRTABLE_API_KEY: '', AIRTABLE_API_APP: '' })

export const firstName = (fullName: string): string => {
  const first = fullName.match(/[^\s._-]+/g)
  return first?.[0] ?? fullName
}

import { copy } from 'shuutils'

export interface User {
  apiApp: string
  apiKey: string
  email: string
  firstName: string
  hasAccess: boolean
  isConnected: boolean
  name: string
  picture: string
}

export interface UserAuth0 extends Partial<Pick<User, 'email' | 'name' | 'picture'>> {
  AIRTABLE_API_KEY?: string // eslint-disable-line @typescript-eslint/naming-convention
  AIRTABLE_API_APP?: string // eslint-disable-line @typescript-eslint/naming-convention
}

export const emptyUser: User = { name: '', firstName: '', isConnected: false, hasAccess: false, picture: '', email: '', apiKey: '', apiApp: '' }

export function firstName (fullName: string): string {
  const first = fullName.match(/[^\s._-]+/gu)
  return first?.[0] ?? fullName
}

export function mergeUserData (userStored: User, userAuth0?: UserAuth0): User {
  const expected = copy(userStored)
  expected.name = userAuth0?.name ?? expected.name
  expected.firstName = firstName(expected.name)
  expected.picture = userAuth0?.picture ?? expected.picture
  expected.email = userAuth0?.email ?? expected.email
  expected.apiKey = userAuth0?.AIRTABLE_API_KEY ?? expected.apiKey
  expected.apiApp = userAuth0?.AIRTABLE_API_APP ?? expected.apiApp
  expected.isConnected = expected.email.length > 0
  expected.hasAccess = expected.apiKey.length > 0
  return expected
}

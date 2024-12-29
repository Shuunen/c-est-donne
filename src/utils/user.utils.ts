
export type User = {
  apiApp: string
  apiKey: string
  email: string
  firstName: string
  hasAccess: boolean
  isConnected: boolean
  name: string
  picture: string
}

export type UserAuth0 = Readonly<Partial<Pick<User, 'email' | 'name' | 'picture'>> & {
  AIRTABLE_API_APP?: string // eslint-disable-line @typescript-eslint/naming-convention
  AIRTABLE_API_KEY?: string // eslint-disable-line @typescript-eslint/naming-convention
}>

export const emptyUser: User = { apiApp: '', apiKey: '', email: '', firstName: '', hasAccess: false, isConnected: false, name: '', picture: '' }

/**
 * Get the firstname from a full name
 * @param fullName the full name to use
 * @returns the firstname
 */
export function firstName (fullName: string) {
  const first = fullName.match(/[^\s._-]+/gu)
  return first?.[0] ?? fullName
}

/**
 * Merge user data
 * @param userStored the stored user
 * @param userAuth0 the data from auth0
 * @returns the merged data
 */
// eslint-disable-next-line complexity, @typescript-eslint/prefer-readonly-parameter-types
export function mergeUserData (userStored: User, userAuth0?: UserAuth0) {
  const expected = { ...userStored }
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

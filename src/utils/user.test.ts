import { expect, it } from 'vitest'
import { type User, type UserAuth0, firstName, mergeUserData } from './user.utils'

const userA: User = {
  apiApp: '',
  apiKey: 'key1234567890',
  email: 'jo@jo.jo',
  firstName: '',
  hasAccess: false,
  isConnected: false,
  name: 'John Doe',
  picture: '',
}

const userAuth0Empty: UserAuth0 = {}
const expectedMergeA: User = {
  apiApp: userA.apiApp,
  apiKey: userA.apiKey,
  email: userA.email,
  firstName: 'John', // deduced from name
  hasAccess: true, // deduced from apiKey
  isConnected: true, // deduced from email
  name: userA.name,
  picture: userA.picture,
}

it('mergeUserData A', () => { expect(mergeUserData(userA, userAuth0Empty)).toStrictEqual(expectedMergeA) })
it('mergeUserData A did not affect param', () => { expect(userA.firstName).toBe('') })

// eslint-disable-next-line @typescript-eslint/naming-convention
const userAuth0B: UserAuth0 = { AIRTABLE_API_APP: 'app1234567890', AIRTABLE_API_KEY: 'key1234567890', name: 'Jane Doe', picture: 'https://example.com/picture.jpg' }
const expectedMergeB: User = {
  apiApp: String(userAuth0B.AIRTABLE_API_APP), // auth0 apiApp overrides user apiApp
  apiKey: String(userAuth0B.AIRTABLE_API_KEY), // auth0 apiKey overrides user apiKey
  email: userA.email, // auth0 email is not set, so user email is kept
  firstName: 'Jane', // deduced from auth0 name
  hasAccess: true, // see above
  isConnected: true, // see above
  name: String(userAuth0B.name), // auth0 name overrides user name
  picture: String(userAuth0B.picture), // auth0 picture overrides user picture
}

it('mergeUserData B', () => { expect(mergeUserData(userA, userAuth0B)).toStrictEqual(expectedMergeB) })

it('user fistName A', () => { expect(firstName('John Doe')).toBe('John') })
it('user fistName B', () => { expect(firstName('John')).toBe('John') })
it('user fistName C', () => { expect(firstName('John Doe Doe')).toBe('John') })
it('user fistName D', () => { expect(firstName('zoe.doe')).toBe('zoe') })
it('user fistName E', () => { expect(firstName('')).toBe('') })

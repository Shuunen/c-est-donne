import { expect, it } from 'vitest'
import { firstName, mergeUserData, type User, type UserAuth0 } from '../src/utils/user.utils'

const userA: User = {
  name: 'John Doe',
  firstName: '',
  isConnected: false,
  hasAccess: false,
  picture: '',
  email: 'jo@jo.jo',
  apiKey: 'key1234567890',
  apiApp: '',
}

const userAuth0Empty: UserAuth0 = {}
const expectedMergeA: User = {
  name: userA.name,
  firstName: 'John', // deduced from name
  isConnected: true, // deduced from email
  hasAccess: true, // deduced from apiKey
  picture: userA.picture,
  email: userA.email,
  apiKey: userA.apiKey,
  apiApp: userA.apiApp,
}

it('mergeUserData A', () => { expect(mergeUserData(userA, userAuth0Empty)).toStrictEqual(expectedMergeA) })
it('mergeUserData A did not affect param', () => { expect(userA.firstName).toBe('') })

// eslint-disable-next-line @typescript-eslint/naming-convention
const userAuth0B: UserAuth0 = { name: 'Jane Doe', picture: 'https://example.com/picture.jpg', AIRTABLE_API_KEY: 'key1234567890', AIRTABLE_API_APP: 'app1234567890' }
const expectedMergeB: User = {
  name: String(userAuth0B.name), // auth0 name overrides user name
  firstName: 'Jane', // deduced from auth0 name
  isConnected: true, // see above
  hasAccess: true, // see above
  picture: String(userAuth0B.picture), // auth0 picture overrides user picture
  email: userA.email, // auth0 email is not set, so user email is kept
  apiKey: String(userAuth0B.AIRTABLE_API_KEY), // auth0 apiKey overrides user apiKey
  apiApp: String(userAuth0B.AIRTABLE_API_APP), // auth0 apiApp overrides user apiApp
}

it('mergeUserData B', () => { expect(mergeUserData(userA, userAuth0B)).toStrictEqual(expectedMergeB) })

it('user fistName A', () => { expect(firstName('John Doe')).toBe('John') })
it('user fistName B', () => { expect(firstName('John')).toBe('John') })
it('user fistName C', () => { expect(firstName('John Doe Doe')).toBe('John') })
it('user fistName D', () => { expect(firstName('zoe.doe')).toBe('zoe') })
it('user fistName E', () => { expect(firstName('')).toBe('') })

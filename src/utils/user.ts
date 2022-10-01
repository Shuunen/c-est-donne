import { storage } from 'shuutils'

interface User {
  name: string
  picture: string
  email: string
  AIRTABLE_API_KEY: string
  AIRTABLE_API_APP: string
}

export const getUser = ():User => storage.get<User>('user', { name: '', picture: '', email: '', AIRTABLE_API_KEY: '', AIRTABLE_API_APP: '' })

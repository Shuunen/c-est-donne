import { storage } from 'shuutils'

interface User {
  name: string
  firstName: string
  picture: string
  email: string
  AIRTABLE_API_KEY: string
  AIRTABLE_API_APP: string
}

export const getUser = ():User => storage.get<User>('user', { name: '', firstName: '', picture: '', email: '', AIRTABLE_API_KEY: '', AIRTABLE_API_APP: '' })

export const firstName = (fullName:string):string => {
  const first = fullName.match(/[^\s._-]+/g)
  return first?.[0] ?? fullName
}

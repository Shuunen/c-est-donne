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

export const EMPTY_USER: User = { name: '', firstName: '', isConnected: false, hasAccess: false, picture: '', email: '', apiKey: '', apiApp: '' }

export const firstName = (fullName: string): string => {
  const first = fullName.match(/[^\s._-]+/g)
  return first?.[0] ?? fullName
}

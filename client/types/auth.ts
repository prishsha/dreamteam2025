export interface IsAuthenticatedResponse {
  is_admin?: boolean
  is_authenticated: boolean
  error?: string
  user?: User
}

export interface User {
  id: number
  email: string
  name: string
  givenName: string
  familyName: string
  picture: string
}


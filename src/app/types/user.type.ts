export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  enabled: boolean
  emailVerified: boolean
  phone: string
  address: string
  address1: string
  address2: string
  address3: string
  address4: string
  gender: string
  createdAt: string
  modifiedAt: string
  roles?: string[]
  disableReason: string
}

export interface UserRegister {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

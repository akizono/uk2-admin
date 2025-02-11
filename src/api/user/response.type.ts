import type { Role } from '@/store/model/auth/interfaces'
import type { BaseUser } from './dto.type'

export interface UserInfo extends BaseUser {}

export interface UserList {
  total: number
  list: {
    userInfo: UserInfo
    role: Role[]
  }[]
}

export interface CreateUser {
  id: string
  password: string
}

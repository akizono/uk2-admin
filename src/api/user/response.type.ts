import type { Role } from '@/store/model/auth/interfaces'
import type { BaseUserDTO } from './dto.type'

export interface UserInfo extends BaseUserDTO {
  id: string
}

export interface UserList {
  total: number
  list: {
    userInfo: UserInfo
    role: Role[]
  }[]
}

export interface CreateUserResponse extends UserInfo {
  password: string
}

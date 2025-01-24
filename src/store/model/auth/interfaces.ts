import type { UserInfo } from '@/api/user/response.type'

export type Role = string

export interface AuthState {
  userInfo: UserInfo | null
  role: Role[]
  accessToken: string
}

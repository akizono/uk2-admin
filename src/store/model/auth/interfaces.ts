import type { UserInfo } from '@/api/auth/interfaces'

export type Role = string

export interface AuthState {
  userInfo: UserInfo | null
  role: Role[]
  token: string
}

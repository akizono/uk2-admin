import type * as USER_RESPONSE from '@/api/user/response.type'

export type Role = string

export interface AuthState {
  userInfo: USER_RESPONSE.UserInfo | null
  role: Role[]
  accessToken: string
}

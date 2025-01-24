import type { Role } from '@/store/model/auth/interfaces'
import type { UserInfo } from '@/api/user/response.type'

export interface Token {
  accessToken: string
  refreshToken: string
}

/** 登入介面返回的資料結構 */
export interface LoginResponse {
  userInfo: UserInfo
  role: Role[]
  token: Token
}

/** 刷新 Token 的介面返回的資料結構 */
export type RefreshTokenResponse = Token

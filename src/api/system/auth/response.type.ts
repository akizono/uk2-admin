import type { UserInfo } from '@/api/user/response.type'
import type { Role } from '@/store/model/auth/interfaces'

export interface Token {
  accessToken: string
  refreshToken: string
}

/** 登入介面返回的資料結構 */
export interface Login {
  userInfo: UserInfo
  role: Role[]
  token: Token
}

/** 刷新 Token 的介面返回的資料結構 */
export type RefreshToken = Token

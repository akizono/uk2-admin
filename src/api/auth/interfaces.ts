import type { Role } from '@/store/model/auth/interfaces'

export interface UserInfo {
  id: string
  username: string
  nickname: string | null
  age: number | null
  remark: string | null
  email: string | null
  mobile: string | null
  sex: string | null
  avatar: string | null
  status: number
  isDeleted: number
  createTime: string
  updateTime: string
}

export interface Token {
  accessToken: string
  refreshToken: string
}

/** 登入介面返回的資料結構 */
export interface LoginResponseData {
  userInfo: UserInfo
  role: Role[]
  token: Token
}

/** 刷新 Token 的介面返回的資料結構 */
export type RefreshTokenResponseData = Token

import type { ApiResponse } from '@/utils/request/types'
import type * as interfaces from './interfaces'
import type * as vos from './vos'
import { local } from '@/utils'
import request from '@/utils/request'

// 登入（使用帳號密碼）
export const loginUrl = '/auth/login'
export function login(data: vos.AuthLoginVO): ApiResponse<interfaces.LoginResponseData> {
  return request.post({
    url: loginUrl,
    data,
    headers: {
      'skip-auth-token': true, // 跳過 Token 驗證
    },
  })
}

// 更新 Token
export const refreshTokenMethodUrl = '/auth/refreshTokenMethod'
export function refreshTokenMethod(): ApiResponse<interfaces.RefreshTokenResponseData> {
  return request.post({
    url: refreshTokenMethodUrl,
    headers: {
      'refresh-token': `Bearer ${local.get('refreshToken')}`,
    },
  })
}

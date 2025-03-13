import type * as DTO from './dto.type'
import type * as RESPONSE from './response.type'
import type { ApiResponse } from '@/utils/request/types'

import { local } from '@/utils'
import request from '@/utils/request'

// 登入（使用帳號密碼）
export const loginUrl = '/auth/login'
export function login(data: DTO.LoginCredentials): ApiResponse<RESPONSE.Login> {
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
export function refreshTokenMethod(): ApiResponse<RESPONSE.RefreshToken> {
  return request.post({
    url: refreshTokenMethodUrl,
    headers: {
      'refresh-token': `Bearer ${local.get('refreshToken')}`,
    },
  })
}

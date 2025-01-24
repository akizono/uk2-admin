import type { ApiResponse } from '@/utils/request/types'
import type * as reqTypes from './dto.type'
import type * as resTypes from './response.type'

import request from '@/utils/request'

import { local } from '@/utils'

// 登入（使用帳號密碼）
export const loginUrl = '/auth/login'
export function login(data: reqTypes.AuthLoginDTO): ApiResponse<resTypes.LoginResponse> {
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
export function refreshTokenMethod(): ApiResponse<resTypes.RefreshTokenResponse> {
  return request.post({
    url: refreshTokenMethodUrl,
    headers: {
      'refresh-token': `Bearer ${local.get('refreshToken')}`,
    },
  })
}

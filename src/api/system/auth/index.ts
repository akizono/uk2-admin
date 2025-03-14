import type { UserVo } from '../user/'

import { local } from '@/utils'
import request from '@/utils/request'

export interface LoginVO {
  username: string
  password: string
}

export interface RefreshTokenVO {
  accessToken: string
  refreshToken: string
}

// 登入（使用帳號密碼）
export const loginUrl = '/system/auth/login'
export function login(data: LoginVO): ApiResponse<UserVo> {
  return request.post({
    url: loginUrl,
    data,
    headers: {
      'skip-auth-token': true, // 跳過 Token 驗證
    },
  })
}

// 更新 Token
export const refreshTokenMethodUrl = '/system/auth/refreshTokenMethod'
export function refreshTokenMethod(): ApiResponse<RefreshTokenVO> {
  return request.post({
    url: refreshTokenMethodUrl,
    headers: {
      'refresh-token': `Bearer ${local.get('refreshToken')}`,
    },
  })
}

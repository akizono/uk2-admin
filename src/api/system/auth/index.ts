import type { UserVo } from '../user/'

import { i18n } from '@/modules/i18n'
import { local } from '@/utils'
import request from '@/utils/request'

const t = i18n.global.t

export interface LoginVO {
  username: string
  password: string
}

export interface RefreshTokenVO {
  accessToken: string
  refreshToken: string
}

interface RegisterVO extends UserVo {
  verifyCode: string
  verifyCodeType: VerifyCodeType
  password: string
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

// ------------------------------------------------------------
// 以下是「註冊」的相關方法
// ------------------------------------------------------------

// 發送註冊的「驗證碼」到使用者信箱
export function sendRegisterEmail(data: { email: string }) {
  return request.post({
    url: '/system/auth/send-register-email',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.operationTooFrequent') },
        { code: 409, message: t('account.mobileOrEmailExist') },
      ],
    },
  })
}

// 發送註冊的「驗證碼」到使用者手機
export function sendRegisterMobile(data: { mobile: string }) {
  return request.post({
    url: '/system/auth/send-register-mobile',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.operationTooFrequent') },
        { code: 409, message: t('account.mobileOrEmailExist') },
      ],
    },
  })
}

// 註冊
export function register(data: RegisterVO) {
  return request.post({
    url: '/system/auth/register',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.verifyCodeError') },
      ],
    },
  })
}

// ------------------------------------------------------------
// 以下是「密碼找回」的相關方法
// ------------------------------------------------------------

// 檢查使用者是否擁有手機號碼或者信箱
export function checkUserHasMobileOrEmail(params: { username: string }): ApiResponse<{ hasMobile: boolean, hasEmail: boolean }> {
  return request.get({
    url: '/system/auth/check-user-has-mobile-or-email',
    params,
    headers: {
      'specify-error-message': [
        { code: 409, message: t('account.mobileOrEmailExist') },
      ],
    },
  })
}

// 發送找回密碼的「驗證碼」到使用者信箱
export function sendResetPasswordEmail(data: { username: string }) {
  return request.post({
    url: '/system/auth/send-reset-password-email',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.operationTooFrequent') },
      ],
    },
  })
}

// 發送找回密碼的「驗證碼」到使用者手機
export function sendResetPasswordMobile(data: { username: string }) {
  return request.post({
    url: '/system/auth/send-reset-password-mobile',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.operationTooFrequent') },
      ],
    },
  })
}

// 修改密碼
export function updatePassword(data: {
  username: string
  password: string
  verifyCode: string
  verifyCodeType: VerifyCodeType
}) {
  return request.post({
    url: '/system/auth/update-password',
    data,
    headers: {
      'specify-error-message': [
        { code: 400, message: t('login.verifyCodeError') },
      ],
    },
  })
}

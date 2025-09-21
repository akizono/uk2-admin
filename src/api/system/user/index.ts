import type { DeptVO } from '../dept'

import { $t } from '@/utils'
import request from '@/utils/request'

export interface Token {
  accessToken: string
  refreshToken: string
}

export interface UserVO extends Api.BaseVO {
  id: string
  username: string
  nickname: string
  age: number
  sex: number
  email: string
  mobile: string
  avatar: string

  dept: DeptVO
  deptId: string
  deptName: string

  role: string[]
  roleIds: string[]
  roleNames: string[]
  token?: Token
}

export const UserApi = {
  /** 獲取使用者分頁列表 */
  getUserList: async (params: PageParams & Partial<UserVO>): PageRes<UserVO> => {
    return await request.get({ url: '/system/user/list', params })
  },

  /** 獲取使用者資料 */
  getUser: async (id: string): ApiResponse<UserVO> => {
    return await request.get({ url: `/system/user/get/${id}` })
  },

  /** 新增使用者 */
  createUser: async (data: UserVO) => {
    return await request.post({ url: '/system/user/create', data })
  },

  /** 修改使用者個人資訊 */
  updateUser: async (data: Partial<UserVO> & { password?: string }) => {
    return await request.put({ url: '/system/user/update', data, isFilterEmpty: false })
  },

  /** 刪除使用者 */
  deleteUser: async (id: string) => {
    return await request.delete({ url: `/system/user/delete/${id}` })
  },

  /** 封鎖使用者 */
  blockUser: async (id: string) => {
    return await request.put({ url: `/system/user/block/${id}` })
  },

  /** 解封使用者 */
  unblockUser: async (id: string) => {
    return await request.put({ url: `/system/user/unblock/${id}` })
  },

  /** 發送用於綁定信箱的「驗證碼」到使用者信箱 */
  sendBindEmail: async (data: { email: string }) => {
    return await request.post({
      url: '/system/user/send-bind-email',
      data,
      headers: {
        'specify-error-message': [
          { code: 400, message: $t('common.operationTooFrequent') },
          { code: 409, message: $t('user.emailExist') },
        ],
      },
    })
  },

  /** 發送用於綁定手機號碼的「驗證碼」到使用者手機 */
  sendBindMobile: async (data: { mobile: string }) => {
    return await request.post({
      url: '/system/user/send-bind-mobile',
      data,
      headers: {
        'specify-error-message': [
          { code: 400, message: $t('common.operationTooFrequent') },
          { code: 409, message: $t('user.mobileExist') },
        ],
      },
    })
  },

  /** 綁定信箱或者手機 */
  bindEmailOrMobile: async (data: {
    verifyCode: string
    verifyCodeType: VerifyCodeType
    email?: string
    mobile?: string
  }) => {
    return await request.put({
      url: '/system/user/bind-email-or-mobile',
      data,
      headers: {
        'specify-error-message': [
          { code: 400, message: $t('user.verifyCodeError') },
        ],
      },
    })
  },

  /** 修改個人資訊 */
  updatePersonalInfo: async (data: Partial<Omit<UserVO, keyof Api.BaseVO | 'id' | 'username' | 'email' | 'mobile' | 'role' | 'roleIds' | 'roleNames' | 'token'>>) => {
    return await request.put({ url: '/system/user/update-personal-info', data })
  },

  /** 獲取個人資訊 */
  getPersonalInfo: async (): ApiResponse<UserVO> => {
    return await request.get({ url: '/system/user/get-personal-info' })
  },

  /** 修改個人密碼 */
  updatePersonalPassword: async (data: { oldPassword: string, newPassword: string }) => {
    return await request.put({
      url: '/system/user/update-personal-password',
      data,
      headers: {
        'specify-error-message': [
          { code: 400, message: $t('user.oldPasswordError') },
        ],
      },
    })
  },
}

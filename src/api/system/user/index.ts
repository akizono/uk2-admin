import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface Token {
  accessToken: string
  refreshToken: string
}

export interface UserVo extends BaseVO {
  id?: string
  username?: string
  nickname?: string
  age?: number
  sex?: number
  email?: string
  mobile?: string
  avatar?: string

  role?: string[]
  roleIds?: string[]
  token?: Token
}

export const UserApi = {
  /** 獲取使用者分頁列表 */
  getUserPage: async (params: PageParams): PageRes<UserVo> => {
    return await request.get({ url: '/system/user/page', params })
  },

  /** 新增使用者 */
  createUser: async (data: UserVo) => {
    return await request.post({ url: '/system/user/create', data })
  },

  /** 修改使用者個人資訊 */
  updateUser: async (data: UserVo) => {
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
}

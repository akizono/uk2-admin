import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface RoleVO extends BaseVO {
  id: string
  code: string
  name: string
  description: string
}

export const RoleApi = {
  /** 獲取角色分頁列表 */
  getRolePage: async (params: PageParams & Partial<RoleVO>): PageRes<RoleVO> => {
    return await request.get({ url: '/system/role/page', params })
  },

  /** 新增角色 */
  createRole: async (data: RoleVO) => {
    return await request.post({ url: '/system/role/create', data })
  },

  /** 修改角色 */
  updateRole: async (data: RoleVO) => {
    return await request.put({ url: '/system/role/update', data })
  },

  /** 刪除角色 */
  deleteRole: async (id: string) => {
    return await request.delete({ url: `/system/role/delete/${id}` })
  },

  /** 封鎖角色 */
  blockRole: async (id: string) => {
    return await request.put({ url: `/system/role/block/${id}` })
  },

  /** 解封角色 */
  unblockRole: async (id: string) => {
    return await request.put({ url: `/system/role/unblock/${id}` })
  },
}

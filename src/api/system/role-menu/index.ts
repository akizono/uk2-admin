import request from '@/utils/request'

export interface RoleMenuVO extends Api.BaseVO {
  id: string
  roleId: string
  menuId: string
}

export const RoleMenuApi = {
  /** 獲取 RoleMenu分頁列表 */
  getRoleMenuPage: async (params: PageParams & Partial<RoleMenuVO>): PageRes<RoleMenuVO> => {
    return await request.get({ url: '/system/role-menu/page', params })
  },

  /** 批次更新 */
  batchUpdate: async (data: {
    roleId: string
    menuIds: string[]
  }): Promise<void> => {
    return await request.put({ url: '/system/role-menu/batch-update', data })
  },
}

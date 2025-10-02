import request from '@/utils/request'

export interface RoleVO extends Api.BaseVO {
  id: string
  code: string
  name: string
  description: string
}

export const RoleApi = {
  /** 獲取角色分頁列表 */
  getRoleList: async (params: PageParams & Partial<RoleVO>): PageRes<RoleVO> => {
    return await request.get({ url: '/platform-api/system/role/list', params })
  },

  /** 獲取角色資料 */
  getRole: async (id: string): ApiResponse<RoleVO> => {
    return await request.get({ url: `/platform-api/system/role/get/${id}` })
  },

  /** 新增角色 */
  createRole: async (data: RoleVO) => {
    return await request.post({ url: '/platform-api/system/role/create', data })
  },

  /** 修改角色 */
  updateRole: async (data: RoleVO) => {
    return await request.put({ url: '/platform-api/system/role/update', data })
  },

  /** 刪除角色 */
  deleteRole: async (id: string) => {
    return await request.delete({ url: `/platform-api/system/role/delete/${id}` })
  },

  /** 封鎖角色 */
  blockRole: async (id: string) => {
    return await request.put({ url: `/platform-api/system/role/block/${id}` })
  },

  /** 解封角色 */
  unblockRole: async (id: string) => {
    return await request.put({ url: `/platform-api/system/role/unblock/${id}` })
  },
}

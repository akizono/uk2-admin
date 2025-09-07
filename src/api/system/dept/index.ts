import type { UserVO } from '../user'

import request from '@/utils/request'

export interface DeptVO extends Api.BaseVO {
  id: string
  parentId: string
  name: string
  sort: number
  leaderUserId: string
  leaderUser: UserVO
}

export const DeptApi = {
  /** 獲取部門分頁列表 */
  getDeptPage: async (params: PageParams & Partial<DeptVO>): PageRes<DeptVO> => {
    return await request.get({ url: '/system/dept/page', params })
  },

  /** 獲取「當前系統語言」版本的「部門分頁列表」 */
  getDeptPageByLang: async (params: PageParams & Partial<DeptVO>): PageRes<DeptVO> => {
    return await request.getByLang({ url: '/system/dept/page', params })
  },

  /** 新增部門 */
  createDept: async (data: DeptVO) => {
    return await request.post({ url: '/system/dept/create', data })
  },

  /** 修改部門 */
  updateDept: async (data: DeptVO) => {
    return await request.put({ url: '/system/dept/update', data, isFilterEmpty: false })
  },

  /** 刪除部門 */
  deleteDept: async (id: string) => {
    return await request.delete({ url: `/system/dept/delete/${id}` })
  },

  /** 封鎖部門 */
  blockDept: async (id: string) => {
    return await request.put({ url: `/system/dept/block/${id}` })
  },

  /** 解封部門 */
  unblockDept: async (id: string) => {
    return await request.put({ url: `/system/dept/unblock/${id}` })
  },
}

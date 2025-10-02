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
  getDeptList: async (params: PageParams & Partial<DeptVO>): PageRes<DeptVO> => {
    return await request.get({ url: '/platform-api/system/dept/list', params })
  },

  /** 獲取「當前系統語言」版本的「部門分頁列表」 */
  getDeptListByLang: async (params: PageParams & Partial<DeptVO>): PageRes<DeptVO> => {
    return await request.getByLang({ url: '/platform-api/system/dept/list', params })
  },

  /** 獲取部門資料 */
  getDept: async (id: string): ApiResponse<DeptVO> => {
    return await request.get({ url: `/platform-api/system/dept/get/${id}` })
  },

  /** 獲取「當前系統語言」版本的「部門資料」 */
  getDeptByLang: async (id: string): ApiResponse<DeptVO> => {
    return await request.getByLang({ url: `/platform-api/system/dept/get/${id}` })
  },

  /** 新增部門 */
  createDept: async (data: DeptVO) => {
    return await request.post({ url: '/platform-api/system/dept/create', data })
  },

  /** 修改部門 */
  updateDept: async (data: DeptVO) => {
    return await request.put({ url: '/platform-api/system/dept/update', data, isFilterEmpty: false })
  },

  /** 刪除部門 */
  deleteDept: async (id: string) => {
    return await request.delete({ url: `/platform-api/system/dept/delete/${id}` })
  },

  /** 封鎖部門 */
  blockDept: async (id: string) => {
    return await request.put({ url: `/platform-api/system/dept/block/${id}` })
  },

  /** 解封部門 */
  unblockDept: async (id: string) => {
    return await request.put({ url: `/platform-api/system/dept/unblock/${id}` })
  },
}

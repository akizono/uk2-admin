import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface LanguageVO extends BaseVO {
  id: string
  name: string
  code: string
  sort: number

}

export const LanguageApi = {
  /** 獲取語言分頁列表 */
  getLanguagePage: async (params: PageParams & Partial<LanguageVO>): PageRes<LanguageVO> => {
    return await request.get({ url: '/system/language/page', params })
  },

  /** 新增語言 */
  createLanguage: async (data: LanguageVO) => {
    return await request.post({ url: '/system/language/create', data })
  },

  /** 修改語言 */
  updateLanguage: async (data: LanguageVO) => {
    return await request.put({ url: '/system/language/update', data, isFilterEmpty: false })
  },

  /** 刪除語言 */
  deleteLanguage: async (id: string) => {
    return await request.delete({ url: `/system/language/delete/${id}` })
  },

  /** 封鎖語言 */
  blockLanguage: async (id: string) => {
    return await request.put({ url: `/system/language/block/${id}` })
  },

  /** 解封語言 */
  unblockLanguage: async (id: string) => {
    return await request.put({ url: `/system/language/unblock/${id}` })
  },
}

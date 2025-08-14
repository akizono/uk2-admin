import request from '@/utils/request'

export interface DictTypeVO extends Api.BaseVO {
  id: string
  name: string
  type: string
  sort: number
}

export const DictTypeApi = {
  /** 獲取字典類型分頁列表 */
  getDictTypePage: async (params: PageParams & Partial<DictTypeVO>): PageRes<DictTypeVO> => {
    return await request.get({ url: '/system/dict-type/page', params })
  },

  /** 獲取「當前系統語言」版本的「字典類型分頁列表」 */
  getDictTypePageByLang: async (params: PageParams & Partial<DictTypeVO>): PageRes<DictTypeVO> => {
    return await request.getByLang({ url: '/system/dict-type/page', params })
  },

  /** 新增字典類型 */
  createDictType: async (data: DictTypeVO) => {
    return await request.post({ url: '/system/dict-type/create', data })
  },

  /** 修改字典類型 */
  updateDictType: async (data: DictTypeVO) => {
    return await request.put({ url: '/system/dict-type/update', data, isFilterEmpty: false })
  },

  /** 刪除字典類型 */
  deleteDictType: async (id: string) => {
    return await request.delete({ url: `/system/dict-type/delete/${id}` })
  },

  /** 封鎖字典類型 */
  blockDictType: async (id: string) => {
    return await request.put({ url: `/system/dict-type/block/${id}` })
  },

  /** 解封字典類型 */
  unblockDictType: async (id: string) => {
    return await request.put({ url: `/system/dict-type/unblock/${id}` })
  },
}

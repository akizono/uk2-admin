import type { BaseVO } from '@/typings/base'

import request from '@/utils/request'

export interface DictDataVO extends BaseVO {
  id: string
  dictType: string
  label: string
  value: any // 資料庫中是varchar，但是在前端會根據dataType進行轉化，所以這裡是any
  dataType: 'undefined' | 'null' | 'number' | 'string' | 'boolean'
  sort: number
}

export const DictDataApi = {
  /** 獲取字典數據分頁列表 */
  getDictDataPage: async (params: PageParams): PageRes<DictDataVO> => {
    return await request.get({ url: '/system/dict-data/page', params })
  },

  /** 新增字典數據 */
  createDictData: async (data: DictDataVO) => {
    return await request.post({ url: '/system/dict-data/create', data })
  },

  /** 修改字典數據 */
  updateDictData: async (data: DictDataVO) => {
    return await request.put({ url: '/system/dict-data/update', data, isFilterEmpty: false })
  },

  /** 刪除字典數據 */
  deleteDictData: async (id: string) => {
    return await request.delete({ url: `/system/dict-data/delete/${id}` })
  },

  /** 封鎖字典數據 */
  blockDictData: async (id: string) => {
    return await request.put({ url: `/system/dict-data/block/${id}` })
  },

  /** 解封字典數據 */
  unblockDictData: async (id: string) => {
    return await request.put({ url: `/system/dict-data/unblock/${id}` })
  },
}

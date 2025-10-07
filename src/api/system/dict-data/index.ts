import request from '@/utils/request'

export interface DictDataVO extends Api.BaseVO {
  id: string
  dictType: string
  label: string
  value: any // 資料庫中是varchar，但是在前端會根據dataType進行轉化，所以這裡是any
  dataType: 'undefined' | 'null' | 'number' | 'string' | 'boolean'
  sort: number
}

export const DictDataApi = {
  /** 獲取字典數據分頁列表 */
  getDictDataList: async (params: PageParams & Partial<DictDataVO>): PageRes<DictDataVO> => {
    return await request.get({ url: '/platform-api/system/dict-data/list', params })
  },

  /** 獲取「當前系統語言」版本的「字典數據分頁列表」 */
  getDictDataListByLang: async (params: PageParams & Partial<DictDataVO> & { dictTypeStatus?: number }): PageRes<DictDataVO> => {
    return await request.getByLang({ url: '/platform-api/system/dict-data/list', params })
  },

  /** 獲取字典數據資料 */
  getDictData: async (id: string): ApiResponse<DictDataVO> => {
    return await request.get({ url: `/platform-api/system/dict-data/get/${id}` })
  },

  /** 獲取「當前系統語言」版本的「字典數據資料」 */
  getDictDataByLang: async (id: string): ApiResponse<DictDataVO> => {
    return await request.getByLang({ url: `/platform-api/system/dict-data/get/${id}` })
  },

  /** 新增字典數據 */
  createDictData: async (data: DictDataVO) => {
    return await request.post({ url: '/platform-api/system/dict-data/create', data })
  },

  /** 修改字典數據 */
  updateDictData: async (data: DictDataVO) => {
    return await request.put({ url: '/platform-api/system/dict-data/update', data, isFilterEmpty: false })
  },

  /** 刪除字典數據 */
  deleteDictData: async (id: string) => {
    return await request.delete({ url: `/platform-api/system/dict-data/delete/${id}` })
  },

  /** 封鎖字典數據 */
  blockDictData: async (id: string) => {
    return await request.put({ url: `/platform-api/system/dict-data/block/${id}` })
  },

  /** 解封字典數據 */
  unblockDictData: async (id: string) => {
    return await request.put({ url: `/platform-api/system/dict-data/unblock/${id}` })
  },
}

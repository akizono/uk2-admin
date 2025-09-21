import { useLanguageStore } from '@/store/model/language'
import request from '@/utils/request'

const languageStore = useLanguageStore()

export interface MultilingualFieldsVO extends Api.BaseVO {
  id: string
  fieldId: string
  language: string
  value: number

  ifNewLanguage?: boolean
  isUpdated?: boolean
}

export const MultilingualFieldsApi = {
  /** 獲取多語言欄位分頁列表 */
  getMultilingualFieldsList: async (params: PageParams & Partial<MultilingualFieldsVO>): PageRes<MultilingualFieldsVO> => {
    return await request.get({ url: '/system/multilingual-fields/list', params })
  },

  /** 新增多語言欄位 */
  createMultilingualFields: async (data: MultilingualFieldsVO) => {
    return await request.post({ url: '/system/multilingual-fields/create', data })
  },

  /** 批次新增多語言欄位 */
  createMultilingualFieldsBatch: async (data: MultilingualFieldsVO[]) => {
    return await request.post({ url: '/system/multilingual-fields/create-batch', data })
  },

  /** 修改多語言欄位 */
  updateMultilingualFields: async (data: MultilingualFieldsVO) => {
    return await request.put({ url: '/system/multilingual-fields/update', data })
  },

  /** 批次修改多語言欄位 */
  updateMultilingualFieldsBatch: async (data: MultilingualFieldsVO[]) => {
    return await request.put({ url: '/system/multilingual-fields/update-batch', data })
  },

  /** 刪除多語言欄位 */
  deleteMultilingualFields: async (id: string) => {
    return await request.delete({ url: `/system/multilingual-fields/delete/${id}` })
  },

  /** 封鎖多語言欄位 */
  blockMultilingualFields: async (id: string) => {
    return await request.put({ url: `/system/multilingual-fields/block/${id}` })
  },

  /** 解封多語言欄位 */
  unblockMultilingualFields: async (id: string) => {
    return await request.put({ url: `/system/multilingual-fields/unblock/${id}` })
  },

  /** 將「字串」轉換為其他語言 */
  convertLanguage: async (data: { text: string }) => {
    const targetLanguages = languageStore.languageCodeList
    return await request.post({ url: '/system/multilingual-fields/ai/convert-language', data: { ...data, targetLanguages } })
  },
}

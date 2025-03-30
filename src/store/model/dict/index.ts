import { DictDataApi } from '@/api/system/dict-data'
import { session } from '@/utils'

export interface DictItem {
  value: string | number
  label: string
  [key: string]: any
}

/**
 * 字典映射類型
 */
type DictMap = Record<string, DictItem[]>

/**
 * 字典儲存模組
 * 用於管理系統中的字典數據，支持快取和併發請求最佳化
 */
export const useDictStore = defineStore('dict-store', {
  state: () => {
    return {
      /** 字典數據快取 */
      dictMap: {} as DictMap,
      /** 正在進行中的請求映射，用於防止重複請求 */
      pendingRequests: new Map<string, Promise<DictItem[]>>(),
    }
  },
  actions: {
    /**
     * 獲取字典數據並返回多種格式的訪問方法
     * @param type 字典類型
     * @returns 包含多種格式的字典數據訪問器
     */
    async dict(type: string) {
      // 調用前初始化
      if (!this.dictMap) {
        this.initDict()
      }

      const targetDict = await this.getDict(type)

      return {
        data: () => targetDict,
        enum: () => Object.fromEntries(targetDict.map(({ value, label }) => [value, label])),
        valueMap: () => Object.fromEntries(targetDict.map(({ value, ...data }) => [value, data])),
        labelMap: () => Object.fromEntries(targetDict.map(({ label, ...data }) => [label, data])),
      }
    },

    /**
     * 獲取字典數據，優先從快取中獲取，如果快取中不存在則從網路獲取
     * 使用 Promise 快取機制避免併發請求
     * @param type 字典類型
     * @returns 字典數據列表
     */
    async getDict(type: string) {
      const isExist = Reflect.has(this.dictMap, type)

      // 如果快取中存在，直接返回
      if (isExist) {
        return this.dictMap[type]
      }

      // 檢查是否有正在進行的請求
      const pendingRequest = this.pendingRequests.get(type)
      if (pendingRequest) {
        return pendingRequest
      }

      // 創建新的請求
      const promise = this.getDictByNet(type)
      this.pendingRequests.set(type, promise)

      try {
        const result = await promise
        return result
      }
      finally {
        // 請求完成後，刪除 pending 狀態
        this.pendingRequests.delete(type)
      }
    },

    /**
     * 從網路獲取字典數據
     * @param type 字典類型
     * @returns 字典數據列表
     * @throws 當網路請求失敗時拋出錯誤
     */
    async getDictByNet(type: string) {
      try {
        const { data: result } = await DictDataApi.getDictDataPage({
          pageSize: 0,
          currentPage: 1,
          // @ts-expect-error neglect
          dictType: type,
        })
        Reflect.set(this.dictMap, type, result.list)
        // 同步至session
        session.set('dict', this.dictMap)
        return result.list
      }
      catch {
        throw new Error(`Failed to get ${type} dictionary from network, check ${type} field or network`)
      }
    },

    /**
     * 初始化字典數據，從 session 中恢復快取
     */
    initDict() {
      const dict = session.get('dict')
      if (dict) {
        Object.assign(this.dictMap, dict)
      }
    },
  },
})

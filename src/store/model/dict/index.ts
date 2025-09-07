import { DictDataApi } from '@/api/system/dict-data'
import { $t, session } from '@/utils'

export interface DictItem {
  value: string | number
  label: string
  [key: string]: any
}

/**
 * 字典映射類型
 */
export type DictMap = Record<string, DictItem[]>

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
      /** 失敗的字典類型，避免無限重試 */
      failedTypes: new Set<string>(),
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

      // 如果之前載入失敗，返回空數組而不是重試
      if (this.failedTypes.has(type)) {
        return []
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
        // 載入成功，從失敗列表中移除
        this.failedTypes.delete(type)
        return result
      }
      catch {
        // 載入失敗，加入失敗列表
        this.failedTypes.add(type)
        // 返回空數組而不是拋出錯誤
        return []
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
        const { data: result } = await DictDataApi.getDictDataPageByLang({
          pageSize: 0,
          currentPage: 1,
          dictType: type,
          dictTypeStatus: 1,
          status: 1,
        })

        for (const item of result.list) {
          const dataType = item.dataType
          const value = item.value

          // 將資料庫中的數據轉化為「對應的類型」
          switch (dataType) {
            case 'undefined':
              item.value = undefined
              break
            case 'null':
              item.value = null
              break
            case 'number':
              item.value = Number(value) ?? null
              break
            case 'string':
              item.value = String(value)
              break
            case 'boolean':
              item.value = String(value) === 'true' ? true : (String(value) === 'false' ? false : undefined)
              break
          }
        }

        Reflect.set(this.dictMap, type, result.list)
        // 同步至session
        session.set('dict', this.dictMap)
        return result.list
      }
      catch (error) {
        console.warn(`${$t('dictionary.dictLoadError')} ${type}:`, error)
        throw error
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

    /**
     * 重設字典錯誤狀態，允許重新載入失敗的字典
     * @param type 字典類型，如果不提供則重設所有失敗狀態
     */
    resetFailedTypes(type?: string) {
      if (type) {
        this.failedTypes.delete(type)
        // 也清除對應的快取，以便重新載入
        delete this.dictMap[type]
      }
      else {
        this.failedTypes.clear()
        this.dictMap = {}
      }
    },
  },
})

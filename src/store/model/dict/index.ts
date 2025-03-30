import { DictDataApi } from '@/api/system/dict-data'
import { session } from '@/utils'

export const useDictStore = defineStore('dict-store', {
  state: () => {
    return {
      dictMap: {} as DictMap,
      isInitDict: false,
    }
  },
  actions: {
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
    async getDict(type: string) {
      const isExist = Reflect.has(this.dictMap, type)

      if (isExist) {
        return this.dictMap[type]
      }
      else {
        return await this.getDictByNet(type)
      }
    },

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
    initDict() {
      const dict = session.get('dict')
      if (dict) {
        Object.assign(this.dictMap, dict)
      }
      this.isInitDict = true
    },
  },
})

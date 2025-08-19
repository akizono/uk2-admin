import type { DictItem } from '@/store/model/dict'

import { useDictStore } from '@/store'

// 全局字典快取
const dictCache = ref<Record<string, DictItem[]>>({})
// 錯誤狀態快取，避免無限重試
const errorCache = ref<Record<string, boolean>>({})
// 正在載入狀態快取
const loadingCache = ref<Record<string, boolean>>({})

/**
 * 初始化字典數據
 * @param dictType 字典類型
 */
function initDict(dictType: string) {
  // 如果已經有快取數據或已經出錯，直接返回
  if (dictCache.value[dictType] || errorCache.value[dictType] || loadingCache.value[dictType]) {
    return
  }

  // 設置載入狀態
  loadingCache.value[dictType] = true

  const dictStore = useDictStore()
  dictStore.dict(dictType)
    .then((dict) => {
      dictCache.value[dictType] = dict.data()
      // 清除錯誤狀態
      if (errorCache.value[dictType]) {
        delete errorCache.value[dictType]
      }
    })
    .catch((error) => {
      console.warn(`無法載入字典數據 ${dictType}:`, error)
      // 設置錯誤狀態，避免無限重試
      errorCache.value[dictType] = true
      // 設置空數組作為快取，避免後續重試
      dictCache.value[dictType] = []
    })
    .finally(() => {
      // 清除載入狀態
      delete loadingCache.value[dictType]
    })
}

/**
 * 根據字典類型和值獲取對應的標籤
 * @param dictType 字典類型
 * @param value 字典值
 * @returns 返回對應的標籤，如果找不到則返回空字串
 */
export function getDictLabel(dictType: string, value: any) {
  initDict(dictType)
  return computed(() => {
    if (!dictCache.value[dictType])
      return ''
    const item = dictCache.value[dictType].find(item => item.value === value) // 使用非嚴格相等以處理不同類型的比較
    return item?.label || ''
  })
}

/**
 * 獲取字典數據
 * @param dictType 字典類型
 * @returns 返回字典數據列表
 */
export function getDictData(dictType: string) {
  initDict(dictType)
  return computed(() => {
    return dictCache.value[dictType] || []
  })
}

/**
 * 獲取字典枚舉格式 {value: label}
 * @param dictType 字典類型
 * @returns 返回字典枚舉格式
 */
export function getDictEnum(dictType: string) {
  initDict(dictType)
  return computed(() => {
    if (!dictCache.value[dictType])
      return {}
    return Object.fromEntries(dictCache.value[dictType].map(({ value, label }) => [value, label]))
  })
}

/**
 * 獲取字典值映射 {value: {label, ...其他屬性}}
 * @param dictType 字典類型
 * @returns 返回字典值映射
 */
export function getValueMap(dictType: string) {
  initDict(dictType)
  return computed(() => {
    if (!dictCache.value[dictType])
      return {}
    return Object.fromEntries(dictCache.value[dictType].map(({ value, ...data }) => [value, data]))
  })
}

/**
 * 獲取字典標籤映射 {label: {value, ...其他屬性}}
 * @param dictType 字典類型
 * @returns 返回字典標籤映射
 */
export function getLabelMap(dictType: string) {
  initDict(dictType)
  return computed(() => {
    if (!dictCache.value[dictType])
      return {}
    return Object.fromEntries(dictCache.value[dictType].map(({ label, ...data }) => [label, data]))
  })
}

/**
 * 重設字典錯誤狀態，允許重新載入失敗的字典
 * @param dictType 字典類型，如果不提供則重設所有
 */
export function resetDictError(dictType?: string) {
  if (dictType) {
    delete errorCache.value[dictType]
    delete dictCache.value[dictType]
    delete loadingCache.value[dictType]
  }
  else {
    errorCache.value = {}
    dictCache.value = {}
    loadingCache.value = {}
  }

  // 同時重設 store 中的錯誤狀態
  const dictStore = useDictStore()
  dictStore.resetFailedTypes(dictType)
}

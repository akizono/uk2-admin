import { useLanguageStore } from '@/store'

import { convertUndefinedToNull, filterObjEmptyValues as filterEmpty } from '../tools/object'
import { config } from './config'
import { service } from './service'

const { defaultHeaders } = config

function request(option: any) {
  // 檢查是否為 FormData，如果是則跳過所有資料處理
  const isFormData = option.data instanceof FormData

  // 默認將物件中所有的空值移除
  const isFilterEmpty = option.isFilterEmpty === undefined ? true : option.isFilterEmpty
  if (isFilterEmpty) {
    if (option.params)
      option.params = filterEmpty(option.params)

    if (option.data && !isFormData) {
      // 如果 data 是陣列，直接使用，不進行 filterEmpty
      option.data = Array.isArray(option.data)
        ? option.data
        : filterEmpty(option.data)
    }
  }
  // 不移除空值則將所有 undefined 值轉換為 null
  else {
    if (option.params)
      option.params = convertUndefinedToNull(option.params)

    if (option.data && !isFormData) {
      option.data = convertUndefinedToNull(option.data)
    }
  }

  const { headersType, headers, ...otherOption } = option
  // 將headers中非字串的值轉換為字串
  if (headers) {
    for (const key in headers) {
      if (typeof headers[key] !== 'string') {
        const json = JSON.stringify(headers[key])
        const encodedJson = encodeURIComponent(json)
        headers[key] = encodedJson
      }
    }
  }

  // 如果是 FormData，讓瀏覽器自動設定 Content-Type（包含 boundary）
  const contentType = isFormData ? undefined : (headersType || defaultHeaders)

  return service({
    ...otherOption,
    headers: {
      ...(contentType && { 'Content-Type': contentType }),
      ...headers,
    },
  })
}

export default {
  get: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })
    return res as unknown as T
  },
  getByLang: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })

    // 處理列表資料
    if (
      res.data.list
      && res.data.list.length > 0
      && res.data.list[0].multilingualFields
    ) {
      const { current } = useLanguageStore()
      res.data.list.forEach((item: any) => {
        Object.keys(item.multilingualFields).forEach((key) => {
          item[key] = item.multilingualFields[key].find((item: any) => item.language === current)?.value
        })
      })
    }

    // 處理單筆資料
    else if (
      res.data
      && res.data.multilingualFields
    ) {
      const { current } = useLanguageStore()
      Object.keys(res.data.multilingualFields).forEach((key) => {
        res.data[key] = res.data.multilingualFields[key].find((item: any) => item.language === current)?.value
      })
    }
    return res as unknown as T
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res as unknown as T
  },
  postOriginal: async (option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res
  },
  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res as unknown as T
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res as unknown as T
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
}

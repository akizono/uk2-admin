import { useLanguageStore } from '@/store'

import { convertUndefinedToNull, filterObjEmptyValues as filterEmpty } from '../tools/object'
import { config } from './config'
import { service } from './service'

const { defaultHeaders } = config

function request(option: any) {
  // 默認將物件中所有的空值移除
  const isFilterEmpty = option.isFilterEmpty === undefined ? true : option.isFilterEmpty
  if (isFilterEmpty) {
    if (option.params)
      option.params = filterEmpty(option.params)

    if (option.data) {
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

    if (option.data) {
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

  return service({
    ...otherOption,
    headers: {
      'Content-Type': headersType || defaultHeaders,
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
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as Promise<T>
  },
}

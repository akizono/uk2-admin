import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/store'
import { $t, local } from '@/utils'
import qs from 'qs'

// ------------------------------請求攔截器--------------------------------

/**
 * 處理請求的授權標頭
 * @param config axios 請求設定
 * @description 如果請求沒有設定跳過授權標記，則加入 Bearer Token 到請求標頭
 */
export function handleAuthHeader(config: InternalAxiosRequestConfig) {
  const skipAuthToken = config.headers['skip-auth-token']
  if (!skipAuthToken)
    config.headers.Authorization = `Bearer ${local.get('accessToken')}`
}

/**
 * 處理 GET 請求的快取設定
 * @param config axios 請求設定
 * @description 加入防快取標頭，確保每次請求都取得最新資料
 */
export function handleGetRequest(config: InternalAxiosRequestConfig) {
  config.headers['Cache-Control'] = 'no-cache'
  config.headers.Pragma = 'no-cache'
}

/**
 * 處理 POST 請求的資料格式
 * @param config axios 請求設定
 * @description 當內容類型為 form-urlencoded 時，將請求資料轉換為 URL 編碼格式
 */
export function handlePostRequest(config: InternalAxiosRequestConfig) {
  const contentType = config.headers['Content-Type'] || config.headers['content-type']
  if (contentType === 'application/x-www-form-urlencoded') {
    if (config.data && typeof config.data !== 'string') {
      config.data = qs.stringify(config.data)
    }
  }
}

/**
 * 處理語言請求頭
 * @param config axios 請求設定
 * @description 加入當前語言到請求標頭
 */
export function handleLanguageHeader(config: InternalAxiosRequestConfig) {
  config.headers['Language-Current'] = local.get('languageCurrent')
}

// ------------------------------response 攔截器--------------------------------

/**
 * 處理回應資料
 * @param response axios 回應物件
 * @returns 處理後的回應資料
 * @description
 * 1. 提取回應中的 data 資料
 * 2. 處理二進位資料回應(blob/arraybuffer)
 *    - 如果不是 JSON 格式則直接回傳
 *    - 如果是 JSON 格式則解析後回傳
 */
export async function handleResponseData(response: AxiosResponse<any>) {
  try {
    let { data } = response

    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      if (response.data.type !== 'application/json') {
        return response.data
      }
      data = await new Response(response.data).json()
    }

    return data
  }
  catch (error) {
    console.warn(error)
    return Promise.reject(error)
  }
}

/**
 * 處理來自網路錯誤的訊息
 * @param errorMsg 錯誤訊息字串
 * @returns 翻譯後的錯誤訊息
 */
export function handleNetworkErrorMessage(errorMsg: string) {
  const networkErrorKey = 'http.networkError'
  const requestTimeoutKey = 'http.requestTimeout'

  if (errorMsg === 'Network Error') {
    return $t(networkErrorKey) !== networkErrorKey ? $t(networkErrorKey) : 'Network Error'
  }

  if (errorMsg.includes('timeout')) {
    return $t(requestTimeoutKey) !== requestTimeoutKey ? $t(requestTimeoutKey) : 'Request timeout'
  }

  return errorMsg
}

/**
 * @description 登出並清除使用者快取
 */
export async function handleUnauthorized() {
  const authStore = useAuthStore()
  await authStore.logout()
}

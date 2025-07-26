import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { loginUrl, refreshTokenMethod, refreshTokenMethodUrl } from '@/api/system/auth'
import { i18n } from '@/modules/i18n'
import { useAuthStore } from '@/store'
import { local } from '@/utils'
import axios from 'axios'
import qs from 'qs'

import { config } from './config'
import * as handle from './handle'

// 使用 i18n 實例的全局 t 方法
const t = i18n.global.t
const { baseURL, requestTimeout } = config

// 等待重新執行的請求佇列
const requestList: (() => Promise<any>)[] = []
// 是否正在重新整理 Token 的標記，避免重複重新整理
let isRefreshToken = false

// 建立 axios 實例
const service: AxiosInstance = axios.create({
  baseURL,
  timeout: requestTimeout, // 請求超時時間限制
  withCredentials: false, // 不允許跨域請求攜帶憑證
  // 自訂請求參數序列化方法,支援巢狀物件
  paramsSerializer: (params) => {
    return qs.stringify(params, { allowDots: true })
  },
})

// 請求攔截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    handle.handleAuthHeader(config)
    handle.handleLanguageHeader(config)

    const method = config.method?.toUpperCase()
    if (method === 'GET')
      handle.handleGetRequest(config)
    else if (method === 'POST')
      handle.handlePostRequest(config)

    return config
  },
  (error: AxiosError) => {
    console.warn(error)
    return Promise.reject(error)
  },
)

// 錯誤狀態

// 回應攔截器
service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    return handle.handleResponseData(response)
  },
  async (error: AxiosError) => {
    const { status } = error
    const url = error.config?.url

    // 讀取後端返回的錯誤消息
    // const message = (error.response?.data as { message?: string })?.message
    //   ?? handle.handleNetworkErrorMessage(error.message)

    // 根據狀態碼，回傳前端預設的錯誤訊息
    const message = error.response?.status
      ? t(`http.${error.response.status}`)
      : handle.handleNetworkErrorMessage(error.message)

    // 如果是重新整理 Token 的請求失敗，直接登出
    if (url === refreshTokenMethodUrl) {
      return handle.handleUnauthorized()
    }

    if (status === 401) {
      // 如果是登入請求，直接回傳錯誤
      if (url === loginUrl) {
        window.$message?.error(message)
        return Promise.reject(error)
      }

      // 如果當前沒有在重新整理 Token，則進行重新整理 Token 操作
      if (!isRefreshToken) {
        isRefreshToken = true

        // 如果沒有 refreshToken，則登出
        if (!local.get('refreshToken')) {
          return handle.handleUnauthorized()
        }

        // 取得新的 Token
        const { data: result } = await refreshTokenMethod()
        const authStore = useAuthStore()
        authStore.handleRefreshToken(result)

        // 重新整理成功後，執行佇列中的請求
        requestList.forEach(callback => callback())
        // 清空佇列
        requestList.length = 0
        // 重設重新整理狀態
        isRefreshToken = false

        // 重新發送當前失敗的請求
        return service(error.config!)
      }

      // 如果正在重新整理 Token，將請求加入佇列，等待重新整理完成後重試
      else {
        return new Promise((resolve) => {
          requestList.push(async () => {
            try {
              resolve(await service(error.config!))
            }
            catch (err) {
              return Promise.reject(err)
            }
          })
        })
      }
    }

    else {
      window.$message?.error(message)
      return Promise.reject(error)
    }
  },
)

export { service }

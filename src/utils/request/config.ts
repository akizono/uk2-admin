type AxiosHeaders =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'

const config: {
  baseURL: string
  requestTimeout: number
  defaultHeaders: AxiosHeaders
} = {
  /**
   * API 基礎網址
   */
  baseURL: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL,

  /**
   * API 請求逾時時間
   */
  requestTimeout: 30000,

  /**
   * 預設請求標頭格式
   * 可選值：application/x-www-form-urlencoded multipart/form-data
   */
  defaultHeaders: 'application/json',
}

export { config }

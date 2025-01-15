// 後端回傳的資料格式統一包裝
export type ApiResponse<T = any> = Promise<{
  message: string
  data: T
}>

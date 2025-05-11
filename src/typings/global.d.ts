/* 資料庫實體表的型別定義，詳細內容請參考 ./entities 資料夾 */
declare namespace Entity {
}

/* API 介面回傳的資料型別定義，詳細內容請參考 ./api 資料夾 */
declare namespace Api {

}

interface Window {
  $loadingBar: import('naive-ui').LoadingBarApi
  $dialog: import('naive-ui').DialogApi
  $message: import('naive-ui').MessageApi
  $notification: import('naive-ui').NotificationApi
}

declare const AMap: any
declare const BMap: any

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare namespace NaiveUI {
  type ThemeColor = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
}

declare namespace App {
  // 選項的通用型別
  interface SelectOption {
    value: string
    label: string
  }
}

interface DictMap {
  [key: string]: import('@/store/model/dict').DictItem[]
}

// API 回應介面
type ApiResponse<T = any> = Promise<{
  message: string
  data: T
}>

// 分頁回應介面
type PageRes<T> = ApiResponse<{
  total: number
  list: T[]
}>

// 分頁參數介面
interface PageParams {
  pageSize?: number
  currentPage?: number
}

// 彈出視窗類型
type ModalType = 'add' | 'view' | 'edit'

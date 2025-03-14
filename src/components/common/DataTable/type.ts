/** 表格行數據介面 */
export interface TableRow {
  /** 唯一識別ID */
  id: string
  /** 其他任意鍵值對 */
  [key: string]: any
}

/** 查詢參數介面 */
export interface InitQueryParams {
  /** 欄位名稱 */
  name: string
  /** 欄位值 */
  value: any
  /** 顯示標籤文字 */
  label?: string
  /** 自訂 CSS 類名 */
  class?: string
  /** 輸入框提示文字 */
  placeholder?: string
  /** 輸入框類型 */
  inputType: string
  /** 字典代碼（用於下拉選單等） */
  dict?: string
}

/** 表單數據介面 */
export interface InitFormData {
  /** 欄位名稱 */
  name: string
  /** 欄位預設值 */
  value: any
  /** 是否隱藏此欄位 */
  hidden?: boolean
  /** 欄位寬度（1:半行, 2:整行） */
  span?: number
  /** 顯示標籤文字 */
  label?: string
  /**
   * 欄位類型
   * - input: 一般輸入框
   * - textarea: 多行文字輸入框
   * - input-number: 數字輸入框
   * - switch: 開關
   */
  type?: string
  /** 編輯時是否禁用此欄位 */
  disableEdit?: boolean
}

/** 彈出視窗類型 */
export type ModalType =
  | 'add' // 新增
  | 'edit' // 編輯
  | 'view' // 檢視

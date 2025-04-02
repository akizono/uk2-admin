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
  dictType?: string
}

/** 條件運算符 */
export type Operator =
  | 'eq' // 等於
  | 'neq' // 不等於
  | 'gt' // 大於
  | 'gte' // 大於等於
  | 'lt' // 小於
  | 'lte' // 小於等於
  | 'in' // 在列表中
  | 'nin' // 不在列表中

/** 單一條件 */
export interface Condition {
  /** 欄位名稱 */
  field: string
  /** 運算符 */
  operator: Operator
  /** 比較值 */
  value: any
}

/** 條件組合 */
export interface ConditionGroup {
  /** 邏輯運算符 */
  logic: 'and' | 'or'
  /** 條件列表 */
  conditions: (Condition | ConditionGroup)[]
}

/** 值生成器的條件項 */
interface ValueGeneratorCondition {
  /** 條件判斷表達式 */
  when?: string
  /** 生成的值模板 */
  then: string
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
   * - select: 下拉選單
   */
  type?: string
  /** rules規則中的type屬性 */
  rulesType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'integer'
  /** 選單配置 */
  selectOptions?: {
    /** 選單 API */
    api?: any
    /** 選單 API 參數 */
    selectParam?: string
    /** 選單選項映射返回的數據 */
    itemMapping?: {
      label: string
      value: string
    }
    /** 是否啟用懶載入 */
    lazy?: boolean
  }
  /** 禁止該欄位進行更新（請求中不會攜帶該欄位） */
  disableUpdate?: boolean
  /** 編輯時是否禁用此欄位的輸入框 */
  disableEditInput?: boolean
  /** 新增時是否禁用此欄位的輸入框 */
  disableAddInput?: boolean
  /** 字典類型 */
  dictType?: string
  /** 輸入框提示文字 */
  placeholder?: string
  /** 輸入框前綴 */
  inputPrefix?: string
  /** 輸入框後綴 */
  inputSuffix?: string
  /** 幫助提示 */
  helpInfo?: string
  /** 顯示條件 */
  showCondition?: Condition | ConditionGroup
  /** 值生成器配置 */
  valueGenerator?: {
    /** 需要監聽變化的欄位列表 */
    watchFields: string[]
    /** 生成規則 */
    rule: {
      /** 規則類型 */
      type: 'template' | 'condition' | 'expression'
      /** 規則值 */
      value: string | ValueGeneratorCondition[]
    }
  }
}

/** 彈出視窗類型 */
export type ModalType =
  | 'add' // 新增
  | 'edit' // 編輯
  | 'view' // 檢視

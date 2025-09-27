# DataTable 元件

## 簡介

DataTable 元件是我在此專案中封裝的唯一比較大型且複雜的元件，適用於多數後台管理系統中各種數據管理場景。

系統管理的所有頁面都基於此元件進行開發。當然了，你也可以不使用此元件也是可以的。

該元件基於 Naive UI 的 DataTable 進行擴展，提供了完整的 CRUD（新增、讀取、更新、刪除）功能，同時支援樹狀結構、多語言、排序、過濾等功能。適用於後台管理系統中各種數據管理場景。

## 快速開始

### 基本用法

```vue
<script setup lang="tsx">
import DataTable from '@/components/common/DataTable/index.vue'

// 元件的配置
const options = {
  // 表格的顯示功能
  view: true, // 是否顯示「查看按鈕」
  edit: true, // 是否顯示「編輯按鈕」
  del: true, // 是否顯示「刪除按鈕」
  search: true, // 是否顯示「頂部搜索框」
  add: true, // 是否顯示「新增按鈕」
  index: false, // 是否顯示「索引」
  pagination: false, // 是否開啟分頁

  // 表格配置
  columns, // 表格欄位的定義
  viewEntranceColumns: ['name'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getListFunction: API.getList, // 獲取表格數據的 API
  deleteFunction: API.deleteItem, // 刪除表格數據的 API
  updateFunction: API.updateItem, // 更新表格數據的 API
  createFunction: API.createItem, // 新增表格數據的 API

  // 表單配置
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  // 其他配置
  modalWidth: '800px',
  modalName: '用戶', // 表格中的數據名稱
  permission: { /* 權限配置 */ },
}
</script>

<template>
  <DataTable v-bind="options" />
</template>
```

## 詳細配置說明

### 1. 權限配置 (permission)

權限配置是 DataTable 的核心功能之一，用於控制各種操作的顯示和執行權限。

```typescript
const permission = {
  create: ['system:user:create'], // 新增權限
  page: ['system:user:page'], // 查看列表權限
  update: ['system:user:update'], // 編輯權限
  delete: ['system:user:delete'], // 刪除權限
  block: ['system:user:block'], // 封鎖權限
  unblock: ['system:user:unblock'], // 解封鎖權限
}
```

**說明：**
- 每個權限對應一個字串陣列，包含該操作所需的權限代碼
- 如果用戶沒有對應權限，相關的按鈕或功能將被隱藏或禁用
- 權限檢查基於 `usePermi` hook 實現

### 2. 查詢參數配置 (initQueryParams)

用於配置頂部搜索區域的查詢條件。

```typescript
const initQueryParams: InitQueryParams[] = [
  {
    name: 'pageSize', // 參數名稱
    value: 10, // 預設值
    inputType: 'pagination', // 輸入類型
  },
  {
    name: 'title', // 參數名稱
    value: undefined, // 預設值
    label: '標題', // 顯示標籤
    class: '!w-64', // CSS 類名（支援 UnoCSS）
    placeholder: '請輸入標題', // 提示文字
    inputType: 'input', // 輸入類型
    multilingual: true, // 是否多語言
  },
  {
    name: 'status',
    value: undefined,
    label: '狀態',
    class: '!w-64',
    placeholder: '請選擇狀態',
    inputType: 'select', // 下拉選單
    dictType: 'common_status', // 字典類型
  },
  {
    name: 'role',
    value: undefined,
    label: '角色',
    class: '!w-64',
    placeholder: '請選擇角色',
    inputType: 'select',
    selectOptions: { // 選單配置
      api: RoleApi.getRoleList, // API 函數
      selectParam: 'name', // 搜索參數
      itemMapping: { // 數據映射
        label: 'name', // 顯示欄位
        value: 'id' // 值欄位
      }
    }
  }
]
```

**inputType 支援的類型：**
- `input`: 文字輸入框
- `select`: 下拉選單（需要 dictType 或 selectOptions）
- `pagination`: 分頁器（僅用於 pageSize 和 currentPage）

**pageSize 特殊說明：**
- 不設置：預設為 10
- 設置為 0：不分頁，顯示全部數據
- 設置為 0：不分頁，顯示全部數據
- 設置為正數：每頁顯示對應數量

**class 屬性：**
- 支援普通的 CSS 類名
- 支援 UnoCSS 原子化 CSS 類名
- 常用：`!w-64`（寬度）、`!mr-4`（右邊距）等

**multilingual 屬性：**
- 設為 `true` 時，該欄位會根據當前語言顯示對應的多語言內容
- 需要後端 API 返回多語言數據結構

**dictType 屬性：**
- 用於字典數據的下拉選單
- 系統會自動從字典服務獲取選項數據
- 與 selectOptions 二選一使用

**selectOptions 屬性：**
- 用於自訂 API 的下拉選單
- 必須提供 api、selectParam、itemMapping
- 支援懶載入（lazy: true）和多選（multiple: true）

### 3. 表格列配置 (columns)

定義表格的列結構和顯示方式。

```typescript
const columns: DataTableColumns<UserVO> = [
  {
    title: '使用者名稱',           // 列標題
    align: 'left',            // 對齊方式
    key: 'username',          // 數據欄位
    copy: true,               // 是否可複製
    fixed: 'left',            // 固定位置
    multilingual: true,       // 是否多語言
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    dictType: 'common_status', // 字典類型
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row: UserVO) => { // 自訂渲染
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={(value) => dataTableRef.value.handleStatusChange(row, value)}
        />
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: UserVO) => { // 自訂操作按鈕
      return (
        <NButton
          size="small"
          onClick={() => handleCustomAction(row)}
        >
          自訂操作
        </NButton>
      )
    },
  }
]
```

**render 函數：**
- 使用 TSX 語法編寫
- 接收當前行數據作為參數
- 可以返回任何 Vue 元件或 HTML 元素
- 常用於狀態開關、操作按鈕、自訂顯示等

**dictType 屬性：**
- 自動將數據值轉換為對應的字典標籤
- 例如：`1` 顯示為 `啟用`，`0` 顯示為 `禁用`

**multilingual 屬性：**
- 自動根據當前語言顯示對應的多語言內容
- 需要後端返回多語言數據結構

### 4. 表單配置 (initFormData)

定義新增/編輯表單的欄位結構。

```typescript
const initFormData: InitFormData[] = [
  {
    name: 'id', // 欄位名稱
    value: undefined, // 預設值
    hidden: true, // 是否隱藏
  },
  {
    name: 'username',
    value: undefined,
    span: 1, // 欄位寬度（1:半行, 2:整行）
    label: '使用者名稱',
    type: 'input', // 欄位類型
    placeholder: '請輸入使用者名稱',
    multilingual: true, // 是否多語言
  },
  {
    name: 'role',
    value: undefined,
    span: 1,
    label: '角色',
    type: 'select',
    selectOptions: { // 選單配置
      api: RoleApi.getRoleList,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' }
    }
  },
  {
    name: 'status',
    value: 1,
    span: 1,
    label: '狀態',
    type: 'switch', // 開關
  },
  {
    name: 'remark',
    value: undefined,
    span: 2, // 整行寬度
    label: '備註',
    type: 'textarea', // 多行文字
  },
  {
    name: 'avatar',
    value: undefined,
    span: 2,
    label: '頭像',
    type: 'file', // 檔案上傳
    fileOptions: { // 檔案配置
      maxFileCount: 1,
      maxFileSize: 5,
      filetype: 'img',
      fileExtension: ['jpg', 'png', 'gif'],
      autoUpload: true,
      singleFile: true
    }
  },
  {
    name: 'type',
    value: 0,
    span: 1,
    label: '類型',
    type: 'radio', // 單選框
    dictType: 'user_type',
    showCondition: { // 條件顯示
      field: 'role',
      operator: 'eq',
      value: 'admin'
    }
  },
  {
    name: 'createTime',
    value: undefined,
    span: 1,
    label: '創建時間',
    type: 'input',
    showInMode: { // 模式控制
      view: true, // 查看模式顯示
      add: false, // 新增模式隱藏
      edit: false, // 編輯模式隱藏
    },
    disableUpdate: true, // 禁止更新
    disableEditInput: true, // 編輯時禁用輸入
  }
]
```

**欄位類型 (type)：**
- `input`: 文字輸入框
- `textarea`: 多行文字輸入框
- `input-number`: 數字輸入框
- `switch`: 開關
- `select`: 下拉選單
- `radio`: 單選框
- `icon-select`: 圖示選擇器
- `file`: 檔案上傳

**showInMode 屬性：**
- 控制欄位在不同模式下的顯示狀態
- `view`: 查看模式
- `add`: 新增模式
- `edit`: 編輯模式
- 不設置則在所有模式下都顯示

**showCondition 屬性：**
- 根據其他欄位的值來控制顯示
- 支援多種運算符：`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`in`、`nin`

**fileOptions 屬性：**
- `maxFileCount`: 最大檔案數量
- `maxFileSize`: 最大檔案大小（MB）
- `filetype`: 顯示類型（`img` 或 `list`）
- `fileExtension`: 允許的副檔名
- `autoUpload`: 是否自動上傳
- `singleFile`: 是否單個檔案

### 5. 表單驗證規則 (rules)

定義表單欄位的驗證規則。

```typescript
const rules: FormRules = {
  username: [
    {
      required: true,
      message: '使用者名稱不能為空',
      trigger: ['blur', 'input'],
    },
    {
      pattern: /^\w{3,20}$/,
      message: '使用者名稱只能包含字母、數字、下劃線，長度3-20位',
      trigger: ['blur', 'input'],
    },
  ],
  email: {
    required: true,
    message: '信箱不能為空',
    trigger: ['blur', 'input'],
    type: 'email',
  },
  age: {
    required: true,
    message: '年齡不能為空',
    trigger: ['blur', 'input'],
    type: 'number',
    validator: (rule, value) => {
      if (value < 18 || value > 100) {
        return new Error('年齡必須在18-100之間')
      }
      return true
    },
  },
}
```

**驗證規則類型：**
- `required`: 必填
- `pattern`: 正則表達式
- `type`: 數據類型（`string`、`number`、`email`、`url` 等）
- `validator`: 自訂驗證函數
- `min`/`max`: 最小值/最大值
- `len`: 長度

### 6. 完整配置選項 (options)

```typescript
const options = {
  // 基本配置
  modalName: '用戶管理', // 模態框標題
  modalWidth: '800px', // 模態框寬度
  modalFormLabelWidth: '120px', // 表單標籤寬度
  multilingualFieldsModalWidth: '900px', // 多語言彈出視窗寬度

  // 功能開關
  view: true, // 查看功能
  edit: true, // 編輯功能
  del: true, // 刪除功能
  search: true, // 搜索功能
  add: true, // 新增功能
  index: false, // 序號列
  pagination: true, // 分頁功能
  showMenu: false, // 左側菜單
  menuMultilingual: false, // 菜單多語言
  menuDefaultExpandRoot: false, // 菜單預設展開

  // 表格配置
  columns, // 列定義
  viewEntranceColumns: ['username'], // 可點擊查看的列
  tableScrollX: 1200, // 表格橫向滾動寬度
  tableOperateColumnFixed: 'right', // 操作列固定位置
  tabShowBorder: true, // 表格邊框
  neckSlot: [], // 頂部自訂按鈕

  // 數據相關
  getListFunction: UserApi.getUserList, // 獲取列表
  deleteFunction: UserApi.deleteUser, // 刪除
  updateFunction: UserApi.updateUser, // 更新
  createFunction: UserApi.createUser, // 新增
  blockFunction: UserApi.blockUser, // 封鎖
  unblockFunction: UserApi.unblockUser, // 解封鎖
  getListFunctionExtraParams: {}, // 額外參數

  // 表單配置
  initFormData, // 表單欄位
  rules, // 驗證規則

  // 菜單和過濾
  getMenuDataFunction: MenuApi.getMenuList, // 菜單數據
  filterField: 'deptId', // 過濾欄位
  filterColumnName: 'deptId', // 過濾條件欄位名
  filterColumnValue: computed(() => '123'), // 過濾條件值

  // 權限配置
  permission, // 權限配置

  // 其他
  ref: 'dataTableRef', // 元件引用
}
```

## 資料結構

### InitQueryParams 查詢參數

```typescript
interface InitQueryParams {
  name: string // 欄位名稱
  value: any // 欄位值
  label?: string // 顯示標籤文字
  class?: string // 自訂 CSS 類名
  placeholder?: string // 輸入框提示文字
  inputType: string // 輸入框類型
  dictType?: string | null // 字典代碼（用於下拉選單等）
  multilingual?: boolean // 是否多語言
  selectOptions?: { // 選單配置
    api?: any // 選單 API
    selectParam?: string // 選單 API 參數
    itemMapping?: { // 選單選項映射返回的數據
      label: string
      value: string
    }
    lazy?: boolean // 是否啟用懶載入
    multiple?: boolean // 是否多選
  }
}
```

### InitFormData 表單數據

```typescript
interface InitFormData {
  name: string // 欄位名稱
  value: any // 欄位預設值
  hidden?: boolean // 是否隱藏此欄位
  span?: number // 欄位寬度（1:半行, 2:整行）
  label?: string // 顯示標籤文字
  type?: 'input' | 'textarea' | 'input-number' | 'switch' | 'select' | 'radio' | 'icon-select' | 'file' // 欄位類型
  dictType?: string // 字典類型
  placeholder?: string // 輸入框提示文字
  inputPrefix?: string // 輸入框前綴
  inputSuffix?: string // 輸入框後綴
  helpInfo?: string // 幫助提示
  multilingual?: boolean // 是否多語言

  // 選單配置
  selectOptions?: {
    api?: any // 選單 API
    selectParam?: string // 選單 API 參數
    itemMapping?: { // 選單選項映射返回的數據
      label: string
      value: string
    }
    lazy?: boolean // 是否啟用懶載入
    multiple?: boolean // 是否多選
  }

  // 檔案上傳配置
  fileOptions?: {
    maxFileCount: number // 最大檔案數量
    maxFileSize: number // 最大檔案大小 (MB)
    filetype: 'img' | 'list' // 檔案顯示類型
    fileExtension: string[] // 允許的檔案副檔名
    autoUpload: boolean // 是否自動上傳
    singleFile?: boolean // 是否單個文件
  }

  // 控制項
  disableUpdate?: boolean // 禁止該欄位進行更新
  disableEditInput?: boolean // 編輯時是否禁用此欄位的輸入框
  disableAddInput?: boolean // 新增時是否禁用此欄位的輸入框

  // 條件顯示
  showCondition?: Condition | ConditionGroup // 顯示條件

  // 模式控制
  showInMode?: {
    view?: boolean // 是否在檢視模式下顯示
    add?: boolean // 是否在新增模式下顯示
    edit?: boolean // 是否在編輯模式下顯示
  }
}
```

## 功能說明

### 基本功能

1. **CRUD 操作**：支援新增、查看、編輯、刪除等基本操作。
2. **分頁功能**：支援分頁顯示數據。
3. **搜索功能**：支援多條件搜索。
4. **排序功能**：支援按欄位排序。
5. **批次刪除**：支援批次選擇並刪除數據。

### 表單功能

1. **多種輸入類型**：支援文本、數字、開關、選擇器、單選、圖示選擇、文件上傳等多種輸入類型。
2. **表單驗證**：支援表單驗證規則。
3. **條件顯示**：支援根據條件顯示或隱藏表單項。
4. **模式控制**：可控制表單項在查看、新增、編輯模式下的顯示狀態。

### 樹狀結構

1. **樹狀數據**：支援樹狀結構數據的展示和操作。
2. **父子關係**：自動處理父子節點關係。
3. **排序功能**：支援樹狀結構的排序。

### 多語言支援

1. **欄位多語言**：支援欄位的多語言顯示。
2. **菜單多語言**：支援菜單的多語言顯示。

## 使用範例

以下是一個完整的使用範例，展示如何配置 DataTable 元件：

```vue
<script setup lang="tsx">
import type { MenuVO } from '@/api/system/menu'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { NSwitch } from 'naive-ui'

import { MenuApi } from '@/api/system/menu'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'

defineOptions({
  name: 'Menu Settings',
})

const { hasPermi } = usePermi()

const dataTableRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:menu:create'],
  page: ['system:menu:page'],
  update: ['system:menu:update'],
  delete: ['system:menu:delete'],
  block: ['system:menu:block'],
  unblock: ['system:menu:unblock'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'pageSize',
    value: 0,
    inputType: 'pagination',
  },
  {
    name: 'title',
    value: undefined,
    label: $t('menu.menuTitle'),
    class: '!w-64',
    placeholder: $t('menu.menuTitlePlaceholder'),
    inputType: 'input',
    multilingual: true,
  },
  {
    name: 'status',
    value: undefined,
    label: $t('common.status'),
    class: '!w-64',
    placeholder: $t('common.statusPlaceholder'),
    inputType: 'select',
    dictType: 'common_status',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<MenuVO> = [
  {
    title: $t('menu.menuTitle'),
    align: 'left',
    key: 'title',
    multilingual: true,
    copy: false,
    fixed: 'left',
  },
  {
    title: $t('menu.menuIcon'),
    align: 'center',
    key: 'icon',
  },
  {
    title: $t('menu.menuType'),
    align: 'center',
    key: 'type',
    dictType: 'system_menu_type',
  },
  {
    title: $t('common.sort'),
    align: 'center',
    key: 'sort',
  },
  {
    title: $t('common.status'),
    align: 'center',
    key: 'status',
    render: (row: MenuVO) => {
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)}
        />
      )
    },
  },
]

/** 初始化表單數據 */
const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    span: 2,
    label: 'ID',
    showInMode: {
      view: true,
      add: false,
      edit: false,
    },
  },
  {
    name: 'parentId',
    value: undefined,
    span: 2,
    label: $t('menu.parentMenu'),
    type: 'select',
    selectOptions: {
      api: MenuApi.getMenuList,
      selectParam: 'name',
      itemMapping: { label: 'title', value: 'id' },
    },
    multilingual: true,
  },
  {
    name: 'title',
    value: undefined,
    span: 2,
    label: $t('menu.menuTitle'),
    type: 'input',
    multilingual: true,
  },
  {
    name: 'name',
    value: undefined,
    span: 2,
    label: $t('menu.menuCode'),
    type: 'input',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'path',
    value: undefined,
    span: 1,
    label: $t('menu.routePath'),
    type: 'input',
    placeholder: 'Eg: /system/user',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'component',
    value: undefined,
    span: 1,
    label: $t('menu.componentPath'),
    type: 'input',
    placeholder: 'Eg: /system/user/index.vue',
    inputPrefix: '@/src/view',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  // ... 更多表單項配置
]

/** 表單驗證規則 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: $t('menu.menuCodePlaceholder'),
      trigger: ['blur', 'input'],
    },
    {
      pattern: /^[\s\w-]+$/, // 正則表達式：允許空格(\s)、橫槓(-)、下劃線(\w包含_)、英文和數字
      message: $t('menu.menuCodeRule'),
      trigger: ['blur', 'input'],
    },
  ],
  title: {
    required: true,
    message: $t('menu.menuTitleRule'),
    trigger: ['blur', 'input'],
  },
  // ... 更多驗證規則
}

/** 元件的配置 */
const options = {
  /** 表格的顯示功能 */
  view: true, // 是否顯示「查看按鈕」
  edit: true, // 是否顯示「編輯按鈕」
  del: true, // 是否顯示「刪除按鈕」
  search: true, // 是否顯示「頂部搜索框」
  add: true, // 是否顯示「新增按鈕」
  index: false, // 是否顯示「索引」
  pagination: false, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['name'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getListFunction: MenuApi.getMenuList, // 獲取表格數據的 API
  deleteFunction: MenuApi.deleteMenu, // 刪除表格數據的 API
  updateFunction: MenuApi.updateMenu, // 更新表格數據的 API
  createFunction: MenuApi.createMenu, // 新增表格數據的 API

  blockFunction: MenuApi.blockMenu, // 封鎖表格數據的 API
  unblockFunction: MenuApi.unblockMenu, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: $t('menu.menu'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  multilingualFieldsModalWidth: '900px', // 多語言欄位彈出視窗的寬度
  permission, // 權限配置

  tableScrollX: 1200,
  // tableOperateColumnFixed: 'right' as const,
  // tabShowBorder: true,
}
</script>

<template>
  <DataTable v-bind="options" />
</template>
```

## 從頭搭建完整案例

讓我們透過一個完整的用戶管理頁面來學習如何使用 DataTable 元件。

### 步驟 1：創建 API 文件

首先創建用戶相關的 API 文件：

```typescript
// src/api/system/user/index.ts
import { request } from '@/utils/request'

export interface UserVO {
  id: string
  username: string
  email: string
  phone: string
  status: number
  roleId: string
  roleName: string
  createTime: string
  updateTime: string
}

export interface UserQuery {
  pageSize: number
  currentPage: number
  username?: string
  email?: string
  status?: number
  roleId?: string
}

export interface UserCreate {
  username: string
  email: string
  phone: string
  password: string
  roleId: string
  status: number
}

export interface UserUpdate extends UserCreate {
  id: string
}

export const UserApi = {
  // 獲取用戶列表
  getUserList: (params: UserQuery) => {
    return request.get('/system/user/list', { params })
  },

  // 獲取用戶詳情
  getUserDetail: (id: string) => {
    return request.get(`/system/user/${id}`)
  },

  // 創建用戶
  createUser: (data: UserCreate) => {
    return request.post('/system/user', data)
  },

  // 更新用戶
  updateUser: (data: UserUpdate) => {
    return request.put('/system/user', data)
  },

  // 刪除用戶
  deleteUser: (id: string) => {
    return request.delete(`/system/user/${id}`)
  },

  // 封鎖用戶
  blockUser: (id: string) => {
    return request.put(`/system/user/${id}/block`)
  },

  // 解封鎖用戶
  unblockUser: (id: string) => {
    return request.put(`/system/user/${id}/unblock`)
  }
}
```

### 步驟 2：創建角色 API（用於下拉選單）

```typescript
// src/api/system/role/index.ts
import { request } from '@/utils/request'

export interface RoleVO {
  id: string
  name: string
  code: string
}

export const RoleApi = {
  // 獲取角色列表
  getRoleList: (params?: { name?: string }) => {
    return request.get('/system/role/list', { params })
  }
}
```

### 步驟 3：創建用戶管理頁面

```vue
<!-- src/views/system/user/index.vue -->
<script setup lang="tsx">
import type { UserCreate, UserQuery, UserUpdate, UserVO } from '@/api/system/user'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { NButton, NSwitch, NTag } from 'naive-ui'

import { RoleApi } from '@/api/system/role'
import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'

defineOptions({
  name: 'User Management',
})

const { hasPermi } = usePermi()
const dataTableRef = ref()

// 權限配置
const permission = {
  create: ['system:user:create'],
  page: ['system:user:page'],
  update: ['system:user:update'],
  delete: ['system:user:delete'],
  block: ['system:user:block'],
  unblock: ['system:user:unblock'],
}

// 查詢參數配置
const initQueryParams: InitQueryParams[] = [
  {
    name: 'pageSize',
    value: 10,
    inputType: 'pagination',
  },
  {
    name: 'currentPage',
    value: 1,
    inputType: 'pagination',
  },
  {
    name: 'username',
    value: undefined,
    label: '使用者名稱',
    class: '!w-64',
    placeholder: '請輸入使用者名稱',
    inputType: 'input',
  },
  {
    name: 'email',
    value: undefined,
    label: '信箱',
    class: '!w-64',
    placeholder: '請輸入信箱',
    inputType: 'input',
  },
  {
    name: 'status',
    value: undefined,
    label: '狀態',
    class: '!w-64',
    placeholder: '請選擇狀態',
    inputType: 'select',
    dictType: 'common_status',
  },
  {
    name: 'roleId',
    value: undefined,
    label: '角色',
    class: '!w-64',
    placeholder: '請選擇角色',
    inputType: 'select',
    selectOptions: {
      api: RoleApi.getRoleList,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
  },
]

// 表格列配置
const columns: DataTableColumns<UserVO> = [
  {
    title: '使用者名稱',
    align: 'left',
    key: 'username',
    copy: true,
    fixed: 'left',
  },
  {
    title: '信箱',
    align: 'left',
    key: 'email',
    copy: true,
  },
  {
    title: '手機號碼',
    align: 'center',
    key: 'phone',
  },
  {
    title: '角色',
    align: 'center',
    key: 'roleName',
    render: (row: UserVO) => {
      return <NTag type="info">{row.roleName}</NTag>
    },
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row: UserVO) => {
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)}
        />
      )
    },
  },
  {
    title: '創建時間',
    align: 'center',
    key: 'createTime',
    width: 180,
  },
]

// 表單配置
const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    hidden: true,
  },
  {
    name: 'username',
    value: undefined,
    span: 1,
    label: '使用者名稱',
    type: 'input',
    placeholder: '請輸入使用者名稱',
  },
  {
    name: 'email',
    value: undefined,
    span: 1,
    label: '信箱',
    type: 'input',
    placeholder: '請輸入信箱',
  },
  {
    name: 'phone',
    value: undefined,
    span: 1,
    label: '手機號碼',
    type: 'input',
    placeholder: '請輸入手機號碼',
  },
  {
    name: 'password',
    value: undefined,
    span: 1,
    label: '密碼',
    type: 'input',
    placeholder: '請輸入密碼',
    showInMode: {
      view: false,
      add: true,
      edit: false,
    },
  },
  {
    name: 'roleId',
    value: undefined,
    span: 1,
    label: '角色',
    type: 'select',
    selectOptions: {
      api: RoleApi.getRoleList,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
  },
  {
    name: 'status',
    value: 1,
    span: 1,
    label: '狀態',
    type: 'switch',
  },
]

// 表單驗證規則
const rules: FormRules = {
  username: [
    {
      required: true,
      message: '使用者名稱不能為空',
      trigger: ['blur', 'input'],
    },
    {
      pattern: /^\w{3,20}$/,
      message: '使用者名稱只能包含字母、數字、下劃線，長度3-20位',
      trigger: ['blur', 'input'],
    },
  ],
  email: {
    required: true,
    message: '信箱不能為空',
    trigger: ['blur', 'input'],
    type: 'email',
  },
  phone: {
    required: true,
    message: '手機號碼不能為空',
    trigger: ['blur', 'input'],
    pattern: /^1[3-9]\d{9}$/,
  },
  password: {
    required: true,
    message: '密碼不能為空',
    trigger: ['blur', 'input'],
    min: 6,
    max: 20,
  },
  roleId: {
    required: true,
    message: '請選擇角色',
    trigger: ['change'],
  },
}

// 元件配置
const options = {
  // 基本配置
  modalName: '用戶',
  modalWidth: '800px',
  modalFormLabelWidth: '100px',

  // 功能開關
  view: true,
  edit: true,
  del: true,
  search: true,
  add: true,
  index: true,
  pagination: true,

  // 表格配置
  columns,
  viewEntranceColumns: ['username', 'email'],
  initQueryParams,
  getListFunction: UserApi.getUserList,
  deleteFunction: UserApi.deleteUser,
  updateFunction: UserApi.updateUser,
  createFunction: UserApi.createUser,
  blockFunction: UserApi.blockUser,
  unblockFunction: UserApi.unblockUser,

  // 表單配置
  initFormData,
  rules,

  // 權限配置
  permission,

  // 其他配置
  ref: 'dataTableRef',
  tableScrollX: 1000,
  tabShowBorder: true,
}
</script>

<template>
  <DataTable v-bind="options" />
</template>
```

### 步驟 4：添加路由配置

```typescript
// src/router/routes.inner.ts
export const routes = [
  {
    path: '/system/user',
    name: 'UserManagement',
    component: () => import('@/views/system/user/index.vue'),
    meta: {
      title: '用戶管理',
      icon: 'user',
      permissions: ['system:user:page'],
    },
  },
]
```

### 步驟 5：添加菜單配置

在後台管理系統中添加對應的菜單項，確保用戶有相應的權限。

## 常見問題與解決方案

### 1. 分頁配置錯誤

**問題**：開啟了分頁功能，但 pageSize 設置為 0。

**解決方案**：
- 確保當 `pagination: true` 時，initQueryParams 中的 pageSize 不為 0。
- 如果不需要分頁，請設置 `pagination: false`。

### 2. CRUD 函數缺失

**問題**：啟用了 CRUD 功能，但沒有提供相應的 API 函數。

**解決方案**：
- 確保啟用 `add` 時提供 `createFunction`
- 確保啟用 `edit` 時提供 `updateFunction`
- 確保啟用 `del` 時提供 `deleteFunction`
- 必須提供 `getListFunction` 獲取數據

### 3. 搜索參數配置錯誤

**問題**：開啟了搜索功能，但沒有提供除 pageSize 和 currentPage 以外的查詢參數。

**解決方案**：
- 在 initQueryParams 中添加至少一個非分頁相關的查詢參數。

### 4. 選擇器配置錯誤

**問題**：使用了 select 或 radio 類型的輸入，但沒有提供數據源。

**解決方案**：
- 為 select 或 radio 類型的輸入提供 dictType 或 selectOptions。
- 如果使用 selectOptions，確保提供 api、selectParam 和 itemMapping。

### 5. 狀態欄位配置錯誤

**問題**：表格中包含 status 欄位，但沒有提供 blockFunction 和 unblockFunction。

**解決方案**：
- 如果表格中包含 status 欄位，必須提供 blockFunction 和 unblockFunction。

### 6. 過濾條件配置錯誤

**問題**：提供了 filterColumnName 但沒有提供 filterColumnValue，或者反之。

**解決方案**：
- filterColumnName 和 filterColumnValue 必須同時提供或同時不提供。
- 確保 filterColumnValue.value 是非空字串。

### 7. 重複欄位名稱

**問題**：initFormData 中存在多個同名欄位，但沒有提供 showCondition。

**解決方案**：
- 如果 initFormData 中有多個同名欄位，必須為每個欄位提供 showCondition 以控制顯示條件。

### 8. 菜單功能配置錯誤

**問題**：開啟了菜單功能，但沒有提供 getMenuDataFunction 或 filterField。

**解決方案**：
- 如果 showMenu 為 true，必須提供 getMenuDataFunction 和 filterField。

### 9. 文件上傳配置錯誤

**問題**：使用了 file 類型的輸入，但沒有提供 fileOptions，或者 singleFile 為 true 但 maxFileCount 不為 1。

**解決方案**：
- 為 file 類型的輸入提供 fileOptions。
- 如果 fileOptions.singleFile 為 true，確保 fileOptions.maxFileCount 為 1。

## 進階功能

### 1. 自訂操作按鈕

在表格列中添加自訂操作按鈕：

```typescript
{
  title: '操作',
  key: 'actions',
  width: 200,
  render: (row: UserVO) => {
    return (
      <NSpace>
        <NButton
          size="small"
          type="primary"
          onClick={() => handleResetPassword(row)}
        >
          重設密碼
        </NButton>
        <NButton
          size="small"
          type="warning"
          onClick={() => handleExportUser(row)}
        >
          導出
        </NButton>
      </NSpace>
    )
  },
}
```

### 2. 條件顯示表單欄位

根據其他欄位的值來控制表單欄位的顯示：

```typescript
{
  name: 'adminLevel',
  value: undefined,
  span: 1,
  label: '管理員等級',
  type: 'select',
  dictType: 'admin_level',
  showCondition: {
    field: 'roleId',
    operator: 'eq',
    value: 'admin_role_id',
  },
}
```

### 3. 多語言支援

啟用多語言功能：

```typescript
// 在 initQueryParams 中
{
  name: 'title',
  value: undefined,
  label: $t('user.title'),
  multilingual: true,
},

// 在 columns 中
{
  title: $t('user.username'),
  key: 'username',
  multilingual: true,
},

// 在 initFormData 中
{
  name: 'username',
  label: $t('user.username'),
  multilingual: true,
},
```

### 4. 檔案上傳

配置檔案上傳功能：

```typescript
{
  name: 'avatar',
  value: undefined,
  span: 2,
  label: '頭像',
  type: 'file',
  fileOptions: {
    maxFileCount: 1,
    maxFileSize: 5,
    filetype: 'img',
    fileExtension: ['jpg', 'png', 'gif', 'webp'],
    autoUpload: true,
    singleFile: true,
  },
}
```

這樣，你就完成了一個功能完整的用戶管理頁面！DataTable 元件會自動處理所有的 CRUD 操作、權限控制、表單驗證等功能。

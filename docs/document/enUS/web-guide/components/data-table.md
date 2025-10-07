# DataTable Component

## Introduction

The DataTable component is the only large and complex component I packaged in this project, and is suitable for various data management scenarios in most backend management systems.

All pages managed by the system are developed based on this component. Of course, you can also not use this component.

This component is extended based on the DataTable of Naive UI, providing complete CRUD (new, read, update, delete) functions, and supports tree structure, multilingual, sorting, filtering and other functions. Suitable for various data management scenarios in the background management system.

## Start quickly

### Basic usage

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

## Detailed configuration instructions

### 1. Permission configuration (permission)

Permission configuration is one of the core functions of DataTable, which is used to control the display and execution permissions of various operations.

```typescript
const permission = {
  create: ['system:user:create'], // 新增權限
  page: ['system:user:query'], // 查看列表權限
  update: ['system:user:update'], // 編輯權限
  delete: ['system:user:delete'], // 刪除權限
  block: ['system:user:block'], // 封鎖權限
  unblock: ['system:user:unblock'], // 解封鎖權限
}
```

**illustrate:**
- Each permission corresponds to a string array, containing the permission code required for the operation
- If the user does not have corresponding permissions, the relevant buttons or functions will be hidden or disabled
- Permission checking is based on`usePermi`hook implementation

### 2. Query parameter configuration (initQueryParams)

Used to configure query conditions for the top search area.

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

**InputType Supported Type: **
- `input`: Text input box
- `select`: drop-down menu (requires dictType or selectOptions)
- `pagination`: Pager (only for pageSize and currentPage)

**pageSize Special Description: **
- Not set: preset to 10
- Set to 0: No page, display all data
- Set to 0: No pages, display all data
- Set to positive number: display the corresponding number per page

**class attribute: **
- Supports ordinary CSS class names
- Support UnoCSS atomized CSS class name
- Commonly used:`!w-64`(width),`!mr-4`(right margin) etc.

**multilingual properties: **
- Set as`true`When this field will display the corresponding multilingual content according to the current language
- Need a backend API to return multilingual data structures

**dictType attribute: **
- Drop-down menu for dictionary data
- The system will automatically obtain option data from the dictionary service
- Choose one of the two with selectOptions

**selectOptions property: **
- Drop-down menus for customizing APIs
- Must provide api, selectParam, itemMapping
- Supports lazy loading (lazy: true) and multiple: true)

### 3. Table column configuration (columns)

Defines the column structure and display method of the table.

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

**render function: **
- Written using TSX syntax
- Receive the current row data as a parameter
- Can return any Vue element or HTML element
- Commonly used in status switches, operation buttons, custom displays, etc.

**dictType attribute: **
- Automatically convert data values ​​into corresponding dictionary tags
- For example:`1`Show as`啟用`，`0`Show as`禁用`

**multilingual properties: **
- Automatically display the corresponding multilingual content according to the current language
- Need to return multilingual data structures in the backend

### 4. Form Configuration (initFormData)

Defines the column structure for adding/editing forms.

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

**Bar type (type): **
- `input`: Text input box
- `textarea`: Multi-line text input box
- `input-number`: Digital input box
- `switch`: switch
- `select`: Pull down menu
- `radio`: Radio box
- `icon-select`: Graphic selector
- `file`: File upload

**showInMode property: **
- The display status of the control column in different modes
- `view`: View mode
- `add`: Added mode
- `edit`: Edit mode
- If not set, it will be displayed in all modes

**showCondition property: **
- Control display according to the values ​​of other fields
- Supports multiple operators:`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`in`、`nin`

**fileOptions Attribute: **
- `maxFileCount`: Maximum number of files
- `maxFileSize`: Maximum file size (MB)
- `filetype`: Display type (`img`or`list`）
- `fileExtension`: Allowed sub-file name
- `autoUpload`: Whether to upload automatically
- `singleFile`: Is it a single file

### 5. Form Verification Rules (rules)

Defines the verification rules for form columns.

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

**Verification Rule Type: **
- `required`: Required
- `pattern`: Regular expression
- `type`: Data type (`string`、`number`、`email`、`url`wait)
- `validator`: Custom verification function
- `min`/`max`: Min/max value
- `len`: length

### 6. Complete configuration options (options)

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

## Data structure

### InitQueryParams query parameters

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

### InitFormData form data

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

## Function description

### Basic functions

1. **CRUD Operation**: Supports basic operations such as adding, viewing, editing, and deleting.
2. **Paging function**: Support pagination display data.
3. **Search function**: Supports multi-condition search.
4. **Sorting function**: Support sorting by column.
5. **Batch Deletion**: Support batch selection and delete data.

### Form function

1. **Multiple input types**: Supports text, numbers, switches, selectors, single selection, illustration selection, file upload and other input types.
2. **Form Verification**: Supports form verification rules.
3. **Condition display**: Supports display or hide form items according to conditions.
4. **Mode Control**: It can control the display status of form items in view, add, and edit modes.

### Tree structure

1. **Tree data**: Supports the display and operation of tree structure data.
2. **Father-son relationship**: Automatically handle parent-child node relationship.
3. **Sorting function**: Supports sorting of tree structures.

### Multilingual support

1. **Ball Multilingual**: Support multilingual display of the column.
2. **Men Multilingual**: Supports multilingual display of menus.

## Usage example

Here is a complete usage example showing how to configure a DataTable component:

```vue
<script setup lang="tsx">
import type { MenuVO } from '@/api/system/menu'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { MenuApi } from '@/api/system/menu'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'
import { NSwitch } from 'naive-ui'

defineOptions({
  name: 'Menu Settings',
})

const { hasPermi } = usePermi()

const dataTableRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:menu:create'],
  page: ['system:menu:query'],
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

## Build a complete case from scratch

Let's learn how to use the DataTable component through a complete user management page.

### Step 1: Create API File

First create a user-related API file:

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

### Step 2: Create a role API (for drop-down menu)

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

### Step 3: Create a user management page

```vue
<!-- src/views/system/user/index.vue -->
<script setup lang="tsx">
import type { UserCreate, UserQuery, UserUpdate, UserVO } from '@/api/system/user'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { RoleApi } from '@/api/system/role'
import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'
import { NButton, NSwitch, NTag } from 'naive-ui'

defineOptions({
  name: 'User Management',
})

const { hasPermi } = usePermi()
const dataTableRef = ref()

// 權限配置
const permission = {
  create: ['system:user:create'],
  page: ['system:user:query'],
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

### Step 4: Add routing configuration

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
      permissions: ['system:user:query'],
    },
  },
]
```

### Step 5: Add Menu Configuration

Add corresponding menu items to the background management system to ensure that the user has corresponding permissions.

## FAQs and Solutions

### 1. Pagination configuration error

**Problem**: The paging function is enabled, but the pageSize is set to 0.

**Solution**:
- Make sure`pagination: true`When initQueryParams, the pageSize in initQueryParams is not 0.
- If you don't need paging, please set it`pagination: false`。

### 2. CRUD function is missing

**Problem**: The CRUD function is enabled, but no corresponding API function is provided.

**Solution**:
- Make sure to enable`add`Provided when`createFunction`
- Make sure to enable`edit`Provided when`updateFunction`
- Make sure to enable`del`Provided when`deleteFunction`
- Must provide`getListFunction`Get data

### 3. Search parameters configuration error

**Problem**: The search function is enabled, but no query parameters except pageSize and currentPage are provided.

**Solution**:
- Add at least one non-paging related query parameter in initQueryParams.

### 4. Selector configuration error

**Problem**: Inputs of type select or radio were used, but no data source was provided.

**Solution**:
- Provides dictType or selectOptions for inputs of type select or radio.
- If you use selectOptions, make sure to provide api, selectParam, and itemMapping.

### 5. The status field is configured incorrectly

**Problem**: The table contains the status field, but blockFunction and unblockFunction are not provided.

**Solution**:
- If the table contains the status field, blockFunction and unblockFunction must be provided.

### 6. Filter condition configuration error

**Problem**: FilterColumnName is provided but filterColumnValue is not provided, or vice versa.

**Solution**:
- filterColumnName and filterColumnValue must be provided at the same time or not.
- Make sure filterColumnValue.value is a non-empty string.

### 7. Repeat the column name

**Problem**: There are multiple fields of the same name in initFormData, but no showCondition is provided.

**Solution**:
- If there are multiple fields with the same name in initFormData, each field must be provided with a showCondition to control the display conditions.

### 8. Menu function configuration error

**Problem**: Menu function is enabled, but getMenuDataFunction or filterField is not provided.

**Solution**:
- If showMenu is true, getMenuDataFunction and filterField must be provided.

### 9. File upload configuration error

**Problem**: Input of file type was used, but fileOptions was not provided, or singleFile is true but maxFileCount is not 1.

**Solution**:
- Provides fileOptions for inputs of type file.
- If fileOptions.singleFile is true, make sure fileOptions.maxFileCount is 1.

## Advanced functions

### 1. Customize the operation button

Add a custom action button to the table column:

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

### 2. Conditional display form column

Control the display of form columns according to the values ​​of other columns:

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

### 3. Multilingual support

Enable multilingual features:

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

### 4. File upload

Configure file upload function:

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

In this way, you have completed a complete user management page with functions! The DataTable component will automatically handle all CRUD operations, permission control, form verification and other functions.

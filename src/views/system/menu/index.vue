<script setup lang="tsx">
// TODO：還需要最佳化
import type { MenuVO } from '@/api/system/menu'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'

import { MenuApi } from '@/api/system/menu'
import DataTable from '@/components/common/DataTable/index.vue'
import { type DataTableColumns, type FormRules, NSwitch } from 'naive-ui'

defineOptions({
  name: 'Menu Settings',
})

const dataTableRef = ref()

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'pageSize',
    value: 0,
    inputType: 'pagination',
  },
  {
    name: 'name',
    value: undefined,
    label: '選單標題',
    class: '!w-64',
    placeholder: '請填寫選單標題',
    inputType: 'input',
  },
  {
    name: 'status',
    value: undefined,
    label: '狀態',
    class: '!w-64',
    placeholder: '請填寫狀態',
    inputType: 'select',
    dictType: 'common_status',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<MenuVO> = [
  {
    title: '選單標題',
    align: 'left',
    key: 'title',
    multilingual: true,
    copy: true,
    fixed: 'left',
  },
  {
    title: '選單圖示',
    align: 'center',
    key: 'icon',
  },
  {
    title: '選單類型',
    align: 'center',
    key: 'type',
    dictType: 'system_menu_type',
  },
  {
    title: '排序',
    align: 'center',
    key: 'sort',
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row) => {
      return <NSwitch value={row.status === 1} onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)} />
    },
  },
]

/** 初始化表單數據 */
const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    hidden: true,
  },
  {
    name: 'parentId',
    value: undefined,
    span: 2,
    label: '父級選單',
    type: 'select',
    selectOptions: {
      api: MenuApi.getMenuPage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
  },
  {
    name: 'title',
    value: undefined,
    span: 2,
    label: '選單標題',
    type: 'input',
    multilingual: true,
  },
  {
    name: 'name',
    value: undefined,
    span: 2,
    label: '選單標識',
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
    label: '路由路徑',
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
    label: '元件路徑',
    type: 'input',
    placeholder: 'Eg: /system/user/index.vue',
    inputPrefix: '@/src/view',
    // inputSuffix: '.vue',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'permission',
    value: undefined,
    span: 1,
    label: '路由權限',
    type: 'input',
    placeholder: 'Eg: system:user:page',
    helpInfo: `控制器中定義的權限表示，如 @HasPermission('system:user:create')`,
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1, 2],
    },
  },
  {
    name: 'type',
    value: 0,
    span: 1,
    label: '選單類型',
    type: 'radio',
    dictType: 'system_menu_type',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'icon',
    value: undefined,
    span: 1,
    label: '選單圖示',
    type: 'icon-select',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'link',
    value: undefined,
    span: 1,
    label: '外鏈',
    type: 'input',
    placeholder: 'Eg: https://google.com',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isCache',
    value: undefined,
    span: 1,
    label: '是否快取',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isShowTag',
    value: undefined,
    span: 1,
    label: '顯示與TAB欄',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isPersistentTag',
    value: undefined,
    span: 1,
    label: '常駐TAB欄',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isShowSide',
    value: 1,
    span: 1,
    label: '顯示與側邊目錄',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'sort',
    value: undefined,
    span: 2,
    label: '排序',
    type: 'input-number',
  },
  {
    name: 'remark',
    value: undefined,
    span: 2,
    label: '備註',
    type: 'textarea',
  },
  {
    name: 'status',
    value: 1,
    span: 2,
    label: '狀態',
    type: 'switch',
  },

]

/** 表單驗證規則 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '選單標識不能為空',
      trigger: ['blur', 'input'],
    },
    {
      pattern: /^[\s\w-]+$/, // 正則表達式：允許空格(\s)、橫槓(-)、下劃線(\w包含_)、英文和數字
      message: '選單標識只能包含空格、橫槓(-)、下劃線(_)、英文和數字',
      trigger: ['blur', 'input'],
    },
  ],
  title: {
    required: true,
    message: '請填寫選單標題',
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: '請選擇選單類型',
    trigger: ['blur', 'input'],
    type: 'number',
  },
  sort: {
    required: true,
    message: '請填寫排序',
    trigger: ['blur', 'input'],
    type: 'number',
  },
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
  getFunction: MenuApi.getMenuPage, // 獲取表格數據的 API
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
  modalName: '選單', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  multilingualFieldsModalWidth: '900px', // 多語言欄位彈出視窗的寬度
}
</script>

<template>
  <DataTable v-bind="options" />
</template>

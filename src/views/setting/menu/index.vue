<script setup lang="tsx">
// TODO：還需要最佳化
import type { MenuVO } from '@/api/system/menu'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'

import { MenuApi } from '@/api/system/menu'
import DataTable from '@/components/common/DataTable/index.vue'
import { type DataTableColumns, type FormRules, NSwitch } from 'naive-ui'

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
    label: '部門名稱',
    class: '!w-64',
    placeholder: '請填寫部門名稱',
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
    title: '菜單名稱',
    align: 'center',
    key: 'name',
  },
  {
    title: '菜單圖示',
    align: 'center',
    key: 'icon',
  },
  {
    title: '路由路徑',
    align: 'center',
    key: 'path',
  },
  {
    title: '路由元件',
    align: 'center',
    key: 'component',
  },
  {
    title: '路由權限',
    align: 'center',
    key: 'permission',
  },
  {
    title: '菜單類型',
    align: 'center',
    key: 'type',

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
    label: '父級菜單',
    type: 'select',
    selectOptions: {
      api: MenuApi.getMenuPage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
  },
  {
    name: 'name',
    value: undefined,
    span: 2,
    label: '菜單名稱',
    type: 'input',
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
    label: '菜單類型',
    type: 'radio',
    dictType: 'system_menu_type',
  },
  {
    name: 'icon',
    value: undefined,
    span: 1,
    label: '菜單圖示',
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
    label: '顯示與標籤',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isKeepAlive',
    value: undefined,
    span: 1,
    label: '常駐標籤欄',
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isShowSide',
    value: undefined,
    span: 1,
    label: '顯示與側邊欄',
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
  name: {
    required: true,
    message: '請填寫菜單名稱',
    trigger: ['blur', 'input'],
  },
  permission: {
    required: true,
    message: '請填寫路由權限',
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: '請選擇菜單類型',
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
  index: true, // 是否顯示「索引」
  pagination: false, // 是否開啟分頁
  drag: true, // 是否開啟拖拽

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

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: '菜單', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
}
</script>

<template>
  <DataTable
    v-bind="options"
  />
</template>

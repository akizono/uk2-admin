<script setup lang="tsx">
import type { LogVO } from '@/api/system/log'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns } from 'naive-ui'

import { LogApi } from '@/api/system/log'
import DataTable from '@/components/common/DataTable/index.vue'

defineOptions({
  name: 'System Log',
})

// const { t } = useI18n()

/** 權限配置 */
const permission = {
  page: ['system:log:page'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'operationName',
    value: undefined,
    label: '操作名稱',
    class: '!w-64',
    placeholder: '操作名稱',
    inputType: 'input',
  },
  {
    name: 'actionType',
    value: undefined,
    label: '操作類型',
    class: '!w-64',
    placeholder: '操作類型',
    inputType: 'select',
    dictType: 'system_log_action-type',
  },
  {
    name: 'module',
    value: undefined,
    label: '業務模組名',
    class: '!w-64',
    placeholder: '業務模組名',
    inputType: 'input',
  },
  {
    name: 'path',
    value: undefined,
    label: '介面路徑',
    class: '!w-64',
    placeholder: '介面路徑',
    inputType: 'input',
  },
  {
    name: 'method',
    value: undefined,
    label: 'HTTP方法',
    class: '!w-64',
    placeholder: 'HTTP方法',
    inputType: 'select',
    dictType: 'system_log_method',
  },
  {
    name: 'statusCode',
    value: undefined,
    label: 'HTTP狀態碼',
    class: '!w-64',
    placeholder: 'HTTP狀態碼',
    inputType: 'select',
    dictType: 'system_log_status-code',
  },
  {
    name: '',
    value: undefined,
    label: '使用者',
    class: '!w-64',
    placeholder: 'Eg: username',
    inputType: 'input',
  },
  {
    name: 'ip',
    value: undefined,
    label: '使用者IP位址',
    class: '!w-64',
    placeholder: '使用者IP位址',
    inputType: 'input',
  },

]

/** 表格列定義 */
const columns: DataTableColumns<LogVO> = [
  {
    title: '操作名稱',
    align: 'center',
    key: 'operationName',
  },
  {
    title: '操作類型',
    align: 'center',
    key: 'actionType',
  },
  {
    title: '業務模組名',
    align: 'center',
    key: 'module',
  },
  // {
  //   title: 'id',
  //   align: 'center',
  //   key: 'id',
  // },
  // {
  //   title: '介面路徑',
  //   align: 'center',
  //   key: 'path',
  // },
  // {
  //   title: 'HTTP方法',
  //   align: 'center',
  //   key: 'method',
  // },
  // {
  //   title: '請求參數(params)',
  //   align: 'center',
  //   key: 'params',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.params)}</div>
  //   },
  // },
  // {
  //   title: '請求體數據(body)',
  //   align: 'center',
  //   key: 'body',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.body)}</div>
  //   },
  // },
  // {
  //   title: '查詢參數(query)',
  //   align: 'center',
  //   key: 'query',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.query)}</div>
  //   },
  // },
  {
    title: 'HTTP狀態碼',
    align: 'center',
    key: 'statusCode',
  },
  // {
  //   title: '反應時間（毫秒）',
  //   align: 'center',
  //   key: 'responseTime',
  // },
  {
    title: '使用者',
    align: 'center',
    key: 'user.username',
  },
  // {
  //   title: '使用者IP位址',
  //   align: 'center',
  //   key: 'ip',
  // },
  // {
  //   title: '使用者代理（瀏覽器資訊）',
  //   align: 'center',
  //   key: 'userAgent',
  // },
  {
    title: '是否操作成功',
    align: 'center',
    key: 'isSuccess',
    dictType: 'system_log_is-success',
  },
  // {
  //   title: '錯誤資訊',
  //   align: 'center',
  //   key: 'errorMessage',
  // },
  // {
  //   title: '錯誤堆棧',
  //   align: 'center',
  //   key: 'errorStack',
  // },

  // {
  //   title: '資源ID',
  //   align: 'center',
  //   key: 'resourceId',
  // },
]

/** 初始化表單數據 */
const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    span: 1,
    hidden: false,
    label: 'ID',
  },
  {
    name: 'operationName',
    value: undefined,
    span: 1,
    label: '操作名稱',
  },
  {
    name: 'actionType',
    value: undefined,
    span: 1,
    label: '操作類型',
  },
  {
    name: 'module',
    value: undefined,
    span: 1,
    label: '業務模組名',
  },
  {
    name: 'method',
    value: undefined,
    span: 1,
    label: 'HTTP方法',
  },
  {
    name: 'statusCode',
    value: undefined,
    span: 1,
    label: 'HTTP狀態碼',
  },
  {
    name: 'responseTime',
    value: undefined,
    span: 1,
    label: '反應時間（毫秒）',
  },
  {
    name: 'user.username',
    value: undefined,
    span: 1,
    label: '使用者',
  },
  {
    name: 'isSuccess',
    value: undefined,
    span: 1,
    label: '是否操作成功',
    dictType: 'system_log_is-success',
  },
  {
    name: 'resourceId',
    value: undefined,
    span: 1,
    label: '資源ID',
  },
  {
    name: 'path',
    value: undefined,
    span: 2,
    label: '介面路徑',
  },
  {
    name: 'params',
    value: undefined,
    span: 2,
    label: '請求參數(params)',
  },
  {
    name: 'body',
    value: undefined,
    span: 2,
    label: '請求體數據(body)',
  },
  {
    name: 'query',
    value: undefined,
    span: 2,
    label: '查詢參數(query)',
  },

  {
    name: 'ip',
    value: undefined,
    span: 2,
    label: '使用者IP位址',
  },
  {
    name: 'userAgent',
    value: undefined,
    span: 2,
    label: '使用者代理（瀏覽器資訊）',
  },
  {
    name: 'errorMessage',
    value: undefined,
    span: 2,
    label: '錯誤資訊',
  },
  {
    name: 'errorStack',
    value: undefined,
    span: 2,
    label: '錯誤堆棧',
  },
]

/** 元件的配置 */
const options = {
  /** 表格的顯示功能 */
  view: true, // 是否顯示「查看按鈕」
  search: true, // 是否顯示「頂部搜索框」
  index: true, // 是否顯示「索引」
  pagination: true, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  // viewEntranceColumns: [],
  initQueryParams, // 初始化查詢參數
  getFunction: LogApi.getLogPage, // 獲取表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: '日誌', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置
}
</script>

<template>
  <div class="system-log">
    <DataTable v-bind="options" />
  </div>
</template>

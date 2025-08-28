<script setup lang="tsx">
import type { LogVO } from '@/api/system/log'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { LogApi } from '@/api/system/log'
import DataTable from '@/components/common/DataTable/index.vue'

defineOptions({
  name: 'System Log',
})

// const { hasPermi } = usePermi()
// const { t } = useI18n()

// const dataTableRef = ref()

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
  //   title: '請求體數據',
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

]

/** 表單驗證規則 */
const rules: FormRules = {

}

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
  rules, // 表單驗證規則
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

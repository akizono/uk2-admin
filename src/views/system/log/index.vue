<script setup lang="tsx">
import type { LogVO } from '@/api/system/log'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns } from 'naive-ui'

import { LogApi } from '@/api/system/log'
import DataTable from '@/components/common/DataTable/index.vue'
import { $t } from '@/utils'

defineOptions({
  name: 'System Log',
})

/** 權限配置 */
const permission = {
  page: ['system:log:page'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'operationName',
    value: undefined,
    label: $t('log.operationName'),
    class: '!w-64',
    placeholder: $t('log.operationName'),
    inputType: 'input',
  },
  {
    name: 'actionType',
    value: undefined,
    label: $t('log.actionType'),
    class: '!w-64',
    placeholder: $t('log.actionType'),
    inputType: 'select',
    dictType: 'system_log_action-type',
  },
  {
    name: 'module',
    value: undefined,
    label: $t('log.module'),
    class: '!w-64',
    placeholder: $t('log.module'),
    inputType: 'input',
  },
  {
    name: 'path',
    value: undefined,
    label: $t('log.path'),
    class: '!w-64',
    placeholder: $t('log.path'),
    inputType: 'input',
  },
  {
    name: 'method',
    value: undefined,
    label: $t('log.method'),
    class: '!w-64',
    placeholder: $t('log.method'),
    inputType: 'select',
    dictType: 'system_log_method',
  },
  {
    name: 'statusCode',
    value: undefined,
    label: $t('log.statusCode'),
    class: '!w-64',
    placeholder: $t('log.statusCode'),
    inputType: 'select',
    dictType: 'system_log_status-code',
  },
  {
    name: '',
    value: undefined,
    label: $t('log.username'),
    class: '!w-64',
    placeholder: 'Eg: username',
    inputType: 'input',
  },
  {
    name: 'ip',
    value: undefined,
    label: $t('log.userIp'),
    class: '!w-64',
    placeholder: $t('log.userIp'),
    inputType: 'input',
  },

]

/** 表格列定義 */
const columns: DataTableColumns<LogVO> = [
  {
    title: $t('log.operationName'),
    align: 'center',
    key: 'operationName',
  },
  {
    title: $t('log.actionType'),
    align: 'center',
    key: 'actionType',
  },
  {
    title: $t('log.module'),
    align: 'center',
    key: 'module',
  },
  // {
  //   title: 'id',
  //   align: 'center',
  //   key: 'id',
  // },
  // {
  //   title: $t('log.path'),
  //   align: 'center',
  //   key: 'path',
  // },
  // {
  //   title: $t('log.method'),
  //   align: 'center',
  //   key: 'method',
  // },
  // {
  //   title: `${$t('log.params')}(params)`,
  //   align: 'center',
  //   key: 'params',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.params)}</div>
  //   },
  // },
  // {
  //   title: `${$t('log.body')}(body)`,
  //   align: 'center',
  //   key: 'body',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.body)}</div>
  //   },
  // },
  // {
  //   title: `${$t('log.query')}(query)`,
  //   align: 'center',
  //   key: 'query',
  //   render: (row: LogVO) => {
  //     return <div>{JSON.stringify(row.query)}</div>
  //   },
  // },
  {
    title: $t('log.statusCode'),
    align: 'center',
    key: 'statusCode',
  },
  // {
  //   title: $t('log.responseTime'),
  //   align: 'center',
  //   key: 'responseTime',
  // },
  {
    title: $t('log.username'),
    align: 'center',
    key: 'user.username',
  },
  // {
  //   title: $t('log.userIp'),
  //   align: 'center',
  //   key: 'ip',
  // },
  // {
  //   title: $t('log.userAgent'),
  //   align: 'center',
  //   key: 'userAgent',
  // },
  {
    title: $t('log.isSuccess'),
    align: 'center',
    key: 'isSuccess',
    dictType: 'system_log_is-success',
  },
  // {
  //   title: $t('log.errorMessage'),
  //   align: 'center',
  //   key: 'errorMessage',
  // },
  // {
  //   title: $t('log.errorStack'),
  //   align: 'center',
  //   key: 'errorStack',
  // },

  // {
  //   title: $t('log.resourceId'),
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
    label: $t('log.operationName'),
  },
  {
    name: 'actionType',
    value: undefined,
    span: 1,
    label: $t('log.actionType'),
  },
  {
    name: 'module',
    value: undefined,
    span: 1,
    label: $t('log.module'),
  },
  {
    name: 'method',
    value: undefined,
    span: 1,
    label: $t('log.method'),
  },
  {
    name: 'statusCode',
    value: undefined,
    span: 1,
    label: $t('log.statusCode'),
  },
  {
    name: 'responseTime',
    value: undefined,
    span: 1,
    label: $t('log.responseTime'),
  },
  {
    name: 'user.username',
    value: undefined,
    span: 1,
    label: $t('log.username'),
  },
  {
    name: 'isSuccess',
    value: undefined,
    span: 1,
    label: $t('log.isSuccess'),
    dictType: 'system_log_is-success',
  },
  {
    name: 'resourceId',
    value: undefined,
    span: 1,
    label: $t('log.resourceId'),
  },
  {
    name: 'path',
    value: undefined,
    span: 2,
    label: $t('log.path'),
  },
  {
    name: 'params',
    value: undefined,
    span: 2,
    label: `${$t('log.params')}(params)`,
  },
  {
    name: 'body',
    value: undefined,
    span: 2,
    label: `${$t('log.body')}(body)`,
  },
  {
    name: 'query',
    value: undefined,
    span: 2,
    label: `${$t('log.query')}(query)`,
  },

  {
    name: 'ip',
    value: undefined,
    span: 2,
    label: $t('log.userIp'),
  },
  {
    name: 'userAgent',
    value: undefined,
    span: 2,
    label: $t('log.userAgent'),
  },
  {
    name: 'errorMessage',
    value: undefined,
    span: 2,
    label: $t('log.errorMessage'),
  },
  {
    name: 'errorStack',
    value: undefined,
    span: 2,
    label: $t('log.errorStack'),
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
  modalName: $t('log.log'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置

  tableScrollX: 1200,
  tabShowBorder: true,
}
</script>

<template>
  <div class="system-log">
    <DataTable v-bind="options" />
  </div>
</template>

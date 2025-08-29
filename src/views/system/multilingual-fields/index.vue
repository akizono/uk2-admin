<script setup lang="tsx">
import type { MultilingualFieldsVO } from '@/api/system/multilingual-fields'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { NTime } from 'naive-ui'

import { getLanguageList } from '@/api/system/lang'
import { MultilingualFieldsApi } from '@/api/system/multilingual-fields'
import DataTable from '@/components/common/DataTable/index.vue'

defineOptions({
  name: 'Multilingual Field Settings',
})

// const { hasPermi } = usePermi()
const { t } = useI18n()

// const dataTableRef = ref()

/** 權限配置 */
const permission = {
  page: ['system:multilingual-fields:page'],
  update: ['system:multilingual-fields:update'],
  delete: ['system:multilingual-fields:delete'],
  block: ['system:multilingual-fields:block'],
  unblock: ['system:multilingual-fields:unblock'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'fieldId',
    value: undefined,
    label: '欄位ID',
    class: '!w-64',
    placeholder: '請輸入欄位ID',
    inputType: 'input',
  },
  {
    name: 'language',
    value: undefined,
    label: '對應語言',
    class: '!w-64',
    inputType: 'select',
    selectOptions: {
      api: getLanguageList,
      itemMapping: {
        label: 'label',
        value: 'value',
      },
    },
  },
  {
    name: 'value',
    value: undefined,
    label: '欄位值',
    class: '!w-64',
    placeholder: '請輸入欄位值',
    inputType: 'input',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<MultilingualFieldsVO> = [
  {
    title: '欄位ID',
    align: 'left',
    key: 'fieldId',
    copy: true,
  },
  {
    title: '對應語言',
    align: 'left',
    key: 'language',
    render: (row: MultilingualFieldsVO) => {
      return t(`language.${row.language}`)
    },
  },
  {
    title: '欄位值',
    align: 'left',
    key: 'value',
  },
  {
    title: '創建時間',
    align: 'center',
    key: 'createTime',
    render: (row: MultilingualFieldsVO) => {
      return <NTime time={new Date(row.createTime)} />
    },
  },
  {
    title: '更新時間',
    align: 'center',
    key: 'updateTime',
    render: (row: MultilingualFieldsVO) => {
      return <NTime time={new Date(row.updateTime)} />
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
      edit: false,
    },
  },
  {
    name: 'fieldId',
    value: undefined,
    span: 2,
    label: '欄位ID',
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'language',
    value: undefined,
    span: 1,
    label: '對應語言',
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'value',
    value: undefined,
    span: 1,
    label: '欄位值',
    type: 'input',
  },
  {
    name: 'createTime',
    value: undefined,
    span: 1,
    label: '創建時間',
    dateFormat: 'yyyy-MM-dd hh:mm:ss',
    showInMode: {
      view: true,
      edit: false,
    },
  },
  {
    name: 'updateTime',
    value: undefined,
    span: 1,
    label: '更新時間',
    dateFormat: 'yyyy-MM-dd hh:mm:ss',
    showInMode: {
      view: true,
      edit: false,
    },
  },
]

/** 表單驗證規則 */
const rules: FormRules = {
  value: [
    {
      required: true,
      message: '請輸入欄位值',
      trigger: ['blur', 'input'],
    },
  ],
}

/** 元件的配置 */
const options = {
  /** 表格的顯示功能 */
  view: true, // 是否顯示「查看按鈕」
  edit: true, // 是否顯示「編輯按鈕」
  del: true, // 是否顯示「刪除按鈕」
  search: true, // 是否顯示「頂部搜索框」
  index: false, // 是否顯示「索引」
  pagination: true, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['fieldId'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: MultilingualFieldsApi.getMultilingualFieldsPage, // 獲取表格數據的 API
  deleteFunction: MultilingualFieldsApi.deleteMultilingualFields, // 刪除表格數據的 API
  updateFunction: MultilingualFieldsApi.updateMultilingualFields, // 更新表格數據的 API

  blockFunction: MultilingualFieldsApi.blockMultilingualFields, // 封鎖表格數據的 API
  unblockFunction: MultilingualFieldsApi.unblockMultilingualFields, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: '多語言欄位設定', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置
}
</script>

<template>
  <DataTable v-bind="options" />
</template>

<style scoped lang="scss"></style>

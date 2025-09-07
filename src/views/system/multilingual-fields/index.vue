<script setup lang="tsx">
import type { MultilingualFieldsVO } from '@/api/system/multilingual-fields'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { NTime } from 'naive-ui'

import { getLanguageList } from '@/api/system/lang'
import { MultilingualFieldsApi } from '@/api/system/multilingual-fields'
import DataTable from '@/components/common/DataTable/index.vue'
import { $t } from '@/utils'

defineOptions({
  name: 'Multilingual Field Settings',
})

// const { hasPermi } = usePermi()

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
    label: $t('multilingualFields.fieldId'),
    class: '!w-64',
    placeholder: $t('multilingualFields.fieldIdPlaceholder'),
    inputType: 'input',
  },
  {
    name: 'language',
    value: undefined,
    label: $t('multilingualFields.language'),
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
    label: $t('multilingualFields.value'),
    class: '!w-64',
    placeholder: $t('multilingualFields.valuePlaceholder'),
    inputType: 'input',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<MultilingualFieldsVO> = [
  {
    title: $t('multilingualFields.fieldId'),
    align: 'left',
    key: 'fieldId',
    copy: true,
  },
  {
    title: $t('multilingualFields.language'),
    align: 'left',
    key: 'language',
    render: (row: MultilingualFieldsVO) => {
      return $t(`language.${row.language}`)
    },
  },
  {
    title: $t('multilingualFields.value'),
    align: 'left',
    key: 'value',
  },
  {
    title: $t('multilingualFields.createTime'),
    align: 'center',
    key: 'createTime',
    render: (row: MultilingualFieldsVO) => {
      return <NTime time={new Date(row.createTime)} />
    },
  },
  {
    title: $t('multilingualFields.updateTime'),
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
    label: $t('multilingualFields.fieldId'),
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'language',
    value: undefined,
    span: 1,
    label: $t('multilingualFields.language'),
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'value',
    value: undefined,
    span: 1,
    label: $t('multilingualFields.value'),
    type: 'input',
  },
  {
    name: 'createTime',
    value: undefined,
    span: 1,
    label: $t('multilingualFields.createTime'),
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
    label: $t('multilingualFields.updateTime'),
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
      message: $t('multilingualFields.valuePlaceholder'),
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
  modalName: $t('multilingualFields.multilingualFieldSettings'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置
}
</script>

<template>
  <DataTable v-bind="options" />
</template>

<style scoped lang="scss"></style>

<script setup lang="tsx">
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DictTypeApi, type DictTypeVO } from '@/api/system/dict-type'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'
import { NButton, NSwitch } from 'naive-ui'

import DictData from './components/dict-data/index.vue'

defineOptions({
  name: 'Dictionary Management',
})
const { hasPermi } = usePermi()

const dataTableRef = ref()
const modalRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:dict-type:create'],
  page: ['system:dict-type:query'],
  update: ['system:dict-type:update'],
  delete: ['system:dict-type:delete'],
  block: ['system:dict-type:block'],
  unblock: ['system:dict-type:unblock'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'name',
    value: undefined,
    label: $t('dictionary.dictName'),
    class: '!w-64',
    placeholder: $t('dictionary.dictNamePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'type',
    value: undefined,
    label: $t('dictionary.dictType'),
    class: '!w-64',
    placeholder: $t('dictionary.dictTypePlaceholder'),
    inputType: 'input',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<DictTypeVO> = [
  {
    title: $t('dictionary.dictName'),
    align: 'center',
    key: 'name',
    multilingual: true,
  },
  {
    title: $t('dictionary.dictType'),
    align: 'center',
    key: 'type',
    copy: true,
  },
  {
    title: $t('common.sort'),
    align: 'center',
    key: 'sort',
  },
  {
    title: $t('common.remark'),
    align: 'center',
    key: 'remark',
  },
  {
    title: $t('common.status'),
    align: 'center',
    key: 'status',
    render: (row: DictTypeVO) => {
      return <NSwitch disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)} value={row.status === 1} onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)} />
    },
  },
  {
    title: $t('common.action'),
    key: 'actions',
    render: (row: DictTypeVO) => {
      return <NButton size="small" onClick={() => modalRef.value.openModal(row)}>{$t('dictionary.dictData')}</NButton>
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
    name: 'name',
    value: undefined,
    span: 1,
    label: $t('dictionary.dictName'),
    type: 'input',
    multilingual: true,
  },
  {
    name: 'type',
    value: undefined,
    span: 1,
    label: $t('dictionary.dictType'),
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'sort',
    value: undefined,
    span: 1,
    label: $t('common.sort'),
    type: 'input-number',
  },
  {
    name: 'remark',
    value: undefined,
    span: 2,
    label: $t('common.remark'),
    type: 'textarea',
  },
  {
    name: 'status',
    value: 1,
    span: 1,
    label: $t('common.status'),
    type: 'switch',
  },
]

/** 表單驗證規則 */
const rules: FormRules = {
  name: {
    required: true,
    message: $t('dictionary.dictNameRule'),
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: $t('dictionary.dictTypeRule'),
    trigger: ['blur', 'input'],
  },
  sort: {
    required: true,
    message: $t('dictionary.sortRule'),
    trigger: ['blur', 'input'],
    type: 'number',
  },
}

/** 元件的配置 */
const options = {
  /** 表格的顯示功能 */
  view: false, // 是否顯示「查看按鈕」
  edit: true, // 是否顯示「編輯按鈕」
  del: true, // 是否顯示「刪除按鈕」
  search: true, // 是否顯示「頂部搜索框」
  add: true, // 是否顯示「新增按鈕」
  index: true, // 是否顯示「索引」
  pagination: true, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: [], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getListFunction: DictTypeApi.getDictTypeList, // 獲取表格數據的 API
  deleteFunction: DictTypeApi.deleteDictType, // 刪除表格數據的 API
  updateFunction: DictTypeApi.updateDictType, // 更新表格數據的 API
  createFunction: DictTypeApi.createDictType, // 新增表格數據的 API

  blockFunction: DictTypeApi.blockDictType, // 封鎖表格數據的 API
  unblockFunction: DictTypeApi.unblockDictType, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則

  /** 其他配置 */
  modalName: $t('dictionary.dictionary'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置

  tableScrollX: 1200,
  tabShowBorder: true,
}
</script>

<template>
  <div>
    <DataTable
      v-bind="options"
    />

    <DictData ref="modalRef" />
  </div>
</template>

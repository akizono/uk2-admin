<script setup lang="tsx">
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DictTypeApi, type DictTypeVO } from '@/api/system/dict-type'
import { NButton, NSwitch } from 'naive-ui'

import DictData from './components/dict-data/index.vue'

const dataTableRef = ref()
const modalRef = ref()

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'name',
    value: undefined,
    label: '字典名稱',
    class: '!w-64',
    placeholder: '請填寫字典名稱',
    inputType: 'input',
  },
  {
    name: 'type',
    value: undefined,
    label: '字典類型',
    class: '!w-64',
    placeholder: '請填寫字典類型',
    inputType: 'input',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<DictTypeVO> = [
  {
    title: '字典名稱',
    align: 'center',
    key: 'name',
  },
  {
    title: '字典類型',
    align: 'center',
    key: 'type',
  },
  {
    title: '排序',
    align: 'center',
    key: 'sort',
  },
  {
    title: '備註',
    align: 'center',
    key: 'remark',
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row) => {
      return <NSwitch value={row.status === 1} onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)} />
    },
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return <NButton size="small" onClick={() => modalRef.value.openModal(row)}>字典數據</NButton>
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
    label: '字典名稱',
    type: 'input',
  },
  {
    name: 'type',
    value: undefined,
    span: 1,
    label: '字典類型',
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'sort',
    value: undefined,
    span: 1,
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
    span: 1,
    label: '狀態',
    type: 'switch',
  },
]

/** 表單驗證規則 */
const rules: FormRules = {
  name: {
    required: true,
    message: '請填寫字典名稱',
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: '請填寫字典類型',
    trigger: ['blur', 'input'],
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
  getFunction: DictTypeApi.getDictTypePage, // 獲取表格數據的 API
  deleteFunction: DictTypeApi.deleteDictType, // 刪除表格數據的 API
  updateFunction: DictTypeApi.updateDictType, // 更新表格數據的 API
  createFunction: DictTypeApi.createDictType, // 新增表格數據的 API

  blockFunction: DictTypeApi.blockDictType, // 封鎖表格數據的 API
  unblockFunction: DictTypeApi.unblockDictType, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則

  /** 其他配置 */
  modalName: '字典', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
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

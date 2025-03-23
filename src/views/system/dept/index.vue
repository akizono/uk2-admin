<script setup lang="tsx">
// TODO：禁用之後 所有子項也會被禁用
// TODO：表但需要一個父ID選項
// TODO：刪除的時候是否刪除所有的子項
import type { DeptVO } from '@/api/system/dept'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DeptApi } from '@/api/system/dept'
import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'

/** 更新用戶狀態 */
// const dataTableRef = ref()
// function handleUpdateDisabled(value: 0 | 1, id: string) {
//   dataTableRef.value.setListItemFieldValue(id, 'status', value)
//   if (value === 1)
//     DeptApi.unblockDept(id)
//   else
//     DeptApi.blockDept(id)
// }

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
    dict: 'status',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<DeptVO> = [
  {
    title: '部門名稱',
    align: 'center',
    key: 'name',
  },
  {
    title: '負責人',
    align: 'center',
    key: 'leaderUser.nickname',
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
      return row.status === 1 ? '啟用' : '禁用'
    },
  },
]

/** 表單驗證規則 */
const rules: FormRules = {
  name: {
    required: true,
    message: '請填寫部門名稱',
    trigger: ['blur', 'input'],
  },
  leaderUserId: {
    required: true,
    message: '請選擇負責人',
    trigger: ['blur', 'change'],
  },
}

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
    label: '父級部門',
    type: 'select',
    options: {
      api: DeptApi.getDeptPage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
  },
  {
    name: 'name',
    value: undefined,
    span: 1,
    label: '部門名稱',
    type: 'input',
  },
  {
    name: 'leaderUserId',
    value: undefined,
    span: 1,
    label: '負責人',
    type: 'select',
    options: {
      api: UserApi.getUserPage,
      selectParam: 'username',
      itemMapping: { label: 'nickname', value: 'id' },
      lazy: true,
    },
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

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['name'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: DeptApi.getDeptPage, // 獲取表格數據的 API
  deleteFunction: DeptApi.deleteDept, // 刪除表格數據的 API
  updateFunction: DeptApi.updateDept, // 更新表格數據的 API
  createFunction: DeptApi.createDept, // 新增表格數據的 API

  /** 表單配置 */
  rules, // 表單驗證規則
  initFormData, // 初始化表單數據

  /** 其他配置 */
  modalName: '部門', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
}
</script>

<template>
  <DataTable
    v-bind="options"
  />
</template>

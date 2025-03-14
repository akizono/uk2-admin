<script setup lang="tsx">
import type { DeptVo } from '@/api/system/dept'
import type { InitFormData, InitQueryParams, TableRow } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DeptApi } from '@/api/system/dept'
import DataTable from '@/components/common/DataTable/index.vue'

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
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
const columns: DataTableColumns<DeptVo> = [
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
const viewEntranceColumns = ['name'] // 點擊後能進入查看視窗的欄位

/** 更新用戶狀態 */
const dataTableRef = ref()
function handleUpdateDisabled(value: 0 | 1, id: string) {
  dataTableRef.value.setListItemFieldValue(id, 'status', value)
  if (value === 1)
    DeptApi.unblockDept(id)
  else
    DeptApi.blockDept(id)
}

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
    hidden: true,
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
</script>

<template>
  <DataTable
    ref="dataTableRef"
    modal-name="部門"

    view
    edit
    del
    search
    add
    index

    :columns="columns"
    :view-entrance-columns="viewEntranceColumns"
    :init-query-params="initQueryParams"
    :update-disabled="handleUpdateDisabled"
    :get-function="DeptApi.getDeptPage"
    :delete-function="DeptApi.deleteDept"
    :update-function="DeptApi.updateDept"
    :create-function="DeptApi.createDept"

    :rules="rules"
    :init-form-data="initFormData"
  />
</template>

<script setup lang="tsx">
// TODO：隱藏顯示左側菜單、適配彈出視窗
import type { UserVo } from '@/api/system/user'
import type { InitFormData, InitQueryParams, TableRow } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'
import CopyText from '@/components/custom/CopyText.vue'
import { createCopyableDialog } from '@/utils/dialog'
import { NSwitch } from 'naive-ui'

/** 更新用戶狀態 */
const dataTableRef = ref()
function handleUpdateDisabled(value: 0 | 1, id: string) {
  dataTableRef.value.setListItemFieldValue(id, 'status', value)
  if (value === 1)
    UserApi.unblockUser(id)
  else
    UserApi.blockUser(id)
}

/** 處理 Modal 提交成功後返回的數據 */
function handleCreateSuccess(params: TableRow) {
  const tips = `帳號：${params.username}<br />密碼：${params.password}<br />請盡快登錄系統修改您的默認密碼。`
  createCopyableDialog({
    title: '新增使用者成功',
    content: tips,
    positiveText: '確認',
    negativeText: '複製資訊',
  })
}

const initQueryParams: InitQueryParams[] = [
  {
    name: 'username',
    value: undefined,
    label: '使用者名稱',
    class: '!w-64',
    placeholder: '請填寫使用者名稱',
    inputType: 'input',
  },
  {
    name: 'nickname',
    value: undefined,
    label: '暱稱',
    class: '!w-64',
    placeholder: '請填寫暱稱',
    inputType: 'input',
  },
  {
    name: 'age',
    value: undefined,
    label: '年齡',
    class: '!w-64',
    placeholder: '請填寫年齡',
    inputType: 'input-number',
  },
  {
    name: 'sex',
    value: undefined,
    label: '性別',
    class: '!w-64',
    placeholder: '請填寫性別',
    inputType: 'select',
    dict: 'sex',
  },
  {
    name: 'email',
    value: undefined,
    label: '電子郵件',
    class: '!w-64',
    placeholder: '請填寫電子郵件',
    inputType: 'input',
  },
  {
    name: 'mobile',
    value: undefined,
    label: '手機號碼',
    class: '!w-64',
    placeholder: '請填寫手機號碼',
    inputType: 'input',
  },
  {
    name: 'status',
    value: undefined,
    label: '狀態',
    class: '!w-64',
    inputType: 'select',
    dict: 'status',
  },
]

const columns: DataTableColumns<UserVo> = [
  {
    title: '使用者名稱',
    align: 'center',
    key: 'username',
    // fixed: 'left',
  },
  {
    title: '暱稱',
    align: 'center',
    key: 'nickname',
  },
  {
    title: '年齡',
    align: 'center',
    key: 'age',
  },
  {
    title: '性別',
    align: 'center',
    key: 'sex',
    render: (row) => {
      if (row.sex)
        return row.sex === 1 ? '男' : '女'
      else
        return ''
    },
  },
  {
    title: '電子郵件',
    align: 'center',
    key: 'email',
  },
  {
    title: '手機號碼',
    align: 'center',
    key: 'mobile',
    render: (row) => {
      return (
        <CopyText value={row.mobile} />
      )
    },
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
      return (
        <NSwitch
          value={row.status}
          checked-value={1}
          unchecked-value={0}
          onUpdateValue={(value: 0 | 1) =>
            handleUpdateDisabled(value, row.id!)}
        >
          {{ checked: () => '啟用', unchecked: () => '禁用' }}
        </NSwitch>
      )
    },
  },

]

const rules: FormRules = {
  username: {
    required: true,
    message: '請輸入使用者名稱',
    trigger: ['blur', 'input'],
  },
  nickname: {
    message: '請輸入暱稱',
    trigger: ['blur', 'input'],
  },
  age: {
    type: 'number',
    message: '請輸入年齡',
    trigger: ['blur', 'input'],
  },
  sex: {
    type: 'number',
    message: '請選擇性別',
    trigger: ['blur', 'change'],
  },
  email: {
    type: 'email',
    message: '請輸入正確的電子郵件格式',
    trigger: ['blur', 'input'],
  },
  mobile: {
    pattern: /^[\d\s+]{1,20}$/,
    message: '請輸入正確的手機號碼格式',
    trigger: ['blur', 'input'],
  },
}

const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    hidden: true,
  },
  {
    name: 'username',
    value: undefined,
    span: 1,
    label: '使用者名稱',
    type: 'input',
    disableEdit: true, // 編輯時禁用
  },
  {
    name: 'nickname',
    value: undefined,
    span: 1,
    label: '暱稱',
    type: 'input',
  },
  {
    name: 'age',
    value: undefined,
    span: 1,
    label: '年齡',
    type: 'input-number',
  },
  {
    name: 'sex',
    value: undefined,
    span: 1,
    label: '性別',
    type: 'radio',
  },
  {
    name: 'email',
    value: undefined,
    span: 1,
    label: '電子郵件',
    type: 'input',
  },
  {
    name: 'mobile',
    value: undefined,
    span: 1,
    label: '手機號碼',
    type: 'input',
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
    label: '使用者狀態',
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

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['username'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: UserApi.getUserPage, // 獲取表格數據的 API
  deleteFunction: UserApi.deleteUser, // 刪除表格數據的 API
  updateFunction: UserApi.updateUser, // 更新表格數據的 API
  createFunction: UserApi.createUser, // 新增表格數據的 API

  /** 表單配置 */
  rules, // 表單驗證規則
  initFormData, // 初始化表單數據

  /** 其他配置 */
  modalName: '使用者', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
}
</script>

<template>
  <DataTable
    v-bind="options"
    @create-success="handleCreateSuccess"
  />
</template>

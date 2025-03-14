<script setup lang="tsx">
// TODO：隱藏顯示左側菜單、適配彈出視窗
import type { UserVo } from '@/api/user'
import type { InitFormData, InitQueryParams, TableRow } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { UserApi } from '@/api/user'
import DataTable from '@/components/common/DataTable/index.vue'
import CopyText from '@/components/custom/CopyText.vue'
import { createCopyableDialog } from '@/utils/dialog'
import { NSwitch } from 'naive-ui'

// 初始化查詢參數
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
    value: 1,
    label: '狀態',
    class: '!w-64',
    inputType: 'select',
    dict: 'status',
  },
]

// 表格列定義
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
    key: 'tel',
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

/** 更新用戶狀態 */
const dataTableRef = ref()
function handleUpdateDisabled(value: 0 | 1, id: string) {
  dataTableRef.value.setListItemFieldValue(id, 'status', value)
  if (value === 1)
    UserApi.unblockUser(id)
  else
    UserApi.blockUser(id)
}

// 表單驗證規則
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

// 初始化表單數據
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

// 處理 Modal 提交成功後返回的數據
function handleCreateSuccess(params: TableRow) {
  const tips = `帳號：${params.username}<br />密碼：${params.password}<br />請盡快登錄系統修改您的默認密碼。`
  createCopyableDialog({
    title: '新增使用者成功',
    content: tips,
    positiveText: '確認',
    negativeText: '複製資訊',
  })
}
</script>

<template>
  <DataTable
    ref="dataTableRef"
    modal-name="使用者"

    edit
    del
    search
    add
    index

    :columns="columns"
    :init-query-params="initQueryParams"
    :get-function="UserApi.getUserPage"
    :delete-function="UserApi.deleteUser"
    :update-function="UserApi.updateUser"
    :create-function="UserApi.createUser"

    :rules="rules"
    :init-form-data="initFormData"

    @create-success="handleCreateSuccess"
  />
</template>

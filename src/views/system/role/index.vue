<script setup lang="tsx">
import type { RoleVO } from '@/api/system/role'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'

import { RoleApi } from '@/api/system/role'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'
import { type DataTableColumns, type FormRules, NButton, NSwitch } from 'naive-ui'

import AssignmentMenu from './components/assignment-menu/index.vue'

defineOptions({
  name: 'Role Management',
})

const { hasPermi } = usePermi()

const dataTableRef = ref()
const assignmentMenuRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:role:create'],
  page: ['system:role:page'],
  update: ['system:role:update'],
  delete: ['system:role:delete'],
  block: ['system:role:block'],
  unblock: ['system:role:unblock'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'code',
    value: undefined,
    label: $t('role.code'),
    class: '!w-64',
    placeholder: $t('role.inputPlaceholder'),
    inputType: 'input',
  },
  {
    name: 'name',
    value: undefined,
    label: $t('role.name'),
    class: '!w-64',
    placeholder: $t('role.inputPlaceholder'),
    inputType: 'input',
  },

]

/** 表格列定義 */
const columns: DataTableColumns<RoleVO> = [
  {
    title: $t('role.code'),
    align: 'left',
    key: 'code',
    copy: true,
  },
  {
    title: $t('role.name'),
    align: 'left',
    key: 'name',
  },
  {
    title: $t('role.remark'),
    align: 'left',
    key: 'remark',
  },
  {
    title: $t('common.sort'),
    align: 'center',
    key: 'sort',
  },
  {
    title: $t('common.status'),
    align: 'center',
    key: 'status',
    render: (row: RoleVO) => {
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)}
        />
      )
    },
  },
  {
    title: $t('common.action'),
    key: 'actions',
    width: '400px',
    render: (row: RoleVO) => {
      return (
        <NButton disabled={row.status === 0} size="small" onClick={() => assignmentMenuRef.value.openModal(row)}>
          {$t('role.menuAndPermission')}
        </NButton>
      )
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
    name: 'code',
    value: undefined,
    span: 2,
    label: $t('role.code'),
    type: 'input',
  },
  {
    name: 'name',
    value: undefined,
    span: 2,
    label: $t('role.name'),
    type: 'input',
  },
  {
    name: 'description',
    value: undefined,
    span: 2,
    label: $t('role.description'),
    type: 'textarea',
  },
  {
    name: 'sort',
    value: undefined,
    span: 2,
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
    span: 2,
    label: $t('common.status'),
    type: 'switch',
  },
]

/** 表單驗證規則 */
const rules: FormRules = {
  code: {
    required: true,
    message: $t('role.codeNotEmpty'),
    trigger: ['blur', 'input'],
  },
  name: {
    required: true,
    message: $t('role.nameNotEmpty'),
    trigger: ['blur', 'input'],
  },
  sort: {
    required: true,
  },
}

/** 元件的配置 */
const options = {
/** 表格的顯示功能 */
  view: true, // 是否顯示「查看按鈕」
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
  getListFunction: RoleApi.getRoleList, // 獲取表格數據的 API
  deleteFunction: RoleApi.deleteRole, // 刪除表格數據的 API
  updateFunction: RoleApi.updateRole, // 更新表格數據的 API
  createFunction: RoleApi.createRole, // 新增表格數據的 API

  blockFunction: RoleApi.blockRole, // 封鎖表格數據的 API
  unblockFunction: RoleApi.unblockRole, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: $t('role.role'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置

  tableScrollX: 1200,
  tabShowBorder: true,
}
</script>

<template>
  <div>
    <DataTable v-bind="options" />

    <AssignmentMenu ref="assignmentMenuRef" />
  </div>
</template>

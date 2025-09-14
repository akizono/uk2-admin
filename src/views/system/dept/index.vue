<script setup lang="tsx">
import type { DeptVO } from '@/api/system/dept'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'

import { type DataTableColumns, type FormRules, NSwitch } from 'naive-ui'

import { DeptApi } from '@/api/system/dept'
import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { $t } from '@/utils'

defineOptions({
  name: 'Department Management',
})

const { hasPermi } = usePermi()

const dataTableRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:dept:create'],
  page: ['system:dept:page'],
  update: ['system:dept:update'],
  delete: ['system:dept:delete'],
  block: ['system:dept:block'],
  unblock: ['system:dept:unblock'],
}

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
    label: $t('dept.deptName'),
    class: '!w-64',
    placeholder: $t('dept.deptNamePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'code',
    value: undefined,
    label: $t('dept.deptCode'),
    class: '!w-64',
    placeholder: $t('dept.deptCodePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'status',
    value: undefined,
    label: $t('common.status'),
    class: '!w-64',
    placeholder: $t('common.statusPlaceholder'),
    inputType: 'select',
    dictType: 'common_status',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<DeptVO> = [
  {
    title: $t('dept.deptName'),
    align: 'center',
    key: 'name',
    multilingual: true,
  },
  {
    title: $t('dept.deptCode'),
    align: 'center',
    key: 'code',
  },
  {
    title: $t('dept.leaderUser'),
    align: 'center',
    key: 'leaderUser.nickname',
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
    render: (row: DeptVO) => {
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)}
        />
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
    name: 'parentId',
    value: undefined,
    span: 2,
    label: $t('dept.parentDept'),
    type: 'select',
    selectOptions: {
      api: DeptApi.getDeptPage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
    multilingual: true,
  },
  {
    name: 'name',
    value: undefined,
    span: 1,
    label: $t('dept.deptName'),
    type: 'input',
    multilingual: true,
  },
  {
    name: 'code',
    value: undefined,
    span: 1,
    label: $t('dept.deptCode'),
    type: 'input',
  },
  {
    name: 'leaderUserId',
    value: undefined,
    span: 1,
    label: $t('dept.leaderUser'),
    type: 'select',
    selectOptions: {
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
    message: $t('dept.deptNameRule'),
    trigger: ['blur', 'input'],
  },
  code: {
    required: true,
    message: $t('dept.deptCodeRule'),
    trigger: ['blur', 'input'],
  },
  leaderUserId: {
    required: true,
    message: $t('dept.leaderUserRule'),
    trigger: ['blur', 'change'],
  },
  sort: {
    required: true,
    message: $t('common.sortRule'),
    trigger: ['blur', 'input'],
    type: 'number',
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
  pagination: false, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['name'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: DeptApi.getDeptPage, // 獲取表格數據的 API
  deleteFunction: DeptApi.deleteDept, // 刪除表格數據的 API
  updateFunction: DeptApi.updateDept, // 更新表格數據的 API
  createFunction: DeptApi.createDept, // 新增表格數據的 API

  blockFunction: DeptApi.blockDept, // 封鎖表格數據的 API
  unblockFunction: DeptApi.unblockDept, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則

  /** 其他配置 */
  modalName: $t('dept.dept'), // 表格中的數據名稱
  modalWidth: '800px', // 表格的寬度
  ref: 'dataTableRef', // 表格的 ref
  multilingualFieldsModalWidth: '800px', // 多語言欄位彈出視窗的寬度
  permission, // 權限配置

  tableScrollX: 1200,
  tabShowBorder: true,
}
</script>

<template>
  <DataTable
    v-bind="options"
  />
</template>

<script setup lang="tsx">
// TODO：隱藏顯示左側選單、適配彈出視窗
import type { UserVo } from '@/api/system/user'
import type { InitFormData, InitQueryParams, TableRow } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DeptApi } from '@/api/system/dept'
import { RoleApi } from '@/api/system/role'
import { UserApi } from '@/api/system/user'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { createCopyableDialog } from '@/utils/dialog'
import { NButton, NSwitch } from 'naive-ui'

import UpdatePassword from './components/update-password/index.vue'

defineOptions({
  name: 'User Management',
})

const { t } = useI18n()

const { hasPermi } = usePermi()

const dataTableRef = ref()

// 修改密碼彈出視窗
const showPasswordModal = ref(false)
const currentUser = ref({} as UserVo)

/** 處理 Modal 提交成功後返回的數據 */
function handleCreateSuccess(params: TableRow) {
  const tips = `${t('account.username')}：${params.username}<br />${t('account.password')}：${params.password}<br />${t('account.pleaseChangePassword')}`
  createCopyableDialog({
    title: t('account.addSuccess'),
    content: tips,
    positiveText: t('common.confirm'),
    negativeText: t('account.copyInfo'),
  })
}

/** 權限配置 */
const permission = {
  create: ['system:user:create'],
  page: ['system:user:page'],
  update: ['system:user:update'],
  delete: ['system:user:delete'],
  block: ['system:user:block'],
  unblock: ['system:user:unblock'],
}

const initQueryParams: InitQueryParams[] = [
  {
    name: 'username',
    value: undefined,
    label: t('account.username'),
    class: '!w-64',
    placeholder: t('account.usernamePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'nickname',
    value: undefined,
    label: t('account.nickname'),
    class: '!w-64',
    placeholder: t('account.nicknamePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'age',
    value: undefined,
    label: t('account.age'),
    class: '!w-64',
    placeholder: t('account.agePlaceholder'),
    inputType: 'input-number',
  },
  {
    name: 'sex',
    value: undefined,
    label: t('account.sex'),
    class: '!w-64',
    placeholder: t('account.sexPlaceholder'),
    inputType: 'select',
    dictType: 'system_user_sex',
  },
  {
    name: 'email',
    value: undefined,
    label: t('account.email'),
    class: '!w-64',
    placeholder: t('account.emailPlaceholder'),
    inputType: 'input',
  },
  {
    name: 'mobile',
    value: undefined,
    label: t('account.mobile'),
    class: '!w-64',
    placeholder: t('account.mobilePlaceholder'),
    inputType: 'input',
  },
  {
    name: 'status',
    value: undefined,
    label: t('common.status'),
    class: '!w-64',
    inputType: 'select',
    dictType: 'common_status',
  },
  {
    name: 'roleIds',
    value: undefined,
    label: t('account.role'),
    class: '!w-64',
    placeholder: t('account.rolePlaceholder'),
    inputType: 'select',
    selectOptions: {
      api: RoleApi.getRolePage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
      multiple: true,
    },
  },
]

const columns: DataTableColumns<UserVo> = [
  {
    title: t('account.username'),
    align: 'center',
    key: 'username',
    // fixed: 'left',
    copy: true,
  },
  {
    title: t('account.nickname'),
    align: 'center',
    key: 'nickname',
  },
  {
    title: t('account.age'),
    align: 'center',
    key: 'age',
  },
  {
    title: t('account.sex'),
    align: 'center',
    key: 'sex',
    dictType: 'system_user_sex',
  },
  // {
  //   title: t('account.email'),
  //   align: 'center',
  //   key: 'email',
  // },
  // {
  //   title: t('account.mobile'),
  //   align: 'center',
  //   key: 'mobile',
  //   render: (row: UserVo) => {
  //     return (
  //       <CopyText value={row.mobile} />
  //     )
  //   },
  // },
  {
    title: t('common.remark'),
    align: 'center',
    key: 'remark',
  },
  {
    title: t('common.status'),
    align: 'center',
    key: 'status',
    render: (row: UserVo) => {
      return (
        <NSwitch
          disabled={!hasPermi(row.status === 1 ? permission.block : permission.unblock)}
          value={row.status === 1}
          onUpdateValue={value => dataTableRef.value.handleStatusChange(row, value)}
        >
          {{ checked: () => t('common.enable'), unchecked: () => t('common.disable') }}
        </NSwitch>
      )
    },
  },
  {
    title: t('common.action'),
    key: 'actions',
    width: '400px',
    render: (row: UserVo) => {
      return (
        <NButton
          disabled={row.status === 0}
          size="small"
          onClick={() => {
            currentUser.value = row
            showPasswordModal.value = true
          }}
        >
          修改密碼
        </NButton>
      )
    },
  },

]

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
    label: t('account.username'),
    type: 'input',
    disableEditInput: true,
    disableUpdate: true,
  },
  {
    name: 'nickname',
    value: undefined,
    span: 1,
    label: t('account.nickname'),
    type: 'input',
  },
  {
    name: 'age',
    value: undefined,
    span: 1,
    label: t('account.age'),
    type: 'input-number',
  },
  {
    name: 'sex',
    value: undefined,
    span: 1,
    label: t('account.sex'),
    type: 'radio',
    dictType: 'system_user_sex',
  },
  {
    name: 'email',
    value: undefined,
    span: 1,
    label: t('account.email'),
    type: 'input',
  },
  {
    name: 'mobile',
    value: undefined,
    span: 1,
    label: t('account.mobile'),
    type: 'input',
    placeholder: '+886 912345678',
    helpInfo: t('account.mobileHelpInfo'),
  },
  {
    name: 'deptId',
    value: undefined,
    span: 2,
    label: t('account.dept'),
    type: 'select',
    selectOptions: {
      api: DeptApi.getDeptPage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
    },
    multilingual: true,
  },
  {
    name: 'roleIds',
    value: undefined,
    span: 2,
    label: t('account.role'),
    type: 'select',
    selectOptions: {
      api: RoleApi.getRolePage,
      selectParam: 'name',
      itemMapping: { label: 'name', value: 'id' },
      multiple: true,
    },
  },
  {
    name: 'remark',
    value: undefined,
    span: 2,
    label: t('common.remark'),
    type: 'textarea',
  },
  {
    name: 'status',
    value: 1,
    span: 1,
    label: t('account.userStatus'),
    type: 'switch',
  },
]

const rules: FormRules = {
  username: {
    required: true,
    message: t('account.usernameRule'),
    trigger: ['blur', 'input'],
  },
  nickname: {
    message: t('account.nicknameRule'),
    trigger: ['blur', 'input'],
  },
  age: [
    {
      validator: (rule, value) => {
        if (value < 0) {
          return new Error(t('account.ageRuleTip'))
        }
        if (value > 127) {
          return new Error(t('account.ageRuleTip2'))
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  sex: {
    type: 'number',
    message: t('account.sexRule'),
    trigger: ['blur', 'change'],
  },
  email: {
    type: 'email',
    message: t('account.emailRule'),
    trigger: ['blur', 'input'],
  },
  mobile: {
    validator: (rule: any, value: string) => {
      if (!value)
        return true

      if (!/^\+/.test(value))
        return new Error(t('account.mobileRuleTip'))

      if (!/^\+\d+/.test(value))
        return new Error(t('account.mobileRuleTip2'))

      if (!/^\+\d+ /.test(value))
        return new Error(t('account.mobileRuleTip3'))

      if (!/^\+\d+ \d/.test(value))
        return new Error(t('account.mobileRuleTip4'))

      if (/ {2}/.test(value))
        return new Error(t('account.mobileRuleTip5'))

      if (!/^\+\d+ [\d ]+$/.test(value))
        return new Error(t('account.mobileRuleTip6'))

      return true
    },
    trigger: ['blur', 'input'],
  },
  roleIds: {
    required: true,
    type: 'array',
    message: t('account.roleRule'),
    trigger: ['blur', 'input'],
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

  /** 菜單配置 */
  showMenu: true, // 開啟菜單功能
  menuMultilingual: true, // 菜單開啟多語言
  getMenuDataFunction: DeptApi.getDeptPage, // 獲取菜單數據的 API
  filterField: 'deptId', // 過濾欄位
  menuDefaultExpandRoot: false, // 默認展開根節點

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: [], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: UserApi.getUserPage, // 獲取表格數據的 API
  deleteFunction: UserApi.deleteUser, // 刪除表格數據的 API
  updateFunction: UserApi.updateUser, // 更新表格數據的 API
  createFunction: UserApi.createUser, // 新增表格數據的 API

  blockFunction: UserApi.blockUser, // 封鎖使用者的 API
  unblockFunction: UserApi.unblockUser, // 解封使用者的 API

  /** 表單配置 */
  rules, // 表單驗證規則
  initFormData, // 初始化表單數據

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: t('account.user'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置
}
</script>

<template>
  <div>
    <DataTable
      v-bind="options"
      @create-success="handleCreateSuccess"
    />

    <!-- 修改密碼彈出視窗 -->
    <UpdatePassword
      v-model:show="showPasswordModal"
      :current-user="currentUser"
      @success="dataTableRef.value?.refresh()"
    />
  </div>
</template>

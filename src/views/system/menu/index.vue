<script setup lang="tsx">
import type { MenuVO } from '@/api/system/menu'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'

import { MenuApi } from '@/api/system/menu'
import DataTable from '@/components/common/DataTable/index.vue'
import { usePermi } from '@/hooks'
import { type DataTableColumns, type FormRules, NSwitch } from 'naive-ui'

defineOptions({
  name: 'Menu Settings',
})

const { hasPermi } = usePermi()
const { t } = useI18n()

const dataTableRef = ref()

/** 權限配置 */
const permission = {
  create: ['system:menu:create'],
  page: ['system:menu:page'],
  update: ['system:menu:update'],
  delete: ['system:menu:delete'],
  block: ['system:menu:block'],
  unblock: ['system:menu:unblock'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'pageSize',
    value: 0,
    inputType: 'pagination',
  },
  {
    name: 'title',
    value: undefined,
    label: t('menu.menuTitle'),
    class: '!w-64',
    placeholder: t('menu.menuTitlePlaceholder'),
    inputType: 'input',
    multilingual: true,
  },
  {
    name: 'status',
    value: undefined,
    label: t('common.status'),
    class: '!w-64',
    placeholder: t('common.statusPlaceholder'),
    inputType: 'select',
    dictType: 'common_status',
  },
]

/** 表格列定義 */
const columns: DataTableColumns<MenuVO> = [
  {
    title: t('menu.menuTitle'),
    align: 'left',
    key: 'title',
    multilingual: true,
    copy: true,
    fixed: 'left',
  },
  {
    title: t('menu.menuIcon'),
    align: 'center',
    key: 'icon',
  },
  {
    title: t('menu.menuType'),
    align: 'center',
    key: 'type',
    dictType: 'system_menu_type',
  },
  {
    title: t('common.sort'),
    align: 'center',
    key: 'sort',
  },
  {
    title: t('common.status'),
    align: 'center',
    key: 'status',
    render: (row: MenuVO) => {
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
    label: t('menu.parentMenu'),
    type: 'select',
    selectOptions: {
      api: MenuApi.getMenuPage,
      selectParam: 'name',
      itemMapping: { label: 'title', value: 'id' },
    },
    multilingual: true,
  },
  {
    name: 'title',
    value: undefined,
    span: 2,
    label: t('menu.menuTitle'),
    type: 'input',
    multilingual: true,
  },
  {
    name: 'name',
    value: undefined,
    span: 2,
    label: t('menu.menuCode'),
    type: 'input',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'path',
    value: undefined,
    span: 1,
    label: t('menu.routePath'),
    type: 'input',
    placeholder: 'Eg: /system/user',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'component',
    value: undefined,
    span: 1,
    label: t('menu.componentPath'),
    type: 'input',
    placeholder: 'Eg: /system/user/index.vue',
    inputPrefix: '@/src/view',
    // inputSuffix: '.vue',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'permission',
    value: undefined,
    span: 1,
    label: t('menu.routePermission'),
    type: 'input',
    placeholder: 'Eg: system:user:page',
    helpInfo: `${t('menu.helpInfo')}`,
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1, 2],
    },
  },
  {
    name: 'type',
    value: 0,
    span: 1,
    label: t('menu.menuType'),
    type: 'radio',
    dictType: 'system_menu_type',
    // disableEditInput: true,
    // disableUpdate: true,
    // multilingual: true,
  },
  {
    name: 'icon',
    value: undefined,
    span: 1,
    label: t('menu.menuIcon'),
    type: 'icon-select',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'link',
    value: undefined,
    span: 1,
    label: t('menu.externalLink'),
    type: 'input',
    placeholder: 'Eg: https://google.com',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isCache',
    value: undefined,
    span: 1,
    label: t('menu.isCache'),
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isShowTab',
    value: undefined,
    span: 1,
    label: t('menu.isShowTab'),
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isPersistentTab',
    value: undefined,
    span: 1,
    label: t('menu.isPersistentTab'),
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [1],
    },
  },
  {
    name: 'isShowSide',
    value: 1,
    span: 1,
    label: t('menu.isShowSide'),
    type: 'switch',
    showCondition: {
      field: 'type',
      operator: 'in',
      value: [0, 1],
    },
  },
  {
    name: 'sort',
    value: undefined,
    span: 2,
    label: t('common.sort'),
    type: 'input-number',
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
    span: 2,
    label: t('common.status'),
    type: 'switch',
  },

]

/** 表單驗證規則 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('menu.menuCodePlaceholder'),
      trigger: ['blur', 'input'],
    },
    {
      pattern: /^[\s\w-]+$/, // 正則表達式：允許空格(\s)、橫槓(-)、下劃線(\w包含_)、英文和數字
      message: t('menu.menuCodeRule'),
      trigger: ['blur', 'input'],
    },
  ],
  title: {
    required: true,
    message: t('menu.menuTitleRule'),
    trigger: ['blur', 'input'],
  },
  type: {
    required: true,
    message: t('menu.menuTypeRule'),
    trigger: ['blur', 'input'],
    type: 'number',
  },
  sort: {
    required: true,
    message: t('common.sortPlaceholder'),
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
  index: false, // 是否顯示「索引」
  pagination: false, // 是否開啟分頁

  /** 表格配置 */
  columns, // 表格欄位的定義
  viewEntranceColumns: ['name'], // 點擊後能進入「查看視窗」的欄位
  initQueryParams, // 初始化查詢參數
  getFunction: MenuApi.getMenuPage, // 獲取表格數據的 API
  deleteFunction: MenuApi.deleteMenu, // 刪除表格數據的 API
  updateFunction: MenuApi.updateMenu, // 更新表格數據的 API
  createFunction: MenuApi.createMenu, // 新增表格數據的 API

  blockFunction: MenuApi.blockMenu, // 封鎖表格數據的 API
  unblockFunction: MenuApi.unblockMenu, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則
  modalFormLabelWidth: '120px', // 表單的 label 寬度

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: t('menu.menu'), // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  multilingualFieldsModalWidth: '900px', // 多語言欄位彈出視窗的寬度
  permission, // 權限配置
}
</script>

<template>
  <DataTable v-bind="options" />
</template>

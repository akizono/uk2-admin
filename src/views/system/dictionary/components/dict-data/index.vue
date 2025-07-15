<script setup lang="ts">
import type { DictTypeVO } from '@/api/system/dict-type'
import type { InitFormData } from '@/components/common/DataTable/type'
import type { DataTableColumns, FormRules } from 'naive-ui'

import { DictDataApi, type DictDataVO } from '@/api/system/dict-data'
import { wrapOptionsToPromise } from '@/utils/initFormData'

const modalRef = ref()
// const dataTableRef = ref()
const modalTitle = ref('')
const filterColumnValue = ref<string>('')

/** 權限配置 */
const permission = {
  create: ['system:dict-data:create'],
  page: ['system:dict-data:page'],
  update: ['system:dict-data:update'],
  delete: ['system:dict-data:delete'],
  block: ['system:dict-data:block'],
  unblock: ['system:dict-data:unblock'],
}

/** 表格列定義 */
const columns: DataTableColumns<DictDataVO> = [
  {
    title: '字典標籤',
    align: 'center',
    key: 'label',
    copy: true,
    multilingual: true,
  },
  {
    title: '字典鍵值',
    align: 'center',
    key: 'value',
    copy: true,
  },
  {
    title: '數據類型',
    align: 'center',
    key: 'dataType',
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
    name: 'dictType',
    value: undefined, // 在openModal時會被賦值
    hidden: true,
  },
  {
    name: 'label',
    value: undefined,
    span: 2,
    label: '字典標籤',
    type: 'input',
    multilingual: true,
  },
  {
    name: 'dataType',
    value: undefined,
    span: 2,
    label: '數據類型',
    type: 'select',
    dictType: 'system_dict_data_data_type',
  },
  {
    name: 'value',
    value: '',
    span: 2,
    label: '字典鍵值',
    type: 'input',
    disableAddInput: true,
    disableEditInput: true,
    showCondition: {
      field: 'dataType',
      operator: 'in',
      value: ['undefined', 'null'],
    },
    valueGenerator: {
      watchFields: ['dataType'],
      rule: {
        type: 'template',
        value: '${dataType}',
      },
    },
  },
  {
    name: 'value',
    value: 0,
    span: 2,
    label: '字典鍵值',
    type: 'input-number',
    rulesType: 'number',
    showCondition: {
      field: 'dataType',
      operator: 'in',
      value: ['number'],
    },
  },
  {
    name: 'value',
    value: undefined,
    span: 2,
    label: '字典鍵值',
    type: 'input',
    rulesType: 'string',
    showCondition: {
      field: 'dataType',
      operator: 'in',
      value: ['string'],
    },
  },
  {
    name: 'value',
    value: undefined,
    span: 2,
    label: '字典鍵值',
    type: 'radio',
    selectOptions: {
      api: wrapOptionsToPromise([
        { label: 'true', value: 'true' },
        { label: 'false', value: 'false' },
      ]),
      itemMapping: {
        label: 'label',
        value: 'value',
      },
    },
    showCondition: {
      field: 'dataType',
      operator: 'in',
      value: ['boolean'],
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

/** 表單驗證規則 */
const rules: FormRules = {
  label: {
    required: true,
    message: '請填寫字典標籤',
    trigger: ['blur', 'input'],
  },
  value: {
    required: true,
    message: '請填寫字典鍵值',
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
  search: false, // 是否顯示「頂部搜索框」
  add: true, // 是否顯示「新增按鈕」
  index: true, // 是否顯示「索引」
  pagination: true, // 是否開啟分頁

  /** 表格配置 */
  filterColumnName: 'dictType', // 過濾條件的欄位名稱
  filterColumnValue: computed(() => filterColumnValue.value), // 過濾條件的欄位 ID（ 所有新增和查詢的介面都會自動帶上{[filterColumnName]:filterColumnValue.value} ）

  columns, // 表格欄位的定義
  viewEntranceColumns: [], // 點擊後能進入「查看視窗」的欄位
  getFunction: DictDataApi.getDictDataPage, // 獲取表格數據的 API
  deleteFunction: DictDataApi.deleteDictData, // 刪除表格數據的 API
  updateFunction: DictDataApi.updateDictData, // 更新表格數據的 API
  createFunction: DictDataApi.createDictData, // 新增表格數據的 API

  blockFunction: DictDataApi.blockDictData, // 封鎖表格數據的 API
  unblockFunction: DictDataApi.unblockDictData, // 解封鎖表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據
  rules, // 表單驗證規則

  /** 其他配置 */
  modalName: '字典數據', // 表格中的數據名稱
  ref: 'dataTableRef', // 表格的 ref
  permission, // 權限配置
}

defineExpose({
  openModal: (row: DictTypeVO) => {
    // 設置過濾欄位的 ID
    filterColumnValue.value = row.type

    // 設置字典類型的 ID（在「initFormData」中會用到）
    initFormData.find(item => item.name === 'dictType')!.value = row.type

    // 設置模態框的標題
    modalTitle.value = row.name

    // 打開模態框
    modalRef.value.showModal()
  },
})
</script>

<template>
  <PageModal
    ref="modalRef"
    :title="`${modalTitle} - 字典數據`"
    width="90%"
  >
    <DataTable
      v-bind="options"
    />
  </PageModal>
</template>

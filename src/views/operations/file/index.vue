<script setup lang="tsx">
import type { FileVO } from '@/api/operations/file'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns } from 'naive-ui'
import { $t } from '@/utils'

import { FileApi } from '@/api/operations/file'
import DataTable from '@/components/common/DataTable/index.vue'
import { downloadFile } from '@/utils/download'
import { NButton, NImage, NTime } from 'naive-ui'
import IconParkOutlineUpload from '~icons/icon-park-outline/upload'

import FileUpload from './components/file-upload/index.vue'

defineOptions({
  name: 'File Management',
})

/** 上傳檔案的 ref */
const fileUploadRef = ref()

/** 權限配置 */
const permission = {
  create: ['operations:file:create'],
  page: ['operations:file:page'],
  delete: ['operations:file:delete'],
}

/** 初始化查詢參數 */
const initQueryParams: InitQueryParams[] = [
  {
    name: 'name',
    value: undefined,
    label: $t('file.fileName'),
    class: '!w-64',
    placeholder: $t('file.fileName'),
    inputType: 'input',
  },
]

/** 表格上方的插槽 */
const neckSlot = [
  <>
    <NButton
      class="m-l-10px"
      type="primary"
      v-slots={{
        icon: () => <IconParkOutlineUpload />,
      }}
      onClick={() => {
        fileUploadRef.value.openModal()
      }}
    >
    { $t('file.uploadFileAction') }
    </NButton>
  </>,
]

/** 表格列定義 */
const columns: DataTableColumns<FileVO> = [
  {
    title: $t('file.fileName'),
    align: 'center',
    key: 'name',
  },
  // {
  //   title: $t('file.fileType'),
  //   align: 'center',
  //   key: 'type',
  // },
  {
    title: $t('file.fileSize'),
    align: 'center',
    key: 'size',
    width: '100px',
    render: (row: FileVO) => {
      return (
        <>
          {`${row.size} KB`}
        </>
      )
    },
  },
  {
    title: $t('file.fileUrl'),
    align: 'center',
    key: 'url',
    copy: true,
  },
  {
    title: $t('file.uploadTime'),
    align: 'center',
    key: 'createTime',
    width: '180px',
    render: (row: FileVO) => {
      return (
        <>
          <NTime time={new Date(row.createTime)} />
        </>
      )
    },
  },
  {
    title: $t('file.filePreview'),
    align: 'center',
    key: 'preview',
    width: '180px',
    render: (row: FileVO) => {
      return (
        <>
          <NImage src={row.url} width="30px" height="30px" object-fit="cover" />
        </>
      )
    },
  },
  {
    title: $t('common.action'),
    key: 'actions',
    render: (row: FileVO) => {
      return (
        <>
          <NButton size="small" onClick={() => downloadFile(row.url, row.name)}>
            { $t('file.downloadFileAction') }
          </NButton>
        </>

      )
    },
  },
]

/** 初始化表單數據 */
const initFormData: InitFormData[] = [
  {
    name: 'id',
    value: undefined,
    span: 2,
    label: 'ID',
    showInMode: {
      view: true,
      add: false,
      edit: false,
    },
  },
]

/** 元件的配置 */
const options = {
  /** 表格的顯示功能 */
  view: false, // 是否顯示「查看按鈕」
  edit: false, // 是否顯示「編輯按鈕」
  del: true, // 是否顯示「刪除按鈕」
  search: true, // 是否顯示「頂部搜索框」
  add: false, // 是否顯示「新增按鈕」
  index: true, // 是否顯示「索引」
  pagination: true, // 是否開啟分頁

  /** 表格配置 */
  neckSlot, // 表格頂部的自訂按鈕
  columns, // 表格欄位的定義
  initQueryParams, // 初始化查詢參數
  getFunction: FileApi.getFilePage, // 獲取表格數據的 API
  deleteFunction: FileApi.deleteFile, // 刪除表格數據的 API

  /** 表單配置 */
  initFormData, // 初始化表單數據

  /** 其他配置 */
  modalWidth: '1000px',
  modalName: $t('file.fileEntity'), // 表格中的數據名稱
  permission, // 權限配置

  tableScrollX: 1400,
  tabShowBorder: true,
}
</script>

<template>
  <div>
    <DataTable v-bind="options" />
    <FileUpload ref="fileUploadRef" />
  </div>
</template>

<style scoped lang="scss"></style>

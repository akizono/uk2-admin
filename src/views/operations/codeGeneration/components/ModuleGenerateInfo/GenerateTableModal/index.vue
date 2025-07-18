<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'

import { useBoolean } from '@/hooks'

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

// 數據類型選項
const dataTypeOptions = [
  { label: 'BIGINT', value: 'BIGINT' },
  { label: 'INT', value: 'INT' },
  { label: 'SMALLINT', value: 'SMALLINT' },
  { label: 'TINYINT', value: 'TINYINT' },
  { label: 'BOOL', value: 'BOOL' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'FLOAT', value: 'FLOAT' },
  { label: 'DOUBLE', value: 'DOUBLE' },
  { label: 'DECIMAL', value: 'DECIMAL' },
  { label: 'VARCHAR(50)', value: 'VARCHAR(50)' },
  { label: 'VARCHAR(100)', value: 'VARCHAR(100)' },
  { label: 'VARCHAR(255)', value: 'VARCHAR(255)' },
  { label: 'VARCHAR(500)', value: 'VARCHAR(500)' },
  { label: 'TEXT', value: 'TEXT' },
  { label: 'LONGTEXT', value: 'LONGTEXT' },
  { label: 'CHAR(1)', value: 'CHAR(1)' },
  { label: 'CHAR(10)', value: 'CHAR(10)' },
  { label: 'DATE', value: 'DATE' },
  { label: 'TIME', value: 'TIME' },
  { label: 'DATETIME', value: 'DATETIME' },
  { label: 'TIMESTAMP', value: 'TIMESTAMP' },
  { label: 'JSON', value: 'JSON' },
  { label: 'BLOB', value: 'BLOB' },
]

// 定義欄位的型別
interface ColumnRow {
  columnName?: string | null
  dataType?: string | null
  length?: number | null
  isNotNull?: number
  isAutoIncrement?: number
  isPrimaryKey?: number
  isUnique?: number
  defaultValue?: string | null
  comment?: string | null
}

const rowTemplate: ColumnRow = {
  columnName: null,
  dataType: 'VARCHAR(100)',
  length: null,
  isNotNull: 0,
  isAutoIncrement: 0,
  isPrimaryKey: 0,
  isUnique: 0,
  defaultValue: null,
  comment: null,
}

const formData = ref<ColumnRow[]>([
  { ...rowTemplate },
])

const columns = ref<DataTableColumns<ColumnRow>>([
  {
    key: 'columnName',
    title: '欄位名稱',
    width: 150,
    render: (row: ColumnRow) => {
      return <n-input v-model:value={row.columnName} placeholder="請輸入欄位名稱" />
    },
  },
  {
    key: 'dataType',
    title: '數據類型',
    width: 140,
    render: (row: ColumnRow) => {
      return (
        <n-select
          v-model:value={row.dataType}
          options={dataTypeOptions}
          placeholder="選擇類型"
        />
      )
    },
  },
  {
    key: 'length',
    title: '長度',
    width: 100,
    render: (row: ColumnRow) => {
      return (
        <n-input-number
          v-model:value={row.length}
          placeholder="長度"
          min={1}
          max={9999}
          show-button={false}
        />
      )
    },
  },
  {
    key: 'isNotNull',
    title: '非空',
    width: 80,
    render: (row: ColumnRow) => {
      return (
        <n-switch
          v-model:value={row.isNotNull}
          checked-value={1}
          unchecked-value={0}
        />
      )
    },
  },
  {
    key: 'isAutoIncrement',
    title: '自增',
    width: 80,
    render: (row: ColumnRow) => {
      return (
        <n-switch
          v-model:value={row.isAutoIncrement}
          checked-value={1}
          unchecked-value={0}
        />
      )
    },
  },
  {
    key: 'isPrimaryKey',
    title: '主鍵',
    width: 80,
    render: (row: ColumnRow) => {
      return (
        <n-switch
          v-model:value={row.isPrimaryKey}
          checked-value={1}
          unchecked-value={0}
        />
      )
    },
  },
  {
    key: 'isUnique',
    title: '唯一',
    width: 80,
    render: (row: ColumnRow) => {
      return (
        <n-switch
          v-model:value={row.isUnique}
          checked-value={1}
          unchecked-value={0}
        />
      )
    },
  },
  {
    key: 'defaultValue',
    title: '預設值',
    width: 120,
    render: (row: ColumnRow) => {
      return <n-input v-model:value={row.defaultValue} placeholder="預設值" />
    },
  },
  {
    key: 'comment',
    title: '註釋',
    width: 150,
    render: (row: ColumnRow) => {
      return <n-input v-model:value={row.comment} placeholder="欄位註釋" />
    },
  },
  {
    key: 'actions',
    title: '操作',
    width: 80,
    render: (row: ColumnRow, index: number) => {
      return (
        <n-button
          size="small"
          type="error"
          onClick={() => removeRow(index)}
          disabled={formData.value.length <= 1}
        >
          刪除
        </n-button>
      )
    },
  },
])

function addRow() {
  formData.value.push({ ...rowTemplate })
}

function removeRow(index: number) {
  if (formData.value.length > 1) {
    formData.value.splice(index, 1)
  }
}

// 打開彈出視窗
async function openModal() {
  showModal()
}

// 關閉彈出視窗
function closeModal() {
  hiddenModal()
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible" :mask-closable="false" preset="card" title="創建模組" class="w-[95%]" :segmented="{
        content: true,
        action: true,
      }" style="max-width: 2000px;"
    >
      <NSpace vertical class="flex-1">
        <n-alert type="info">
          系統將根據您在下方填寫的資訊進行資料庫的創建。請仔細填寫每個欄位的屬性。
        </n-alert>

        <div class="overflow-y-auto" style="height: calc(100vh - 300px);">
          <n-data-table :columns="columns" :data="formData" size="small" striped />
          <NButton class="w-full" secondary style="border-radius: 0px;" @click="addRow">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            增加一個欄位
          </NButton>
        </div>
      </NSpace>
      <template #action>
        <n-space justify="center">
          <n-button type="primary">
            創建，並進入下一步
          </n-button>
          <n-button @click="closeModal">
            取消
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

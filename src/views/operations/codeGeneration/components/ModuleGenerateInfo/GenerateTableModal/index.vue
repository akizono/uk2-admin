<script setup lang="tsx">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'
import type { DataTableColumns, NDataTable } from 'naive-ui'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import { useBoolean } from '@/hooks'
import { useTableDrag } from '@/hooks/useTableDrag'
import { camelToSnakeCase, hyphenToCamelCase, replaceDashToUnderscore } from '@/utils/string'

import CodePreviewModal from './CodePreviewModal/index.vue'

const props = defineProps<{
  row: CodeGenerationVO
}>()

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制"生成預覽"的loading
const { bool: generatePreviewLoading, setTrue: startGeneratePreviewLoading, setFalse: endGeneratePreviewLoading } = useBoolean(false)

/**
 * MySQL資料庫欄位類型選項列表
 * 用於創建或修改表結構時的欄位類型選擇
 * 每個選項包含：
 *   label - 顯示給用戶的類型名稱
 *   value - 實際的MySQL數據類型
 */
const dataTypeOptions = [
  // 整數類型
  { label: 'TINYINT', value: 'tinyint' }, // 1位元組，範圍(-128~127)
  { label: 'SMALLINT', value: 'smallint' }, // 2位元組，範圍(-32768~32767)
  { label: 'INT', value: 'int' }, // 4位元組，標準整數
  { label: 'BIGINT', value: 'bigint' }, // 8位元組，大整數

  // 布爾類型
  { label: 'BOOL', value: 'bool' }, // 布爾類型，實際上是TINYINT(1)的別名
  { label: 'BOOLEAN', value: 'boolean' }, // 同上

  // 浮點類型
  { label: 'FLOAT', value: 'float' }, // 單精度浮點
  { label: 'DOUBLE', value: 'double' }, // 雙精度浮點
  { label: 'DECIMAL', value: 'decimal' }, // 精確小數，適合財務數據

  // 日期時間類型
  { label: 'DATE', value: 'date' }, // 日期，格式'YYYY-MM-DD'
  { label: 'TIME', value: 'time' }, // 時間，格式'HH:MM:SS'
  { label: 'DATETIME', value: 'datetime' }, // 日期時間，格式'YYYY-MM-DD HH:MM:SS'
  { label: 'TIMESTAMP', value: 'timestamp' }, // 時間戳，自動更新

  // 字串類型
  { label: 'CHAR', value: 'char' }, // 定長字串
  { label: 'VARCHAR', value: 'varchar' }, // 變長字串

  // 文本類型
  { label: 'TEXT', value: 'text' }, // 長文本，最大65535字元
  { label: 'LONGTEXT', value: 'longtext' }, // 超長文本，最大4GB

  // 二進制類型
  { label: 'BLOB', value: 'blob' }, // 二進制大對象

  // JSON類型
  { label: 'JSON', value: 'json' }, // JSON格式數據(MySQL 5.7+)
]
// 需要指定長度的資料類型
const typesRequireLength = ['char', 'varchar', 'decimal']
// 可以自增的資料類型
const autoIncrementTypes = ['tinyint', 'smallint', 'int', 'bigint']
// 資料類型對應的 JavaScript 類型
const dataTypeToJsDataTypeMap: Record<string, string> = {
  // 數值類型
  tinyint: 'number',
  smallint: 'number',
  int: 'number',
  bigint: 'number',
  float: 'number',
  double: 'number',
  decimal: 'number',

  // 布爾類型
  bool: 'boolean',
  boolean: 'boolean',

  // 日期時間類型
  date: 'object',
  time: 'object',
  datetime: 'object',
  timestamp: 'object',

  // JSON
  json: 'object',

  // 字串/文本/二進制
  char: 'string',
  varchar: 'string',
  text: 'string',
  longtext: 'string',
  blob: 'string',
}
// 判斷資料類型是否需要指定長度
function isLengthRequired(dataType: string): boolean {
  return typesRequireLength.includes(dataType)
}
// 判斷資料類型是否可以自增
function canAutoIncrement(dataType: string): boolean {
  return autoIncrementTypes.includes(dataType)
}
// 將 MySQL 資料類型轉換為 JavaScript 資料類型
function mysqlTypeToJsDataType(dataType: string): string {
  const jsDataType = dataTypeToJsDataTypeMap[dataType.toLowerCase()]
  return jsDataType || 'string' // 預設返回 string 類型
}

// 定義欄位的型別
interface ColumnRow {
  columnName: string
  dataType: string
  length: number | null
  isNotNull: number
  isAutoIncrement: number
  isPrimaryKey: number
  isUnique: number
  defaultValue: string | null
  comment: string | null
}

// 欄位模板
const rowTemplate: ColumnRow = {
  columnName: '',
  dataType: 'varchar',
  length: null,
  isNotNull: 0,
  isAutoIncrement: 0,
  isPrimaryKey: 0,
  isUnique: 0,
  defaultValue: null,
  comment: null,
}

// 表單數據
const formData = ref<ColumnRow[]>([
  // { ...rowTemplate },
  {
    columnName: 'name',
    dataType: 'varchar',
    length: 55,
    isNotNull: 1,
    isAutoIncrement: 0,
    isPrimaryKey: 0,
    isUnique: 0,
    defaultValue: null,
    comment: '姓名',
  },
  {
    columnName: 'age',
    dataType: 'int',
    length: null,
    isNotNull: 0,
    isAutoIncrement: 0,
    isPrimaryKey: 0,
    isUnique: 0,
    defaultValue: '12',
    comment: '年齡',
  },
  {
    columnName: 'idCard',
    dataType: 'varchar',
    length: 55,
    isNotNull: 0,
    isAutoIncrement: 0,
    isPrimaryKey: 0,
    isUnique: 1,
    defaultValue: null,
    comment: '證件號碼',
  },
])

// 驗證狀態
const validationErrors = ref<{ [key: string]: { [field: string]: string } }>({})
// 驗證欄位名稱
function validateColumnName(value: string | null | undefined, _rowIndex: number): string | null {
  if (!value || value.trim() === '') {
    return '欄位名稱為必填項'
  }
  if (value.length > 50) {
    return '欄位名稱不能超過50個字'
  }
  return null
}

// 驗證長度欄位
function validateLength(value: number | null | undefined, dataType: string, _rowIndex: number): string | null {
  if (isLengthRequired(dataType)) {
    if (value === null || value === undefined) {
      return '長度為必填項'
    }
  }
  return null
}

// 設置驗證錯誤
function setValidationError(rowIndex: number, field: string, error: string | null) {
  if (!validationErrors.value[rowIndex]) {
    validationErrors.value[rowIndex] = {}
  }

  if (error) {
    validationErrors.value[rowIndex][field] = error
  }
  else {
    delete validationErrors.value[rowIndex][field]
    if (Object.keys(validationErrors.value[rowIndex]).length === 0) {
      delete validationErrors.value[rowIndex]
    }
  }
}

const columns = ref<DataTableColumns<ColumnRow>>([
  {
    key: 'drag',
    width: 40,
    render: () => {
      return (
        <div class="cursor-move flex items-center justify-center">
          <icon-park-outline-drag class="text-gray-400" />
        </div>
      )
    },
  },
  {
    key: 'columnName',
    title: '欄位名稱',
    width: 150,
    render: (row: ColumnRow, rowIndex: number) => {
      const rowIdx = rowIndex as number
      const error = validationErrors.value[rowIdx]?.columnName

      return (
        <div>
          <n-input
            v-model:value={row.columnName}
            placeholder="請輸入欄位名稱"
            status={error ? 'error' : undefined}
            onUpdateValue={(value: string) => {
              row.columnName = value
              const validationError = validateColumnName(value, rowIdx)
              setValidationError(rowIdx, 'columnName', validationError)
            }}
            onBlur={() => {
              const validationError = validateColumnName(row.columnName, rowIdx)
              setValidationError(rowIdx, 'columnName', validationError)
            }}
          />
          {error && <div class="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      )
    },
  },
  {
    key: 'dataType',
    title: '數據類型',
    width: 140,
    render: (row: ColumnRow, rowIndex: number) => {
      const rowIdx = rowIndex as number
      return (
        <n-select
          v-model:value={row.dataType}
          options={[...dataTypeOptions].sort((a, b) => a.label.localeCompare(b.label))}
          placeholder="選擇類型"
          onUpdateValue={(value: string) => {
            row.dataType = value
            // 如果切換到不需要長度的類型，清空長度值
            if (!isLengthRequired(value)) {
              row.length = null
            }
            // 重新驗證長度欄位
            const lengthError = validateLength(row.length, value, rowIdx)
            setValidationError(rowIdx, 'length', lengthError)

            // 當選擇不可自增的類型時，關閉自增選項
            if (!canAutoIncrement(value) && row.isAutoIncrement === 1) {
              row.isAutoIncrement = 0
            }

            // 當選擇可自增的類型且為主鍵時，自動開啟自增
            if (canAutoIncrement(value) && row.isPrimaryKey === 1) {
              row.isAutoIncrement = 1
            }
          }}
        />
      )
    },
  },
  {
    key: 'length',
    title: '長度',
    width: 100,
    render: (row: ColumnRow, rowIndex: number) => {
      const rowIdx = rowIndex as number
      const needLength = isLengthRequired(row.dataType)
      const error = validationErrors.value[rowIdx]?.length

      return (
        <div>
          <n-input-number
            v-model:value={row.length}
            placeholder={needLength ? '長度' : ''}
            min={1}
            max={9999}
            show-button={false}
            disabled={!needLength}
            status={error ? 'error' : undefined}
            onUpdateValue={(value: number | null) => {
              row.length = value
              const lengthError = validateLength(value, row.dataType, rowIdx)
              setValidationError(rowIdx, 'length', lengthError)
            }}
            onBlur={() => {
              const lengthError = validateLength(row.length, row.dataType, rowIdx)
              setValidationError(rowIdx, 'length', lengthError)
            }}
          />
          {error && <div class="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      )
    },
  },
  {
    key: 'isPrimaryKey',
    title: '主鍵',
    width: 80,
    render: (row: ColumnRow, rowIndex: number) => {
      // 檢查是否有其他行已經設為主鍵
      const hasOtherPrimaryKey = formData.value.some((r, idx) => idx !== rowIndex && r.isPrimaryKey === 1)

      return (
        <n-switch
          v-model:value={row.isPrimaryKey}
          checked-value={1}
          unchecked-value={0}
          disabled={hasOtherPrimaryKey}
          onUpdateValue={(value: number) => {
            row.isPrimaryKey = value
            // 當設為主鍵且資料類型為可自增類型時，自動開啟自增
            if (value === 1 && canAutoIncrement(row.dataType)) {
              row.isAutoIncrement = 1
            }

            // 當設為主鍵時，自動開啟非空和唯一約束
            if (value === 1) {
              row.isNotNull = 1
              row.isUnique = 1
            }
          }}
        />
      )
    },
  },
  {
    key: 'isNotNull',
    title: '非空',
    width: 80,
    render: (row: ColumnRow) => {
      // 如果是主鍵，則非空約束必須開啟且無法關閉
      const isPrimary = row.isPrimaryKey === 1

      return (
        <n-switch
          v-model:value={row.isNotNull}
          checked-value={1}
          unchecked-value={0}
          disabled={isPrimary}
        />
      )
    },
  },
  {
    key: 'isAutoIncrement',
    title: '自增',
    width: 80,
    render: (row: ColumnRow, rowIndex: number) => {
      // 檢查是否有其他行已經開啟自增
      const hasOtherAutoIncrement = formData.value.some((r, idx) => idx !== rowIndex && r.isAutoIncrement === 1)
      // 檢查當前資料類型是否支援自增
      const canAuto = canAutoIncrement(row.dataType)

      return (
        <n-switch
          v-model:value={row.isAutoIncrement}
          checked-value={1}
          unchecked-value={0}
          disabled={hasOtherAutoIncrement || !canAuto}
        />
      )
    },
  },
  {
    key: 'isUnique',
    title: '唯一',
    width: 80,
    render: (row: ColumnRow) => {
      // 如果是主鍵，則唯一約束必須開啟且無法關閉
      const isPrimary = row.isPrimaryKey === 1

      return (
        <n-switch
          v-model:value={row.isUnique}
          checked-value={1}
          unchecked-value={0}
          disabled={isPrimary}
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
    // 移除對應的驗證錯誤
    delete validationErrors.value[index]
    // 重新整理索引
    const newErrors: typeof validationErrors.value = {}
    Object.keys(validationErrors.value).forEach((key) => {
      const keyNum = Number.parseInt(key)
      if (keyNum > index) {
        newErrors[keyNum - 1] = validationErrors.value[keyNum]
      }
      else if (keyNum < index) {
        newErrors[keyNum] = validationErrors.value[keyNum]
      }
    })
    validationErrors.value = newErrors
  }
}

// 表格引用
const tableRef = ref<InstanceType<typeof NDataTable>>()
// 初始化拖動功能
const { initDrag } = useTableDrag({
  tableRef,
  data: formData,
  onRowDrag(_rows, _newList) {
    // 拖動完成後的處理，這裡不需要特別處理，因為 formData 已經被更新
    window.$message.success('欄位順序已更新')
  },
})

// 驗證所有欄位
function validateAllFields(): boolean {
  let isValid = true
  formData.value.forEach((row, index) => {
    // 驗證欄位名稱
    const columnNameError = validateColumnName(row.columnName, index)
    // 設置驗證錯誤
    setValidationError(index, 'columnName', columnNameError)
    // 如果欄位名稱有錯誤，則設置驗證狀態為 false
    if (columnNameError) {
      isValid = false
    }

    // 驗證長度
    const lengthError = validateLength(row.length, row.dataType, index)
    // 設置驗證錯誤
    setValidationError(index, 'length', lengthError)
    // 如果長度有錯誤，則設置驗證狀態為 false
    if (lengthError) {
      isValid = false
    }
  })
  return isValid
}

/** 生成預覽 */
const codePreviewModalRef = ref()
async function handleGeneratePreview() {
  if (!validateAllFields()) {
    window.$message.error('請修正表單中的錯誤')
    return
  }

  if (dataTypeOptions.length !== Object.keys(dataTypeToJsDataTypeMap).length) {
    window.$message.error('請修正 dataTypeToJsDataTypeMap 的錯誤')
    return
  }

  try {
    startGeneratePreviewLoading()

    await CodeGenerationApi.previewTableCode({
      className: `${hyphenToCamelCase(props.row.code)}Entity`, // Entit 的類名
      fileName: Date.now().toString(), // plop 的臨時檔案名
      tableName: replaceDashToUnderscore(props.row.code), // 資料表的名稱
      // 資料表的欄位集合
      tableColumns: formData.value.map(item => ({
        columnNameUnderline: camelToSnakeCase(item.columnName), // 欄位名稱轉換為下劃線命名
        jsDataType: mysqlTypeToJsDataType(item.dataType), // 資料類型轉換為 JavaScript 類型
        ...item,
      })),
    })

    // codePreviewModalRef.value?.openModal()
  }
  finally {
    endGeneratePreviewLoading()
  }
}

/** 打開彈出視窗 */
async function openModal() {
  showModal()
  // 重設驗證錯誤
  validationErrors.value = {}
}

/** 關閉彈出視窗 */
function closeModal() {
  hiddenModal()
}

onMounted(() => {
  nextTick(() => {
    // 在模態框打開後初始化拖動功能
    if (modalVisible.value) {
      initDrag()
    }
  })
})

// 監聽模態框顯示狀態，當顯示時初始化拖動功能
watch(modalVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initDrag()
    })
  }
})
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
          <n-data-table
            ref="tableRef"
            :columns="columns"
            :data="formData"
            size="small"
            striped
            row-class-name="drag-handle"
          />
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
          <n-button
            type="primary"
            :loading="generatePreviewLoading"
            @click="handleGeneratePreview"
          >
            生成預覽
          </n-button>
          <n-button :disabled="generatePreviewLoading" @click="closeModal">
            取消
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 預覽生成代碼的彈出視窗 -->
    <CodePreviewModal ref="codePreviewModalRef" />
  </div>
</template>

<style scoped>
:deep(.drag-handle) {
  cursor: move;
}

:deep(.drag-handle.sortable-ghost) {
  background-color: #f0f9ff !important;
  opacity: 0.8;
}

:deep(.drag-handle.sortable-chosen) {
  background-color: #e6f4ff !important;
}
</style>

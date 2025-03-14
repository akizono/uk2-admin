<script setup lang="tsx">
import type { InitFormData, InitQueryParams, ModalType, TableRow } from './type'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'

import { useBoolean } from '@/hooks'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'

import TableModal from './TableModal.vue'

const props = defineProps<{
  modalName: string // 模態框名稱

  edit?: boolean // 開啟編輯
  del?: boolean // 開啟刪除
  search?: boolean // 開啟搜索
  add?: boolean // 開啟新建
  index?: boolean // 開啟序號
  view?: boolean // 開啟查看

  columns: DataTableColumns<any> // 表格列定義
  viewEntranceColumns?: string[] // 點擊後能進入查看視窗的欄位
  initQueryParams?: InitQueryParams[] // 初始化查詢參數
  getFunction: (...args: any[]) => Promise<any> // 獲取列表數據的函數
  deleteFunction: (...args: any[]) => Promise<any> // 刪除列表數據的函數
  updateFunction: (...args: any[]) => Promise<any> // 更新列表數據的函數（傳遞到 Modal）
  createFunction: (...args: any[]) => Promise<any> // 新增列表數據的函數（傳遞到 Modal）

  rules?: FormRules // 表單驗證規則（傳遞到 Modal）
  initFormData?: InitFormData[] // 初始化表單數據（傳遞到 Modal）
}>()

const emit = defineEmits(['createSuccess', 'editSuccess'])

defineExpose({
  setListItemFieldValue,
})

// 列表的載入狀態
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const delBtnLoadMap = ref<Record<string, boolean>>({})

// 查詢參數
const formRef = ref<FormInst | null>()
const total = ref(0)
const queryParams = ref<Record<string, any>>({})
const queryParamsMapping = ref<Record<string, InitQueryParams>>({})
function handleResetSearch() {
  if (props.initQueryParams && Array.isArray(props.initQueryParams)) {
    props.initQueryParams.forEach((item: InitQueryParams) => {
      queryParams.value[item.name] = item.value
      queryParamsMapping.value[item.name] = item
    })
  }
}

/** 列表 */
const modalRef = ref()
const list = ref<TableRow[]>([])
const columns = computed(() => {
  const batchDeleteColumn = props.del
    ? [
        {
          type: 'selection',
          fixed: 'left',
          align: 'center',
          width: 50,
        },
      ]
    : []

  const indexColumn = props.index
    ? [
        {
          title: '序號',
          key: 'index',
          width: 80,
          align: 'center',
          fixed: 'left',
          render: (_: unknown, index: number) => getRowIndex(index),
        },
      ]
    : []

  const actualColumns = props.columns.map((column) => {
    const newColumn = { ...column }
    if ('key' in newColumn
      && !('children' in newColumn)
      && props.viewEntranceColumns?.includes(newColumn.key as string)) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          return (
            <n-button type="primary" text onClick={() => modalRef.value.openModal('view', row)}>
              {row[newColumn.key]}
            </n-button>
          )
        },
      }
    }
    return newColumn
  })

  const operateColumn = [
    {
      title: '操作',
      align: 'center',
      key: 'actions',
      width: 250,
      render: (row: TableRow) => {
        return (
          <NSpace justify="center">
            {props.view && (
              <NButton
                size="small"
                onClick={() => modalRef.value.openModal('view', row)}
              >
                查看
              </NButton>
            )}
            {props.edit && (
              <NButton
                size="small"
                onClick={() => modalRef.value.openModal('edit', row)}
              >
                編輯
              </NButton>
            )}
            {props.del && (
              <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
                {{
                  default: () => '確認刪除?',
                  trigger: () => (
                    <NButton
                      size="small"
                      type="error"
                      loading={delBtnLoadMap.value[row.id!]}
                    >
                      刪除
                    </NButton>
                  ),
                }}
              </NPopconfirm>
            )}
          </NSpace>
        )
      },
    },
  ]

  return [
    ...batchDeleteColumn,
    ...indexColumn,
    ...actualColumns,
    ...operateColumn,
  ]
})
async function getList() {
  try {
    startLoading()
    const { data: result } = await props.getFunction(queryParams.value)

    // 將巢狀物件攤平化
    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
      return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
        const value = obj[key]
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(acc, flattenObject(value, newKey))
        }
        else {
          acc[newKey] = value
        }

        return acc
      }, {})
    }

    const flattenData = (data: any[]): any[] => {
      return data.map((item: any) => flattenObject(item))
    }

    list.value = flattenData(result.list)
    total.value = result.total
  }
  finally {
    endLoading()
  }
}
// 計算序號
function getRowIndex(rowIndex: number): number {
  const currentPage = queryParams.value.currentPage || 1
  const pageSize = queryParams.value.pageSize || 10
  return (currentPage - 1) * pageSize + rowIndex + 1
}

/** 點擊「刪除」按鈕 */
async function handleDelete(id: string) {
  try {
    delBtnLoadMap.value[id!] = true

    await props.deleteFunction(id!)
    list.value = list.value.filter((item: TableRow) => item.id !== id)
    window.$message.success(`已經刪除${props.modalName}`)
  }
  finally {
    delBtnLoadMap.value[id!] = false
  }
}

/**  批次刪除 */
const showBatchDeleteModalRef = ref(false)
const batchDeleteLoading = ref(false)
const checkedRowKeys = ref<string[]>([])
async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) {
    window.$message.warning('請至少選擇一條紀錄')
    return
  }
  showBatchDeleteModalRef.value = true
}

async function confirmBatchDelete() {
  try {
    batchDeleteLoading.value = true
    // 依序刪除選中的紀錄
    for (const id of checkedRowKeys.value) {
      await props.deleteFunction(id)
      list.value = list.value.filter((item: TableRow) => item.id !== id)
    }

    window.$message.success(`已批次刪除${checkedRowKeys.value.length}條紀錄`)
    checkedRowKeys.value = [] // 清空選中項
    showBatchDeleteModalRef.value = false
  }
  catch (error) {
    console.error('批次刪除失敗:', error)
    window.$message.error('批次刪除失敗')
  }
  finally {
    batchDeleteLoading.value = false
  }
}

/** 設置列表項的欄位值 */
function setListItemFieldValue(id: string, field: string, value: any) {
  const index = list.value.findIndex((item: TableRow) => item.id === id)
  if (index > -1) {
    list.value[index][field] = value
  }
}

/** 分頁器 */
function changePage(page: number, size: number) {
  queryParams.value.currentPage = page
  queryParams.value.pageSize = size
  getList()
}

/**
 * 處理表單提交成功後的操作
 * 如果是新增使用者，則顯示帳號密碼提示框並將使用者加入列表
 * 如果是編輯使用者，則更新列表中對應使用者的資料
 */
function tableModalSuccess(params: { modalType: ModalType, password?: string } & TableRow) {
  const { modalType, ...remain } = params

  if (modalType === 'add') {
    list.value.push(remain)
    emit('createSuccess', remain)
  }

  if (modalType === 'edit') {
    const index = list.value.findIndex((item: TableRow) => item.id === remain.id)
    if (index > -1)
      list.value[index] = { ...list.value[index], ...remain }
    emit('editSuccess', remain)
  }
}

onMounted(async () => {
  await handleResetSearch()
  await getList()
})
</script>

<template>
  <NSpace vertical class="flex-1">
    <n-card v-if="search && initQueryParams">
      <n-form ref="formRef" :model="queryParams" label-placement="left" inline :show-feedback="false">
        <n-flex>
          <template v-for="item in queryParamsMapping" :key="item.name">
            <n-form-item
              v-if="item.inputType !== 'pagination'" :label="item.label || '未知'" :path="item.name"
              :class="item.class"
            >
              <n-input
                v-if="item.inputType === 'input'" v-model:value="queryParams[item.name]"
                :placeholder="item.placeholder || '請輸入'"
              />
              <n-input-number
                v-if="item.inputType === 'input-number'" v-model:value="queryParams[item.name]"
                :placeholder="item.placeholder || '請輸入'"
              />
            </n-form-item>
          </template>
          <!-- <n-form-item label="性別" path="sex" class="!w-64">
            <n-select
              v-model:value="queryParams.sex"
              :options="[
                { label: '男', value: 1 },
                { label: '女', value: 2 },
              ]"
              placeholder="請選擇"
              clearable
              class="max-w-40 w-100"
            />
          </n-form-item> -->
          <n-flex class="ml-auto">
            <NButton type="primary" @click="getList">
              <template #icon>
                <icon-park-outline-search />
              </template>
              搜索
            </NButton>
            <NButton strong secondary @click="handleResetSearch">
              <template #icon>
                <icon-park-outline-redo />
              </template>
              重設
            </NButton>
          </n-flex>
        </n-flex>
      </n-form>
    </n-card>

    <n-card class="flex-1">
      <template #header>
        <NButton v-if="add" type="primary" @click="modalRef.openModal('add')">
          <template #icon>
            <icon-park-outline-add-one />
          </template>
          新建使用者
        </NButton>
        <NButton v-if="del" type="error" class="m-l-10px" :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete">
          <template #icon>
            <icon-park-outline-delete />
          </template>
          批次刪除
        </NButton>
      </template>
      <NSpace vertical>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :scroll-x="1300"
          :columns="columns as DataTableColumns"
          :data="list"
          :loading="loading"
          :row-key="row => row.id"
        />
        <Pagination
          v-if="queryParams.pageSize" :total="total" :page-size="queryParams.pageSize"
          :current-page="queryParams.currentPage" @change="changePage"
        />
        <Pagination v-else :total="total" @change="changePage" />
      </NSpace>
    </n-card>

    <TableModal
      ref="modalRef"
      modal-name="使用者"

      :update-function="updateFunction"
      :create-function="createFunction"

      :rules="rules"
      :init-form-data="initFormData"

      @success="tableModalSuccess"
    />

    <!-- 批次刪除確認 Modal -->
    <n-modal
      v-model:show="showBatchDeleteModalRef"
      preset="dialog"
      title="確認刪除"
      positive-text="確認"
      negative-text="取消"
      :loading="batchDeleteLoading"
      @positive-click="confirmBatchDelete"
      @negative-click="() => { showBatchDeleteModalRef = false }"
    >
      <template #default>
        確定要刪除選中的 {{ checkedRowKeys.length }} 條紀錄嗎？此操作無法復原！
      </template>
    </n-modal>
  </NSpace>
</template>

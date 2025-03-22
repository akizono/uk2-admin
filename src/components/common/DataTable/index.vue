<script setup lang="tsx">
// TODO: 不同分類要用不同顏色區分
// 測試添加功能
import type { InitFormData, InitQueryParams, ModalType, TableRow } from './type'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'

import { useBoolean } from '@/hooks'
import { arrayToTree } from '@/utils/'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'

import TableModal from './components/TableModal.vue'

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

// 表格的載入狀態
const { bool: tableLoading, setTrue: startTableLoading, setFalse: endTableLoading } = useBoolean(false)
// 查詢項的載入狀態
const { bool: queryLoading, setTrue: startQueryLoading, setFalse: endQueryLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const delBtnLoadMap = ref<Record<string, boolean>>({})

// 查詢參數
const formRef = ref<FormInst | null>()
const total = ref(0)
const queryParams = ref<Record<string, any>>({})
const queryParamsMapping = ref<Record<string, InitQueryParams>>({})
function handleResetSearch() {
  try {
    startQueryLoading()
    if (props.initQueryParams && Array.isArray(props.initQueryParams)) {
      props.initQueryParams.forEach((item: InitQueryParams) => {
        queryParams.value[item.name] = item.value
        queryParamsMapping.value[item.name] = item
      })
    }
  }
  finally {
    endQueryLoading()
  }
}

/** 列表 */
const modalRef = ref()
const list = ref<TableRow[]>([])
// 控制展開的行
const expandedRowKeys = ref<string[]>([])
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
          align: 'center',
          fixed: 'left',
          render: (_: unknown, index: number) => getRowIndex(index),
        },
      ]
    : []

  // 定義一個輔助函數來尋找父項
  function findParentItem(items: TableRow[], parentId: string): TableRow | null {
    for (const item of items) {
      if (item.id === parentId) {
        // 找到父項，返回一個沒有 children 的複製版本
        const { children, ...parentWithoutChildren } = item
        return parentWithoutChildren
      }

      if (item.children && item.children.length > 0) {
        const found = findParentItem(item.children, parentId)
        if (found)
          return found
      }
    }
    return null
  }

  const actualColumns = props.columns.map((column) => {
    const newColumn = { ...column }
    if ('key' in newColumn
      && !('children' in newColumn)
      && props.viewEntranceColumns?.includes(newColumn.key as string)) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          const parentData = findParentItem(list.value, row.parentId)
          return (
            <n-button type="primary" text onClick={() => modalRef.value.openModal('view', row, parentData)}>
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
                onClick={() => {
                  const parentData = findParentItem(list.value, row.parentId)
                  modalRef.value.openModal('view', row, parentData)
                }}
              >
                查看
              </NButton>
            )}
            {props.edit && (
              <NButton
                size="small"
                onClick={() => {
                  const parentData = findParentItem(list.value, row.parentId)
                  modalRef.value.openModal('edit', row, parentData)
                }}
              >
                編輯
              </NButton>
            )}
            {props.del && (
              <NPopconfirm onPositiveClick={() => handleDelete(row)}>
                {{
                  default: () => '確認刪除本項?',
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
    startTableLoading()
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
      return data.map((item: any) => {
        // 先創建一個攤平的物件
        const flattened = flattenObject(item)

        // 然後將原始物件中的所有屬性都添加到攤平物件中
        // 這樣既保留了原始物件的結構，也有攤平後的屬性
        return { ...item, ...flattened }
      })
    }

    list.value = arrayToTree(flattenData(result.list))
    total.value = result.total
  }
  finally {
    endTableLoading()
  }
}
// 計算序號
function getRowIndex(rowIndex: number): number {
  const currentPage = queryParams.value.currentPage || 1
  const pageSize = queryParams.value.pageSize || 10
  return (currentPage - 1) * pageSize + rowIndex + 1
}

/** 「刪除」按鈕 */
async function handleDelete(row: TableRow) {
  try {
    if (row.children && row.children.length > 0) {
      window.$message.warning('該項目存在子項，無法刪除')
      return
    }

    delBtnLoadMap.value[row.id!] = true

    // 先確保後端刪除成功
    await props.deleteFunction(row.id!)

    // 後端刪除成功後，再從前端移除
    // 定義遞迴尋找並刪除項目的函數
    const deleteRecursively = (items: TableRow[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === row.id) {
          // 找到匹配項，從陣列中刪除
          items.splice(i, 1)
          return true
        }

        // 如果當前項有子項，則遞迴搜尋
        if (items[i].children && items[i].children.length > 0) {
          const found = deleteRecursively(items[i].children)
          if (found)
            return true
        }
      }
      return false
    }

    // 先在最外層尋找
    const index = list.value.findIndex((item: TableRow) => item.id === row.id)
    if (index > -1) {
      list.value.splice(index, 1)
    }
    else {
      // 如果外層沒找到，則遞迴搜尋子項
      deleteRecursively(list.value)
    }

    window.$message.success(`已經刪除${props.modalName}`)
  }
  catch (error) {
    window.$message.error(`刪除 ID ${row.id} 失敗:${error}`)
  }
  finally {
    delBtnLoadMap.value[row.id!] = false
  }
}

/** 批次刪除 */
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

    // 儲存已成功刪除的 ID 列表
    const successDeletedIds: string[] = []

    // 定義遞迴尋找並刪除項目的函數
    const deleteRecursively = (items: TableRow[], idToDelete: string): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === idToDelete) {
          // 找到匹配項，從陣列中刪除
          items.splice(i, 1)
          return true
        }

        // 如果當前項有子項，則遞迴搜尋
        if (items[i].children && items[i].children.length > 0) {
          const found = deleteRecursively(items[i].children, idToDelete)
          if (found)
            return true
        }
      }
      return false
    }

    // 依序刪除選中的紀錄，先完成所有後端刪除請求
    for (const id of checkedRowKeys.value) {
      try {
        await props.deleteFunction(id)
        // 後端刪除成功，將 ID 添加到成功列表
        successDeletedIds.push(id)
      }
      catch (error) {
        console.error(`刪除 ID ${id} 失敗:`, error)
        window.$message.error(`刪除 ID ${id} 失敗`)
        // 繼續處理下一個，不中斷整個過程
      }
    }

    // 後端刪除成功後，從前端移除這些項目
    for (const id of successDeletedIds) {
      // 先在最外層尋找
      const index = list.value.findIndex((item: TableRow) => item.id === id)
      if (index > -1) {
        list.value.splice(index, 1)
      }
      else {
        // 如果外層沒找到，則遞迴搜尋子項
        deleteRecursively(list.value, id)
      }
    }

    if (successDeletedIds.length > 0) {
      window.$message.success(`已批次刪除 ${successDeletedIds.length} 條紀錄`)
    }

    // 只移除成功刪除的 ID
    checkedRowKeys.value = checkedRowKeys.value.filter(id => !successDeletedIds.includes(id))

    // 如果沒有剩餘選中項，關閉對話框
    if (checkedRowKeys.value.length === 0) {
      showBatchDeleteModalRef.value = false
    }
    else {
      // 如果有剩餘的未成功刪除的項目，顯示提示
      window.$message.warning(`有 ${checkedRowKeys.value.length} 條紀錄未能成功刪除`)
    }
  }
  catch {
    window.$message.error('批次刪除過程中發生錯誤')
  }
  finally {
    batchDeleteLoading.value = false
  }
}

/** 設置列表項的欄位值 */
function setListItemFieldValue(id: string, field: string, value: any) {
  // 定義遞迴尋找並更新欄位值的函數
  const updateFieldValueRecursively = (items: TableRow[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        // 找到匹配項，更新欄位值
        items[i][field] = value
        return true
      }

      // 如果當前項有子項，則遞迴搜尋
      if (items[i].children && items[i].children.length > 0) {
        const found = updateFieldValueRecursively(items[i].children)
        if (found)
          return true
      }
    }
    return false
  }

  // 先在最外層尋找
  const index = list.value.findIndex((item: TableRow) => item.id === id)
  if (index > -1) {
    list.value[index][field] = value
  }
  else {
    // 如果外層沒找到，則遞迴搜尋子項
    updateFieldValueRecursively(list.value)
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
function tableModalSuccess(params: { modalType: ModalType, password?: string, parentId?: string } & TableRow) {
  const { modalType, parentId, ...remain } = params

  if (modalType === 'add') {
    // 如果有指定父項 ID，則尋找父項並將新項目添加到其 children 中
    if (parentId) {
      // 定義遞迴尋找父項的路徑
      const findParentPath = (items: TableRow[], path: string[] = []): string[] | null => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === parentId) {
            // 找到父項，返回路徑（包含父項自身的ID）
            return [...path, items[i].id]
          }

          // 如果當前項有子項，則遞迴搜尋
          if (items[i].children && items[i].children.length > 0) {
            const result = findParentPath(items[i].children, [...path, items[i].id])
            if (result)
              return result
          }
        }
        return null
      }

      // 定義遞迴尋找父項並添加子項的函數
      const addToParentRecursively = (items: TableRow[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === parentId) {
            // 找到父項，添加到其 children 中
            if (!items[i].children) {
              items[i].children = []
            }
            items[i].children.push({ ...remain, parentId })
            return true
          }

          // 如果當前項有子項，則遞迴搜尋
          if (items[i].children && items[i].children.length > 0) {
            const found = addToParentRecursively(items[i].children)
            if (found)
              return true
          }
        }
        return false
      }

      // 尋找父項的路徑，用於自動展開
      const parentPath = findParentPath(list.value)

      // 嘗試在樹中尋找父項
      const parentFound = addToParentRecursively(list.value)

      // 如果找到了父項路徑，則自動展開
      if (parentPath) {
        // 將路徑上的所有節點ID添加到 expandedRowKeys
        parentPath.forEach((id) => {
          if (!expandedRowKeys.value.includes(id)) {
            expandedRowKeys.value.push(id)
          }
        })
      }

      // 如果沒有找到父項，則添加到最外層
      if (!parentFound) {
        list.value.push(remain)
      }
    }
    else {
      // 沒有指定父項，直接添加到最外層
      list.value.push(remain)
    }
    emit('createSuccess', remain)
  }

  if (modalType === 'edit') {
    // 定義遞迴尋找並更新函數
    const updateRecursively = (items: TableRow[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === remain.id) {
          // 找到匹配項，進行更新
          items[i] = { ...items[i], ...remain }
          return true
        }

        // 如果當前項有子項，則遞迴搜尋
        if (items[i].children && items[i].children.length > 0) {
          const found = updateRecursively(items[i].children)
          if (found)
            return true
        }
      }
      return false
    }

    // 先在最外層尋找
    const index = list.value.findIndex((item: TableRow) => item.id === remain.id)
    if (index > -1) {
      list.value[index] = { ...list.value[index], ...remain }
    }
    else {
      // 如果外層沒找到，則遞迴搜尋子項
      updateRecursively(list.value)
    }

    emit('editSuccess', remain)
  }
}

/** 獲取菜單的數據 */
// async function getMenuList() {
//   try {
//     const { data: result } = await DeptApi.getDeptPage({
//       currentPage: 1,
//       pageSize: 1000,
//     })
//     console.log(result.list)
//   }
//   finally {

//   }
// }

onMounted(async () => {
  // 打開載入狀態
  await startTableLoading()
  await startQueryLoading()

  // 排隊查詢
  await handleResetSearch()
  // await getMenuList()
  await getList()
})
</script>

<template>
  <NSpace vertical class="flex-1">
    <n-card v-if="search && initQueryParams">
      <n-spin :show="queryLoading" size="large">
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
      </n-spin>
    </n-card>

    <n-card class="flex-1">
      <template #header>
        <NButton v-if="add" type="primary" @click="modalRef.openModal('add')">
          <template #icon>
            <icon-park-outline-add-one />
          </template>
          新建{{ props.modalName }}
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
          v-model:expanded-row-keys="expandedRowKeys"
          :columns="columns as DataTableColumns"
          :data="list"
          :loading="tableLoading"
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

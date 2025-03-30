<script setup lang="tsx">
// TODO: 不同分類要用不同顏色區分
// 測試添加功能
import type { InitFormData, InitQueryParams, ModalType, TableRow } from './type'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import type { ComputedRef, VNode } from 'vue'

import { DictDataApi } from '@/api/system/dict-data/'
import { useBoolean, useThrottleAction } from '@/hooks'
import { arrayToTree, sortTreeData } from '@/utils/array'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'

import AsyncDictLabel from '../AsyncDictLabel/index.vue'
import TableModal from './components/TableModal.vue'

const props = defineProps<{
  width?: string // 表格的寬度
  modalName: string // 模態框名稱

  edit?: boolean // 開啟編輯
  del?: boolean // 開啟刪除
  search?: boolean // 開啟搜索
  add?: boolean // 開啟新建
  index?: boolean // 開啟序號
  view?: boolean // 開啟查看
  pagination?: boolean // 開啟分頁

  filterColumnName?: string // 過濾條件的欄位名稱
  filterColumnValue?: ComputedRef<string> // 過濾條件的欄位 ID（ 所有新增和查詢的介面都會自動帶上{[filterColumnName]:filterColumnValue.value} ）

  columns: DataTableColumns<any> // 表格列定義
  viewEntranceColumns?: string[] // 點擊後能進入查看視窗的欄位
  initQueryParams?: InitQueryParams[] // 初始化查詢參數
  getFunction: (...args: any[]) => Promise<any> // 獲取列表數據的函數
  deleteFunction?: (...args: any[]) => Promise<any> // 刪除列表數據的函數
  updateFunction?: (...args: any[]) => Promise<any> // 更新列表數據的函數（傳遞到 Modal）
  createFunction?: (...args: any[]) => Promise<any> // 新增列表數據的函數（傳遞到 Modal）

  blockFunction?: (...args: any[]) => Promise<any> // 封鎖列表數據的函數
  unblockFunction?: (...args: any[]) => Promise<any> // 解封鎖列表數據的函數

  initFormData?: InitFormData[] // 初始化表單數據（傳遞到 Modal）
  rules?: FormRules // 表單驗證規則（傳遞到 Modal）
}>()
const emit = defineEmits(['createSuccess', 'editSuccess'])

const propsVerifyPassed = ref(false)
const propsVerifyErrorMsg = ref('')
function propsVerify() {
  // 分頁器已開啟，pageSize不能為0
  const paginationON = props.pagination
  const initQueryParamsIncludePageSize0 = props.initQueryParams?.some((item: InitQueryParams) => item.name === 'pageSize' && item.value === 0)
  if (initQueryParamsIncludePageSize0 && paginationON) {
    propsVerifyErrorMsg.value = '分頁器已開啟，pageSize不能為0'
    propsVerifyPassed.value = false
    return
  }

  // 檢查必要的 CRUD 函數
  if (!props.getFunction) {
    propsVerifyErrorMsg.value = '缺少 getFunction'
    propsVerifyPassed.value = false
    return
  }
  if (props.del && !props.deleteFunction) {
    propsVerifyErrorMsg.value = '開啟刪除功能但缺少 deleteFunction'
    propsVerifyPassed.value = false
    return
  }
  if (props.edit && !props.updateFunction) {
    propsVerifyErrorMsg.value = '開啟編輯功能但缺少 updateFunction'
    propsVerifyPassed.value = false
    return
  }
  if (props.add && !props.createFunction) {
    propsVerifyErrorMsg.value = '開啟新增功能但缺少 createFunction'
    propsVerifyPassed.value = false
    return
  }

  // 開啟了search，initQueryParams必須有除了pageSize和currentPageq以外的其他屬性
  const searchON = props.search
  const hasPageOutside = props.initQueryParams?.some(item => item.name !== 'pageSize' && item.name !== 'currentPage') || false
  if (searchON && !hasPageOutside) {
    propsVerifyErrorMsg.value = '開啟了search，initQueryParams必須有除了pageSize和currentPageq以外的其他屬性'
    propsVerifyPassed.value = false
    return
  }

  /** initQueryParams進行循環然後對每一項進行校驗: */
  // 首先第一個if，所有的屬性都要包含name、value、inputType
  const hasEssential = props.initQueryParams?.every((item: InitQueryParams) =>
    ['name', 'value', 'inputType'].every(key => key in item),
  ) || false
  if (props.initQueryParams && !hasEssential) {
    propsVerifyErrorMsg.value = 'initQueryParams必須包含name、value、inputType'
    propsVerifyPassed.value = false
    return
  }

  // initQueryParams中如果inputType是select的時候，必須包含dict
  const hasSelectCarryDict = !props.initQueryParams?.some((item: InitQueryParams) =>
    item.inputType === 'select' && !item.dict,
  )
  if (!hasSelectCarryDict) {
    propsVerifyErrorMsg.value = 'inputType是select的時候，必須包含dict'
    propsVerifyPassed.value = false
    return
  }

  // initFormData中如果type是select的時候，必須包含options，且options中必須包含api、selectParam、itemMapping，且itemMapping中必須包含label和value
  const hasSelectCarryOptions = !props.initFormData?.some((item: InitFormData) =>
    item.type === 'select' && (
      !item.options
      || !item.options.api
      || !item.options.selectParam
      || !item.options.itemMapping
      || !item.options.itemMapping.label
      || !item.options.itemMapping.value
    ),
  )
  if (!hasSelectCarryOptions) {
    propsVerifyErrorMsg.value = 'type是select的時候，必須包含options，且options中必須包含api、selectParam、itemMapping，且itemMapping中必須包含label和value'
    propsVerifyPassed.value = false
    return
  }

  // 如果 columns 存在 status 欄位，則必須包含 blockFunction 和 unblockFunction
  const hasStatusColumn = props.columns.some(item => 'key' in item && item.key === 'status')
  if (hasStatusColumn && (!props.blockFunction || !props.unblockFunction)) {
    propsVerifyErrorMsg.value = '當表格包含 status 欄位時，必須提供 blockFunction 和 unblockFunction'
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnName 存在則必須提供 filterColumnValue
  if (props.filterColumnName && !props.filterColumnValue) {
    propsVerifyErrorMsg.value = '如果 filterColumnName 存在則必須提供 filterColumnValue'
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnValue 存在則必須提供 filterColumnName
  if (props.filterColumnValue && !props.filterColumnName) {
    propsVerifyErrorMsg.value = '如果 filterColumnValue 存在則必須提供 filterColumnName'
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnValue.value 不是非空 string 則報錯
  if (props.filterColumnValue && (typeof props.filterColumnValue.value !== 'string' || props.filterColumnValue.value === '')) {
    propsVerifyErrorMsg.value = 'filterColumnValue.value 必須是 string 且不能為空'
    propsVerifyPassed.value = false
    return
  }

  propsVerifyPassed.value = true
}

defineExpose({
  setListItemFieldValue,
  handleStatusChange,
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

  // 外部傳遞進來的 columns
  const actualColumns = props.columns.map((column) => {
    const newColumn = { ...column } as any

    // 將 dictValue 轉化為具體的字典值
    // 判斷 render 是不是JSON對象
    if (typeof newColumn.render === 'function') {
      const originalRender = newColumn.render
      newColumn.render = (row: TableRow) => {
        const result = originalRender(row)
        // console.log('render 函數返回值：', result)
        try {
          const data = JSON.parse(result)
          // 判斷data是否包含dictType
          if ('dictType' in data) {
            return h(AsyncDictLabel, {
              dictType: data.dictType,
              value: data.value,
            })
          }
        }
        catch {
          // 如果不是 JSON 字串，直接返回原始結果
          return result
        }
        return result
      }
    }

    // 返回新的 column
    if ('key' in newColumn
      && !('children' in newColumn)
      && props.viewEntranceColumns?.includes(newColumn.key as string)) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          // 找到父項
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

  // 外部的 actions 列
  const externalActionsColumn = props.columns.find((column): column is (typeof column & { key: 'actions', render?: (row: any) => VNode }) =>
    'key' in column && column.key === 'actions',
  )

  const operateColumn = [
    {
      title: '操作',
      align: 'center',
      key: 'actions',
      width: 250,
      render: (row: TableRow) => {
        return (
          <NSpace justify="center">
            {/* 如果存在外部的 actions 列，先渲染它的內容 */}
            {externalActionsColumn?.render?.(row)}
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
    ...actualColumns.filter(col => !('key' in col) || col.key !== 'actions'), // 過濾掉外部的 actions 列
    ...operateColumn, // 總是使用合併後的操作列
  ]
})
async function getList() {
  try {
    startTableLoading()
    const { data: result } = await props.getFunction({
      ...queryParams.value,
      ...(props.filterColumnName && props.filterColumnValue ? { [props.filterColumnName]: props.filterColumnValue.value } : {}),
    })

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

    // 先將數據轉換為樹狀結構，然後進行排序
    list.value = sortTreeData(arrayToTree(flattenData(result.list)))
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
    await props.deleteFunction!(row.id!)

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
        await props.deleteFunction!(id)
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
 * 遞迴更新子項狀態並進行封鎖操作
 * 這個函數主要用於處理樹狀結構中的父子關係：
 * 1. 當一個父項被封鎖（status設為0）時
 * 2. 它的所有子項也需要被封鎖
 * 3. 但只有原本狀態為啟用（status=1）的子項才需要調用封鎖API
 * @param item - 要處理的父項目
 */
async function updateChildrenStatus(item: TableRow) {
  /**
   * 在整個列表中尋找指定ID的項目
   * 因為列表是樹狀結構，所以需要遞迴搜尋每一層
   * @param items - 要搜尋的項目列表
   * @param targetId - 要尋找的項目ID
   * @returns 找到的項目，如果沒找到則返回null
   */
  const findItemInList = (items: TableRow[], targetId: string): TableRow | null => {
    for (const listItem of items) {
      if (listItem.id === targetId) {
        return listItem
      }
      if (listItem.children && listItem.children.length > 0) {
        const found = findItemInList(listItem.children, targetId)
        if (found)
          return found
      }
    }
    return null
  }

  // 先找到完整的父項數據（包含children）
  const fullItem = findItemInList(list.value, item.id)
  if (fullItem?.children && fullItem.children.length > 0) {
    /**
     * 第一步：記錄所有子項的原始狀態
     * 為什麼要記錄？因為我們需要知道哪些子項原本是啟用的（status=1）
     * 只有這些子項才需要調用封鎖API
     */
    const originalStatus = new Map<string, number>()
    const recordOriginalStatus = (items: TableRow[]) => {
      for (const child of items) {
        originalStatus.set(child.id!, child.status)
        if (child.children && child.children.length > 0) {
          recordOriginalStatus(child.children)
        }
      }
    }
    recordOriginalStatus(fullItem.children)

    /**
     * 第二步：更新前端顯示
     * 將所有子項的狀態都設為已封鎖（status=0）
     */
    const updateStatusRecursively = (items: TableRow[]) => {
      for (const child of items) {
        child.status = 0
        if (child.children && child.children.length > 0) {
          updateStatusRecursively(child.children)
        }
      }
    }
    updateStatusRecursively(fullItem.children)

    /**
     * 第三步：處理後端API調用
     * 遍歷所有子項，但只對原本狀態為啟用（status=1）的項目調用封鎖API
     * 如果API調用失敗，會恢復該項的狀態為啟用
     */
    const processBlockOperations = async (items: TableRow[]) => {
      for (const child of items) {
        // 只有原本狀態為啟用的子項才需要調用封鎖API
        if (props.blockFunction && originalStatus.get(child.id!) === 1) {
          try {
            await props.blockFunction(child.id)
          }
          catch (error) {
            console.error(`Block operation failed for id ${child.id}:`, error)
            // API調用失敗，恢復狀態為啟用
            child.status = 1
            window.$message.error(`封鎖操作失敗: ${child.id}`)
          }
        }
        // 繼續處理這個子項的子項（如果有的話）
        if (child.children && child.children.length > 0) {
          await processBlockOperations(child.children)
        }
      }
    }

    // 開始執行封鎖操作
    processBlockOperations(fullItem.children)
  }
}

/** 處理狀態變更 */
async function handleStatusChange(row: TableRow, value: boolean) {
  const newStatus = value ? 1 : 0

  // 使用節流 hook
  useThrottleAction(
    `${props.modalName}_status_${row.id}`,
    1000,
    async () => {
      setListItemFieldValue(row.id!, 'status', newStatus)
      if (value) {
        await props.unblockFunction!(row.id!)
      }
      else {
        await props.blockFunction!(row.id!)
        // 如果是 block 操作，同時處理子項
        await updateChildrenStatus(row)
      }
    },
  )
}

/**
 * 處理表單提交成功後的操作
 * 如果是新增使用者，則顯示帳號密碼提示框並將使用者加入列表
 * 如果是編輯使用者，則更新列表中對應使用者的資料
 */
async function tableModalSuccess(params: { modalType: ModalType, password?: string, parentId?: string } & TableRow) {
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
      console.log('remain', remain)
      list.value.push(remain)
    }
    emit('createSuccess', remain)
  }

  if (modalType === 'edit') {
    /** 遞迴更新資料表項目 */
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

    /** status 是0的話同時 block 子項 */
    if (remain.status === 0) {
      await updateChildrenStatus(remain)
    }

    emit('editSuccess', remain)
  }
}

onMounted(async () => {
  await propsVerify()

  // 打開載入狀態
  await startTableLoading()
  await startQueryLoading()

  // 排隊查詢
  await handleResetSearch()
  await getList()
})
</script>

<template>
  <n-result
    v-if="!propsVerifyPassed"
    status="error"
    title="請檢查props參數"
    :description="propsVerifyErrorMsg"
  />

  <NSpace v-else vertical class="flex-1">
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
        <template v-if="pagination">
          <Pagination
            v-if="queryParams.pageSize" :total="total" :page-size="queryParams.pageSize"
            :current-page="queryParams.currentPage" @change="changePage"
          />
          <Pagination v-else :total="total" @change="changePage" />
        </template>
      </NSpace>
    </n-card>

    <TableModal
      ref="modalRef"
      :width="width"
      modal-name="使用者"

      :update-function="updateFunction || undefined"
      :create-function="createFunction || undefined"

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

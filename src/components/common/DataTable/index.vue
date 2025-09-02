<script setup lang="tsx">
import type { InitFormData, InitQueryParams, menuTreeNode, ModalType, TableRow } from './type'
import type { MultilingualFieldsVO } from '@/api/system/multilingual-fields'
import type { DataTableColumns, FormInst, FormRules, NDataTable } from 'naive-ui'
import type { ComputedRef, VNode } from 'vue'

import CopyText from '@/components/custom/CopyText.vue'
import { useBoolean, useThrottleAction } from '@/hooks'
import { useDictStore, useLanguageStore } from '@/store'
import { arrayToTree, sortTreeData } from '@/utils/array'
import { createIcon } from '@/utils/icon'
import { useDebounceFn } from '@vueuse/core'
import { NButton, NPopconfirm, NPopover, NSpace, useThemeVars } from 'naive-ui'
import IconAttention from '~icons/icon-park-outline/attention'

import AsyncDictLabel from '../AsyncDictLabel/index.vue'
import TableModal from './components/TableModal.vue'

// 樹狀結構的節點
interface TreeNode {
  label: string
  value: string | number
  key: string | number
  children?: TreeNode[]
}

const props = defineProps<{
  modalFormLabelWidth?: string // 模態框表單label的寬度（傳遞到 Modal）
  modalName?: string // 模態框名稱
  modalWidth?: string // 模態框的寬度（傳遞到 Modal）
  multilingualFieldsModalWidth?: string // 多語言欄位彈出視窗的寬度（傳遞到 Modal）

  edit?: boolean // 開啟編輯
  del?: boolean // 開啟刪除
  search?: boolean // 開啟搜索
  add?: boolean // 開啟新建
  index?: boolean // 開啟序號
  view?: boolean // 開啟查看
  pagination?: boolean // 開啟分頁

  showMenu?: boolean // 開啟菜單功能
  menuMultilingual?: boolean // 菜單開啟多語言
  getMenuDataFunction?: (...args: any[]) => Promise<any> // 獲取菜單數據的函數
  filterField?: string // 過濾欄位
  menuDefaultExpandRoot?: boolean // 默認展開根節點

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

  getFunctionExtraParams?: Record<string, any> // 獲取列表數據的函數的額外參數（每次獲取列表數據的時候都會帶著這個參數）

  initFormData?: InitFormData[] // 初始化表單數據（傳遞到 Modal）
  rules?: FormRules // 表單驗證規則（傳遞到 Modal）
  permission: Record<string, string[]> // 權限配置
}>()
const emit = defineEmits(['createSuccess', 'editSuccess'])
const { t } = useI18n()
const languageStore = useLanguageStore()

const propsVerifyPassed = ref(false)
const propsVerifyErrorMsg = ref('')
function propsVerify() {
  // 分頁器已開啟，pageSize不能為0
  const paginationON = props.pagination
  const initQueryParamsIncludePageSize0 = props.initQueryParams?.some((item: InitQueryParams) => item.name === 'pageSize' && item.value === 0)
  if (initQueryParamsIncludePageSize0 && paginationON) {
    propsVerifyErrorMsg.value = t('dataTable.paginationError')
    propsVerifyPassed.value = false
    return
  }

  // 檢查必要的 CRUD 函數
  if (!props.getFunction) {
    propsVerifyErrorMsg.value = t('dataTable.getFunctionError')
    propsVerifyPassed.value = false
    return
  }
  if (props.del && !props.deleteFunction) {
    propsVerifyErrorMsg.value = t('dataTable.deleteFunctionError')
    propsVerifyPassed.value = false
    return
  }
  if (props.edit && !props.updateFunction) {
    propsVerifyErrorMsg.value = t('dataTable.updateFunctionError')
    propsVerifyPassed.value = false
    return
  }
  if (props.add && !props.createFunction) {
    propsVerifyErrorMsg.value = t('dataTable.createFunctionError')
    propsVerifyPassed.value = false
    return
  }

  // 開啟了search，initQueryParams必須有除了pageSize和currentPageq以外的其他屬性
  const searchON = props.search
  const hasPageOutside = props.initQueryParams?.some(item => item.name !== 'pageSize' && item.name !== 'currentPage') || false
  if (searchON && !hasPageOutside) {
    propsVerifyErrorMsg.value = t('dataTable.searchError')
    propsVerifyPassed.value = false
    return
  }

  /** initQueryParams進行循環然後對每一項進行校驗: */
  // 首先第一個if，所有的屬性都要包含name、value、inputType
  const hasEssential = props.initQueryParams?.every((item: InitQueryParams) =>
    ['name', 'value', 'inputType'].every(key => key in item),
  ) || false
  if (props.initQueryParams && !hasEssential) {
    propsVerifyErrorMsg.value = t('dataTable.initQueryParamsError')
    propsVerifyPassed.value = false
    return
  }

  // initQueryParams中如果inputType是select的時候，必須包含dictType或者selectOptions
  const hasSelectCarryDictType = !props.initQueryParams?.some((item: InitQueryParams) =>
    item.inputType === 'select' && (!item.dictType && !item.selectOptions),
  )
  if (!hasSelectCarryDictType) {
    propsVerifyErrorMsg.value = t('dataTable.initQueryParamsSelectError')
    propsVerifyPassed.value = false
    return
  }

  // initQueryParams中如果存在name是pageSize的選項，值必須是數字且不能為負數（可以為0）；如果存在name是currentPage的選項，值必須是數字且不能為0和負數）
  if (props.initQueryParams) {
    const pageSizeParam = props.initQueryParams.find(item => item.name === 'pageSize')
    const currentPageParam = props.initQueryParams.find(item => item.name === 'currentPage')

    if (pageSizeParam) {
      if (typeof pageSizeParam.value !== 'number') {
        propsVerifyErrorMsg.value = t('dataTable.pageSizeError')
        propsVerifyPassed.value = false
        return
      }
      if (pageSizeParam.value < 0) {
        propsVerifyErrorMsg.value = t('dataTable.pageSizeNegativeError')
        propsVerifyPassed.value = false
        return
      }
    }

    if (currentPageParam) {
      if (typeof currentPageParam.value !== 'number') {
        propsVerifyErrorMsg.value = t('dataTable.currentPageError')
        propsVerifyPassed.value = false
        return
      }
      if (currentPageParam.value <= 0) {
        propsVerifyErrorMsg.value = t('dataTable.currentPageNegativeError')
        propsVerifyPassed.value = false
        return
      }
    }
  }

  // initFormData中如果type是select的時候，必須包含selectOptions或者dictType，且selectOptions中必須包含api、selectParam、itemMapping，且itemMapping中必須包含label和value
  const selectFormItems = props.initFormData?.filter((item: InitFormData) => item.type === 'select') || []
  for (const item of selectFormItems) {
    // 檢查是否有任一選項來源
    if (!item.selectOptions && !item.dictType) {
      propsVerifyErrorMsg.value = t('dataTable.selectOptionsError')
      propsVerifyPassed.value = false
      return
    }

    // 檢查是否同時存在兩種選項來源
    if (item.selectOptions && item.dictType) {
      propsVerifyErrorMsg.value = t('dataTable.selectOptionsDictTypeError')
      propsVerifyPassed.value = false
      return
    }

    // 如果使用selectOptions，檢查必要屬性
    if (item.selectOptions) {
      if (!item.selectOptions.api) {
        propsVerifyErrorMsg.value = t('dataTable.selectOptionsApiError')
        propsVerifyPassed.value = false
        return
      }
      if (!item.selectOptions.selectParam) {
        propsVerifyErrorMsg.value = t('dataTable.selectOptionsSelectParamError')
        propsVerifyPassed.value = false
        return
      }
      if (!item.selectOptions.itemMapping) {
        propsVerifyErrorMsg.value = t('dataTable.selectOptionsItemMappingError')
        propsVerifyPassed.value = false
        return
      }
      if (!item.selectOptions.itemMapping.label || !item.selectOptions.itemMapping.value) {
        propsVerifyErrorMsg.value = t('dataTable.itemMappingError')
        propsVerifyPassed.value = false
        return
      }
    }
  }

  // initFormData中如果type是radio的時候，必須包含selectOptions或者dictType，且selectOptions中必須包含api、itemMapping，且itemMapping中必須包含label和value
  const radioFormItems = props.initFormData?.filter((item: InitFormData) => item.type === 'radio') || []
  for (const item of radioFormItems) {
    // 檢查是否有任一選項來源
    if (!item.selectOptions && !item.dictType) {
      propsVerifyErrorMsg.value = t('dataTable.radioOptionsError')
      propsVerifyPassed.value = false
      return
    }

    // 檢查是否同時存在兩種選項來源
    if (item.selectOptions && item.dictType) {
      propsVerifyErrorMsg.value = t('dataTable.radioOptionsDictTypeError')
      propsVerifyPassed.value = false
      return
    }

    // 如果使用selectOptions，檢查必要屬性
    if (item.selectOptions) {
      if (!item.selectOptions.api) {
        propsVerifyErrorMsg.value = t('dataTable.selectOptionsApiError')
        propsVerifyPassed.value = false
        return
      }
      if (!item.selectOptions.itemMapping) {
        propsVerifyErrorMsg.value = t('dataTable.selectOptionsItemMappingError')
        propsVerifyPassed.value = false
        return
      }
      if (!item.selectOptions.itemMapping.label || !item.selectOptions.itemMapping.value) {
        propsVerifyErrorMsg.value = t('dataTable.itemMappingError')
        propsVerifyPassed.value = false
        return
      }
    }
  }

  // initFormData中如果type是radio的時候，必須包含dictType 或者 selectOptions（且selectOptions中必須包含api、itemMapping，且itemMapping中必須包含label和value）
  const hasRadioCarryDictType = !props.initFormData?.some((item: InitFormData) =>
    item.type === 'radio' && !item.dictType && (!item.selectOptions || !item.selectOptions.api || !item.selectOptions.itemMapping || !item.selectOptions.itemMapping.label || !item.selectOptions.itemMapping.value),
  )
  if (!hasRadioCarryDictType) {
    propsVerifyErrorMsg.value = t('dataTable.radioOptionsErrorMsg')
    propsVerifyPassed.value = false
    return
  }

  // 如果 columns 存在 status 欄位，則必須包含 blockFunction 和 unblockFunction
  const hasStatusColumn = props.columns.some(item => 'key' in item && item.key === 'status')
  if (hasStatusColumn && (!props.blockFunction || !props.unblockFunction)) {
    propsVerifyErrorMsg.value = t('dataTable.statusColumnError')
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnName 存在則必須提供 filterColumnValue
  if (props.filterColumnName && !props.filterColumnValue) {
    propsVerifyErrorMsg.value = t('dataTable.filterColumnNameError')
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnValue 存在則必須提供 filterColumnName
  if (props.filterColumnValue && !props.filterColumnName) {
    propsVerifyErrorMsg.value = t('dataTable.filterColumnValueError')
    propsVerifyPassed.value = false
    return
  }

  // 如果 filterColumnValue.value 不是非空 string 則報錯
  if (props.filterColumnValue && (typeof props.filterColumnValue.value !== 'string' || props.filterColumnValue.value === '')) {
    propsVerifyErrorMsg.value = t('dataTable.filterColumnValueStringError')
    propsVerifyPassed.value = false
    return
  }

  // 如果同時出現了兩個及以上name一樣的值，那麼他們必須包含正確的showCondition屬性
  if (props.initFormData) {
    // 使用Map來統計每個name出現的次數
    const nameCount = new Map<string, number>()
    props.initFormData.forEach((item: InitFormData) => {
      nameCount.set(item.name, (nameCount.get(item.name) || 0) + 1)
    })

    // 檢查所有出現次數大於1的name
    for (const [name, count] of nameCount.entries()) {
      if (count > 1) {
        // 找出所有具有這個name的項目
        const itemsWithSameName = props.initFormData.filter(item => item.name === name)

        // 檢查這些項目是否都有showCondition屬性
        const allHaveShowCondition = itemsWithSameName.every(item => item.showCondition !== undefined)

        if (!allHaveShowCondition) {
          propsVerifyErrorMsg.value = t('dataTable.initFormDataNameError1') + name + t('dataTable.initFormDataNameError2')
          propsVerifyPassed.value = false
          return
        }
      }
    }
  }

  // 如果開啟了菜單功能，則必須提供 getMenuDataFunction 和 filterField
  if (props.showMenu && (!props.getMenuDataFunction || !props.filterField)) {
    propsVerifyErrorMsg.value = t('dataTable.menuFunctionError')
    propsVerifyPassed.value = false
    return
  }

  // 如果 initFormData 中存在 type 為 file 的欄位，則必須包含 fileOptions 屬性
  // 如果 fileOptions 中存在 singleFile 為 true，則必須包含 maxFileCount 為 1
  const fileFormItems = props.initFormData?.filter((item: InitFormData) => item.type === 'file') || []
  for (const item of fileFormItems) {
    if (!item.fileOptions) {
      propsVerifyErrorMsg.value = 'type 為 file 的欄位必須包含 fileOptions 屬性'
      propsVerifyPassed.value = false
      return
    }
    if (item.fileOptions.singleFile && item.fileOptions.maxFileCount !== 1) {
      propsVerifyErrorMsg.value = '如果 fileOptions 中存在 singleFile 為 true，則必須包含 maxFileCount 為 1'
      propsVerifyPassed.value = false
      return
    }
  }

  propsVerifyPassed.value = true
}

// 暴露給父組件的方法
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
const dictOptionsMap = ref<Record<string, any>>({})
// 為每個 select 添加獨立的 loading 狀態
const selectLoadingMap = ref<Record<string, boolean>>({})
// 為每個帶選項的欄位創建獨立的儲存區域
const selectOptionsMap = ref<Record<string, any[]>>({})

// 設置選項的共用函數，使用 nextTick 確保 DOM 更新
async function setOptionsWithNextTick(
  fieldName: string,
  list: any[],
  labelKey: string,
  valueKey: string,
) {
  // 先設置為空數組，強制更新
  selectOptionsMap.value[fieldName] = []
  // 使用 nextTick 確保 DOM 已更新
  await nextTick()

  // 檢查是否包含 parentId
  const hasParentId = list.length > 0 && 'parentId' in list[0]
  // 檢查是否包含 sort
  const hasSort = list.length > 0 && 'sort' in list[0]

  // 如果有 sort 欄位，先進行排序
  if (hasSort) {
    list.sort((a, b) => (a.sort || 0) - (b.sort || 0))
  }

  // 獲取已經打開了 multilingual 的欄位
  const yesMultilingualFields = Object.values(queryParamsMapping.value).filter(item => item.multilingual)
  const isMultilingual = yesMultilingualFields.some(item => item.name === fieldName)

  //  如果list的某些數據已經打開了「多語言」且存在「multilingualFields」屬性，則將該條數據的「labelKey」屬性值進行替換
  list.forEach((item) => {
    if (isMultilingual && item.multilingualFields) {
      if (item.multilingualFields[labelKey]) {
        item[labelKey] = item.multilingualFields[labelKey].find((field: MultilingualFieldsVO) => field.language === languageStore.current)?.value
      }
    }
  })

  if (hasParentId) {
    // 先建立所有節點
    const nodeMap = new Map<string | number, TreeNode>()

    // 第一次遍歷：建立所有節點
    list.forEach((item: any) => {
      const node: TreeNode = {
        label: item[labelKey],
        value: item[valueKey],
        key: item[valueKey],
      }
      nodeMap.set(item[valueKey], node)
    })

    // 第二次遍歷：建立父子關係
    list.forEach((item: any) => {
      if (item.parentId) {
        const parentNode = nodeMap.get(item.parentId)
        const currentNode = nodeMap.get(item[valueKey])
        if (parentNode && currentNode) {
          if (!parentNode.children) {
            parentNode.children = []
          }
          parentNode.children.push(currentNode)
          // 如果有 sort 欄位，對子節點進行排序
          if (hasSort && parentNode.children.length > 1) {
            parentNode.children.sort((a, b) => {
              const aItem = list.find(i => i[valueKey] === a.value)
              const bItem = list.find(i => i[valueKey] === b.value)
              return (aItem?.sort || 0) - (bItem?.sort || 0)
            })
          }
        }
      }
    })

    // 找出所有根節點（沒有 parentId 的節點）
    const treeData = list
      .filter(item => !item.parentId)
      .map(item => nodeMap.get(item[valueKey]))
      .filter((node): node is TreeNode => node !== undefined)

    // 如果有 sort 欄位，對根節點進行排序
    if (hasSort) {
      treeData.sort((a, b) => {
        const aItem = list.find(i => i[valueKey] === a.value)
        const bItem = list.find(i => i[valueKey] === b.value)
        return (aItem?.sort || 0) - (bItem?.sort || 0)
      })
    }

    selectOptionsMap.value[fieldName] = treeData
  }
  else {
    // 原有的扁平結構處理
    selectOptionsMap.value[fieldName] = list.map((resultItem: any) => ({
      label: resultItem[labelKey],
      value: resultItem[valueKey],
      sort: resultItem.sort, // 保留 sort 欄位用於排序
    }))

    // 如果有 sort 欄位，進行排序
    if (hasSort) {
      selectOptionsMap.value[fieldName].sort((a, b) => (a.sort || 0) - (b.sort || 0))
    }
  }
}

// 搜索下拉框選項
const handleSearch = useDebounceFn(async (query: string, item: InitQueryParams) => {
  const fieldName = item.name

  // 如果搜索內容為空，清空選項並返回
  if (!query) {
    selectOptionsMap.value[fieldName] = []
    return
  }

  // 設置 loading 狀態為 true
  selectLoadingMap.value[fieldName] = true

  if (item.selectOptions?.api) {
    try {
      const { data: result } = await item.selectOptions.api({ [item.selectOptions.selectParam!]: query })
      if (result.list.length > 0) {
        await setOptionsWithNextTick(
          fieldName,
          result.list,
          item.selectOptions.itemMapping!.label,
          item.selectOptions.itemMapping!.value,
        )
      }
      else {
        selectOptionsMap.value[fieldName] = []
      }
    }
    finally {
      selectLoadingMap.value[fieldName] = false
    }
  }
  else {
    // 如果沒有 API，也要設置 loading 狀態為 false
    selectLoadingMap.value[fieldName] = false
  }
}, 300)

function handleResetSearch() {
  try {
    startQueryLoading()

    queryParams.value = {}

    // 為 queryParams 添加初始值
    if (props.initQueryParams && Array.isArray(props.initQueryParams)) {
      props.initQueryParams.forEach(async (item: InitQueryParams) => {
        if (item.multilingual) {
          if (!queryParams.value.multilingualFields) {
            queryParams.value.multilingualFields = []
          }
          queryParams.value.multilingualFields.push(item.name)
        }

        queryParamsMapping.value[item.name] = item
        queryParams.value[item.name] = item.value === undefined ? null : item.value

        // 如果是 select 類型且有 dictType，則獲取字典選項
        if (item.inputType === 'select' && item.dictType) {
          await getDictOptions(item.dictType)
        }

        // 如果選單類型 且有 selectOptions
        else if (item.inputType === 'select' && item.selectOptions) {
          selectLoadingMap.value[item.name] = true

          // 初始化為空數組
          selectOptionsMap.value[item.name] = []

          // 如果有 API，載入選項
          if (item.selectOptions.api) {
            try {
              const { data: result } = await item.selectOptions.api({ pageSize: 0, currentPage: 1 })
              if (result.list.length > 0) {
                await setOptionsWithNextTick(
                  item.name,
                  result.list,
                  item.selectOptions.itemMapping!.label,
                  item.selectOptions.itemMapping!.value,
                )
              }
            }
            finally {
              selectLoadingMap.value[item.name] = false
            }
          }
          else {
            selectLoadingMap.value[item.name] = false
          }
        }
      })
    }

    // 如果此時 queryParams.value 沒有 pageSize 和 currentPage，則添加
    if (queryParams.value.pageSize === undefined || queryParams.value.pageSize === null) {
      queryParams.value.pageSize = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE)
    }
    if (!queryParams.value.currentPage) {
      queryParams.value.currentPage = Number(import.meta.env.VITE_DEFAULT_CURRENT_PAGE)
    }

    // 獲取列表
    getList()
  }
  finally {
    endQueryLoading()
  }
}

// 獲取字典選項
const { dict } = useDictStore()
async function getDictOptions(dictType: string) {
  try {
    // 設置 loading 狀態為 true
    selectLoadingMap.value[dictType] = true
    const dictData = await dict(dictType)
    dictOptionsMap.value[dictType] = dictData.data()
  }
  finally {
    // 設置 loading 狀態為 false
    selectLoadingMap.value[dictType] = false
  }
}

/** 菜單 */
const selectedMenuKeys = ref<string[]>([])
const selectedMenuId = computed(() => selectedMenuKeys.value[0] || undefined) // 選中的菜單 ID
watch(selectedMenuId, () => {
  getList()
})

const menuTreeData = ref<menuTreeNode[]>([])
// 獲取菜單數據
async function getMenuData() {
  if (props.getMenuDataFunction) {
    try {
      const { data: result } = await props.getMenuDataFunction({
        status: 1,
        pageSize: 0,
      })

      // 系統當前語言
      const languageCurrent = languageStore.current

      // 如果開啟了多語言
      if (props.menuMultilingual) {
        // 將多語言欄位轉換為當前語言的值
        result.list.forEach((item: any) => {
          if (!item.multilingualFields)
            return

          // 處理多語言欄位
          Object.entries(item.multilingualFields).forEach(([field, translations]) => {
            if (item[field]) {
              // 使用型別斷言確保型別安全
              const multilangFields = translations as MultilingualFieldsVO[]
              const languageText = multilangFields.find(t => t.language === languageCurrent)?.value
              if (languageText) {
                item[field] = languageText
              }
            }
          })
        })
      }

      // 將數據轉換為樹狀結構
      menuTreeData.value = arrayToTree(result.list)

      // 默認選中第一個節點
      if (props.menuDefaultExpandRoot && menuTreeData.value && menuTreeData.value.length > 0) {
        selectedMenuKeys.value = [menuTreeData.value[0].id]
      }
    }
    catch {
    }
  }
}

/** 列表 */
const modalRef = ref()
const list = ref<TableRow[]>([])
// 控制展開的行
const expandedRowKeys = ref<string[]>([])
// 表格列定義
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
          title: t('dataTable.serialNumber'),
          key: 'index',
          align: 'center',
          fixed: 'left',
          minWidth: 80,
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

    // 處理 icon 欄位
    if ('key' in newColumn && newColumn.key === 'icon') {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          return row.icon && createIcon(row.icon, { size: 20 })
        },
      }
    }

    // 處理可複製的欄位
    if ('key' in newColumn && newColumn.copy) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          const themeVars = useThemeVars()
          if (newColumn.multilingual && !(row.multilingualFields?.[newColumn.key].length)) {
            return h('div', [
              h(CopyText, {
                value: row[newColumn.key],
              }),
              h(NPopover, {
                trigger: 'hover',
              }, {
                trigger: () => h(IconAttention, { style: { color: themeVars.value.warningColor } }),
                default: () => h('span', t('dataTable.multilingualNotSet')),
              }),
            ])
          }

          return h(CopyText, {
            value: row[newColumn.key],
          })
        },
      }
    }

    // 處理字典值欄位
    if ('key' in newColumn && newColumn.dictType) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          return h(AsyncDictLabel, {
            dictType: newColumn.dictType,
            value: row[newColumn.key],
          })
        },
      }
    }

    // 處理一般文字欄位
    if ('key' in newColumn && newColumn.multilingual) {
      return {
        ...newColumn,
        render: (row: TableRow) => {
          const themeVars = useThemeVars()
          if (!(row.multilingualFields?.[newColumn.key].length)) {
            return h('div', [
              h('span', row[newColumn.key]),
              h(NPopover, {
                trigger: 'hover',
              }, {
                trigger: () => h(IconAttention, { style: { color: themeVars.value.warningColor } }),
                default: () => h('span', t('dataTable.multilingualNotSet')),
              }),
            ])
          }
          return h('span', row[newColumn.key])
        },
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

  // 外部傳遞進來的 actions 列
  const externalActionsColumn = props.columns.find((column): column is (typeof column & { key: 'actions', render?: (row: any) => VNode }) =>
    'key' in column && column.key === 'actions',
  )

  // 操作列  - 內部的 actions 和 externalActionsColumn 合併
  const operateColumn = [
    {
      title: t('common.action'),
      align: 'center',
      key: 'actions',
      width: externalActionsColumn?.width || 280,
      render: (row: TableRow) => {
        return (
          <NSpace justify="center">
            {/* 如果存在外部的 actions 列，先渲染它的內容 */}
            {externalActionsColumn?.render?.(row)}
            {props.view && (
              <NButton
                v-hasPermi={props.permission.page}
                size="small"
                onClick={() => {
                  const parentData = findParentItem(list.value, row.parentId)
                  modalRef.value.openModal('view', row, parentData)
                }}
              >
                {t('common.check')}
              </NButton>
            )}
            {props.edit && (
              <NButton
                v-hasPermi={props.permission.update}
                size="small"
                onClick={() => {
                  const parentData = findParentItem(list.value, row.parentId)
                  modalRef.value.openModal('edit', row, parentData)
                }}
              >
                {t('common.edit')}
              </NButton>
            )}
            {props.del && (
              <NPopconfirm onPositiveClick={() => handleDelete(row)}>
                {{
                  default: () => t('common.deleteConfirm'),
                  trigger: () => (
                    <NButton
                      v-hasPermi={props.permission.delete}
                      size="small"
                      type="error"
                      loading={delBtnLoadMap.value[row.id!]}
                    >
                      {t('common.delete')}
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
// 表格引用
const tableRef = ref<InstanceType<typeof NDataTable>>()
// 檢查是否包含sort列
const hasSortColumn = computed(() => {
  return props.columns.some(column => 'key' in column && column.key === 'sort')
})
// 定義遞迴排序函數
function sortBySort(items: TableRow[]) {
  // 如果有 sort 列，則根據 sort 排序
  if (hasSortColumn.value) {
    items.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0))
    // 遞迴排序子項
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortBySort(item.children)
      }
    })
  }
  return items
}

// 獲取列表
async function getList() {
  try {
    startTableLoading()

    const params = {
      ...queryParams.value,
      ...(props.filterColumnName && props.filterColumnValue ? { [props.filterColumnName]: props.filterColumnValue.value } : {}),
    }
    if (props.showMenu && props.filterField) {
      params[props.filterField] = selectedMenuId.value
    }

    const { data: result } = await props.getFunction(params)

    // 系統當前語言
    const languageCurrent = languageStore.current

    // 將多語言欄位轉換為當前語言的值
    result.list.forEach((item: any) => {
      if (!item.multilingualFields)
        return

      // 先找出所有多語言欄位
      const multilingualColumns = props.columns
        .filter(column => 'key' in column && column.multilingual)
        .map(column => (column as { key: string }).key)

      // 直接處理有多語言欄位的屬性
      Object.entries(item.multilingualFields)
        .filter(([field]) => multilingualColumns.includes(field))
        .forEach(([field, translations]) => {
          if (item[field]) {
            // 使用型別斷言確保型別安全
            const multilangFields = translations as MultilingualFieldsVO[]
            const languageText = multilangFields.find(t => t.language === languageCurrent)?.value
            if (languageText) {
              item[field] = languageText
            }
          }
        })
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
    list.value = sortBySort(sortTreeData(arrayToTree(flattenData(result.list))))
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

/** 「新增」按鈕 */
function handleAdd() {
  if (props.showMenu && selectedMenuId.value && props.filterField) {
    const dataParams: Record<string, any> = {}
    dataParams[props.filterField] = selectedMenuId.value
    modalRef.value.openModal('add', dataParams)
    return
  }
  modalRef.value.openModal('add')
}

/** 「刪除」按鈕 */
async function handleDelete(row: TableRow) {
  try {
    if (row.children && row.children.length > 0) {
      window.$message.warning(t('dataTable.hasChildrenDeleteError'))
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

    window.$message.success(t('dataTable.deleteSuccess') + props.modalName)
  }
  catch (error) {
    window.$message.error(t('dataTable.deleteError-1') + row.id + t('dataTable.deleteError-2') + error)
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
    window.$message.warning(t('dataTable.batchDeleteError'))
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
        console.error(t('dataTable.deleteError-1') + id + t('dataTable.deleteError-2') + error)
        window.$message.error(t('dataTable.deleteError-1') + id + t('dataTable.deleteError-2'))
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
      window.$message.success(t('dataTable.batchDeleteSuccess1') + successDeletedIds.length + t('dataTable.batchDeleteSuccess2'))
    }

    // 只移除成功刪除的 ID
    checkedRowKeys.value = checkedRowKeys.value.filter(id => !successDeletedIds.includes(id))

    // 如果沒有剩餘選中項，關閉對話框
    if (checkedRowKeys.value.length === 0) {
      showBatchDeleteModalRef.value = false
    }
    else {
      // 如果有剩餘的未成功刪除的項目，顯示提示
      window.$message.warning(checkedRowKeys.value.length + t('dataTable.batchDeleteFailed'))
    }
  }
  catch {
    window.$message.error(t('dataTable.batchDeleteProcessError'))
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
          catch {
            // API調用失敗，恢復狀態為啟用
            child.status = 1
            window.$message.error(t('dataTable.blockOperationFailed') + child.id)
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
 * - 如果是新增使用者，則顯示帳號密碼提示框並將使用者加入列表
 *   如果是編輯使用者，則更新列表中對應使用者的資料
 * - 不管新增還是編輯，只要「multilingualFields」存在，則都將「list.value」中的「multilingualFields」進行更新
 */
async function tableModalSuccess(params: { modalType: ModalType, password?: string, parentId?: string, multilingualFields?: { [key: string]: MultilingualFieldsVO } } & TableRow) {
  const { modalType, parentId, multilingualFields, ...remain } = params
  if (modalType === 'add') {
    // 定義根據 sort 值插入項目的函數
    const insertItemBySortValue = (item: TableRow) => {
      const insertIndex = list.value.findIndex(existingItem => (existingItem.sort ?? Infinity) > (item.sort ?? Infinity))
      if (insertIndex === -1) {
        list.value.push(item)
      }
      else {
        list.value.splice(insertIndex, 0, item)
      }
    }

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

            // 根據 sort 值找到合適的插入位置
            const newItem: TableRow = { ...remain, parentId, multilingualFields }
            const insertIndex = items[i].children.findIndex((child: TableRow) =>
              (Number(child.sort) || 0) > (Number(newItem.sort) || 0),
            )

            if (insertIndex === -1) {
              // 如果沒有找到更大的 sort 值，則添加到末尾
              items[i].children.push(newItem)
            }
            else {
              // 在找到的位置插入
              items[i].children.splice(insertIndex, 0, newItem)
            }
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
        insertItemBySortValue({ ...remain, multilingualFields })
      }
    }
    else {
      // 沒有指定父項 直接添加
      insertItemBySortValue({ ...remain, multilingualFields })
    }
    emit('createSuccess', { ...remain, multilingualFields })
  }

  if (modalType === 'edit') {
    // 檢查是否需要重新定位項目（如果 parentId 有變化或者變為 null/undefined）
    let needReposition = false

    // 遞迴尋找項目的當前 parentId
    const findCurrentParentId = (items: TableRow[]): string | null | undefined => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === remain.id) {
          return items[i].parentId
        }

        if (items[i].children && items[i].children.length > 0) {
          const result = findCurrentParentId(items[i].children)
          if (result !== null && result !== undefined) {
            return result
          }
        }
      }
      return null
    }

    // 先檢查項目是否在列表的最外層
    const isInRootLevel = list.value.some(item => item.id === remain.id)
    let currentParentId: string | null | undefined = null

    if (!isInRootLevel) {
      // 如果不在最外層，獲取當前的 parentId
      currentParentId = findCurrentParentId(list.value)
    }

    // 如果 parentId 與當前項的 parentId 不同，或者 parentId 變為 null/undefined，需要重新定位
    if (currentParentId !== parentId) {
      needReposition = true
    }

    // 如果 currentParentId 和 parentId 都為 null/undefined，則不需要重新定位
    if (!currentParentId && !parentId) {
      needReposition = false
    }

    if (needReposition) {
      // 先找到並移除當前項
      let removedItem: TableRow | null = null
      let removed = false

      // 遞迴尋找並移除項目的函數
      const findAndRemoveRecursively = (items: TableRow[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === remain.id) {
            // 找到匹配項，保存它並從當前位置移除
            removedItem = { ...items[i], ...remain, multilingualFields }
            if (parentId) {
              removedItem.parentId = parentId
            }
            else {
              // 如果 parentId 為 null 或 undefined，確保從對象中移除
              delete removedItem.parentId
            }
            items.splice(i, 1)
            return true
          }

          // 如果當前項有子項，則遞迴搜尋
          if (items[i].children && items[i].children.length > 0) {
            const found = findAndRemoveRecursively(items[i].children)
            if (found) {
              // 如果子項列表為空，清理它
              if (items[i].children.length === 0) {
                items[i].children = undefined
              }
              return true
            }
          }
        }
        return false
      }

      // 從最外層尋找並移除
      const index = list.value.findIndex((item: TableRow) => item.id === remain.id)
      if (index > -1) {
        removedItem = { ...list.value[index], ...remain, multilingualFields }
        if (parentId) {
          removedItem.parentId = parentId
        }
        else {
          // 如果 parentId 為 null 或 undefined，確保從對象中移除
          delete removedItem.parentId
        }
        list.value.splice(index, 1)
        removed = true
      }
      else {
        // 如果外層沒找到，則遞迴搜尋子項
        removed = findAndRemoveRecursively(list.value)
      }

      // 如果成功移除了項目，則根據 parentId 放置到正確位置
      if (removed && removedItem) {
        if (parentId) {
          // 如果有指定新的父項，添加到新的父項下
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

                // 根據 sort 值找到合適的插入位置
                const insertIndex = items[i].children.findIndex((child: TableRow) =>
                  (Number(child.sort) || 0) > (Number(removedItem!.sort) || 0),
                )

                if (insertIndex === -1) {
                  // 如果沒有找到更大的 sort 值，則添加到末尾
                  items[i].children.push(removedItem!)
                }
                else {
                  // 在找到的位置插入
                  items[i].children.splice(insertIndex, 0, removedItem!)
                }
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
            // 定義根據 sort 值插入項目的函數
            const insertItemBySortValue = (item: TableRow) => {
              const insertIndex = list.value.findIndex(existingItem => (existingItem.sort ?? Infinity) > (item.sort ?? Infinity))
              if (insertIndex === -1) {
                list.value.push(item)
              }
              else {
                list.value.splice(insertIndex, 0, item)
              }
            }

            insertItemBySortValue(removedItem)
          }
        }
        else {
          // 如果沒有指定父項（parentId 為 null 或 undefined），則添加到最外層
          const insertItemBySortValue = (item: TableRow) => {
            const insertIndex = list.value.findIndex(existingItem => (existingItem.sort ?? Infinity) > (item.sort ?? Infinity))
            if (insertIndex === -1) {
              list.value.push(item)
            }
            else {
              list.value.splice(insertIndex, 0, item)
            }
          }

          insertItemBySortValue(removedItem)
        }
      }
    }
    else {
      /** 遞迴更新資料表項目 */
      const updateRecursively = (items: TableRow[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === remain.id) {
            // 找到匹配項，進行更新
            items[i] = { ...items[i], ...remain, multilingualFields }
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
        list.value[index] = { ...list.value[index], ...remain, multilingualFields }
      }
      else {
        // 如果外層沒找到，則遞迴搜尋子項
        updateRecursively(list.value)
      }
    }

    /** status 是0的話同時 block 子項 */
    if (remain.status === 0) {
      await updateChildrenStatus(remain)
    }

    emit('editSuccess', { ...remain, parentId, multilingualFields })
  }
}

// 處理重新排序
function handleResort() {
  if (list.value && list.value.length > 0) {
    const existSort = list.value.some(item => item.sort)
    if (existSort) {
      list.value = sortBySort([...list.value])
    }
  }
}

onMounted(async () => {
  await propsVerify()

  // 打開載入狀態
  await startTableLoading()
  await startQueryLoading()

  // 查詢菜單
  await getMenuData()
  await handleResetSearch()
})
</script>

<template>
  <n-result
    v-if="!propsVerifyPassed"
    status="error"
    :title="t('dataTable.propsVerifyError')"
    :description="propsVerifyErrorMsg"
  />

  <n-flex v-else>
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
                    :placeholder="item.placeholder || t('common.inputPlaceholder')"
                  />
                  <n-input-number
                    v-if="item.inputType === 'input-number'" v-model:value="queryParams[item.name]"
                    :placeholder="item.placeholder || t('common.inputPlaceholder')"
                  />
                  <n-select
                    v-if="item.inputType === 'select' && item.dictType"
                    v-model:value="queryParams[item.name]"
                    :options="dictOptionsMap[item.dictType]"
                    :placeholder="item.placeholder || t('common.selectPlaceholder')"
                    :loading="selectLoadingMap[item.dictType]"
                    clearable
                    @update:value="getList"
                  />
                  <!-- 如果數據中包含 children，使用樹狀選擇器 -->
                  <n-tree-select
                    v-else-if="item.inputType === 'select' && item.selectOptions && selectOptionsMap[item.name]?.some(option => option.children)"
                    v-model:value="queryParams[item.name]"
                    :options="selectOptionsMap[item.name]"
                    filterable
                    remote
                    :loading="selectLoadingMap[item.name]"
                    :clear-filter-after-select="false"
                    :placeholder="item.placeholder || t('dataTable.searchPlaceholder')"
                    :empty="selectLoadingMap[item.name] ? t('dataTable.searching') : t('dataTable.noMatchingOptions')"
                    key-field="key"
                    label-field="label"
                    children-field="children"
                    clearable
                    :multiple="item.selectOptions?.multiple"
                    @search="(query: string) => handleSearch(query, item)"
                    @update:value="getList"
                  />
                  <!-- 否則使用普通選擇器 -->
                  <n-select
                    v-else-if="item.inputType === 'select' && item.selectOptions"
                    v-model:value="queryParams[item.name]"
                    :options="selectOptionsMap[item.name]"
                    filterable
                    remote
                    :loading="selectLoadingMap[item.name]"
                    :clear-filter-after-select="false"
                    :placeholder="item.placeholder || t('common.selectPlaceholder')"
                    :empty="selectLoadingMap[item.name] ? t('dataTable.searching') : t('dataTable.noMatchingOptions')"
                    clearable
                    :multiple="item.selectOptions?.multiple"
                    @search="(query: string) => handleSearch(query, item)"
                    @update:value="getList"
                  />
                </n-form-item>
              </template>
              <n-flex class="ml-auto">
                <NButton type="primary" @click="getList">
                  <template #icon>
                    <icon-park-outline-search />
                  </template>
                  {{ t('common.search') }}
                </NButton>
                <NButton strong secondary @click="handleResetSearch">
                  <template #icon>
                    <icon-park-outline-redo />
                  </template>
                  {{ t('common.reset') }}
                </NButton>
              </n-flex>
            </n-flex>
          </n-form>
        </n-spin>
      </n-card>

      <n-card class="flex-1">
        <template #header>
          <n-flex justify="space-between">
            <div>
              <NButton v-if="add" v-hasPermi="permission.create" type="primary" @click="handleAdd">
                <template #icon>
                  <icon-park-outline-add-one />
                </template>
                {{ t('common.add') + props.modalName }}
              </NButton>

              <NButton v-if="del" v-hasPermi="permission.delete" type="error" class="m-l-10px" :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete">
                <template #icon>
                  <icon-park-outline-delete />
                </template>
                {{ t('common.batchDelete') }}
              </NButton>
            </div>
          </n-flex>
        </template>
        <n-flex>
          <n-card v-if="showMenu" class="w-70">
            <n-tree
              v-model:selected-keys="selectedMenuKeys"
              block-line
              :data="menuTreeData"
              key-field="id"
              label-field="name"
              selectable
            />
          </n-card>
          <NSpace vertical class="flex-1">
            <n-data-table
              ref="tableRef"
              v-model:checked-row-keys="checkedRowKeys"
              v-model:expanded-row-keys="expandedRowKeys"
              :columns="columns"
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
        </n-flex>
      </n-card>

      <TableModal
        ref="modalRef"
        :modal-width="modalWidth"
        :modal-form-label-width="modalFormLabelWidth"
        :modal-name="modalName"
        :multilingual-fields-modal-width="multilingualFieldsModalWidth"
        :update-function="updateFunction || undefined"
        :create-function="createFunction || undefined"

        :rules="rules"
        :init-form-data="initFormData"

        @success="tableModalSuccess"
        @resort="handleResort"
      />

      <!-- 批次刪除確認 Modal -->
      <n-modal
        v-model:show="showBatchDeleteModalRef"
        preset="dialog"
        :title="t('common.confirmDelete')"
        :positive-text="t('common.confirm')"
        :negative-text="t('common.cancel')"
        :loading="batchDeleteLoading"
        @positive-click="confirmBatchDelete"
        @negative-click="() => { showBatchDeleteModalRef = false }"
      >
        <template #default>
          {{ t('dataTable.batchDeleteModalTitle1') + checkedRowKeys.length + t('dataTable.batchDeleteModalTitle2') }}
        </template>
      </n-modal>
    </NSpace>
  </n-flex>
</template>

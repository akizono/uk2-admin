<script setup lang="ts">
import type { Condition, ConditionGroup, InitFormData, ModalType, TableRow } from '../type'
import type { MultilingualFieldsVO } from '@/api/system/multilingual-fields/'
import type { FormRules } from 'naive-ui'

import { MultilingualFieldsApi } from '@/api/system/multilingual-fields/'
import { useBoolean } from '@/hooks'
import { useDictStore } from '@/store'
import { useLanguageStore } from '@/store/model/language'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  modalWidth?: string // 模態框的寬度
  modalFormLabelWidth?: string // 模態框表單label的寬度
  modalName?: string // 模態框名稱
  multilingualFieldsModalWidth?: string // 多語言欄位彈出視窗的寬度

  filterColumnName?: string // 過濾條件的欄位名稱
  filterColumnValue?: ComputedRef<string> // 過濾條件的欄位 ID（ 所有新增和查詢的介面都會自動帶上{[filterColumnName]:filterColumnValue.value} ）

  updateFunction?: (...args: any[]) => Promise<any> // 更新列表數據的函數
  createFunction?: (...args: any[]) => Promise<any> // 新增列表數據的函數

  initFormData?: InitFormData[] // 初始化表單數據
  rules?: FormRules // 表單驗證規則
}>()

const emit = defineEmits(['success', 'resort'])

const languageStore = useLanguageStore()

// 樹狀結構的節點
interface TreeNode {
  label: string
  value: string | number
  key: string | number
  children?: TreeNode[]
}

defineExpose({
  openModal,
})

/** 評估單一條件 */
function evaluateCondition(condition: Condition, formData: Record<string, any>): boolean {
  const { field, operator, value } = condition
  const fieldValue = formData[field]

  switch (operator) {
    case 'eq':
      return fieldValue === value
    case 'neq':
      return fieldValue !== value
    case 'gt':
      return fieldValue > value
    case 'gte':
      return fieldValue >= value
    case 'lt':
      return fieldValue < value
    case 'lte':
      return fieldValue <= value
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue)
    case 'nin':
      return Array.isArray(value) && !value.includes(fieldValue)
    default:
      return false
  }
}
/** 評估條件組 */
function evaluateConditionGroup(group: ConditionGroup, formData: Record<string, any>): boolean {
  const results = group.conditions.map((condition) => {
    if ('logic' in condition) {
      return evaluateConditionGroup(condition, formData)
    }
    return evaluateCondition(condition, formData)
  })

  return group.logic === 'and'
    ? results.every(result => result)
    : results.some(result => result)
}
/** 評估顯示條件 */
function evaluateShowCondition(condition: Condition | ConditionGroup | undefined, formData: Record<string, any>): boolean {
  if (!condition)
    return true

  if ('logic' in condition) {
    return evaluateConditionGroup(condition, formData)
  }

  return evaluateCondition(condition, formData)
}

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制提交的loading
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

// 為每個帶選項的欄位創建獨立的儲存區域
const selectOptionsMap = ref<Record<string, any[]>>({})
// 為每個 select 添加獨立的 loading 狀態
const selectLoadingMap = ref<Record<string, boolean>>({})
// 為每個 radio 添加獨立的 loading 狀態
const radioLoadingMap = ref<Record<string, boolean>>({})
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
const handleSearch = useDebounceFn(async (query: string, item: InitFormData) => {
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

// 獲取字典選項
const { dict } = useDictStore()
const dictOptionsMap = ref<Record<string, any>>({})
async function getDictOptions(dictType: string) {
  const dictData = await dict(dictType)
  dictOptionsMap.value[dictType] = dictData.data()
  console.log(dictType, dictOptionsMap.value[dictType])
}

// 表單數據
const formRef = ref()
const formData = ref<Record<string, any>>({})
const formDataMapping = ref<Record<string, InitFormData>>({})
// 本地的驗證規則
const localRules = ref<FormRules>({})
// 傳進來的行數據(用於傳輸到「MultilingualFields.vue」中使用)
const rowData = ref<TableRow | null>(null)

// 監聽表單數據變化，處理 valueGenerator
watch(formData, (newVal) => {
  // 遍歷所有表單項
  Object.values(formDataMapping.value).forEach((item) => {
    // 如果有 valueGenerator 配置
    if (item.valueGenerator) {
      // 檢查是否有被監聽的欄位發生變化
      const hasChange = item.valueGenerator.watchFields.some(
        field => newVal[field] !== undefined,
      )

      if (hasChange) {
        // 根據不同的規則類型生成值
        const rule = item.valueGenerator.rule
        let generatedValue = ''

        switch (rule.type) {
          case 'template': {
            // 處理模板字串
            if (typeof rule.value === 'string') {
              generatedValue = rule.value.replace(/\$\{(\w+)\}/g, (_: string, field: string) => {
                return newVal[field] || ''
              })
            }
            break
          }

          case 'condition': {
            // 處理條件判斷
            if (Array.isArray(rule.value)) {
              for (const condition of rule.value) {
                if (condition.when) {
                  // 創建一個函數來評估條件
                  // eslint-disable-next-line no-new-func
                  const evalFn = new Function(...Object.keys(newVal), `return ${condition.when}`)
                  if (evalFn(...Object.values(newVal))) {
                    generatedValue = condition.then.replace(/\$\{(\w+)\}/g, (_: string, field: string) => {
                      return newVal[field] || ''
                    })
                    break
                  }
                }
                else {
                  // 沒有 when 條件的就是預設值
                  generatedValue = condition.then.replace(/\$\{(\w+)\}/g, (_: string, field: string) => {
                    return newVal[field] || ''
                  })
                }
              }
            }
            break
          }

          case 'expression': {
            // 處理數學運算
            if (typeof rule.value === 'string') {
              try {
                // eslint-disable-next-line no-new-func
                const evalFn = new Function(...Object.keys(newVal), `return ${rule.value}`)
                generatedValue = evalFn(...Object.values(newVal))
              }
              catch (error) {
                console.error('Expression evaluation error:', error)
                generatedValue = ''
              }
            }
            break
          }
        }

        // 更新生成的值
        formData.value[item.name] = generatedValue
      }
    }
  })
}, { deep: true })

// 監聽 type 值的變化，清除不符合顯示條件的表單項目值
watch(() => formData.value.type, (newType) => {
  if (newType === undefined)
    return

  // 遍歷所有表單項目
  Object.entries(formDataMapping.value).forEach(([key, item]) => {
    // 如果有 showCondition 且條件不滿足
    if (item.showCondition && !evaluateShowCondition(item.showCondition, formData.value)) {
      // 清除該表單項目的值
      formData.value[key] = undefined
    }
  })
})

// 表單類型與標題
const modalType = shallowRef<ModalType | null>(null)
const modalTitle = computed(() => {
  if (!modalType.value)
    return ''
  return {
    add: '新增',
    view: '檢視',
    edit: '編輯',
  }[modalType.value] + (props.modalName ?? '')
})

/**
 * 處理ID相關的資料映射
 * 為什麼這麼做？
 * 例如，當我們從父組件打開TableModal時 ，leaderUserId在選項未載入出來，這時候需要拿從後端返回的leaderUser的數據來進行映射
 * 但是我們新建和編輯後的數據是沒有leaderUser的，這時候我們需要手動填充返回父組件
 * @param baseData - 基礎資料物件
 * @param sourceData - 來源資料物件（用於映射）
 * @returns 處理後的資料物件
 */
function handleIdDataMapping(baseData: Record<string, any>, sourceData: Record<string, any>): Record<string, any> {
  const result = { ...baseData }

  //  遍歷 sourceData 物件中的所有屬性
  for (const key in sourceData) {
    // 檢查屬性名稱是否以 'Id' 結尾，且不是 'parentId'
    if (key.endsWith('Id') && key !== 'parentId') {
      // 移除屬性名稱中的 'Id' 後綴
      const keyWithoutId = key.replace('Id', '')
      // 為什麼要加這個if？因為keyWithoutId篩選到的屬性不一定每個都是「選項」
      if (selectOptionsMap.value[key]) {
      // 在 result 中建立新的物件結構
        result[keyWithoutId] = {
        // 使用 formDataMapping 中定義的標籤映射作為鍵名
          [formDataMapping.value[key].selectOptions!.itemMapping!.label]: selectOptionsMap.value[key][0].label,
          // 儲存選項的實際值（ID）// 為什麼是0？因為selectOptionsMap.value[key]的值是通過精確尋找到的，且這個值通常是唯一的，所以我們可以沒有顧慮的採用第一個元素 所以寫0
          id: selectOptionsMap.value[key][0].value,
        }
      }
    }
  }

  return result
}

// 打開設置多語言欄位的彈出視窗
const multilingualFieldsRef = ref()
function showMultilingualModal(item: InitFormData) {
  // eslint-disable-next-line ts/no-use-before-define
  multilingualFieldsRef.value.openModal(modalType.value, item, multilingualFields.value)
}

// 接收多語言的提交
const multilingualFields = ref<Record<string, any>>({})
function handleMultilingualSubmit(data: { field: string, params: MultilingualFieldsVO[] }) {
  multilingualFields.value[data.field] = data.params
  // 獲取當前選中的語言
  const currentLanguage = languageStore.current
  // 將當前語言數據更新到表單中
  formData.value[data.field] = multilingualFields.value[data.field].find((item: MultilingualFieldsVO) => item.language === currentLanguage)?.value
}

// 處理表單數據
function processFormData() {
  // 創建一個新的對象來儲存處理後的數據
  const processedData: Record<string, any> = { ...formData.value }

  // 處理所有欄位，去掉識別符
  for (const key in processedData) {
    const regex = /-\$\$repeat\$\$-\d+$/
    if (regex.test(key)) {
      const originalKey = key.replace(regex, '')
      if (!formDataMapping.value[key]?.showCondition || evaluateShowCondition(formDataMapping.value[key].showCondition, formData.value)) {
        processedData[originalKey] = processedData[key]
      }
      delete processedData[key]
    }
  }

  // 處理多語言欄位
  const newMFData: Record<string, MultilingualFieldsVO[]> = {}
  for (const key in formDataMapping.value) {
    const item = formDataMapping.value[key]
    if (item.multilingual) {
      // 只儲存需要提交的多語言欄位
      newMFData[item.name] = multilingualFields.value[item.name]
      // 將是「多語言欄位」的欄位的值修改為「多語言欄位」的fieldId
      processedData[item.name] = multilingualFields.value[item.name][0].fieldId
    }
  }
  multilingualFields.value = newMFData

  return processedData
}

// 新增
async function add() {
  const processedData = processFormData()
  const { id, ...remain } = processedData

  // 建立多語言欄位
  for (const key in multilingualFields.value) {
    const itemArray = multilingualFields.value[key]
    await MultilingualFieldsApi.createMultilingualFieldsBatch(itemArray)

    // 將 processedData 中的多語言欄位還原為「當前選擇語言」的值，用於 DataTable 中表格的回顯
    processedData[key] = itemArray.find((item: MultilingualFieldsVO) => item.language === languageStore.current)?.value
  }

  const { data } = await props.createFunction!({
    ...remain,
    ...(props.filterColumnName && props.filterColumnValue ? { [props.filterColumnName]: props.filterColumnValue.value } : {}),
  })

  const emitData = handleIdDataMapping(
    {
      modalType: modalType.value!,
      ...processedData,
      ...data,
    },
    remain,
  )
  emit('success', emitData)
  // 觸發重新排序
  emit('resort')
}

// 編輯
async function edit() {
  const processedData = processFormData()

  // 過濾掉禁止編輯的欄位
  const { isDeleted, creator, createTime, updater, updateTime, ...remain } = processedData
  for (const key of Object.keys(formDataMapping.value)) {
    const item = formDataMapping.value[key]
    if (item.disableUpdate)
      delete remain[key]
  }

  // 更新多語言欄位
  for (const key in multilingualFields.value) {
    const itemArray = multilingualFields.value[key]

    const updateItemArray: MultilingualFieldsVO[] = [] // 待更新
    const addItemArray: MultilingualFieldsVO[] = [] // 待新增
    itemArray.forEach(async (item: MultilingualFieldsVO) => {
      if (item.ifNewLanguage) {
        delete item.ifNewLanguage
        addItemArray.push(item)
      }
      else {
        delete item.ifNewLanguage
        updateItemArray.push(item)
      }
    })
    await MultilingualFieldsApi.createMultilingualFieldsBatch(addItemArray)
    await MultilingualFieldsApi.updateMultilingualFieldsBatch(updateItemArray)

    // 將 processedData 中的多語言欄位還原為「當前選擇語言」的值，用於 DataTable 中表格的回顯
    processedData[key] = itemArray.find((item: MultilingualFieldsVO) => item.language === languageStore.current)?.value
  }

  const { message } = await props.updateFunction!({ ...remain })
  window.$message.success(message)

  const emitData = handleIdDataMapping(
    {
      modalType: modalType.value!,
      ...processedData,
    },
    processedData,
  )

  emit('success', emitData)
  // 觸發重新排序
  emit('resort')
}

// 提交
async function submitModal() {
  try {
    // 驗證表單
    await formRef.value?.validate()

    // 如果id和parentId相同，則提示不能將自己設為父級
    if (formData.value.id && formData.value.parentId && (formData.value.id === formData.value.parentId)) {
      window.$message.error('不能將自己設為父級')
      return
    }

    // 如果某個欄位需要設置多語言，則檢查是否完成全部語言的設置
    for (const key in formDataMapping.value) {
      const item = formDataMapping.value[key]
      if (item.multilingual) {
        if (!multilingualFields.value[item.name]) {
          window.$message.error(`請填寫「${item.label}」的多語言欄位`)
          return
        }
      }
    }

    startLoading()

    if (modalType.value === 'add') {
      await add()
      closeModal()
    }

    else if (modalType.value === 'edit') {
      await edit()
      closeModal()
    }
  }
  catch {
    endLoading()
  }
}

// 重設表單數據
function resetFormData(data?: TableRow, parent?: TableRow) {
  // 重設表單數據
  formData.value = {}
  formDataMapping.value = {}
  selectOptionsMap.value = {}
  selectLoadingMap.value = {} // 重設搜索 loading 狀態
  radioLoadingMap.value = {} // 重設 radio loading 狀態
  multilingualFields.value = {} // 重設多語言欄位

  if (data)
    rowData.value = data // 行數據

  // 重設本地驗證規則
  localRules.value = props.rules ? { ...props.rules } : {}

  // 初始化表單數據
  if (props.initFormData && Array.isArray(props.initFormData)) {
    // 檢查重複的 name 並添加識別符
    const nameCount = new Map<string, number>()
    props.initFormData.forEach((item: InitFormData) => {
      const originalName = item.name
      if (nameCount.has(originalName)) {
        const count = nameCount.get(originalName)! + 1
        nameCount.set(originalName, count)
        item.name = `${originalName}-$$repeat$$-${count}`
      }
      else {
        nameCount.set(originalName, 1)
      }
    })

    props.initFormData.forEach(async (item: InitFormData) => {
      formData.value[item.name] = item.value
      formDataMapping.value[item.name] = item

      // 如果有 rulesType ，添加驗證類型屬性
      if (item.rulesType) {
        localRules.value[item.name] = {
          ...(localRules.value[item.name.includes('-$$repeat$$-') ? item.name.replace(/-\$\$repeat\$\$-\d+$/, '') : item.name] || {}),
          type: item.rulesType as 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'integer',
        }
      }

      // 如果是多語言欄位，則添加多語言欄位
      // 這裡的language、fieldId、value三個屬性需要和「MultilingualFields.vue - handleSubmit()」的params的屬性保持一致
      if (item.multilingual) {
        multilingualFields.value[item.name] = rowData.value?.multilingualFields[item.name]
        // multilingualFields.value[item.name] = rowData.value?.multilingualFields[item.name].map((item: MultilingualFieldsVO) => ({
        //   language: item.language,
        //   fieldId: item.fieldId,
        //   value: item.value,
        // }))
      }

      // 如果是 radio 類型且有 dictType
      if (item.type === 'radio' && item.dictType) {
        radioLoadingMap.value[item.name] = true
        await getDictOptions(item.dictType)
        radioLoadingMap.value[item.name] = false
      }
      // 如果是 radio 類型且有 selectOptions
      else if (item.type === 'radio' && item.selectOptions?.api && item.selectOptions?.itemMapping?.label && item.selectOptions?.itemMapping?.value) {
        radioLoadingMap.value[item.name] = true
        try {
          const { data: result } = await item.selectOptions.api({ pageSize: 0, currentPage: 1 })
          console.log('result', result)
          if (result.list.length > 0) {
            await setOptionsWithNextTick(
              item.name,
              result.list,
              item.selectOptions.itemMapping.label,
              item.selectOptions.itemMapping.value,
            )
          }
        }
        finally {
          radioLoadingMap.value[item.name] = false
        }
      }
      // 如果是 select 類型且有 dictType
      else if (item.type === 'select' && item.dictType) {
        selectLoadingMap.value[item.name] = true
        await getDictOptions(item.dictType)
        selectLoadingMap.value[item.name] = false
      }
      // 如果選單類型 且有 selectOptions
      else if (item.type === 'select' && item.selectOptions) {
        /**
         * 由於 selectOptionsMap.value 初始化時沒有數據，n-select 或者 n-tree-select 組件會直接顯示ID
         * 如果data如果可以拿到ID的具體數據的話， 我們可以先將當前ID的lable和value塞進去
         * 這樣在網速正常的情況下，使用者可以一進來就看到label
         */

        // 通常「某ID」是從「某數據」查詢過來的，如果「某數據」也在介面的返回值中，則可以透過去掉「某Id」的「Id」字串來獲取
        const itemNameMinusId = item.name.replace('Id', '')
        if (data && data![itemNameMinusId] && itemNameMinusId) {
          selectOptionsMap.value[item.name] = [
            {
              label: data![itemNameMinusId][item.selectOptions!.itemMapping!.label],
              value: data![itemNameMinusId][item.selectOptions!.itemMapping!.value],
            },
          ]
        }

        // 如果data中存在parentId這個屬性
        else if (data && parent) {
          selectOptionsMap.value[item.name] = [
            {
              label: parent.name,
              value: parent.id,
            },
          ]
        }

        // 如果拿不到ID的具體數據的話， 則需要初始化一個空數組
        else {
          selectOptionsMap.value[item.name] = []
        }

        // 如果懶載入已開放
        if (item.selectOptions?.lazy) {
          // 初始化為非 loading 狀態
          selectLoadingMap.value[item.name] = false
        }

        // 如果懶載入未開放 則載入全部選項
        else {
          // 設置 loading 狀態為 true
          selectLoadingMap.value[item.name] = true

          try {
            const { data: result } = await item.selectOptions!.api({ pageSize: 0, currentPage: 1 })
            if (result.list.length > 0) {
              await setOptionsWithNextTick(
                item.name,
                result.list,
                item.selectOptions!.itemMapping!.label,
                item.selectOptions!.itemMapping!.value,
              )
            }
          }
          finally {
            selectLoadingMap.value[item.name] = false
          }
        }
      }
    })
  }

  // 如果傳入了數據
  if (data) {
    // 將數據填充到表單中(通常只有新增和編輯時會傳入數據)
    for (const key in formData.value) {
      // 去掉識別符來匹配原始數據
      const originalKey = key.replace(/-\$\$repeat\$\$-\d+$/, '')
      formData.value[key] = data[originalKey]

      // 如果數據是數字，則將數據轉換為數字
      if (formDataMapping.value[key].type === 'input-number') {
        formData.value[key] = Number(formData.value[key])
      }
    }

    // 回填多語言欄位
    // for (const key in formDataMapping.value) {
    //   const item = formDataMapping.value[key]
    //   if (item.multilingual) {
    //     console.log('item', item)
    //     console.log()
    //   }
    // }
  }
}

// 打開彈出視窗
// 如果parent存在，則表示是子級的彈出視窗
async function openModal(type: ModalType, data?: TableRow, parent?: TableRow) {
  modalType.value = type
  showModal()
  resetFormData(data, parent)
}

// 關閉彈出視窗
function closeModal() {
  endLoading()
  hiddenModal()
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible"
      :mask-closable="false"
      preset="card"
      :title="modalTitle"
      :style="{
        width: modalWidth || '700px',
      }"
      :segmented="{
        content: true,
        action: true,
      }"
    >
      <div>{{ formData }}</div>
      <div>{{ multilingualFields }}</div>
      <template v-if="modalType === 'view'">
        <n-descriptions :column="2" bordered label-placement="left">
          <template v-for="(item, key) in formDataMapping" :key="key">
            <n-descriptions-item v-if="!item.hidden && evaluateShowCondition(item.showCondition, formData)" :label="item.label" :span="item.span || 1">
              <template v-if="item.type === 'switch'">
                {{ formData[item.name] === 1 ? '啟用' : '停用' }}
              </template>
              <template v-else>
                {{ formData[item.name] }}
              </template>
            </n-descriptions-item>
          </template>
        </n-descriptions>
      </template>

      <n-form v-else ref="formRef" :rules="localRules" label-placement="left" :model="formData" :label-width="modalFormLabelWidth || 100">
        <n-grid :cols="2" :x-gap="18">
          <template v-for="item in formDataMapping" :key="item.name">
            <n-form-item-grid-item
              v-if="!item.hidden && evaluateShowCondition(item.showCondition, formData)"
              :span="item.span"
              :path="item.name"
            >
              <template #label>
                {{ item.label }}
                <HelpInfo v-if="item.helpInfo" :message="item.helpInfo" />
              </template>

              <n-input-group>
                <n-input-group-label v-if="item.inputPrefix">
                  {{ item.inputPrefix }}
                </n-input-group-label>

                <n-input v-if="item.type === 'input' && item.multilingual" v-model:value="formData[item.name]" readonly class="multilingual-input" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" :placeholder="item.placeholder" @click="showMultilingualModal(item)" />
                <n-input v-else-if="item.type === 'input' && !item.multilingual" v-model:value="formData[item.name]" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" :placeholder="item.placeholder" />
                <n-input v-else-if="item.type === 'textarea'" v-model:value="formData[item.name]" type="textarea" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" :placeholder="item.placeholder" />
                <n-input-number v-else-if="item.type === 'input-number'" v-model:value="formData[item.name]" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" :placeholder="item.placeholder" />
                <n-switch v-else-if="item.type === 'switch'" v-model:value="formData[item.name]" :checked-value="1" :unchecked-value="0" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" />
                <template v-else-if="item.type === 'select'">
                  <!-- 如果數據中包含 children，使用樹狀選擇器 -->
                  <n-tree-select
                    v-if="selectOptionsMap[item.name]?.[0]?.children"
                    v-model:value="formData[item.name]"
                    :options="selectOptionsMap[item.name]"
                    :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')"
                    filterable
                    remote
                    :loading="selectLoadingMap[item.name]"
                    :clear-filter-after-select="false"
                    :placeholder="item.placeholder || '請輸入關鍵字搜索'"
                    :empty="selectLoadingMap[item.name] ? '搜索中...' : '無符合條件的選項'"
                    key-field="key"
                    label-field="label"
                    children-field="children"
                    @search="(query: string) => handleSearch(query, item)"
                  />
                  <!-- 否則使用普通選擇器 -->
                  <n-select
                    v-else
                    v-model:value="formData[item.name]"
                    :options="item.dictType ? dictOptionsMap[item.dictType] : selectOptionsMap[item.name]"
                    :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')"
                    filterable
                    remote
                    :loading="selectLoadingMap[item.name]"
                    :clear-filter-after-select="false"
                    :placeholder="item.placeholder"
                    :empty="selectLoadingMap[item.name] ? '搜索中...' : '無符合條件的選項'"
                    @search="(query: string) => handleSearch(query, item)"
                  />
                </template>
                <n-radio-group v-else-if="item.type === 'radio'" v-model:value="formData[item.name]" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')">
                  <n-space>
                    <template v-if="radioLoadingMap[item.name]">
                      <n-skeleton text :repeat="3" :width="60" />
                    </template>
                    <template v-else-if="item.dictType && dictOptionsMap[item.dictType]">
                      <n-radio v-for="option in dictOptionsMap[item.dictType]" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </n-radio>
                    </template>
                    <template v-else-if="item.selectOptions">
                      <n-radio v-for="option in selectOptionsMap[item.name]" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </n-radio>
                    </template>
                  </n-space>
                </n-radio-group>
                <icon-select v-else-if="item.type === 'icon-select'" v-model:value="formData[item.name]" :disabled="(item.disableEditInput && modalType === 'edit') || (item.disableAddInput && modalType === 'add')" />
                <n-input-group-label v-if="item.inputSuffix">
                  {{ item.inputSuffix }}
                </n-input-group-label>
              </n-input-group>
            </n-form-item-grid-item>
          </template>
        </n-grid>
      </n-form>
      <template #action>
        <n-space justify="center">
          <n-button type="primary" :loading="submitLoading" @click="submitModal">
            提交
          </n-button>
          <n-button @click="closeModal">
            取消
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <MultilingualFields ref="multilingualFieldsRef" :multilingual-fields-modal-width="multilingualFieldsModalWidth" @submit="handleMultilingualSubmit" />
  </div>
</template>

<style scoped>
:deep(.multilingual-input) {
  cursor: pointer;
}

:deep(.multilingual-input .n-input__input-el) {
  cursor: pointer !important;
}
</style>

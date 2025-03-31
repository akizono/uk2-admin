<script setup lang="ts">
import type { InitFormData, ModalType, TableRow } from '../type'
import type { FormRules } from 'naive-ui'

import { useBoolean } from '@/hooks'
import { useDictStore } from '@/store'
import { useDebounceFn } from '@vueuse/core'

// 樹狀結構的節點
interface TreeNode {
  label: string
  value: string | number
  key: string | number
  children?: TreeNode[]
}

const props = defineProps<{
  modalWidth?: string // 模態框的寬度
  modalFormLabelWidth?: string // 模態框表單label的寬度
  modalName?: string // 模態框名稱

  filterColumnName?: string // 過濾條件的欄位名稱
  filterColumnValue?: ComputedRef<string> // 過濾條件的欄位 ID（ 所有新增和查詢的介面都會自動帶上{[filterColumnName]:filterColumnValue.value} ）

  updateFunction?: (...args: any[]) => Promise<any> // 更新列表數據的函數
  createFunction?: (...args: any[]) => Promise<any> // 新增列表數據的函數

  initFormData?: InitFormData[] // 初始化表單數據
  rules?: FormRules // 表單驗證規則
}>()

const emit = defineEmits(['success'])

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制提交的loading
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

// 為每個帶選項的欄位創建獨立的儲存區域
const optionsMap = ref<Record<string, any[]>>({})
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
  optionsMap.value[fieldName] = []
  // 使用 nextTick 確保 DOM 已更新
  await nextTick()

  // 檢查是否包含 parentId
  const hasParentId = list.length > 0 && 'parentId' in list[0]

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
        }
      }
    })

    // 找出所有根節點（沒有 parentId 的節點）
    const treeData = list
      .filter(item => !item.parentId)
      .map(item => nodeMap.get(item[valueKey]))
      .filter((node): node is TreeNode => node !== undefined)

    optionsMap.value[fieldName] = treeData
  }
  else {
    // 原有的扁平結構處理
    optionsMap.value[fieldName] = list.map((resultItem: any) => ({
      label: resultItem[labelKey],
      value: resultItem[valueKey],
    }))
  }
}
// 搜索下拉框選項
const handleSearch = useDebounceFn(async (query: string, item: InitFormData) => {
  const fieldName = item.name

  // 如果搜索內容為空，清空選項並返回
  if (!query) {
    optionsMap.value[fieldName] = []
    return
  }

  // 設置 loading 狀態為 true
  selectLoadingMap.value[fieldName] = true

  if (item.options?.api) {
    try {
      const { data: result } = await item.options.api({ [item.options.selectParam!]: query })
      if (result.list.length > 0) {
        await setOptionsWithNextTick(
          fieldName,
          result.list,
          item.options.itemMapping!.label,
          item.options.itemMapping!.value,
        )
      }
      else {
        optionsMap.value[fieldName] = []
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

// 表單數據
const formRef = ref()
const formData = ref<Record<string, any>>({})
const formDataMapping = ref<Record<string, InitFormData>>({})
// 重設表單數據
function resetFormData(data?: TableRow, parent?: TableRow) {
  // 重設表單數據
  formData.value = {}
  formDataMapping.value = {}
  optionsMap.value = {}
  selectLoadingMap.value = {} // 重設搜索 loading 狀態
  radioLoadingMap.value = {} // 重設 radio loading 狀態

  // 初始化表單數據
  if (props.initFormData && Array.isArray(props.initFormData)) {
    props.initFormData.forEach(async (item: InitFormData) => {
      formData.value[item.name] = item.value
      formDataMapping.value[item.name] = item

      // 如果是 radio 類型且有 dictType
      if (item.type === 'radio' && item.dictType) {
        radioLoadingMap.value[item.name] = true
        await getDictOptions(item.dictType)
        radioLoadingMap.value[item.name] = false
      }

      // 如果選單類型
      if (item.type === 'select' && item.options) {
        /**
         * 由於 optionsMap.value 初始化時沒有數據，n-select 或者 n-tree-select 組件會直接顯示ID
         * 如果data如果可以拿到ID的具體數據的話， 我們可以先將當前ID的lable和value塞進去
         * 這樣在網速正常的情況下，使用者可以一進來就看到label
         */

        // 通常「某ID」是從「某數據」查詢過來的，如果「某數據」也在介面的返回值中，則可以透過去掉「某Id」的「Id」字串來獲取
        const itemNameMinusId = item.name.replace('Id', '')
        if (data && data![itemNameMinusId] && itemNameMinusId) {
          optionsMap.value[item.name] = [
            {
              label: data![itemNameMinusId][item.options!.itemMapping!.label],
              value: data![itemNameMinusId][item.options!.itemMapping!.value],
            },
          ]
        }

        // 如果data中存在parentId這個屬性
        else if (data && parent) {
          optionsMap.value[item.name] = [
            {
              label: parent.name,
              value: parent.id,
            },
          ]
        }

        // 如果拿不到ID的具體數據的話， 則需要初始化一個空數組
        else {
          optionsMap.value[item.name] = []
        }

        // 如果懶載入已開放
        if (item.options?.lazy) {
          // 初始化為非 loading 狀態
          selectLoadingMap.value[item.name] = false
        }

        // 如果懶載入未開放 則載入全部選項
        else {
          // 設置 loading 狀態為 true
          selectLoadingMap.value[item.name] = true

          try {
            const { data: result } = await item.options!.api({ pageSize: 0, currentPage: 1 })
            if (result.list.length > 0) {
              await setOptionsWithNextTick(
                item.name,
                result.list,
                item.options!.itemMapping!.label,
                item.options!.itemMapping!.value,
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

  // 如果傳入了數據，則將數據填充到表單中(通常只有新增和編輯時會傳入數據)
  if (data) {
    for (const key in formData.value) {
      formData.value[key] = data[key]
    }
  }
}
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
      if (optionsMap.value[key]) {
      // 在 result 中建立新的物件結構
        result[keyWithoutId] = {
        // 使用 formDataMapping 中定義的標籤映射作為鍵名
          [formDataMapping.value[key].options!.itemMapping!.label]: optionsMap.value[key][0].label,
          // 儲存選項的實際值（ID）// 為什麼是0？因為optionsMap.value[key]的值是通過精確尋找到的，且這個值通常是唯一的，所以我們可以沒有顧慮的採用第一個元素 所以寫0
          id: optionsMap.value[key][0].value,
        }
      }
    }
  }

  return result
}

// 新增
async function add() {
  const { id, ...remain } = formData.value
  const { data } = await props.createFunction!({
    ...remain,
    ...(props.filterColumnName && props.filterColumnValue ? { [props.filterColumnName]: props.filterColumnValue.value } : {}),
  })

  const emitData = handleIdDataMapping(
    {
      modalType: modalType.value!,
      ...formData.value,
      ...data,
    },
    remain,
  )
  emit('success', emitData)
}

// 編輯
async function edit() {
  // 過濾掉不應該被修改的欄位
  const { isDeleted, creator, createTime, updater, updateTime, ...remain } = formData.value
  for (const key of Object.keys(formDataMapping.value)) {
    const item = formDataMapping.value[key]
    if (item.disableEdit)
      delete remain[key]
  }

  const { message } = await props.updateFunction!({ ...remain })
  window.$message.success(message)

  const emitData = handleIdDataMapping(
    {
      modalType: modalType.value!,
      ...formData.value,
    },
    formData.value,
  )

  emit('success', emitData)
}

// 提交
async function submitModal() {
  try {
    await formRef.value?.validate()
    if (formData.value.id && formData.value.parentId && (formData.value.id === formData.value.parentId)) {
      window.$message.error('不能將自己設為父級')
      return
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

const { dict } = useDictStore()
const dictOptionsMap = ref<Record<string, any>>({})

// 獲取字典選項
async function getDictOptions(dictType: string) {
  const dictData = await dict(dictType)
  dictOptionsMap.value[dictType] = dictData.data()
}
</script>

<template>
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
    <template v-if="modalType === 'view'">
      <n-descriptions :column="2" bordered label-placement="left">
        <template v-for="(item, key) in formDataMapping" :key="key">
          <n-descriptions-item v-if="!item.hidden" :label="item.label" :span="item.span || 1">
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

    <n-form v-else ref="formRef" :rules="rules || {}" label-placement="left" :model="formData" :label-width="modalFormLabelWidth || 100">
      <n-grid :cols="2" :x-gap="18">
        <template v-for="item in formDataMapping" :key="item.name">
          <n-form-item-grid-item v-if="!item.hidden" :span="item.span" :path="item.name">
            <template #label>
              {{ item.label }}
              <HelpInfo v-if="item.helpInfo" :message="item.helpInfo" />
            </template>

            <n-input-group>
              <n-input-group-label v-if="item.inputPrefix">
                {{ item.inputPrefix }}
              </n-input-group-label>

              <n-input v-if="item.type === 'input'" v-model:value="formData[item.name]" :disabled="item.disableEdit ? modalType === 'edit' : false" :placeholder="item.placeholder" />
              <n-input v-else-if="item.type === 'textarea'" v-model:value="formData[item.name]" type="textarea" :disabled="item.disableEdit ? modalType === 'edit' : false" :placeholder="item.placeholder" />
              <n-input-number v-else-if="item.type === 'input-number'" v-model:value="formData[item.name]" :disabled="item.disableEdit ? modalType === 'edit' : false" :placeholder="item.placeholder" />
              <n-switch v-else-if="item.type === 'switch'" v-model:value="formData[item.name]" :checked-value="1" :unchecked-value="0" :disabled="item.disableEdit ? modalType === 'edit' : false" />
              <template v-else-if="item.type === 'select'">
                <!-- 如果數據中包含 children，使用樹狀選擇器 -->
                <n-tree-select
                  v-if="optionsMap[item.name]?.[0]?.children"
                  v-model:value="formData[item.name]"
                  :options="optionsMap[item.name]"
                  :disabled="item.disableEdit ? modalType === 'edit' : false"
                  filterable
                  remote
                  :loading="selectLoadingMap[item.name]"
                  :clear-filter-after-select="false"
                  :placeholder="item.placeholder || '請輸入關鍵字搜索'"
                  :empty="selectLoadingMap[item.name] ? '搜索中...' : '無符合條件的選項'"
                  key-field="key"
                  label-field="label"
                  children-field="children"
                  @search="(query) => handleSearch(query, item)"
                />
                <!-- 否則使用普通選擇器 -->
                <n-select
                  v-else
                  v-model:value="formData[item.name]"
                  :options="optionsMap[item.name]"
                  :disabled="item.disableEdit ? modalType === 'edit' : false"
                  filterable
                  remote
                  :loading="selectLoadingMap[item.name]"
                  :clear-filter-after-select="false"
                  :placeholder="item.placeholder"
                  :empty="selectLoadingMap[item.name] ? '搜索中...' : '無符合條件的選項'"
                  @search="(query) => handleSearch(query, item)"
                />
              </template>
              <n-radio-group v-else-if="item.type === 'radio'" v-model:value="formData[item.name]">
                <n-space>
                  <template v-if="radioLoadingMap[item.name]">
                    <n-skeleton text :repeat="3" :width="60" />
                  </template>
                  <template v-else-if="item.dictType && dictOptionsMap[item.dictType]">
                    <n-radio v-for="option in dictOptionsMap[item.dictType]" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </n-radio>
                  </template>
                </n-space>
              </n-radio-group>

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
</template>

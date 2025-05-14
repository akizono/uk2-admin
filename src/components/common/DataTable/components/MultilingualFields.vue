<script setup lang="tsx">
import type { TableRow } from '../type'

import { useBoolean } from '@/hooks'
import { useLanguageStore } from '@/store/model/language'
import { generateUUID } from '@/utils/tools/generateUUID'

defineProps<{
  multilingualFieldsModalWidth?: string // 多語言欄位彈出視窗的寬度
}>()

const emit = defineEmits(['submit'])

const languageStore = useLanguageStore()

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制提交的loading
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

// 表單數據
const formRef = ref()
const formData = ref<Record<string, any>>({})
// 傳進來的column的設定
const columnData = ref<TableRow | null>(null)
// 傳進來的行數據
// const rowData = ref<TableRow | null>(null)
// 進行編輯時，TableModal會傳入multilingualFields以便進行更新
const multilingualFields = ref<Record<string, any>>({})

// 多語言列表
const languageList = computed(() => {
  return languageStore.list
})

// 表單類型與標題
const modalType = shallowRef<ModalType | null>(null)
const modalName = ref('') // 模態框名稱
const modalTitle = computed(() => {
  if (!modalType.value)
    return ''
  return `${{
    add: '新增',
    view: '檢視',
    edit: '編輯',
  }[modalType.value]}：「${(modalName.value ?? '')}」多語言欄位`
})
// 表單驗證規則
const formRules = computed(() => {
  const rules: Record<string, any> = {}
  languageList.value.forEach((item) => {
    rules[item.value] = {
      required: true,
      message: '請填寫語言欄位',
      trigger: ['blur', 'input'],
    }
  })
  return rules
})

// 重設表單數據
function resetFormData() {
  formData.value = {}
  if (modalType.value !== 'add') {
    // 回填表單數據
    if (multilingualFields.value) {
      const multilingualField = multilingualFields.value[columnData.value?.name]
      if (multilingualField) {
        multilingualField.forEach((item: any) => {
          formData.value[item.language] = item.value
        })
      }
    }
  }
}

// 提交
async function handleSubmit() {
  try {
    startLoading()
    await formRef.value?.validate()

    // 格式化數據為後端介面需要的格式
    const uuid = generateUUID()
    const params = Object.entries(formData.value).map(([key, value]) => {
      if (modalType.value === 'add') {
        return {
          language: key,
          fieldId: uuid,
          value,
        }
      }
      else {
        const mf = multilingualFields.value[columnData.value?.name]
        const mfItem = mf.find((item: any) => item.language === key)

        return {
          language: key,
          fieldId: mf[0].fieldId,
          value,

          ifNewLanguage: !mfItem, // 是否為新增語言
          id: mfItem?.id || undefined,
          remark: mfItem?.remark || undefined,
        }
      }
    })

    emit('submit', { field: columnData.value?.name, params })
    endLoading()
    hiddenModal()
  }
  catch (errors) {
    endLoading()
    console.error('表單驗證失敗：', errors)
  }
}

// 打開彈出視窗
async function openModal(type: ModalType, data: TableRow, /* _rowData?: TableRow, */ _multilingualFields?: Record<string, any>) {
  modalType.value = type // 設置模態框類型
  modalName.value = data?.label // 設置模態框名稱
  columnData.value = data // 設置父級數據
  // rowData.value = _rowData ?? null // 設置行數據
  multilingualFields.value = _multilingualFields ?? {} // TableModal傳入的multilingualFields
  resetFormData()
  showModal()

  // console.log('rowData.value', rowData.value)
  console.log('columnData.value', columnData.value)
}

// 關閉彈出視窗
function closeModal() {
  endLoading()
  hiddenModal()
}
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    :title="modalTitle"
    :style="{
      width: multilingualFieldsModalWidth || '700px',
    }"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <div>formData: {{ formData }}</div>
    <n-form ref="formRef" label-placement="left" :model="formData" :rules="formRules">
      <n-grid :cols="2" :x-gap="18">
        <template v-for="item in languageList" :key="item.code">
          <n-grid-item>
            <n-form-item :label="item.label" :path="item.value">
              <n-input v-model:value="formData[item.value]" />
            </n-form-item>
          </n-grid-item>
        </template>
      </n-grid>
    </n-form>
    <template #action>
      <n-space justify="center">
        <n-button type="primary" :loading="submitLoading" @click="handleSubmit">
          提交
        </n-button>
        <n-button @click="closeModal">
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

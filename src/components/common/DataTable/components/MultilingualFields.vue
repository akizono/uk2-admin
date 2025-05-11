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
const parentData = ref<TableRow | null>(null)

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

// 提交
async function handleSubmit() {
  try {
    startLoading()
    await formRef.value?.validate()

    // 格式化數據為後端介面需要的格式
    const uuid = generateUUID()
    const params = Object.entries(formData.value).map(([key, value]) => ({
      language: key,
      fieldId: uuid,
      value,
    }))

    emit('submit', { field: parentData.value?.name, params })
    endLoading()
    hiddenModal()
  }
  catch (errors) {
    endLoading()
    console.error('表單驗證失敗：', errors)
  }
}

// 打開彈出視窗
async function openModal(type: ModalType, data: TableRow) {
  modalType.value = type // 設置模態框類型
  modalName.value = data?.label // 設置模態框名稱
  parentData.value = data // 設置父級數據
  showModal()
  // resetFormData()
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
    {{ formData }}
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

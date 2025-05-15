<script setup lang="tsx">
import type { TableRow } from '../type'

import { MultilingualFieldsApi } from '@/api/system/multilingual-fields'
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
const { bool: submitLoading, setTrue: startSubmitLoading, setFalse: endSubmitLoading } = useBoolean(false)
// 控制表單的loading
const { bool: formLoading, setTrue: startFormLoading, setFalse: endFormLoading } = useBoolean(false)

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
    startSubmitLoading()
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
        // 通常情況下，我們正在操作multilingualFields.value中的某個欄位，如果這個欄位一直以來都是「多語言欄位」，那麼mf就能正常獲取
        if (mf) {
          const mfItem = mf.find((item: any) => item.language === key)

          return {
            language: key,
            fieldId: mf[0].fieldId,
            value,

            ifNewLanguage: !mfItem, // 是否為新增語言
            id: mfItem?.id || undefined,
            // remark: mfItem?.remark || undefined,
          }
        }

        // 但是，如果這個欄位是從「非多語言欄位」轉換為「多語言欄位」，那麼mf就為undefined，因為multilingualFields.value中沒有這個欄位
        else {
          return {
            language: key,
            fieldId: uuid,
            value,

            ifNewLanguage: true, // 因為是新增語言，所以ifNewLanguage始終為true
            id: undefined, // 新增語言還未儲存到資料庫，所以現在id為undefined
          }
        }
      }
    })

    emit('submit', { field: columnData.value?.name, params })
    endSubmitLoading()
    hiddenModal()
  }
  catch (errors) {
    endSubmitLoading()
    console.error('表單驗證失敗：', errors)
    window.$message.error('表單驗證失敗')
  }
}

// 自動生成其他語言
async function handleConvertLanguage() {
  try {
    if (!formData.value[languageStore.current]) {
      return window.$message.error(`請先填寫「${languageStore.currentName}」`)
    }
    startFormLoading()
    const { data: result } = await MultilingualFieldsApi.convertLanguage({ text: formData.value[languageStore.current] })
    for (const item of languageList.value) {
      formData.value[item.value] = result[item.value]
    }
    window.$message.success('轉換成功')
  }
  finally {
    endFormLoading()
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
  endSubmitLoading()
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
    <!-- <div>formData: {{ formData }}</div> -->
    <n-flex vertical :size="24">
      <n-button
        dashed
        type="primary"
        size="small"
        class="mb-4"
        @click="handleConvertLanguage"
      >
        <template #icon>
          <icon-park-outline-magic-wand />
        </template>
        根據「{{ languageStore.currentName }}」自動生成其他語言
      </n-button>
    </n-flex>

    <n-spin :show="formLoading">
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
    </n-spin>

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

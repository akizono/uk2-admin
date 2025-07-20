<script setup lang="tsx">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import { useBoolean } from '@/hooks'

const emit = defineEmits(['success'])

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 提交按鈕的載入狀態
const { bool: submitLoading, setTrue: startSubmitLoading, setFalse: endSubmitLoading } = useBoolean(false)

const modalType = ref<ModalType>()
const formRef = ref()
const initFormData = {
  id: undefined,
  name: '',
  code: '',
  isGenerateEntity: 0,
  isGenerateBackendCode: 0,
  isGenerateWebCode: 0,
  isImportMenuAndPermission: 0,

  remark: '',
  sort: 0,
  status: 1,
}
const formData = ref({} as CodeGenerationVO)

const rules = ref({
  name: [
    { required: true, message: '請輸入模組名稱' },
    { max: 50, message: '模組名稱不能超過50個字元' },
  ],
  code: [
    { required: true, message: '請輸入模組代碼' },
    { max: 50, message: '模組代碼不能超過50個字元' },
    {
      pattern: /^[a-z]+-[a-z]+$/,
      message: '格式不正確：必須包含一個橫桿(-)，且只能包含小寫英文，橫桿不能出現在開頭或結尾',
    },
  ],
})

// 提交
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    startSubmitLoading()

    if (modalType.value === 'add') {
      await add()
    }
    else if (modalType.value === 'edit') {
      await edit()
    }

    // 關閉彈出視窗
    closeModal()

    window.$message.success('提交成功')
  }
  finally {
    endSubmitLoading()
  }
}

async function add() {
  const { data: result } = await CodeGenerationApi.createCodeGeneration(formData.value)
  formData.value.id = result.id

  emit('success', {
    modalType: modalType.value,
    ...formData.value,
  })
}

async function edit() {
  await CodeGenerationApi.updateCodeGeneration(formData.value)

  emit('success', {
    modalType: modalType.value,
    ...formData.value,
  })
}

// 打開彈出視窗
async function openModal(type: ModalType, data: CodeGenerationVO) {
  modalType.value = type
  formData.value = { ...initFormData } as CodeGenerationVO

  if (data) {
    for (const key in formData.value) {
      // @ts-expect-error close-error
      formData.value[key] = data[key]
    }
  }
  showModal()
}

// 關閉彈出視窗
function closeModal() {
  hiddenModal()
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible" :mask-closable="false" preset="card" title="創建模組"
      class="w-[100%] max-w-[500px]" :segmented="{
        content: true,
        action: true,
      }"
    >
      <n-form
        ref="formRef" label-placement="left" :model="formData" label-align="left" :label-width="80"
        :rules="rules"
      >
        <n-grid :cols="24" :x-gap="18">
          <n-form-item-grid-item :span="24" label="模組名稱" path="name">
            <n-input v-model:value="formData.name" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="模組代碼" path="code">
            <n-input v-model:value="formData.code" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="備註" path="remark">
            <n-input v-model:value="formData.remark" type="textarea" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="排序" path="sort">
            <n-input-number v-model:value="formData.sort" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="狀態" path="status">
            <n-switch v-model:value="formData.status" :checked-value="1" :unchecked-value="0">
              <template #checked>
                啟用
              </template>
              <template #unchecked>
                鎖定
              </template>
            </n-switch>
          </n-form-item-grid-item>
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
  </div>
</template>

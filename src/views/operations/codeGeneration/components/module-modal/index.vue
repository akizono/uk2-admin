<script setup lang="tsx">
import type { TableRow } from '../../type'

import { useBoolean } from '@/hooks'
import { delay } from '@/utils/delay'

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
const formData = ref<TableRow>({
  id: undefined,
  name: '',
  code: '',
})

const rules = ref({
  name: [{ required: true, message: '請輸入模組名稱' }],
  code: [{ required: true, message: '請輸入模組代碼' }],
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
  await delay(500)

  emit('success', {
    modalType: modalType.value,

    id: `${Date.now()}`,
    name: formData.value.name,
    code: formData.value.code,
  })
}

async function edit() {
  await delay(500)

  emit('success', {
    modalType: modalType.value,

    id: formData.value.id,
    name: formData.value.name,
    code: formData.value.code,
  })
}

// 打開彈出視窗
async function openModal(type: ModalType, data: TableRow) {
  modalType.value = type

  if (data)
    formData.value = { ...data }

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

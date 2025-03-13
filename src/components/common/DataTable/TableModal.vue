<script setup lang="ts">
import type { InitFormData, TableRow } from './type'
import type { FormRules } from 'naive-ui'

import { useBoolean } from '@/hooks'

const props = defineProps<{
  modalName?: string

  updateFunction: (...args: any[]) => Promise<any> // 更新列表數據的函數
  createFunction: (...args: any[]) => Promise<any> // 新增列表數據的函數

  rules?: FormRules
  initFormData?: InitFormData[]
}>()

const emit = defineEmits(['success'])

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
const formDataMapping = ref<Record<string, InitFormData>>({})
function resetFormData() {
  if (props.initFormData && Array.isArray(props.initFormData)) {
    props.initFormData.forEach((item: InitFormData) => {
      formData.value[item.name] = item.value
      formDataMapping.value[item.name] = item
    })
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

// 新增
async function add() {
  const { id, ...remain } = formData.value
  const { data } = await props.createFunction(remain)

  emit('success', {
    ModalType: modalType.value!,
    ...formData.value,
    ...data,
  })
}

// 編輯
async function edit() {
  const { username, ...remain } = formData.value
  const { message } = await props.updateFunction({ ...remain })
  window.$message.success(message)
  emit('success', { ModalType: modalType.value!, ...formData.value })
}

// 提交
async function submitModal() {
  try {
    await formRef.value?.validate()
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
async function openModal(type: ModalType, data?: TableRow) {
  modalType.value = type
  showModal()
  const handlers = {
    async add() {
      resetFormData()
    },
    async view() {
      if (!data)
        return
      resetFormData()
      formData.value = { ...data }
    },
    async edit() {
      if (!data)
        return
      resetFormData()
      formData.value = { ...data }
    },
  }
  await handlers[type]()
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
    class="w-700px"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form ref="formRef" :rules="rules || {}" label-placement="left" :model="formData" :label-width="100" :disabled="modalType === 'view'">
      <n-grid :cols="2" :x-gap="18">
        <!-- <n-form-item-grid-item :span="1" label="性別" path="sex">
          <n-radio-group v-model:value="formData.sex">
            <n-space>
              <n-radio :value="1">
                男
              </n-radio>
              <n-radio :value="2">
                女
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-grid-item> -->
        <!-- <n-form-item-grid-item :span="1" label="使用者狀態" path="status">
          <n-switch
            v-model:value="formData.status"
            :checked-value="1" :unchecked-value="0"
          >
            <template #checked>
              啟用
            </template>
            <template #unchecked>
              禁用
            </template>
          </n-switch>
        </n-form-item-grid-item> -->

        <template v-for="item in formDataMapping" :key="item.name">
          <n-form-item-grid-item v-if="!item.hidden" :span="item.span" :label="item.label" :path="item.name">
            <n-input v-if="item.type === 'input'" v-model:value="formData[item.name]" :disabled="item.disableEdit ? modalType === 'edit' : false" />
            <n-input v-else-if="item.type === 'textarea'" v-model:value="formData[item.name]" type="textarea" :disabled="item.disableEdit ? modalType === 'edit' : false" />
            <n-input-number v-else-if="item.type === 'input-number'" v-model:value="formData[item.name]" :disabled="item.disableEdit ? modalType === 'edit' : false" />
            <n-switch v-else-if="item.type === 'switch'" v-model:value="formData[item.name]" :checked-value="1" :unchecked-value="0" :disabled="item.disableEdit ? modalType === 'edit' : false" />
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

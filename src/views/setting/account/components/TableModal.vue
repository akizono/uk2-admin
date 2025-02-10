<script setup lang="ts">
import type * as USER_RESPONSE from '@/api/user/response.type'
import type { FormRules } from 'naive-ui'
import type { ModalType, Success } from './TableModal.type'

import { useBoolean } from '@/hooks'

// import { fetchRoleList } from '@/service'
import { createUser, updateUser } from '@/api/user'

const props = defineProps<{
  modalName?: string
}>()
const emit = defineEmits<{
  success: [Success]
}>()

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制提交的loading
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

// 表單數據
const formRef = ref()
const initFormData: USER_RESPONSE.UserInfo = {
  id: '',
  username: '',
  nickname: '',
  age: undefined,
  sex: undefined,
  email: '',
  mobile: '',
  remark: '',
  status: 1,
}
const formData = ref<USER_RESPONSE.UserInfo>({ ...initFormData })

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

// 表單驗證規則
const rules: FormRules = {
  username: {
    required: true,
    message: '請輸入使用者名稱',
    trigger: ['blur', 'input'],
  },
  nickname: {
    message: '請輸入暱稱',
    trigger: ['blur', 'input'],
  },
  age: {
    type: 'number',
    message: '請輸入年齡',
    trigger: ['blur', 'input'],
  },
  sex: {
    type: 'number',
    message: '請選擇性別',
    trigger: ['blur', 'change'],
  },
  email: {
    type: 'email',
    message: '請輸入正確的電子郵件格式',
    trigger: ['blur', 'input'],
  },
  mobile: {
    pattern: /^[\d\s+]{1,20}$/,
    message: '請輸入正確的手機號碼格式',
    trigger: ['blur', 'input'],
  },
}

// 新增
async function add() {
  const { id, ...remain } = formData.value
  const { data } = await createUser(remain)
  emit('success', {
    ...formData.value,
    type: modalType.value!,
    id: data.id,
    password: data.password,
  })
}

// 編輯
async function edit() {
  const { id, username, ...remain } = formData.value
  const { message } = await updateUser({ id: id!, ...remain })
  window.$message.success(message)
  emit('success', { type: modalType.value!, ...formData.value })
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
async function openModal(type: ModalType, data: USER_RESPONSE.UserInfo) {
  modalType.value = type
  showModal()
  // getRoleList()
  const handlers = {
    async add() {
      formData.value = { ...initFormData }
    },
    async view() {
      if (!data)
        return
      formData.value = { ...data }
    },
    async edit() {
      if (!data)
        return
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

defineExpose({
  openModal,
})

// const options = ref()
// async function getRoleList() {
//   const { data } = await fetchRoleList()
//   options.value = data
// }
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
    <n-form ref="formRef" :rules="rules" label-placement="left" :model="formData" :label-width="100" :disabled="modalType === 'view'">
      <n-grid :cols="2" :x-gap="18">
        <n-form-item-grid-item :span="1" label="使用者名稱" path="username">
          <n-input v-model:value="formData.username" :disabled="modalType === 'edit'" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="暱稱" path="nickname">
          <n-input v-model:value="formData.nickname" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="年齡" path="age">
          <n-input-number v-model:value="formData.age" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="性別" path="sex">
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
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="信箱" path="email">
          <n-input v-model:value="formData.email" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="手機號碼" path="mobile">
          <n-input v-model:value="formData.mobile" />
        </n-form-item-grid-item>

        <!-- <n-form-item-grid-item :span="2" label="角色" path="role">
          <n-select
            v-model:value="formData.role" multiple filterable
            label-field="role"
            value-field="id"
            :options="options"
          />
        </n-form-item-grid-item> -->
        <n-form-item-grid-item :span="2" label="備註" path="remark">
          <n-input v-model:value="formData.remark" type="textarea" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="使用者狀態" path="status">
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
        </n-form-item-grid-item>
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

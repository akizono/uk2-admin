<script setup lang="ts">
import type { UserInfo } from '@/api/user/response.type'
import type { FormRules } from 'naive-ui'
import { filterObjEmptyValues } from '@/utils/tools/object'
import { useBoolean } from '@/hooks'

// import { fetchRoleList } from '@/service'
import { createUser, updateUser } from '@/api/user'

const props = defineProps<{
  modalName?: string
}>()

const emit = defineEmits<{
  success: [{ type: ModalType } & UserInfo]
}>()

// 控制彈窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制提交的loading
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

// 表單數據
const formRef = ref()
const initFormData: UserInfo = {
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
const formData = ref<UserInfo>({ ...initFormData })

// 表單類型與標題
type ModalType = 'add' | 'view' | 'edit'
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
  const { message } = await createUser(filterObjEmptyValues(remain))
  window.$message.success(message)
  emit('success', { type: modalType.value!, ...formData.value })
}

// 編輯
async function edit() {
  const { id, username, ...remain } = filterObjEmptyValues(formData.value)
  const { message } = await updateUser({ id: id!, ...remain })
  window.$message.success(message)
  emit('success', { type: modalType.value!, ...formData.value })
}

// 提交
async function submitModal() {
  if (modalType.value === 'add')
    await add()
  else if (modalType.value === 'edit')
    await edit()

  // const handlers = {
  //   async add() {

  //     // return new Promise((resolve) => {
  //     //   setTimeout(() => {
  //     //     window.$message.success('模拟新增成功')
  //     //     resolve(true)
  //     //   }, 2000)
  //     // })
  //   },
  //   async edit() {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         window.$message.success('模拟编辑成功')
  //         resolve(true)
  //       }, 2000)
  //     })
  //   },
  //   async view() {
  //     return true
  //   },
  // }
  // await formRef.value?.validate()
  // startLoading()
  // await handlers[modalType.value]() && closeModal()
}

// 打開彈窗
async function openModal(type: ModalType, data: UserInfo) {
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

// 關閉彈窗
function closeModal() {
  hiddenModal()
  endLoading()
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
        <n-form-item-grid-item :span="1" label="性别" path="sex">
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
        <n-form-item-grid-item :span="1" label="邮箱" path="email">
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
        <n-form-item-grid-item :span="2" label="备注" path="remark">
          <n-input v-model:value="formData.remark" type="textarea" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="1" label="使用者状态" path="status">
          <n-switch
            v-model:value="formData.status"
            :checked-value="1" :unchecked-value="0"
          >
            <template #checked>
              启用
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

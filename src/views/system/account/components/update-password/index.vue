<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { UserApi } from '@/api/system/user'

const props = withDefaults(defineProps<{
  show: boolean
  currentUser: UserVo
}>(), {
  show: false,
  currentUser: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

// const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  password: '',
})

const loading = ref(false)

const rules = {
  password: {
    required: true,
    trigger: 'blur',
    message: '請輸入新密碼',
  },
}

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    loading.value = true
    try {
      await UserApi.updateUser({
        id: props.currentUser.id,
        password: formValue.value.password,

        /* 因為修改密碼沒有專用的介面，
         * 使用的是修改使用者資訊的介面（這個介面中roleIds是必傳參數）
         * 所以需要傳遞角色id */
        roleIds: props.currentUser.roleIds,
      })

      window.$message.success('密碼修改成功')
      emit('success')
      emit('update:show', false)
    }
    finally {
      loading.value = false
    }
  })
}

function handleCancel() {
  emit('update:show', false)
}

// 初始化表單數據
watch(() => props.show, (newVal) => {
  if (newVal) {
    formValue.value = {
      password: '',
    }
  }
}, { immediate: true })
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    title="修改密碼"
    class="w-500px"
    @update:show="emit('update:show', $event)"
  >
    <template #default>
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :label-width="100"
          :model="formValue"
          :rules="rules"
          label-placement="left"
        >
          <n-form-item label="使用者名稱">
            <n-input disabled :value="currentUser.username" />
          </n-form-item>
          <n-form-item label="新密碼" path="password">
            <n-input-group>
              <n-input
                v-model:value="formValue.password"
                placeholder="請輸入新密碼"
              />
            </n-input-group>
          </n-form-item>
        </n-form>
      </n-spin>
    </template>
    <template #action>
      <n-flex justify="center">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          確認修改
        </n-button>
        <n-button @click="handleCancel">
          取消
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import type { UserVO } from '@/api/system/user'
import type { FormInst } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import { $t } from '@/utils'

const props = withDefaults(defineProps<{
  show: boolean
  currentUser: UserVO
}>(), {
  show: false,
  currentUser: () => ({} as UserVO),
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  password: '',
})

const loading = ref(false)

const rules = {
  password: {
    required: true,
    trigger: 'blur',
    message: $t('account.newPasswordPlaceholder'),
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

      window.$message.success($t('account.passwordUpdateSuccess'))
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
    :title="$t('account.updatePassword')"
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
          <n-form-item :label="$t('account.passwordUpdateUsername')">
            <n-input disabled :value="currentUser.username" />
          </n-form-item>
          <n-form-item :label="$t('account.newPassword')" path="password">
            <n-input-group>
              <n-input
                v-model:value="formValue.password"
                :placeholder="$t('account.newPasswordPlaceholder')"
              />
            </n-input-group>
          </n-form-item>
        </n-form>
      </n-spin>
    </template>
    <template #action>
      <n-flex justify="center">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t('account.confirmUpdate') }}
        </n-button>
        <n-button @click="handleCancel">
          {{ $t('account.cancelButton') }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

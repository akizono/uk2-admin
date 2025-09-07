<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import { $t } from '@/utils'

const props = withDefaults(defineProps<{
  show: boolean
}>(), {
  show: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)

const rules = computed(() => {
  return {
    oldPassword: {
      required: true,
      trigger: 'blur',
      message: $t('userCenter.inputOldPassword'),
    },
    newPassword: {
      required: true,
      trigger: 'blur',
      validator: (rule: unknown, value: string) => {
        if (!value) {
          return new Error($t('userCenter.inputNewPassword'))
        }

        if (value.length < 6) {
          return new Error($t('userCenter.passwordLengthMin'))
        }

        if (value === formValue.value.oldPassword) {
          return new Error($t('userCenter.newPasswordCannotBeSameAsOld'))
        }

        return true
      },
    },
    confirmPassword: {
      required: true,
      trigger: 'blur',
      validator: (rule: unknown, value: string) => {
        if (!value) {
          return new Error($t('userCenter.confirmNewPassword'))
        }

        if (value !== formValue.value.newPassword) {
          return new Error($t('userCenter.passwordsDoNotMatch'))
        }

        return true
      },
    },
  }
})

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    loading.value = true
    try {
      await UserApi.updatePersonalPassword({
        oldPassword: formValue.value.oldPassword,
        newPassword: formValue.value.newPassword,
      })

      window.$message.success($t('userCenter.passwordUpdateSuccess'))
      emit('success')
      emit('update:show', false)

      // 重設表單
      formValue.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }
    finally {
      loading.value = false
    }
  })
}

function handleCancel() {
  // 重設表單
  formValue.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  emit('update:show', false)
}

// 初始化表單數據
watch(() => props.show, (newVal) => {
  if (newVal) {
    formValue.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }
}, { immediate: true })
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    :title="$t('userCenter.updatePasswordTitle')"
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
          <n-form-item :label="$t('userCenter.oldPasswordLabel')" path="oldPassword">
            <n-input
              v-model:value="formValue.oldPassword"
              type="password"
              :placeholder="$t('userCenter.inputOldPassword')"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item :label="$t('userCenter.newPasswordLabel')" path="newPassword">
            <n-input
              v-model:value="formValue.newPassword"
              type="password"
              :placeholder="$t('userCenter.inputNewPasswordPlaceholder')"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item :label="$t('userCenter.confirmPasswordLabel')" path="confirmPassword">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              :placeholder="$t('userCenter.reenterNewPasswordPlaceholder')"
              show-password-on="click"
            />
          </n-form-item>
        </n-form>
      </n-spin>
    </template>
    <template #action>
      <n-flex justify="center">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t('userCenter.confirmUpdate') }}
        </n-button>
        <n-button @click="handleCancel">
          {{ $t('common.cancel') }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

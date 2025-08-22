<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { UserApi } from '@/api/system/user'

const props = withDefaults(defineProps<{
  show: boolean
}>(), {
  show: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

// const { t } = useI18n()

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
      message: '請輸入舊密碼',
    },
    newPassword: {
      required: true,
      trigger: 'blur',
      validator: (rule: unknown, value: string) => {
        if (!value) {
          return new Error('請輸入新密碼')
        }

        if (value.length < 6) {
          return new Error('密碼長度至少6位')
        }

        if (value === formValue.value.oldPassword) {
          return new Error('新密碼不能與舊密碼相同')
        }

        return true
      },
    },
    confirmPassword: {
      required: true,
      trigger: 'blur',
      validator: (rule: unknown, value: string) => {
        if (!value) {
          return new Error('請確認新密碼')
        }

        if (value !== formValue.value.newPassword) {
          return new Error('兩次輸入的密碼不一致')
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

      window.$message.success('密碼修改成功')
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
          <n-form-item label="舊密碼" path="oldPassword">
            <n-input
              v-model:value="formValue.oldPassword"
              type="password"
              placeholder="請輸入舊密碼"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item label="新密碼" path="newPassword">
            <n-input
              v-model:value="formValue.newPassword"
              type="password"
              placeholder="請輸入新密碼（至少6位）"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item label="確認密碼" path="confirmPassword">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              placeholder="請再次輸入新密碼"
              show-password-on="click"
            />
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

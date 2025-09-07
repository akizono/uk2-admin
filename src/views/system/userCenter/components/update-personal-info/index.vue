<script setup lang="ts">
import type { UserVO } from '@/api/system/user'
import type { FormRules } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import { useAuthStore } from '@/store/model/auth'
import { $t, getDictData } from '@/utils'

const props = withDefaults(defineProps<{
  show: boolean
  user?: UserVO
}>(), {
  show: false,
  user: undefined,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const authStore = useAuthStore()

const formRef = ref()
const formValue = ref<Partial<UserVO>>({})
const sexOptions = getDictData('system_user_sex')
const loading = ref(false)

const rules: FormRules = {
  age: [
    {
      required: true,
      validator: (rule, value) => {
        if (value === null || value === undefined) {
          return new Error($t('userCenter.inputAge'))
        }
        if (value < 0) {
          return new Error($t('userCenter.ageCannotBeLessThanZero'))
        }
        if (value > 127) {
          return new Error($t('userCenter.ageCannotExceed127'))
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}

async function handleValidateClick() {
  try {
    await formRef.value?.validate()

    loading.value = true
    await UserApi.updatePersonalInfo(formValue.value)
    window.$message.success($t('userCenter.personalInfoUpdateSuccess'))

    // 更新個人資訊
    authStore.updatePersonalInfo()

    emit('success')
    emit('update:show', false)
  }
  finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:show', false)
}

// 初始化表單數據
watch(() => props.show, (newVal) => {
  if (newVal && props.user) {
    formValue.value = {
      nickname: props.user.nickname,
      age: props.user.age,
      sex: props.user.sex,
      avatar: props.user.avatar,
    }
  }
}, { immediate: true })
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    :title="$t('userCenter.personalInfoUpdateTitle')"
    class="w-600px"
    @update:show="emit('update:show', $event)"
  >
    <template #default>
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          label-placement="left"
        >
          <n-form-item :label="$t('userCenter.nickname')" path="nickname">
            <n-input v-model:value="formValue.nickname" :placeholder="$t('userCenter.inputNicknamePlaceholder')" />
          </n-form-item>
          <n-form-item :label="$t('userCenter.ageLabel')" path="age">
            <n-input-number v-model:value="formValue.age" :placeholder="$t('userCenter.inputAgePlaceholder')" class="w-full" />
          </n-form-item>
          <n-form-item :label="$t('userCenter.sexLabel')" path="sex">
            <n-select v-model:value="formValue.sex" :placeholder="$t('userCenter.inputSexPlaceholder')" :options="sexOptions" />
          </n-form-item>
          <n-form-item :label="$t('userCenter.avatarAddressLabel')" path="avatar">
            <n-input v-model:value="formValue.avatar" />
          </n-form-item>
        </n-form>
      </n-spin>
    </template>
    <template #action>
      <n-flex justify="center">
        <n-button type="primary" :loading="loading" @click="handleValidateClick">
          {{ $t('userCenter.confirmUpdate') }}
        </n-button>
        <n-button @click="handleCancel">
          {{ $t('common.cancel') }}
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

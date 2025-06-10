<script setup lang="ts">
import type { FormRules } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import { useAuthStore } from '@/store'
import { onMounted } from 'vue'

defineOptions({
  name: 'Personal Center',
})

const authStore = useAuthStore()

const { user } = authStore
const formRef = ref()
const formValue = ref({
  id: '',
  nickname: '',
  age: 33,
  mobile: '',
})
const rules: FormRules = {
  nickname: {
    required: true,
    message: '請輸入姓名',
    trigger: 'blur',
  },
  age: {
    required: true,
    type: 'number',
    message: '請輸入年齡',
    trigger: ['input', 'blur'],
  },
  mobile: {
    required: true,
    message: '請輸入手機號碼',
    trigger: ['input'],
  },
}

function handleValidateClick() {
  formRef.value?.validate(async (errors: any) => {
    if (errors)
      return window.$message.error('驗證不通過')

    UserApi.updateUser(formValue.value).then(({ message }) => {
      window.$message.success(message)
    })
  })
}

onMounted(() => {
  if (user) {
    formValue.value = {
      id: user.id!,
      nickname: user.nickname ?? '',
      age: user.age ?? 33,
      mobile: user.mobile ?? '',
    }
  }
})
</script>

<template>
  <n-space vertical>
    <n-card title="個人資訊">
      <n-space size="large">
        <n-avatar round :size="128" :src="user?.avatar || ''" />

        <n-descriptions
          label-placement="left"
          :column="2"
          :title="`傍晚好，${user?.nickname || user?.username}，這裡是簡單的個人中心模板`"
        >
          <n-descriptions-item label="id">
            {{ user!.id }}
          </n-descriptions-item>
          <n-descriptions-item label="使用者名稱">
            {{ user!.username }}
          </n-descriptions-item>
          <n-descriptions-item label="暱稱">
            {{ user?.nickname }}
          </n-descriptions-item>
          <n-descriptions-item label="角色">
            {{ user!.role!.join('、 ') }}
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
    </n-card>
    <n-card title="資訊修改">
      <n-space justify="center">
        <n-form ref="formRef" class="w-500px" :label-width="80" :model="formValue" :rules="rules">
          <n-form-item label="暱稱" path="nickname">
            <n-input v-model:value="formValue.nickname" placeholder="輸入暱稱" />
          </n-form-item>
          <n-form-item label="年齡" path="age">
            <n-input-number v-model:value="formValue.age" placeholder="輸入年齡" />
          </n-form-item>
          <n-form-item label="手機號碼" path="mobile">
            <n-input v-model:value="formValue.mobile" placeholder="手機號碼" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" attr-type="button" block @click="handleValidateClick">
              驗證
            </n-button>
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>
  </n-space>
</template>

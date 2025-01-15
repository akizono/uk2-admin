<script setup lang="ts">
import { updateUserInfo } from '@/api/user'
import { useAuthStore } from '@/store'
import { onMounted } from 'vue'

const authStore = useAuthStore()

const { userInfo } = authStore
const formRef = ref()
const formValue = ref({
  id: '',
  nickname: '',
  age: 33,
  mobile: '',
})
const rules = {
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
    message: '請輸入電話號碼',
    trigger: ['input'],
  },
}

function handleValidateClick() {
  formRef.value?.validate(async (errors: any) => {
    if (errors)
      return window.$message.error('驗證不通過')
    updateUserInfo(formValue.value).then(({ message }) => {
      window.$message.success(message)
    })
  })
}

onMounted(() => {
  if (userInfo) {
    formValue.value = {
      id: userInfo.id,
      nickname: userInfo.nickname ?? '',
      age: userInfo.age ?? 33,
      mobile: userInfo.mobile ?? '',
    }
  }
})
</script>

<template>
  <n-space vertical>
    <n-card title="個人資訊">
      <n-space size="large">
        <n-avatar round :size="128" :src="userInfo?.avatar || ''" />

        <n-descriptions
          label-placement="left"
          :column="2"
          :title="`傍晚好，${userInfo?.nickname || userInfo?.username}，這裡是簡單的個人中心模板`"
        >
          <n-descriptions-item label="id">
            {{ userInfo?.id }}
          </n-descriptions-item>
          <n-descriptions-item label="使用者名稱">
            {{ userInfo?.username }}
          </n-descriptions-item>
          <n-descriptions-item label="真實名稱">
            {{ userInfo?.nickname }}
          </n-descriptions-item>
          <n-descriptions-item label="角色">
            <!-- {{ userInfo?.role }} -->
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
          <n-form-item label="電話號碼" path="mobile">
            <n-input v-model:value="formValue.mobile" placeholder="電話號碼" />
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

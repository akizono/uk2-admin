<script setup lang="ts">
import type { UserVo } from '@/api/system/user'
import type { FormRules } from 'naive-ui'

import { UserApi } from '@/api/system/user'
import { useAuthStore } from '@/store/model/auth'
import { getDictData } from '@/utils'

const props = withDefaults(defineProps<{
  show: boolean
  user?: UserVo
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
const formValue = ref<Partial<UserVo>>({})
const sexOptions = getDictData('system_user_sex')
const loading = ref(false)

const rules: FormRules = {
  age: [
    {
      required: true,
      validator: (rule, value) => {
        if (value === null || value === undefined) {
          return new Error('請輸入年齡')
        }
        if (value < 0) {
          return new Error('年齡不能小於0歲')
        }
        if (value > 127) {
          return new Error('年齡不能超過127歲')
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
    window.$message.success('修改成功')

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
    title="資訊修改"
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
          <n-form-item label="暱稱" path="nickname">
            <n-input v-model:value="formValue.nickname" placeholder="輸入暱稱" />
          </n-form-item>
          <n-form-item label="年齡" path="age">
            <n-input-number v-model:value="formValue.age" placeholder="輸入年齡" class="w-full" />
          </n-form-item>
          <n-form-item label="性別" path="sex">
            <n-select v-model:value="formValue.sex" placeholder="輸入性別" :options="sexOptions" />
          </n-form-item>
          <n-form-item label="頭像地址" path="avatar">
            <n-input v-model:value="formValue.avatar" />
          </n-form-item>
        </n-form>
      </n-spin>
    </template>
    <template #action>
      <n-flex justify="center">
        <n-button type="primary" :loading="loading" @click="handleValidateClick">
          確認修改
        </n-button>
        <n-button @click="handleCancel">
          取消
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { onBeforeUnmount } from 'vue'

import { UserApi } from '@/api/system/user'
import { Regex } from '@/constants/Regex'
import { useAuthStore } from '@/store/model/auth'

const props = withDefaults(defineProps<{
  show: boolean
  type: VerifyCodeType
  currentValue?: string

}>(), {
  show: false,
  type: 'email',
  currentValue: '',
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}>()

const authStore = useAuthStore()
// const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  value: '',
  verifyCode: '',
})

const loading = ref(false)
const sendCodeLoading = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)

const rules = computed(() => {
  return {
    value: {
      required: true,
      trigger: 'blur',
      validator: (rule: unknown, value: string) => {
        if (!value) {
          return new Error(props.type === 'email' ? '請輸入電子郵件' : '請輸入手機號碼')
        }

        if (props.type === 'email') {
          // 電子郵件格式校驗
          const emailRegex = new RegExp(Regex.Email)
          if (!emailRegex.test(value)) {
            return new Error('請輸入有效的電子郵件格式')
          }
        }

        return true
      },
    },
    verifyCode: {
      required: true,
      trigger: 'blur',
      message: '請輸入驗證碼',
    },
  }
})

async function sendVerifyCode() {
  if (countdown.value > 0)
    return

  if (!formValue.value.value) {
    window.$message.warning(props.type === 'email' ? '請先輸入電子郵件' : '請先輸入手機號碼')
    return
  }

  // 如果是電子郵件，先進行格式校驗
  if (props.type === 'email') {
    const emailRegex = new RegExp(Regex.Email)
    if (!emailRegex.test(formValue.value.value)) {
      window.$message.warning('請輸入有效的電子郵件格式')
      return
    }
  }

  sendCodeLoading.value = true
  try {
    if (props.type === 'email') {
      await UserApi.sendBindEmail({ email: formValue.value.value })
      window.$message.success('驗證碼已發送至您的電子郵件')
    }
    else {
      await UserApi.sendBindMobile({ mobile: formValue.value.value })
      window.$message.success('驗證碼已發送至您的手機')
    }

    // 開始倒數計時
    countdown.value = 60
    countdownTimer.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer.value) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
    }, 1000)
  }
  finally {
    sendCodeLoading.value = false
  }
}

// 元件銷毀時清理定時器
onBeforeUnmount(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
})

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    loading.value = true
    try {
      const data: {
        verifyCode: string
        verifyCodeType: VerifyCodeType
        email?: string
        mobile?: string
      } = {
        verifyCode: formValue.value.verifyCode,
        verifyCodeType: props.type as VerifyCodeType,
      }

      if (props.type === 'email')
        data.email = formValue.value.value
      else
        data.mobile = formValue.value.value

      await UserApi.bindEmailOrMobile(data)

      window.$message.success(props.type === 'email' ? '電子郵件綁定成功' : '手機號碼綁定成功')

      // 更新個人資訊
      authStore.updatePersonalInfo()

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
      value: '',
      verifyCode: '',
    }
  }
}, { immediate: true })
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    :title="type === 'email' ? '修改電子郵件' : '修改手機號碼'"
    class="w-600px"
    @update:show="emit('update:show', $event)"
  >
    <template #default>
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :label-width="130"
          :model="formValue"
          :rules="rules"
          label-placement="left"
        >
          <n-form-item :label="type === 'email' ? '當前電子郵件' : '當前手機號碼'">
            <n-input disabled :value="currentValue || '未綁定'" />
          </n-form-item>
          <n-form-item :label="type === 'email' ? '新電子郵件' : '新手機號碼'" path="value">
            <n-input
              v-model:value="formValue.value"
              :placeholder="type === 'email' ? '請輸入新電子郵件' : '請輸入新手機號碼'"
            />
          </n-form-item>
          <n-form-item label="驗證碼" path="verifyCode">
            <n-input-group>
              <n-input v-model:value="formValue.verifyCode" placeholder="請輸入驗證碼" />
              <n-button
                :loading="sendCodeLoading"
                :disabled="countdown > 0"
                class="min-w-[70px]!"
                @click="sendVerifyCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '發送驗證碼' }}
              </n-button>
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

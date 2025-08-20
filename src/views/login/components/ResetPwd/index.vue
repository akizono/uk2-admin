<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { onBeforeUnmount } from 'vue'

import { checkUserHasMobileOrEmail, sendResetPasswordEmail, sendResetPasswordMobile, updatePassword } from '@/api/system/auth'

const emit = defineEmits(['update:modelValue'])
function toLogin() {
  emit('update:modelValue', 'login')
}
const { t } = useI18n()

const rules = computed(() => {
  return {
    account: {
      required: true,
      trigger: 'blur',
      message: t('login.resetPasswordRuleTip'),
    },
    verifyCode: {
      required: true,
      trigger: 'blur',
      message: t('login.verifyCodeRuleTip'),
    },
    password: {
      required: true,
      trigger: 'blur',
      message: t('login.passwordRuleTip'),
    },
  }
})

const formValue = ref({
  account: '',
  verifyCode: '',
  password: '',
  verifyCodeType: '' as VerifyCodeType,
})

const formRef = ref<FormInst | null>(null)
const currentStep = ref<'account' | 'verify' | 'reset'>('account')
const loading = ref(false)
const sendCodeLoading = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)
const userInfo = ref<{
  hasMobile: boolean
  hasEmail: boolean
}>({
  hasMobile: false,
  hasEmail: false,
})

async function checkAccount() {
  await formRef.value?.validate()

  loading.value = true
  try {
    const res = await checkUserHasMobileOrEmail({ username: formValue.value.account })
    userInfo.value = res.data

    if (!userInfo.value.hasMobile && !userInfo.value.hasEmail) {
      window.$message.error(t('login.noVerifyMethodError'))
      return
    }

    currentStep.value = 'verify'
  }
  finally {
    loading.value = false
  }
}

function goToResetStep() {
  if (!formValue.value.verifyCodeType) {
    window.$message.warning(t('login.selectVerifyMethodTip'))
    return
  }
  currentStep.value = 'reset'
}

async function sendVerifyCode() {
  if (countdown.value > 0)
    return

  sendCodeLoading.value = true
  try {
    if (formValue.value.verifyCodeType === 'email') {
      await sendResetPasswordEmail({ username: formValue.value.account })
      window.$message.success(t('login.emailSentSuccess'))
    }
    else {
      await sendResetPasswordMobile({ username: formValue.value.account })
      window.$message.success(t('login.mobileSentSuccess'))
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

// 組件銷毀時清理定時器
onBeforeUnmount(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
})

async function handleResetPassword() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    loading.value = true
    try {
      await updatePassword({
        username: formValue.value.account,
        password: formValue.value.password,
        verifyCode: formValue.value.verifyCode,
        verifyCodeType: formValue.value.verifyCodeType,
      })

      window.$message.success(t('login.resetPasswordSuccess'))
      toLogin()
    }
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div>
    <n-h2 depth="3" class="text-center">
      {{ $t('login.resetPasswordTitle') }}
    </n-h2>
    <n-form ref="formRef" :rules="rules" :model="formValue" :show-label="false" size="large">
      <!-- 步驟一：輸入帳號 -->
      <template v-if="currentStep === 'account'">
        <n-form-item path="account">
          <n-input v-model:value="formValue.account" clearable :placeholder="$t('login.accountPlaceholder')" />
        </n-form-item>
        <n-form-item>
          <n-space vertical :size="20" class="w-full">
            <n-button block type="primary" :loading="loading" @click="checkAccount">
              {{ $t('common.next') }}
            </n-button>
            <n-flex justify="center">
              <n-text>{{ $t('login.haveAccountText') }}</n-text>
              <n-button text type="primary" @click="toLogin">
                {{ $t('login.signIn') }}
              </n-button>
            </n-flex>
          </n-space>
        </n-form-item>
      </template>

      <!-- 步驟二：選擇驗證方式 -->
      <template v-else-if="currentStep === 'verify'">
        <n-alert type="info" :title="$t('login.verifyMethodTitle')" style="margin-bottom: 16px" />
        <n-space vertical>
          <n-radio-group v-model:value="formValue.verifyCodeType">
            <n-space vertical>
              <n-radio v-if="userInfo.hasEmail" value="email">
                {{ $t('login.verifyByEmail') }}
              </n-radio>
              <n-radio v-if="userInfo.hasMobile" value="mobile">
                {{ $t('login.verifyByMobile') }}
              </n-radio>
            </n-space>
          </n-radio-group>

          <n-space vertical :size="20" class="w-full">
            <n-button block type="primary" @click="goToResetStep">
              {{ $t('common.next') }}
            </n-button>
            <n-button block @click="currentStep = 'account'">
              {{ $t('common.back') }}
            </n-button>
          </n-space>
        </n-space>
      </template>

      <!-- 步驟三：輸入驗證碼和新密碼 -->
      <template v-else-if="currentStep === 'reset'">
        <!-- 顯示當前驗證方式 -->
        <n-alert
          type="info"
          :title="formValue.verifyCodeType === 'email' ? $t('login.resetByEmailTitle') : $t('login.resetByMobileTitle')"
          style="margin-bottom: 16px"
        />

        <n-form-item path="verifyCode">
          <n-input-group>
            <n-input v-model:value="formValue.verifyCode" clearable :placeholder="$t('login.verifyCodePlaceholder')" />
            <n-button
              :loading="sendCodeLoading" :disabled="countdown > 0" class="min-w-[70px]!"
              @click="sendVerifyCode"
            >
              {{ countdown > 0 ? `${countdown}s` : $t('login.sendVerifyCode') }}
            </n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="formValue.password" type="password" show-password-on="click"
            :placeholder="$t('login.newPasswordPlaceholder')"
          />
        </n-form-item>
        <n-form-item>
          <n-space vertical :size="20" class="w-full">
            <n-button block type="primary" :loading="loading" @click="handleResetPassword">
              {{ $t('login.resetPassword') }}
            </n-button>
            <n-button block @click="currentStep = 'verify'">
              {{ $t('common.back') }}
            </n-button>
          </n-space>
        </n-form-item>
      </template>
    </n-form>
  </div>
</template>

<style scoped></style>

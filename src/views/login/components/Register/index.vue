<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'

import { register, sendRegisterEmail, sendRegisterMobile } from '@/api/system/auth'
import { CountryCallingCodes, Regex, UserAgreement } from '@/constants/'
// import { computed, h, onBeforeUnmount } from 'vue'

const emit = defineEmits(['update:modelValue'])
function toLogin() {
  emit('update:modelValue', 'login')
}
const { t } = useI18n()

// 註冊方式
const registerType = ref<VerifyCodeType>('email')

// 表單規則
const rules = computed<FormRules>(() => {
  const baseRules: FormRules = {
    username: {
      required: true,
      trigger: 'blur',
      message: t('login.accountRuleTip'),
    },
    nickname: {
      required: true,
      trigger: 'blur',
      message: t('account.nicknameRule'),
    },
    password: {
      required: true,
      trigger: 'blur',
      message: t('login.passwordRuleTip'),
    },
    verifyCode: {
      required: true,
      trigger: 'blur',
      message: t('login.verifyCodeRuleTip'),
    },
  }

  // 根據註冊類型動態添加規則
  if (registerType.value === 'email') {
    baseRules.email = [
      {
        required: true,
        trigger: 'blur',
        message: t('account.emailRule'),
      },
      {
        pattern: new RegExp(Regex.Email),
        trigger: 'blur',
        message: t('account.emailFormatRule'),
      },
    ]
  }
  else {
    baseRules.mobile = {
      required: true,
      trigger: 'blur',
      message: t('account.mobileRule'),
    }
  }

  return baseRules
})

// 表單數據
const formValue = ref({
  username: '',
  nickname: '',
  password: '',
  email: '',
  mobile: '',
  verifyCode: '',
  selectedCountry: 'Taiwan', // 預設選擇台灣
})

// 國家選項
const countryOptions = computed(() => Object.keys(CountryCallingCodes).map((country: string) => ({
  label: t(`country.${country}`),
  value: country,
  rawName: country, // 保存原始名稱，用於顯示
})))

const isRead = ref(false)
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const sendCodeLoading = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)

// 發送驗證碼
async function sendVerifyCode() {
  if (countdown.value > 0)
    return

  // 檢查信箱或手機號碼是否填寫
  if (registerType.value === 'email' && !formValue.value.email) {
    window.$message.warning(t('account.emailRule'))
    return
  }
  if (registerType.value === 'mobile' && !formValue.value.mobile) {
    window.$message.warning(t('account.mobileRule'))
    return
  }

  sendCodeLoading.value = true
  try {
    if (registerType.value === 'email') {
      await sendRegisterEmail({ email: formValue.value.email })
      window.$message.success(t('login.emailSentSuccess'))
    }
    else {
      // 添加國家區號前綴
      const countryCode = CountryCallingCodes[formValue.value.selectedCountry as keyof typeof CountryCallingCodes]
      const mobileWithCode = `+${countryCode}${formValue.value.mobile}`
      await sendRegisterMobile({ mobile: mobileWithCode })
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

// 處理註冊
// 顯示用戶協議
function showUserAgreement() {
  window.$dialog.info({
    title: t('login.userAgreement'),
    content: () => h('div', { innerHTML: UserAgreement.replace(/\n/g, '<br>') }),
    positiveText: t('common.back'),
    onPositiveClick: () => {
      // 關閉彈出視窗
    },
  })
}

async function handleRegister() {
  // 檢查是否同意用戶協議
  if (!isRead.value) {
    window.$message.warning(t('login.pleaseAgree'))
    return
  }

  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    loading.value = true
    try {
      // 創建符合 RegisterVO 類型的數據
      const registerData: any = {
        username: formValue.value.username,
        nickname: formValue.value.nickname,
        password: formValue.value.password,
        verifyCode: formValue.value.verifyCode,
        verifyCodeType: registerType.value,
      }

      // 根據註冊類型設置 email 或 mobile
      if (registerType.value === 'email') {
        registerData.email = formValue.value.email
      }
      else {
        // 添加國家區號前綴
        const countryCode = CountryCallingCodes[formValue.value.selectedCountry as keyof typeof CountryCallingCodes]
        registerData.mobile = `+${countryCode}${formValue.value.mobile}`
      }

      await register(registerData)

      window.$message.success(t('login.signUp') + t('dataTable.addSuccess'))
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
      {{ $t('login.registerTitle') }}
    </n-h2>

    <!-- 註冊方式選擇 -->
    <n-tabs v-model:value="registerType" type="segment" class="mb-4">
      <n-tab-pane name="email" :tab="$t('account.email')" />
      <n-tab-pane name="mobile" :tab="$t('account.mobile')" />
    </n-tabs>

    <n-form
      ref="formRef"
      :rules="rules"
      :model="formValue"
      :show-label="false"
      size="large"
    >
      <!-- 使用者名稱 -->
      <n-form-item path="username">
        <n-input
          v-model:value="formValue.username"
          clearable
          :placeholder="$t('account.usernamePlaceholder')"
        />
      </n-form-item>

      <!-- 暱稱 -->
      <n-form-item path="nickname">
        <n-input
          v-model:value="formValue.nickname"
          clearable
          :placeholder="$t('account.nicknamePlaceholder')"
        />
      </n-form-item>

      <!-- 密碼 -->
      <n-form-item path="password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          :placeholder="$t('login.passwordPlaceholder')"
          clearable
          show-password-on="click"
        >
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>

      <!-- 信箱 (當註冊方式為信箱時顯示) -->
      <n-form-item v-if="registerType === 'email'" path="email">
        <n-input
          v-model:value="formValue.email"
          clearable
          :placeholder="$t('account.emailPlaceholder')"
        />
      </n-form-item>

      <!-- 手機號碼 (當註冊方式為手機時顯示) -->
      <n-form-item v-if="registerType === 'mobile'" path="mobile">
        <n-input-group>
          <n-select
            v-model:value="formValue.selectedCountry"
            class="w-250px"
            :options="countryOptions"
            :render-label="(option: {label: string, value: string, rawName: string}) => `${option.label} (+${CountryCallingCodes[option.value as keyof typeof CountryCallingCodes]})`"
            filterable
          />
          <n-input
            v-model:value="formValue.mobile"
            clearable
            :placeholder="$t('account.mobilePlaceholder')"
          />
        </n-input-group>
        <template #help>
          <span>{{ $t('account.mobileHelpInfo') }}</span>
        </template>
      </n-form-item>

      <!-- 驗證碼 -->
      <n-form-item path="verifyCode">
        <n-input-group>
          <n-input
            v-model:value="formValue.verifyCode"
            clearable
            :placeholder="$t('login.verifyCodePlaceholder')"
          />
          <n-button
            :loading="sendCodeLoading"
            :disabled="countdown > 0"
            class="min-w-[70px]!"
            @click="sendVerifyCode"
          >
            {{ countdown > 0 ? `${countdown}s` : $t('login.sendVerifyCode') }}
          </n-button>
        </n-input-group>
      </n-form-item>

      <n-form-item>
        <n-space
          vertical
          :size="20"
          class="w-full"
        >
          <n-checkbox v-model:checked="isRead">
            {{ $t('login.readAndAgree') }}
            <n-button
              type="primary"
              text
              @click.stop="showUserAgreement"
            >
              {{ $t('login.userAgreement') }}
            </n-button>
          </n-checkbox>
          <n-button
            block
            type="primary"
            :loading="loading"
            @click="handleRegister"
          >
            {{ $t('login.signUp') }}
          </n-button>
          <n-flex justify="center">
            <n-text>{{ $t('login.haveAccountText') }}</n-text>
            <n-button
              text
              type="primary"
              @click="toLogin"
            >
              {{ $t('login.signIn') }}
            </n-button>
          </n-flex>
        </n-space>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped></style>

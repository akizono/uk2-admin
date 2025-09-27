<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { getLoginImageVerifyCode } from '@/api/system/auth'
import { useAuthStore } from '@/store'
import { $t, local } from '@/utils'

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()

const isLoginCaptchaEnabled = import.meta.env.VITE_IS_LOGIN_CAPTCHA_ENABLED === 'true'

function toOtherForm(type: any) {
  emit('update:modelValue', type)
}

const rules = computed(() => {
  const baseRules: Record<string, any> = {
    account: {
      required: true,
      trigger: 'blur',
      message: $t('login.accountRuleTip'),
    },
    password: {
      required: true,
      trigger: 'blur',
      message: $t('login.passwordRuleTip'),
    },
  }

  // 如果啟用驗證碼，添加驗證碼驗證規則
  if (isLoginCaptchaEnabled) {
    baseRules.verifyCode = {
      required: true,
      trigger: 'blur',
      message: $t('login.verifyCodeRuleTip'),
    }
  }

  return baseRules
})
const formValue = ref({
  account: import.meta.env.VITE_LOGIN_DEFAULT_USERNAME,
  password: import.meta.env.VITE_LOGIN_DEFAULT_PASSWORD,
  verifyCode: '',
  svgCaptchaId: '',
})
const isRemember = ref(false)
const isLoading = ref(false)

// 驗證碼相關狀態
const captchaImage = ref('')
const captchaLoading = ref(false)

const formRef = ref<FormInst | null>(null)

// 獲取驗證碼
async function loadCaptcha() {
  if (!isLoginCaptchaEnabled)
    return

  try {
    captchaLoading.value = true
    const response = await getLoginImageVerifyCode()
    if (response.data?.svg)
      captchaImage.value = response.data.svg
    if (response.data?.svgCaptchaId)
      formValue.value.svgCaptchaId = response.data.svgCaptchaId
  }
  catch (error) {
    console.error('獲取驗證碼失敗:', error)
  }
  finally {
    captchaLoading.value = false
  }
}

function handleLogin() {
  formRef.value?.validate(async (errors) => {
    if (errors)
      return

    isLoading.value = true
    const { account, password, verifyCode, svgCaptchaId } = formValue.value

    if (isRemember.value)
      local.set('loginAccount', { account, password })
    else local.remove('loginAccount')

    // 如果啟用驗證碼，則傳遞驗證碼參數和 svgCaptchaId
    const verifyCodeParam = isLoginCaptchaEnabled ? verifyCode : undefined
    const svgCaptchaIdParam = isLoginCaptchaEnabled ? svgCaptchaId : undefined

    authStore.login(account, password, verifyCodeParam, svgCaptchaIdParam).finally(() => {
      isLoading.value = false
    })
  })
}
onMounted(() => {
  checkUserAccount()
  loadCaptcha()
})
function checkUserAccount() {
  const loginAccount = local.get('loginAccount')
  if (!loginAccount)
    return

  formValue.value = loginAccount
  isRemember.value = true
}
</script>

<template>
  <div>
    <n-h2 depth="3" class="text-center">
      {{ $t('login.signInTitle') }}
    </n-h2>
    <n-form ref="formRef" :rules="rules" :model="formValue" :show-label="false" size="large">
      <n-form-item path="account">
        <n-input v-model:value="formValue.account" clearable :placeholder="$t('login.accountPlaceholder')" />
      </n-form-item>
      <n-form-item path="password">
        <n-input v-model:value="formValue.password" type="password" :placeholder="$t('login.passwordPlaceholder')" clearable show-password-on="click">
          <template #password-invisible-icon>
            <icon-park-outline-preview-close-one />
          </template>
          <template #password-visible-icon>
            <icon-park-outline-preview-open />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item v-if="isLoginCaptchaEnabled" path="verifyCode">
        <n-input-group>
          <n-input v-model:value="formValue.verifyCode" :placeholder="$t('login.verifyCodePlaceholder')" clearable />
          <div v-if="captchaImage" class="captcha-image" title="點擊刷新驗證碼" @click="loadCaptcha" v-html="captchaImage" />
        </n-input-group>
      </n-form-item>
      <n-space vertical :size="20">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="isRemember">
            {{ $t('login.rememberMe') }}
          </n-checkbox>
          <n-button type="primary" text @click="toOtherForm('resetPwd')">
            {{ $t('login.forgotPassword') }}
          </n-button>
        </div>
        <n-button block type="primary" size="large" :loading="isLoading" :disabled="isLoading" @click="handleLogin">
          {{ $t('login.signIn') }}
        </n-button>
        <n-flex>
          <n-text>{{ $t('login.noAccountText') }}</n-text>
          <n-button type="primary" text @click="toOtherForm('register')">
            {{ $t('login.signUp') }}
          </n-button>
        </n-flex>
      </n-space>
    </n-form>
    <n-divider>
      <span op-80>{{ $t('login.or') }}</span>
    </n-divider>
    <n-space justify="center">
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-wechat /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-tencent-qq /></n-icon>
        </template>
      </n-button>
      <n-button circle>
        <template #icon>
          <n-icon><icon-park-outline-github-one /></n-icon>
        </template>
      </n-button>
    </n-space>
  </div>
</template>

<style scoped>
.captcha-image {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 40px;
  background: #fafafa;
}

.captcha-image:hover {
  border-color: #40a9ff;
}

.captcha-image :deep(svg) {
  display: block;
  max-height: 100%;
  max-width: 100%;
}
</style>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { $t, getDictLabel } from '@/utils'

import UpdateEmailOrMobile from './components/update-email-or-mobile/index.vue'
import UpdatePassword from './components/update-password/index.vue'
import UpdatePersonalInfo from './components/update-personal-info/index.vue'

defineOptions({
  name: 'Personal Center',
})

const authStore = useAuthStore()

const { user } = authStore
const showUpdateModal = ref(false)
const showEmailModal = ref(false)
const showMobileModal = ref(false)
const showPasswordModal = ref(false)

function handleEditClick() {
  showUpdateModal.value = true
}

function handleUpdateSuccess() {
  // 更新成功後的處理邏輯
}

function handleEditEmail() {
  showEmailModal.value = true
}

function handleEditMobile() {
  showMobileModal.value = true
}

function handleEditPassword() {
  showPasswordModal.value = true
}
</script>

<template>
  <n-space vertical>
    <n-card>
      <template #header>
        <n-button text icon-placement="right" strong @click="handleEditClick">
          <template #icon>
            <icon-park-outline-edit />
          </template>
          {{ $t('userCenter.personalInfo') }}
        </n-button>
      </template>
      <n-space size="large">
        <n-avatar round :size="128" :src="user?.avatar || ''" />
        <n-descriptions
          label-placement="left"
          :column="2"
          :title="`${$t('userCenter.greetingPrefix')}${user?.nickname || user?.username}${$t('userCenter.greetingSuffix')}`"
        >
          <n-descriptions-item label="id">
            {{ user!.id }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('userCenter.username')">
            {{ user!.username }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('userCenter.nickname')">
            {{ user?.nickname }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('userCenter.ageLabel')">
            {{ user?.age }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('userCenter.sexLabel')">
            {{ getDictLabel('system_user_sex', user?.sex) }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('userCenter.roleLabel')">
            {{ user!.roleNames!.join('、 ') }}
          </n-descriptions-item>
          <n-descriptions-item :span="2" :label="$t('userCenter.mobileNumberLabel')">
            {{ user?.mobile || $t('userCenter.unbound') }}
            <n-button text icon-placement="right" strong @click="handleEditMobile">
              <template #icon>
                <icon-park-outline-edit />
              </template>
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item :span="2" :label="$t('userCenter.emailLabel')">
            {{ user?.email || $t('userCenter.unbound') }}
            <n-button text icon-placement="right" strong @click="handleEditEmail">
              <template #icon>
                <icon-park-outline-edit />
              </template>
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item :span="2" :label="$t('userCenter.loginPasswordLabel')">
            {{ $t('userCenter.passwordSetStatus') }}
            <n-button text icon-placement="right" strong @click="handleEditPassword">
              <template #icon>
                <icon-park-outline-edit />
              </template>
            </n-button>
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
    </n-card>

    <!-- 資訊修改彈出視窗 -->
    <UpdatePersonalInfo
      v-model:show="showUpdateModal"
      :user="user || undefined"
      @success="handleUpdateSuccess"
    />

    <!-- 電子郵件修改彈出視窗 -->
    <UpdateEmailOrMobile
      v-model:show="showEmailModal"
      type="email"
      :current-value="user?.email"
      @success="handleUpdateSuccess"
    />

    <!-- 手機號碼修改彈出視窗 -->
    <UpdateEmailOrMobile
      v-model:show="showMobileModal"
      type="mobile"
      :current-value="user?.mobile"
      @success="handleUpdateSuccess"
    />

    <!-- 密碼修改彈出視窗 -->
    <UpdatePassword
      v-model:show="showPasswordModal"
      @success="handleUpdateSuccess"
    />
  </n-space>
</template>

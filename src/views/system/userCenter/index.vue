<script setup lang="ts">
import { useAuthStore } from '@/store'
import { getDictLabel } from '@/utils'

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
          個人資訊
        </n-button>
      </template>
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
          <n-descriptions-item label="年齡">
            {{ user?.age }}
          </n-descriptions-item>
          <n-descriptions-item label="性別">
            {{ getDictLabel('system_user_sex', user?.sex) }}
          </n-descriptions-item>
          <n-descriptions-item label="角色">
            {{ user!.roleNames!.join('、 ') }}
          </n-descriptions-item>
          <n-descriptions-item :span="2" label="手機號碼">
            {{ user?.mobile || '未綁定' }}
            <n-button text icon-placement="right" strong @click="handleEditMobile">
              <template #icon>
                <icon-park-outline-edit />
              </template>
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item :span="2" label="電子郵件">
            {{ user?.email || '未綁定' }}
            <n-button text icon-placement="right" strong @click="handleEditEmail">
              <template #icon>
                <icon-park-outline-edit />
              </template>
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item :span="2" label="登錄密碼">
            已設置
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

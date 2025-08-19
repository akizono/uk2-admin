<script setup lang="ts">
import { useAuthStore } from '@/store'
import { getDictLabel } from '@/utils'

import UpdatePersonalInfo from './components/update-personal-info/index.vue'

defineOptions({
  name: 'Personal Center',
})

const authStore = useAuthStore()

const { user } = authStore
const showUpdateModal = ref(false)

function handleEditClick() {
  showUpdateModal.value = true
}

function handleUpdateSuccess() {
  // 更新成功後的處理邏輯
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
            {{ user?.mobile }}
          </n-descriptions-item>
          <n-descriptions-item :span="2" label="電子郵件">
            {{ user?.email }}
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
  </n-space>
</template>

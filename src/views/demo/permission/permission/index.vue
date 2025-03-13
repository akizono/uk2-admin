<script setup lang="ts">
import type { Role } from '@/store/model/auth/interfaces'

import { usePermission } from '@/hooks'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { hasPermission } = usePermission()
const { role } = authStore

const roleList: Role[] = ['super_admin', 'common']

function toggleUserRole(role: string) {
  const loginConfig = {
    super_admin: {
      username: import.meta.env.VITE_TEST_SUPER_ADMIN_USERNAME,
      password: import.meta.env.VITE_TEST_SUPER_ADMIN_PASSWORD,
    },
    common: {
      username: import.meta.env.VITE_TEST_COMMON_USERNAME,
      password: import.meta.env.VITE_TEST_COMMON_PASSWORD,
    },
  }

  const config = loginConfig[role as keyof typeof loginConfig]
  authStore.login(config.username, config.password)
}
</script>

<template>
  <n-card title="權限範例">
    <n-h1>
      當前權限：{{ role.join('、 ') }}
    </n-h1>
    <n-button-group>
      <n-button v-for="item in roleList" :key="item" type="default" @click="toggleUserRole(item)">
        {{ item }}
      </n-button>
    </n-button-group>
    <n-h2>v-permission 指令用法</n-h2>
    <n-space>
      <n-button v-permission="['super_admin']">
        僅super_admin可見
      </n-button>
      <n-button v-permission="['common']">
        common可見
      </n-button>
    </n-space>

    <n-h2>usePermission 函數用法</n-h2>
    <n-space>
      <n-button v-if="hasPermission(['super_admin'])">
        super_admin可見
      </n-button>
      <n-button v-if="hasPermission(['common'])">
        common可見
      </n-button>
      <n-button v-if="hasPermission(['super_admin', 'common'])">
        super_admin和common可見
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped></style>

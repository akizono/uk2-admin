<script setup lang="ts">
import type { Role } from '@/store/model/auth/interfaces'

import { usePermi, usePermission } from '@/hooks'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { hasPermission } = usePermission()
const { hasPermi } = usePermi()
const { user } = authStore
const role = user?.role || []

const roleList: Role[] = ['admin', 'common']

async function toggleUserRole(role: string) {
  const loginConfig = {
    admin: {
      username: import.meta.env.VITE_TEST_SUPER_ADMIN_USERNAME,
      password: import.meta.env.VITE_TEST_SUPER_ADMIN_PASSWORD,
    },
    common: {
      username: import.meta.env.VITE_TEST_COMMON_USERNAME,
      password: import.meta.env.VITE_TEST_COMMON_PASSWORD,
    },
  }

  const config = loginConfig[role as keyof typeof loginConfig]
  await authStore.login(config.username, config.password)
  window.location.reload()
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
    <n-h2>v-hasPermi 指令用法</n-h2>
    <n-space>
      <n-button v-hasPermi="['system:dept:page']">
        僅包含system:dept:page權限可見
      </n-button>
    </n-space>

    <n-h2>usePermission 函數用法(原版自帶的，使用角色來判斷)</n-h2>
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

    <n-h2>usePermi 函數用法(使用權限來判斷)</n-h2>
    <n-space>
      <n-button v-if="hasPermi(['system:dept:page'])">
        system:dept:page可見
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped></style>

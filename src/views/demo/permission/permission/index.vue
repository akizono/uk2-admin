<script setup lang="ts">
import type { Role } from '@/store/model/auth/interfaces'

import { usePermi, usePermission } from '@/hooks'
import { useAuthStore } from '@/store'
import { $t } from '@/utils'

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
  <n-card :title="$t('permission.permissionExample')">
    <n-h1>
      {{ $t('permission.currentPermission') }}：{{ role.join('、 ') }}
    </n-h1>
    <n-button-group>
      <n-button v-for="item in roleList" :key="item" type="default" @click="toggleUserRole(item)">
        {{ item }}
      </n-button>
    </n-button-group>
    <n-h2>{{ $t('permission.vHasPermiDirectiveUsage') }}</n-h2>
    <n-space>
      <n-button v-hasPermi="['system:dept:page']">
        {{ $t('permission.onlySystemDeptPagePermiVisible') }}
      </n-button>
    </n-space>

    <n-h2>{{ $t('permission.usePermissionFunctionUsage') }}</n-h2>
    <n-space>
      <n-button v-if="hasPermission(['super_admin'])">
        {{ $t('permission.superAdminVisible') }}
      </n-button>
      <n-button v-if="hasPermission(['common'])">
        {{ $t('permission.commonVisible') }}
      </n-button>
      <n-button v-if="hasPermission(['super_admin', 'common'])">
        {{ $t('permission.superAdminAndCommonVisible') }}
      </n-button>
    </n-space>

    <n-h2>{{ $t('permission.usePermiFunctionUsage') }}</n-h2>
    <n-space>
      <n-button v-if="hasPermi(['system:dept:page'])">
        {{ $t('permission.systemDeptPageVisible') }}
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped></style>

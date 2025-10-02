<script setup lang="ts">
import { useHasRole, usePermi } from '@/hooks'
import { useAuthStore } from '@/store'
import { $t } from '@/utils'

const authStore = useAuthStore()
const { hasRole } = useHasRole()
const { hasPermi } = usePermi()
const { user } = authStore
const role = user?.role || []

const roleList: string[] = ['admin', 'common']

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
      <n-button v-hasPermi="['system:dept:query']">
        {{ $t('permission.onlySystemDeptPagePermiVisible') }}
      </n-button>
    </n-space>

    <n-h2>{{ $t('permission.usePermiFunctionUsage') }}</n-h2>
    <n-space>
      <n-button v-if="hasPermi(['system:dept:query'])">
        {{ $t('permission.systemDeptPageVisible') }}
      </n-button>
    </n-space>

    <n-h2>{{ $t('permission.useHasRoleFunctionUsage') }}</n-h2>
    <n-space>
      <n-button v-if="hasRole(['super_admin'])">
        {{ $t('permission.superAdminVisible') }}
      </n-button>
      <n-button v-if="hasRole(['common'])">
        {{ $t('permission.commonVisible') }}
      </n-button>
      <n-button v-if="hasRole(['super_admin', 'common'])">
        {{ $t('permission.superAdminAndCommonVisible') }}
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped></style>

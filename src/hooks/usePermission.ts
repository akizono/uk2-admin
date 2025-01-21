import type { Role } from '@/store/model/auth/interfaces'
import { useAuthStore } from '@/store'
/** 權限判斷 */
export function usePermission() {
  const authStore = useAuthStore()

  function hasPermission(
    permission: Role[] | undefined,
  ) {
    if (!permission)
      return true

    if (!authStore.role)
      return false
    const { role } = authStore

    let has = role.includes('super_admin')
    if (!has) {
      has = permission.some(item => role.includes(item))
    }
    return has
  }

  return {
    hasPermission,
  }
}

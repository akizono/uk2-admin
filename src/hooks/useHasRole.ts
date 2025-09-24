import { useAuthStore } from '@/store'

/** 權限判斷 */
export function useHasRole() {
  const authStore = useAuthStore()

  function hasRole(
    permission: string[] | undefined | string,
  ) {
    if (!Array.isArray(permission) || permission.length === 0)
      return false

    if (!authStore.user?.role)
      return false

    const role = authStore.user.role

    // 超級管理員擁有所有權限
    if (role.includes('super_admin'))
      return true

    // 檢查是否有此角色
    return permission.some(item => role.includes(item))
  }

  return {
    hasRole,
  }
}

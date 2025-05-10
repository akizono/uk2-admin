import { useAuthStore } from '@/store'

/** 權限判斷 */
export function usePermission() {
  const authStore = useAuthStore()

  function hasPermission(
    permission: string[] | undefined | string,
  ) {
    if (!permission)
      return true

    if (!authStore.user?.role)
      return false

    const role = authStore.user.role

    // 超級管理員擁有所有權限
    if (role.includes('super_admin'))
      return true

    // 如果 permission 是字符串（權限標識），則檢查是否有此權限
    // 目前不支持權限標識檢查，暫時返回 true
    if (typeof permission === 'string') {
      return true
    }

    // 如果 permission 是數組（角色組），則檢查是否有此角色
    return permission.some(item => role.includes(item))
  }

  return {
    hasPermission,
  }
}

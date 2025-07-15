import { useRouteStore } from '@/store'

/** 權限判斷 */
export function usePermi() {
  const routeStore = useRouteStore()
  const permissions = routeStore.permissions

  function hasPermi(
    permission: string[] | undefined | string,
  ) {
    if (!permission)
      return true

    if (!permissions)
      return false

    // 如果 permission 是數組
    if (Array.isArray(permission))
      return permission.some(item => permissions.includes(item))
    // 如果 permission 是字串
    else
      return permissions.includes(permission)
  }

  return {
    hasPermi,
  }
}

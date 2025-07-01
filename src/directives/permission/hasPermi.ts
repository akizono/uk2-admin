import type { App } from 'vue'

import { useRouteStore } from '@/store/router/'

/** 判斷權限的指令 directive */
function hasPermi(app: App<Element>) {
  /** 判斷權限的方法 */
  function hasPermission(permission: string[]) {
    const routerStore = useRouteStore()
    return (
      permission.some(perm => routerStore.permissions.includes(perm))
    )
  }

  app.directive('hasPermi', (el, binding) => {
    const { value } = binding

    if (value && Array.isArray(value) && value.length > 0) {
      const hasPermissions = hasPermission(value)

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
    else {
      throw new Error('v-hasPermi Directive with no explicit role attached')
    }
  })
}

/** Vue 插件安裝函數 */
export function install(app: App) {
  hasPermi(app)
}

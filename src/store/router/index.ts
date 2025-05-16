import type { MenuOption } from 'naive-ui'

import { MenuApi } from '@/api/system/menu'
import { router } from '@/router'
import { $t, local } from '@/utils'

import { createMenus, createRoutes, generateCacheRoutes } from './helper'

const { VITE_DEFAULT_LANG } = import.meta.env

interface RoutesStatus {
  isInitAuthRoute: boolean
  menus: MenuOption[]
  rowRoutes: AppRoute.RowRoute[]
  activeMenu: string | null
  cacheRoutes: string[]
}
export const useRouteStore = defineStore('route-store', {
  state: (): RoutesStatus => {
    return {
      isInitAuthRoute: false,
      activeMenu: null,
      menus: [],
      rowRoutes: [],
      cacheRoutes: [],
    }
  },
  actions: {
    resetRouteStore() {
      this.resetRoutes()
      this.$reset()
    },
    resetRoutes() {
      if (router.hasRoute('appRoot'))
        router.removeRoute('appRoot')
    },
    // set the currently highlighted menu key
    setActiveMenu(key: string) {
      this.activeMenu = key
    },

    async initRouteInfo() {
      const { data } = await MenuApi.getMenuPage({
        pageSize: 0,
        // @ts-expect-error 忽略狀態不為1的菜單
        status: 1,
      })
      console.log('data.list', data.list)
      const rowRoutes = data.list
      const languageCurrent = local.get('languageCurrent') || VITE_DEFAULT_LANG

      data.list.forEach((item) => {
        if (item.multilingualFields) {
          for (const field in item.multilingualFields) {
            if (item.multilingualFields[field] && item.multilingualFields[field].length > 0) {
              const currentLang = item.multilingualFields[field].find(mf => mf.language === languageCurrent)
              if (currentLang && currentLang.value) {
                // @ts-expect-error 忽略類型不匹配
                item[field] = currentLang.value
              }
            }
          }
        }
      })

      this.rowRoutes = rowRoutes
      return rowRoutes

      // if (import.meta.env.VITE_ROUTE_LOAD_MODE === 'dynamic') {
      //   const userInfo = local.get('userInfo')

      //   if (!userInfo || !userInfo.id) {
      //     const authStore = useAuthStore()
      //     authStore.logout()
      //     return
      //   }

      //   // Get user's route
      //   const { data } = await fetchUserRoutes({
      //     id: userInfo.id,
      //   })

      //   if (!data)
      //     return

      //   return data
      // }

      // this.rowRoutes = staticRoutes
      // return staticRoutes
    },
    async initAuthRoute() {
      this.isInitAuthRoute = false

      // Initialize route information
      const rowRoutes = await this.initRouteInfo()
      if (!rowRoutes) {
        window.$message.error($t(`app.getRouteError`))
        return
      }
      this.rowRoutes = rowRoutes

      // Generate actual route and insert
      const routes = createRoutes(rowRoutes)
      router.addRoute(routes)

      // Generate side menu
      this.menus = createMenus(rowRoutes)

      // Generate the route cache
      this.cacheRoutes = generateCacheRoutes(rowRoutes)

      this.isInitAuthRoute = true
    },
  },
})

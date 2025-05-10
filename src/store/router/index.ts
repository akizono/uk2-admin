import type { MenuOption } from 'naive-ui'

import { MenuApi } from '@/api/system/menu'
import { router } from '@/router'
import { $t } from '@/utils'

import { createMenus, createRoutes, generateCacheRoutes } from './helper'

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
      // [{"remark":null,"status":1,"isDeleted":0,"creator":"-1","createTime":"2025-05-10T05:34:39.000Z","updater":"-1","updateTime":"2025-05-10T06:08:39.000Z","id":"44","parentId":null,"name":"系統管理","path":null,"component":null,"permission":null,"type":0,"icon":"icon-park-outline:setting","link":null,"isCache":0,"isShowTag":0,"isPersistentTag":0,"isShowSide":1,"sort":-1},{"remark":null,"status":1,"isDeleted":0,"creator":"-1","createTime":"2025-05-10T06:20:36.000Z","updater":null,"updateTime":null,"id":"45","parentId":"44","name":"菜單設置","path":"/system/menu","component":"/system/menu/index.vue","permission":"system:menu:page","type":1,"icon":"icon-park-outline:application-menu","link":null,"isCache":1,"isShowTag":1,"isPersistentTag":0,"isShowSide":1,"sort":10}...]

      // 直接使用 API 返回的數據，過濾掉狀態不為1的菜單
      const rowRoutes = data.list

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

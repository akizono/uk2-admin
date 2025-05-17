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
      // 獲取選單列表
      const { data } = await MenuApi.getMenuPage({
        pageSize: 0,
        // @ts-expect-error 忽略狀態不為1的選單
        status: 1,
      })

      // 處理路由
      const newRowRoutes: AppRoute.RowRoute[] = []
      const languageCurrent = local.get('languageCurrent') || VITE_DEFAULT_LANG
      data.list.forEach((item) => {
        // 處理多語言
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

        // 只保留type為0或1的選單(目錄和頁面)
        if (item.type === 0 || item.type === 1) {
          newRowRoutes.push(item)
        }
      })

      this.rowRoutes = newRowRoutes
      return newRowRoutes
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

      // 修復路由中path為空的問題（通常目錄的path為空）
      const fixRoutes = (item: any) => {
        // 深度優先遍歷函數
        const traverse = (node: any) => {
          if (node.path === '') {
            node.path = `/${Date.now()}` // 使用當前時間戳作為路徑
          }

          if (node.children && node.children.length > 0) {
            node.children.forEach((child: any) => traverse(child))
          }

          return node
        }

        // 處理根節點
        if (routes.path === '') {
          routes.path = `/${Date.now()}`
        }

        // 處理子節點
        if (routes.children && routes.children.length > 0) {
          routes.children.forEach(child => traverse(child))
        }

        return item
      }
      const fixedRoutes = fixRoutes(routes)

      router.addRoute(fixedRoutes)

      // Generate side menu
      this.menus = createMenus(rowRoutes)

      // Generate the route cache
      this.cacheRoutes = generateCacheRoutes(rowRoutes)

      this.isInitAuthRoute = true
    },
  },
})

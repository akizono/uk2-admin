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

      // 定義一個函數來修復路由
      const fixRoutes = (item: any) => {
        // 輔助函數：從路徑中去除最後一段
        const removeLastSegment = (path: string) => {
          // 將路徑以'/'分割成段，並過濾掉空的段
          const segments = path.split('/').filter(Boolean)
          // 如果只有一段或沒有段，返回根路徑'/'
          if (segments.length <= 1)
            return '/'
          // 去掉最後一段，並重新組合成路徑
          segments.pop()
          return `/${segments.join('/')}`
        }

        // 尋找合適的路徑用於修復
        const findSuitablePath = (node: any): string | null => {
          // 1. 檢查子節點中meta.type === 1的路徑
          const findPathInChildren = (children: any[]): string | null => {
            // 遍歷子節點
            for (const child of children) {
              // 如果子節點的meta.type為1且有路徑，返回去掉最後一段的路徑
              if (child.meta?.type === 1 && child.path) {
                return removeLastSegment(child.path)
              }
              // 如果子節點有子節點，遞迴尋找
              if (child.children && child.children.length > 0) {
                const nestedPath = findPathInChildren(child.children)
                if (nestedPath) {
                  return nestedPath
                }
              }
            }
            return null
          }

          // 如果當前節點有子節點，尋找合適的路徑
          if (node.children && node.children.length > 0) {
            const childPath = findPathInChildren(node.children)
            if (childPath) {
              return childPath
            }
          }

          // 2. 檢查兄弟節點的redirect
          if (node.parent) {
            // 遍歷父節點的所有子節點
            for (const sibling of node.parent.children) {
              // 如果不是當前節點且有redirect，返回去掉最後一段的redirect路徑
              if (sibling !== node && sibling.redirect) {
                return removeLastSegment(sibling.redirect)
              }
            }
          }

          return null
        }

        // 深度優先遍歷函數
        const traverse = (node: any, parent: any = null) => {
          // 記錄父節點
          node.parent = parent

          // 修復空路徑
          if (node.path === '') {
            const suitablePath = findSuitablePath(node)
            // 如果找到合適的路徑，則設置為當前節點的路徑，否則使用當前時間戳作為路徑
            node.path = suitablePath || `/${Date.now()}`
          }

          // 修復redirect屬性
          if ((node.component === null || node.component === undefined)
            && (node.redirect === null || node.redirect === undefined)) {
            // 如果有子節點，尋找合適的redirect路徑
            if (node.children && node.children.length > 0) {
              const findRedirectPath = (children: any[]): string | null => {
                for (const child of children) {
                  // 如果子節點的meta.type為1且有路徑，返回該路徑
                  if (child.meta?.type === 1 && child.path) {
                    return child.path
                  }

                  // 如果子節點有子節點，遞迴尋找
                  if (child.children && child.children.length > 0) {
                    const nestedPath = findRedirectPath(child.children)
                    if (nestedPath) {
                      return nestedPath
                    }
                  }
                }
                return null
              }

              const redirectPath = findRedirectPath(node.children)
              // 如果找到合適的redirect路徑，則設置為當前節點的redirect
              if (redirectPath) {
                node.redirect = redirectPath
              }
            }
          }

          // 繼續遍歷子節點
          if (node.children && node.children.length > 0) {
            node.children.forEach((child: any) => traverse(child, node))
          }

          // 清理臨時添加的parent屬性
          delete node.parent

          return node
        }

        // 處理根節點 - 第一層不修復path
        if (item.path === '') {
          // 根節點保持空path
        }

        // 處理根節點的redirect
        if ((item.component === null || item.component === undefined)
          && (item.redirect === null || item.redirect === undefined)) {
          // 如果根節點有子節點，尋找合適的redirect路徑
          if (item.children && item.children.length > 0) {
            const findRedirectPath = (children: any[]): string | null => {
              for (const child of children) {
                // 如果子節點的meta.type為1且有路徑，返回該路徑
                if (child.meta?.type === 1 && child.path) {
                  return child.path
                }

                // 如果子節點有子節點，遞迴尋找
                if (child.children && child.children.length > 0) {
                  const nestedPath = findRedirectPath(child.children)
                  if (nestedPath) {
                    return nestedPath
                  }
                }
              }
              return null
            }

            const redirectPath = findRedirectPath(item.children)
            // 如果找到合適的redirect路徑，則設置為根節點的redirect
            if (redirectPath) {
              item.redirect = redirectPath
            }
          }
        }

        // 處理子節點
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => traverse(child, item))
        }

        return item
      }
      const fixedRoutes = fixRoutes(routes)
      console.log('路由列表', fixedRoutes)

      router.addRoute(fixedRoutes)

      // Generate side menu
      this.menus = createMenus(rowRoutes)

      // Generate the route cache
      this.cacheRoutes = generateCacheRoutes(rowRoutes)

      this.isInitAuthRoute = true
    },
  },
})

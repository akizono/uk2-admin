import type { RouteLocationNormalized } from 'vue-router'

import { router } from '@/router'
import { useRouteStore } from '@/store'

interface TabState {
  persistentTabs: RouteLocationNormalized[] // 常駐TAB欄
  tabs: RouteLocationNormalized[] // 動態TAB欄
  currentTabPath: string // 當前TAB欄路徑
}

/**
 * 從快取中移除指定路由
 * @param routeNames 要保留的路由名稱列表
 */
function updateCacheRoutes(routeNames: string[]) {
  const routeStore = useRouteStore()
  if (routeStore.cacheRoutes.length > 0) {
    routeStore.cacheRoutes = routeStore.cacheRoutes.filter(name =>
      routeNames.includes(name),
    )
  }
}

/**
 * 清除所有快取路由
 */
function clearAllCacheRoutes() {
  const routeStore = useRouteStore()
  routeStore.cacheRoutes = []
}

/**
 * 從標籤列表中提取路由名稱
 * @param tabs 標籤列表
 * @returns 路由名稱列表
 */
function extractRouteNames(tabs: RouteLocationNormalized[]): string[] {
  return tabs
    .map(tab => tab.name?.toString())
    .filter(Boolean) as string[]
}
export const useTabStore = defineStore('tab-store', {
  state: (): TabState => {
    return {
      persistentTabs: [],
      tabs: [],
      currentTabPath: '',
    }
  },
  getters: {
    allTabs: state => [...state.persistentTabs, ...state.tabs],
  },
  actions: {
    addTab(route: RouteLocationNormalized) {
      // 根據 meta 確定是否不添加，可用於錯誤頁,登入頁等
      if (route.meta.isShowTab !== 1)
        return

      // 如果標籤名稱已存在則不添加
      if (this.hasExistTab(route.fullPath as string))
        return

      // 根據 meta.isPersistentTab 傳遞到不同的分組中
      if (route.meta.isPersistentTab)
        this.persistentTabs.push(route)
      else
        this.tabs.push(route)
    },
    async closeTab(fullPath: string) {
      const tabsLength = this.tabs.length
      // 如果動態標籤大於一個,才會標籤跳轉
      if (this.tabs.length > 1) {
        // 獲取關閉的標籤索引
        const index = this.getTabIndex(fullPath)
        const isLast = index + 1 === tabsLength
        // 如果是關閉的當前頁面，路由跳轉到原先標籤的後一個標籤
        if (this.currentTabPath === fullPath && !isLast) {
          // 跳轉到後一個標籤
          router.push(this.tabs[index + 1].fullPath)
        }
        else if (this.currentTabPath === fullPath && isLast) {
          // 已經是最後一個了，就跳轉前一個
          router.push(this.tabs[index - 1].fullPath)
        }
      }

      // 刪除標籤
      const closedTab = this.tabs.find(item => item.fullPath === fullPath)
      this.tabs = this.tabs.filter(item => item.fullPath !== fullPath)

      // 清除頁面快取
      if (closedTab?.name) {
        // 獲取剩餘所有標籤的路由名稱
        const remainingTabs = [...this.tabs, ...this.persistentTabs]
        const remainingRouteNames = extractRouteNames(remainingTabs)
        updateCacheRoutes(remainingRouteNames)
      }

      // 刪除後如果清空了，就跳轉到默認首頁
      if (tabsLength - 1 === 0)
        router.push('/')
    },

    closeOtherTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      const currentTab = this.tabs[index]

      // 只保留當前標籤
      this.tabs = this.tabs.filter((item, i) => i === index)

      // 更新快取
      if (currentTab?.name) {
        const allTabs = [...this.tabs, ...this.persistentTabs]
        const remainingRouteNames = extractRouteNames(allTabs)
        updateCacheRoutes(remainingRouteNames)
      }
    },
    closeLeftTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      const remainingTabs = this.tabs.filter((item, i) => i >= index)

      // 更新標籤列表
      this.tabs = remainingTabs

      // 更新快取
      const allTabs = [...this.tabs, ...this.persistentTabs]
      const remainingRouteNames = extractRouteNames(allTabs)
      updateCacheRoutes(remainingRouteNames)
    },
    closeRightTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      const remainingTabs = this.tabs.filter((item, i) => i <= index)

      // 更新標籤列表
      this.tabs = remainingTabs

      // 更新快取
      const allTabs = [...this.tabs, ...this.persistentTabs]
      const remainingRouteNames = extractRouteNames(allTabs)
      updateCacheRoutes(remainingRouteNames)
    },
    clearAllTabs() {
      this.tabs.length = 0
      this.persistentTabs.length = 0

      // 清除所有頁面的快取
      clearAllCacheRoutes()
    },
    closeAllTabs() {
      this.tabs.length = 0

      // 清除動態頁面的快取，但保留常駐頁面的快取
      const persistentRouteNames = extractRouteNames(this.persistentTabs)
      updateCacheRoutes(persistentRouteNames)

      router.push('/')
    },

    hasExistTab(fullPath: string) {
      const _tabs = [...this.tabs, ...this.persistentTabs]
      return _tabs.some((item) => {
        return item.fullPath === fullPath
      })
    },
    /* 設置當前啟用的標籤 */
    setCurrentTab(fullPath: string) {
      this.currentTabPath = fullPath
    },
    getTabIndex(fullPath: string) {
      return this.tabs.findIndex((item) => {
        return item.fullPath === fullPath
      })
    },
    modifyTab(fullPath: string, modifyFn: (route: RouteLocationNormalized) => void) {
      const index = this.getTabIndex(fullPath)
      modifyFn(this.tabs[index])
    },

    /** 根據當前語言修改標籤 */
    modifyTabByLang(currentLanguage: string) {
      function updateTabTitleByLang(tab: RouteLocationNormalized, currentLanguage: string) {
        for (const field in tab.meta.multilingualFields) {
          const fieldData = tab.meta.multilingualFields[field]
          const matchedItem = fieldData.find(item => item.language === currentLanguage)
          if (matchedItem?.value) {
            tab.meta[field] = matchedItem.value
          }
        }
      }
      this.tabs.forEach(tab => updateTabTitleByLang(tab, currentLanguage))
      this.persistentTabs.forEach(tab => updateTabTitleByLang(tab, currentLanguage))
    },
  },
  persist: {
    storage: sessionStorage,
  },
})

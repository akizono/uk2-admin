import type { RouteLocationNormalized } from 'vue-router'

import { router } from '@/router'

interface TabState {
  persistentTabs: RouteLocationNormalized[] // 常駐TAB欄
  tabs: RouteLocationNormalized[] // 動態TAB欄
  currentTabPath: string // 當前TAB欄路徑
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
      this.tabs = this.tabs.filter((item) => {
        return item.fullPath !== fullPath
      })
      // 刪除後如果清空了，就跳轉到默認首頁
      if (tabsLength - 1 === 0)
        router.push('/')
    },

    closeOtherTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      this.tabs = this.tabs.filter((item, i) => i === index)
    },
    closeLeftTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      this.tabs = this.tabs.filter((item, i) => i >= index)
    },
    closeRightTabs(fullPath: string) {
      const index = this.getTabIndex(fullPath)
      this.tabs = this.tabs.filter((item, i) => i <= index)
    },
    clearAllTabs() {
      this.tabs.length = 0
      this.persistentTabs.length = 0
    },
    closeAllTabs() {
      this.tabs.length = 0
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
  },
  persist: {
    storage: sessionStorage,
  },
})

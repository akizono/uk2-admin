import type { GlobalThemeOverrides } from 'naive-ui'
import type { ProLayoutMode } from 'pro-naive-ui'

import { router } from '@/router'
import { colord } from 'colord'
import { set } from 'radash'

import { useRouteStore } from '../router'
import themeConfig from './theme.json'

export type TransitionAnimation = '' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out'

const { VITE_COPYRIGHT_INFO } = import.meta.env

const docEle = ref(document.documentElement)

const { isFullscreen, toggle } = useFullscreen(docEle)

const { system, store } = useColorMode({
  emitAuto: true,
})

const isMobile = useMediaQuery('(max-width: 700px)')

export const useAppStore = defineStore('app-store', {
  state: () => {
    return {
      footerText: VITE_COPYRIGHT_INFO,
      theme: themeConfig as GlobalThemeOverrides,
      primaryColor: themeConfig.common.primaryColor,
      collapsed: false,
      grayMode: false,
      colorWeak: false,
      loadFlag: true,
      showLogo: true,
      showTabs: true,
      showFooter: true,
      showProgress: true,
      showBreadcrumb: true,
      showBreadcrumbIcon: true,
      showWatermark: false,
      showSetting: false,
      transitionAnimation: 'fade-slide' as TransitionAnimation,
      layoutMode: 'vertical' as ProLayoutMode,
    }
  },
  getters: {
    storeColorMode() {
      return store.value
    },
    colorMode() {
      return store.value === 'auto' ? system.value : store.value
    },
    fullScreen() {
      return isFullscreen.value
    },
    isMobile() {
      return isMobile.value
    },
  },
  actions: {
    // 重設所有設置
    resetAlltheme() {
      this.theme = themeConfig
      this.primaryColor = '#22a6b3'
      this.collapsed = false
      this.grayMode = false
      this.colorWeak = false
      this.loadFlag = true
      this.showLogo = true
      this.showTabs = true
      this.showFooter = true
      this.showBreadcrumb = true
      this.showBreadcrumbIcon = true
      this.showWatermark = false
      this.transitionAnimation = 'fade-slide'
      this.layoutMode = 'vertical'

      // 重設所有配色
      this.setPrimaryColor(this.primaryColor)
    },

    /* 設置主題色 */
    setPrimaryColor(color: string) {
      const brightenColor = colord(color).lighten(0.05).toHex()
      const darkenColor = colord(color).darken(0.05).toHex()
      set(this.theme, 'common.primaryColor', color)
      set(this.theme, 'common.primaryColorHover', brightenColor)
      set(this.theme, 'common.primaryColorPressed', darkenColor)
      set(this.theme, 'common.primaryColorSuppl', brightenColor)
    },
    setColorMode(mode: 'light' | 'dark' | 'auto') {
      store.value = mode
    },
    /* 切換側邊欄收縮 */
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    /* 切換全螢幕 */
    toggleFullScreen() {
      toggle()
    },
    /**
     * @description: 頁面內容重載
     * @param {number} delay - 延遲毫秒數
     * @return {*}
     */
    async reloadPage(delay = 600) {
      this.loadFlag = false
      await nextTick()

      // 獲取當前路由資訊
      const currentRoute = router.currentRoute.value
      const routeStore = useRouteStore()

      // 臨時保存當前的緩存路由列表
      const originalCacheRoutes = [...routeStore.cacheRoutes]

      // 如果當前路由在緩存列表中，臨時從緩存列表中移除
      if (currentRoute && currentRoute.name) {
        const routeName = currentRoute.name.toString()

        // 臨時修改緩存路由列表，強制組件重新創建
        if (originalCacheRoutes.includes(routeName)) {
          // 移除當前路由名稱
          routeStore.cacheRoutes = originalCacheRoutes.filter(name => name !== routeName)

          // 延遲後恢復緩存
          setTimeout(() => {
            routeStore.cacheRoutes = originalCacheRoutes
          }, delay / 2)
        }
      }

      if (delay) {
        setTimeout(() => {
          this.loadFlag = true
        }, delay)
      }
      else {
        this.loadFlag = true
      }
    },
    /* 切換色弱模式 */
    toggleColorWeak() {
      docEle.value.classList.toggle('color-weak')
      this.colorWeak = docEle.value.classList.contains('color-weak')
    },
    /* 切換灰色模式 */
    toggleGrayMode() {
      docEle.value.classList.toggle('gray-mode')
      this.grayMode = docEle.value.classList.contains('gray-mode')
    },

  },
  persist: {
    storage: localStorage,
  },
})

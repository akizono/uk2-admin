import type { Router } from 'vue-router'

import { useAppStore, useRouteStore, useTabStore } from '@/store'
import { local } from '@/utils'

const title = import.meta.env.VITE_APP_NAME

export function setupRouterGuard(router: Router) {
  const appStore = useAppStore()
  const routeStore = useRouteStore()
  const tabStore = useTabStore()

  router.beforeEach(async (to, from, next) => {
    // 判斷是否是外鏈，如果是直接打開網頁並攔截跳轉
    if (to.meta.href) {
      window.open(to.meta.href)
      return false
    }
    // 開始 loadingBar
    appStore.showProgress && window.$loadingBar?.start()

    // 判斷有無TOKEN,登錄鑒權
    const isLogin = Boolean(local.get('accessToken'))
    if (!isLogin) {
      if (to.name === 'login')
        next()

      if (to.name !== 'login') {
        const redirect = (to.name === '404' || to.name === 'notFound') ? undefined : to.fullPath
        next({ path: '/login', query: { redirect } })
      }
      return false
    }

    // 判斷路由有無進行初始化
    if (!routeStore.isInitAuthRoute) {
      await routeStore.initAuthRoute()
      // 動態路由載入完回到根路由
      if (to.name === '404' || to.name === 'notFound') {
      // 等待權限路由載入好了，回到之前的路由,否則404
        next({
          path: to.fullPath,
          replace: true,
          query: to.query,
          hash: to.hash,
        })
        return false
      }
    }

    // 判斷當前頁是否在login,則定位去首頁
    if (to.name === 'login') {
      next({ path: '/' })
      return false
    }

    next()
  })
  router.beforeResolve((to) => {
    // 設置菜單高亮
    routeStore.setActiveMenu(to.meta.activeMenu ?? to.fullPath)
    // 添加tabs
    tabStore.addTab(to)
    // 設置高亮標籤;
    tabStore.setCurrentTab(to.fullPath as string)
  })

  router.afterEach((to) => {
    // 修改網頁標題
    document.title = `${to.meta.title} - ${title}`
    // 結束 loadingBar
    appStore.showProgress && window.$loadingBar?.finish()
  })
}

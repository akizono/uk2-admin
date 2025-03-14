import type { AuthState } from './interfaces'
import type * as AUTH_DTO from '@/api/system/auth/response.type'

import { login } from '@/api/system/auth'
import { router } from '@/router'
import { local } from '@/utils'

import { useRouteStore } from '../../router'
import { useTabStore } from '../tab'

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => {
    return {
      userInfo: local.get('userInfo'),
      role: local.get('role') || [],
      accessToken: local.get('accessToken') || '',
    }
  },
  getters: {
    /** 檢查使用者是否已登入 */
    isLogin(state) {
      return Boolean(state.accessToken)
    },
  },
  actions: {
    /** 處理登出流程，清除使用者資訊及相關資料 */
    async logout() {
      const route = unref(router.currentRoute)
      // 清除本地快取
      this.clearAuthStorage()
      // 清除路由和選單資料
      const routeStore = useRouteStore()
      routeStore.resetRouteStore()
      // 清除頁籤列資料
      const tabStore = useTabStore()
      tabStore.clearAllTabs()
      // 重設目前的 Store
      this.$reset()
      // 導向登入頁面
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },

    /** 處理使用者登入 */
    async login(username: string, password: string) {
      const { data } = await login({ username, password })

      // 處理登入資訊
      await this.handleLoginInfo(data)
    },

    /** 處理登入後的資料 */
    async handleLoginInfo(data: AUTH_DTO.Login) {
      // 儲存 Token 和使用者資訊
      local.set('userInfo', data.userInfo)
      local.set('role', data.role)
      local.set('accessToken', data.token.accessToken)
      local.set('refreshToken', data.token.refreshToken)
      this.userInfo = data.userInfo
      this.role = data.role
      this.accessToken = data.token.accessToken

      // 初始化路由和選單
      const routeStore = useRouteStore()
      await routeStore.initAuthRoute()

      // 導向指定頁面
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
      })
    },

    /** 處理更新 Token 的回傳資料 */
    async handleRefreshToken(data: AUTH_DTO.Token) {
      local.set('accessToken', data.accessToken)
      local.set('refreshToken', data.refreshToken)
      this.accessToken = data.accessToken
    },
  },
})

import { login } from '@/api/system/auth'
import { type Token, UserApi, type UserVo } from '@/api/system/user'
import { router } from '@/router'
import { local } from '@/utils'

import { useRouteStore } from '../../router'
import { useTabStore } from '../tab'

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      user: local.get('user') as UserVo,
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
      local.remove('user')
    },

    /** 處理使用者登入 */
    async login(username: string, password: string) {
      const { data: result } = await login({ username, password })

      // 處理登入資訊
      await this.handleLoginInfo(result)
    },

    /** 處理登入後的資料 */
    async handleLoginInfo(user: UserVo) {
      // 儲存 Token 和使用者資訊
      local.set('user', user)
      local.set('accessToken', user.token!.accessToken)
      local.set('refreshToken', user.token!.refreshToken)
      this.user = user
      this.accessToken = user.token!.accessToken

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
    async handleRefreshToken(token: Token) {
      local.set('accessToken', token.accessToken)
      local.set('refreshToken', token.refreshToken)
      this.accessToken = token.accessToken
    },

    /** 獲取個人資訊 */
    async updatePersonalInfo() {
      const { data: result } = await UserApi.getPersonalInfo()

      if (result) {
        Object.keys(result).forEach((key) => {
          (this.user as any)[key] = (result as any)[key]
        })
      }
      local.set('user', this.user)
    },
  },
})

import { login, type LoginVO, logout as logoutApi } from '@/api/system/auth'
import { type Token, UserApi, type UserVO } from '@/api/system/user'
import { router } from '@/router'
import { $t, local } from '@/utils'
import { createDiscreteApi } from 'naive-ui'

import { useRouteStore } from '../../router'
import { useTabStore } from '../tab'

const { dialog } = createDiscreteApi(['dialog'])

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      user: local.get('user') as UserVO,
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
      // 調用 logout 接口，清空後端的登錄狀態
      await logoutApi()

      // 清除本地快取
      this.clearAuthStorage()

      // 清除路由和選單資料
      const route = unref(router.currentRoute)
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
    async login(username: string, password: string, verifyCode?: string, svgCaptchaId?: string) {
      const loginData: LoginVO = { username, password }

      if (verifyCode)
        loginData.verifyCode = verifyCode
      if (svgCaptchaId)
        loginData.svgCaptchaId = svgCaptchaId

      const { data: result } = await login(loginData)

      await this.handleLoginInfo(result)
      this.tipsBindEmailOrMobile(result)
    },

    /** 處理登入後的資料 */
    async handleLoginInfo(user: UserVO) {
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

    /** 提示使用者綁定信箱或者手機 */
    tipsBindEmailOrMobile(user: UserVO) {
      if (!user.email && !user.mobile) {
        // 檢查是否已經忽略提示
        const noPromptToBindMobilePhoneOrEmail = local.get('noPromptToBindMobilePhoneOrEmail')
        if (noPromptToBindMobilePhoneOrEmail && noPromptToBindMobilePhoneOrEmail.find(item => item.userId === user.id)?.value) {
          return
        }

        setTimeout(() => {
          dialog.warning({
            title: $t('auth.hint'),
            content: $t('auth.hintContent'),
            positiveText: $t('auth.hintPositiveText'),
            negativeText: $t('auth.hintNegativeText'),
            maskClosable: false,
            // 前往綁定
            onPositiveClick: () => {
              router.push('/system/userCenter')
            },
            // 不再提示
            onNegativeClick: () => {
              if (noPromptToBindMobilePhoneOrEmail) {
                noPromptToBindMobilePhoneOrEmail.filter(item => item.userId !== user.id)
                noPromptToBindMobilePhoneOrEmail.push({ userId: user.id!, value: true })
                local.set('noPromptToBindMobilePhoneOrEmail', noPromptToBindMobilePhoneOrEmail)
              }
              else {
                local.set('noPromptToBindMobilePhoneOrEmail', [{ userId: user.id!, value: true }])
              }
            },
          })
        }, 700)
      }
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

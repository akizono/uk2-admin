import { LanguageApi } from '@/api/system/language'
import { router } from '@/router'
import { local, session, setLocale } from '@/utils'

const { VITE_DEFAULT_LANG } = import.meta.env

export const useLanguageStore = defineStore('language-store', {
  state: () => {
    const current = local.get('languageCurrent') || VITE_DEFAULT_LANG
    // 在 state 初始化時就設置語言
    setLocale(current)

    return {
      current, // 當前語言
      list: [] as App.SelectOption[], // 語言列表
    }
  },
  getters: {
    // 當前語言名稱
    currentName: (state) => {
      return state.list.find(item => item.value === state.current)?.label || ''
    },

    // 語言code 的列表
    languageCodeList: (state) => {
      return state.list.map(item => item.value)
    },
  },
  actions: {
    /** 設置語言 */
    setAppLang(lang: string) {
      setLocale(lang)
      local.set('languageCurrent', lang)
      this.current = lang
    },

    /** 初始化語言設定 */
    initLanguage() {
      const current = local.get('languageCurrent') || VITE_DEFAULT_LANG
      this.setAppLang(current)
    },

    /** 獲取語言列表 */
    async getLanguageList() {
      const { data: result } = await LanguageApi.getLanguagePage({
        pageSize: 0,
        // @ts-expect-error 只獲取啟用狀態的語言
        status: 1,
      })

      // 檢查列表中是否包含系統預設語言
      const isDefaultLang = result.list.find(item => item.code === VITE_DEFAULT_LANG)
      if (!isDefaultLang) {
        local.remove('languageCurrent')

        // 路由跳轉到404頁面
        const tipText = `
          <div>語言列表介面缺失系統預設語言，您有兩個處理方法</div>
          <div>1、修改「 .env -> VITE_DEFAULT_LANG 」</div>
          <div>2、調整語言列表介面，將系統預設語言添加到列表中</div>
        `
        router.push({
          path: '/error',
          query: {
            tipText: encodeURIComponent(tipText),
          },
        })
      }
      else {
        this.list = result.list.map(item => ({
          value: item.code,
          label: item.name,
        }))
        session.set('languageList', this.list)
      }
    },
  },
})

import { LanguageApi } from '@/api/system/language'
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

      this.list = result.list.map(item => ({
        value: item.code,
        label: item.name,
      }))
      session.set('languageList', this.list)
    },
  },
})

import type { Language } from '@/modules/i18n'

import { createDiscreteApi } from 'naive-ui'

import { language } from '@/modules/i18n'
import { $t, local, session, setLocale } from '@/utils'
import { defaultLang } from '@/utils/tools/defaultLang'

import { useTabStore } from '../tab'

const { dialog } = createDiscreteApi(['dialog'])

export const useLanguageStore = defineStore('language-store', {
  state: () => {
    const current = local.get('languageCurrent') || defaultLang()
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

    // list，將系統當前語言排在最前面的語言列表
    currentLanguageFirstList: (state): App.SelectOption[] => {
      const currentLanguage = state.list.find(item => item.value === state.current)
      return currentLanguage ? [currentLanguage, ...state.list.filter(item => item.value !== state.current)] : []
    },
  },
  actions: {
    /** 設置語言 */
    setAppLang(lang: Language) {
      dialog.warning({
        title: '警告',
        content: '確定要切換語言嗎？切換後頁面將會重新整理',
        positiveText: '確定',
        negativeText: '取消',
        draggable: true,
        onPositiveClick: () => {
          // 設置語言
          setLocale(lang)
          local.set('languageCurrent', lang)
          this.current = lang

          // 修改tab標籤為新語言
          const tabStore = useTabStore()
          tabStore.modifyTabByLang(lang)

          // 重新整理頁面
          window.location.reload()
        },
        onNegativeClick: () => {
          // 取消操作，不做任何事
        },
      })
    },

    /** 初始化語言設定 */
    initLanguage() {
      const current = local.get('languageCurrent') || defaultLang()
      this.setAppLang(current)
    },

    /** 獲取語言列表 */
    async getLanguageList() {
      for (const key in language) {
        this.list.push({
          value: key,
          label: $t(`language.${key}`),
        })
      }
      session.set('languageList', this.list)
    },
  },
})

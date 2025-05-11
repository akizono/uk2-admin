import type { App } from 'vue'

import { local } from '@/utils'
import { createI18n } from 'vue-i18n'

import enUS from '../../locales/en-US.json'
import zhCN from '../../locales/zh-CN.json'
import zhTW from '../../locales/zh-TW.json'

const { VITE_DEFAULT_LANG } = import.meta.env

export const i18n = createI18n({
  legacy: false,
  locale: local.get('languageCurrent') || VITE_DEFAULT_LANG, // 默认显示语言
  fallbackLocale: VITE_DEFAULT_LANG,
  messages: {
    zhCN,
    enUS,
    zhTW,
  },
  // 缺失国际化键警告
  // missingWarn: false,

  // 缺失回退内容警告
  fallbackWarn: false,
})

export function install(app: App) {
  app.use(i18n)
}

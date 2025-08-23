import type { App } from 'vue'

import { createI18n } from 'vue-i18n'

import { local } from '@/utils'

import enUS from '../../locales/enUS.json'
import zhCN from '../../locales/zhCN.json'
import zhTW from '../../locales/zhTW.json'

const { VITE_DEFAULT_LANG } = import.meta.env

export const language = {
  enUS,
  zhTW,
  zhCN,
}

export const i18n = createI18n({
  legacy: false,
  locale: local.get('languageCurrent') || VITE_DEFAULT_LANG, // 默認顯示語言
  fallbackLocale: 'enUS',
  messages: language,

  // 缺失國際化鍵警告
  missingWarn: true,

  // 缺失回退內容警告
  fallbackWarn: true,
})

export function install(app: App) {
  app.use(i18n)
}

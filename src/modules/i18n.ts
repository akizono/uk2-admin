import type { App } from 'vue'

import { createI18n } from 'vue-i18n'

import { local } from '@/utils'
import { defaultLang } from '@/utils/tools/defaultLang'

import enUS from '../../locales/enUS.json'
import zhCN from '../../locales/zhCN.json'
import zhTW from '../../locales/zhTW.json'

export type Language = 'enUS' | 'zhTW' | 'zhCN'
export const language = {
  enUS,
  zhTW,
  zhCN,
}

export const i18n = createI18n({
  legacy: false,
  locale: local.get('languageCurrent') || defaultLang(), // 默認顯示語言
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

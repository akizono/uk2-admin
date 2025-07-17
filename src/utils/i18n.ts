import type { NDateLocale, NLocale } from 'naive-ui'

import { i18n } from '@/modules/i18n'
import { dateZhCN, dateZhTW, zhCN, zhTW } from 'naive-ui'

export function setLocale(locale: string) {
  i18n.global.locale.value = locale.replace('-', '')
}

export const $t = i18n.global.t

export const naiveI18nOptions: Record<string, { locale: NLocale | null, dateLocale: NDateLocale | null }> = {
  ...{
    // 無橫杆
    // zhCN: {
    //   locale: zhCN,
    //   dateLocale: dateZhCN,
    // },
    // enUS: {
    //   locale: null,
    //   dateLocale: null,
    // },
    // zhTW: {
    //   locale: zhTW,
    //   dateLocale: dateZhTW,
    // },
  },

  ...{
    // 有橫杆
    'zh-TW': {
      locale: zhTW,
      dateLocale: dateZhTW,
    },
    'zh-CN': {
      locale: zhCN,
      dateLocale: dateZhCN,
    },
    'en-US': {
      locale: null,
      dateLocale: null,
    },
  },
}

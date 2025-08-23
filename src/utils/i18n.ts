import type { NDateLocale, NLocale } from 'naive-ui'

import { dateEnUS, dateZhCN, dateZhTW, enUS, zhCN, zhTW } from 'naive-ui'

import { i18n } from '@/modules/i18n'

export function setLocale(locale: 'enUS' | 'zhTW' | 'zhCN') {
  i18n.global.locale.value = locale
}

export const $t = i18n.global.t

export const naiveI18nOptions: Record<string, { locale: NLocale | null, dateLocale: NDateLocale | null }> = {
  enUS: {
    locale: enUS,
    dateLocale: dateEnUS,
  },
  zhTW: {
    locale: zhTW,
    dateLocale: dateZhTW,
  },
  zhCN: {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
}

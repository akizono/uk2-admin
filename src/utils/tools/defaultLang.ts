import type { Language } from '@/modules/i18n'

import { language } from '@/modules/i18n'

/**
 * 獲取預設語言
 * 1. 如果瀏覽器語言在系統語言中，則使用瀏覽器語言
 * 2. 否則使用預設語言
 */
export function defaultLang(): Language {
  const { VITE_DEFAULT_LANG } = import.meta.env as { VITE_DEFAULT_LANG: Language }
  const browserLang = navigator.language.replace(/-/g, '')

  if (Object.keys(language).includes(browserLang)) {
    return browserLang as Language
  }

  return VITE_DEFAULT_LANG
}

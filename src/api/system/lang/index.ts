import { language } from '@/modules/i18n'
import { $t } from '@/utils'

export async function getLanguageList() {
  const languageList = Object.keys(language).map(key => ({
    label: $t(`language.${key}`),
    value: key,
  }))

  return {
    data: {
      list: languageList,
      total: languageList.length,
    },
  }
}

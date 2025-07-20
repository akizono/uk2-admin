<script setup lang="ts">
import { naiveI18nOptions } from '@/utils'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import { darkTheme } from 'naive-ui'

import { useAppStore } from './store'
import { useLanguageStore } from './store/model/language'

hljs.registerLanguage('ts', typescript)

const appStore = useAppStore()
const languageStore = useLanguageStore()

const naiveLocale = computed(() => {
  const currentLang = languageStore.current
  return naiveI18nOptions[currentLang] ? naiveI18nOptions[currentLang] : naiveI18nOptions['en-US']
})

// 初始化語言列表
languageStore.getLanguageList()
</script>

<template>
  <n-config-provider
    class="wh-full" inline-theme-disabled :theme="appStore.colorMode === 'dark' ? darkTheme : null"
    :locale="naiveLocale.locale" :date-locale="naiveLocale.dateLocale" :theme-overrides="appStore.theme"
    :hljs="hljs"
  >
    <naive-provider>
      <router-view />
      <Watermark :show-watermark="appStore.showWatermark" />
    </naive-provider>
  </n-config-provider>
</template>

<style scoped>
/* 目前已知：僅 userCenter 用到了 n-input-number  */
:deep(.n-input-number) {
  width: 100%;
}
</style>

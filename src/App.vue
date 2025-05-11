<script setup lang="ts">
import { naiveI18nOptions } from '@/utils'
import { darkTheme } from 'naive-ui'

import { useAppStore } from './store'
import { useLanguageStore } from './store/model/language'

const appStore = useAppStore()
const languageStore = useLanguageStore()

const naiveLocale = computed(() => {
  return naiveI18nOptions[languageStore.current] ? naiveI18nOptions[languageStore.current] : naiveI18nOptions.enUS
})

// 初始化語言列表
languageStore.getLanguageList()
</script>

<template>
  <n-config-provider
    class="wh-full" inline-theme-disabled :theme="appStore.colorMode === 'dark' ? darkTheme : null"
    :locale="naiveLocale.locale" :date-locale="naiveLocale.dateLocale" :theme-overrides="appStore.theme"
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

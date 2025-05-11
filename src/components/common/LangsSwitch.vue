<script setup lang="ts">
import { useLanguageStore } from '@/store/model/language'

const languageStore = useLanguageStore()
</script>

<template>
  <n-popselect :value="languageStore.current" :options="languageStore.list" trigger="click" @update:value="languageStore.setAppLang">
    <CommonWrapper>
      <icon-park-outline-translate />
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>

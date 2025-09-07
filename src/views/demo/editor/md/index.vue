<script setup lang="ts">
import { $t } from '@/utils'

const text = ref('# Hello Editor ![Image description](https://via.placeholder.com/350x150)')
</script>

<template>
  <n-card :title="$t('md.title')">
    <n-space vertical :size="12">
      <n-alert :title="$t('md.basedOn')" type="success" />
      <MarkDownEditor v-model="text" />
    </n-space>
  </n-card>
</template>

<style scoped></style>

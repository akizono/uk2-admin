<script setup lang="ts">
import { $t } from '@/utils'

const { query } = useRoute()
</script>

<template>
  <n-space vertical>
    <n-alert :title="$t('multi.publicInformation')" type="warning">
      {{ $t('multi.detailPageInfo') }}
    </n-alert>

    <n-h2>
      {{ $t('multi.detailPageId') }}: {{ query.id }}
    </n-h2>
  </n-space>
</template>

<style scoped></style>

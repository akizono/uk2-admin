<script setup lang="ts">
import { FailedRequest } from '@/api/demo/test'
import { $t } from '@/utils'

const emit = defineEmits<{
  update: [data: any] // 具名元組語法
}>()

async function failedRequest() {
  const res = await FailedRequest()
  emit('update', res)
}
</script>

<template>
  <n-card :title="$t('failedRequest.title')" size="small">
    <n-button type="error" @click="failedRequest">
      click
    </n-button>
  </n-card>
</template>

<style scoped>

</style>

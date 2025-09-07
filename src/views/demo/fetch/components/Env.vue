<script setup lang="ts">
import { $t } from '@/utils'

const emit = defineEmits<{
  update: [data: any] // 具名元组语法
}>()

async function get() {
  const res = import.meta.env
  emit('update', res)
}
</script>

<template>
  <n-card :title="$t('env.title')" size="small">
    <n-button @click="get">
      click
    </n-button>
  </n-card>
</template>

<style scoped>

</style>

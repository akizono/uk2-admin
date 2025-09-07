<script setup lang="ts">
import { $t } from '@/utils'

const text = ref('')
// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    text.value = `<p>${$t('rich.simulateAsyncContent')}</p>`
  }, 1500)
})

const active = ref(false)
</script>

<template>
  <n-card :title="$t('rich.title')">
    <n-space vertical :size="12">
      <n-alert :title="$t('rich.basedOn')" type="success" />
      <n-switch v-model:value="active">
        <template #checked>
          {{ $t('common.disable') }}
        </template>
        <template #unchecked>
          {{ $t('common.enable') }}
        </template>
      </n-switch>
      <n-space :size="12">
        <div class="h-300px">
          <RichTextEditor v-model="text" :disabled="active" />
        </div>
        <div>
          <n-h2>{{ $t('rich.vHtmlPreview') }}</n-h2>
          <div v-html="text" />
        </div>
      </n-space>
    </n-space>
  </n-card>
</template>

<style scoped></style>

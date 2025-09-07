<script setup lang="ts">
import { $t } from '@/utils'

const text = ref('Hello UK2-Admin')
</script>

<template>
  <n-card :title="$t('clipboard.title')">
    <n-h3>{{ $t('clipboard.vCopyDirective') }}</n-h3>
    <n-input-group>
      <n-input v-model:value="text" :placeholder="$t('clipboard.copyInputPlaceholder')" />
      <n-button v-copy="text" type="primary">
        {{ $t('clipboard.vCopyBtn') }}
      </n-button>
    </n-input-group>
    <n-h3>{{ $t('clipboard.copyTextComponent') }}</n-h3>
    <copy-text v-model:value="text" />
  </n-card>
</template>

<style scoped></style>

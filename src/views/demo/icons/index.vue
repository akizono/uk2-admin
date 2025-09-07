<script setup lang="ts">
import { $t } from '@/utils'
</script>

<template>
  <n-space vertical>
    <n-card :title="$t('icons.iconSelector')">
      <icon-select />
    </n-card>
    <n-card :title="$t('icons.autoImportIcons')">
      <div>
        {{ $t('icons.normal') }}：<icon-park-outline-apple />
      </div>
      <div>
        {{ $t('icons.large') }}：<icon-park-outline-apple class="text-2em" />
      </div>
      <div>
        {{ $t('icons.extraLarge') }}：<icon-park-outline-apple class="text-4em" />
      </div>
    </n-card>
    <n-card title="自动导入svg图标">
      <div>
        {{ $t('icons.normal') }}：<svg-icons-cool />
      </div>
      <div>
        {{ $t('icons.large') }}：<svg-icons-cool class="text-2em" />
      </div>
      <div>
        {{ $t('icons.extraLarge') }}：<svg-icons-cool class="text-4em" />
      </div>
      <div>
        {{ $t('icons.novaIconComponentLoading') }}：<nova-icon icon="local:cool" />
      </div>
    </n-card>
  </n-space>
</template>

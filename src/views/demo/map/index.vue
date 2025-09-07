<script setup lang="ts">
import { $t } from '@/utils'

import AMap from './components/AMap.vue'
import BMap from './components/BMap.vue'

defineOptions({
  name: 'DemoMap',
})

const maps = [
  {
    id: 'BMap',
    label: $t('map.baiduMap'),
    component: BMap,
  },
  {
    id: 'AMap',
    label: $t('map.gaodeMap'),
    component: AMap,
  },
]
</script>

<template>
  <n-card :title="$t('map.mapExample')">
    <n-tabs
      type="line"
      animated
    >
      <n-tab-pane
        v-for="item in maps"
        :key="item.id"
        :name="item.id"
        :tab="item.label"
        class="h-600px"
      >
        <component :is="item.component" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped></style>

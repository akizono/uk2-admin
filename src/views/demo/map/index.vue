<script setup lang="ts">
import AMap from './components/AMap.vue'
import BMap from './components/BMap.vue'

defineOptions({
  name: 'DemoMap',
})

const maps = [
  {
    id: 'BMap',
    label: '百度地圖',
    component: BMap,
  },
  {
    id: 'AMap',
    label: '高德地圖',
    component: AMap,
  },
]
</script>

<template>
  <n-card title="地圖範例(keepalive快取)">
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

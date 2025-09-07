<script setup lang="ts">
import { type ECOption, useEcharts } from '@/hooks'
import { $t } from '@/utils'

const option = ref<ECOption>({
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {d}%',
  },
  legend: {
    orient: 'horizontal',
    top: 30,
    padding: 5,
    itemWidth: 20,
    itemHeight: 12,
    textStyle: {
      color: '#777',
    },
  },
  series: [{
    type: 'pie',
    radius: ['45%', '60%'],
    center: ['50%', '50%'],
    label: {
      show: true,
      formatter: '{b} : {d}%',
      color: '#777',
    },
    labelLine: {
      show: true,
      length2: 10,
    },
    data: [
      {
        value: 335,
        name: $t('monitor.directAccess'),
      },
      {
        value: 77,
        name: $t('monitor.bilibili'),
      },
      {
        value: 82,
        name: $t('monitor.zhihu'),
      },
      {
        value: 421,
        name: $t('monitor.xiaohongshu'),
      },
    ],
  },
  ],
}) as Ref<ECOption>
useEcharts('lineRef', option)
</script>

<template>
  <div ref="lineRef" class="h-400px" />
</template>

<style scoped></style>

<script setup lang="ts">
import { useDictStore } from '@/store'

const props = defineProps<{
  dictType: string
  value?: number | null
}>()

const { dict } = useDictStore()
const label = ref<string>('')

// 獲取字典標籤
async function getLabel() {
  const dictData = await dict(props.dictType)
  const valueMap = dictData.valueMap()
  if (props.value !== undefined && props.value !== null && valueMap[props.value]) {
    label.value = valueMap[props.value].label
  }
}

onMounted(() => {
  getLabel()
})
</script>

<template>
  <span>{{ label }}</span>
</template>

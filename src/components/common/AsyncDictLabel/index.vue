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
  try {
    const dictData = await dict(props.dictType)
    const valueMap = dictData.valueMap()
    if (props.value !== undefined && props.value !== null && valueMap[props.value]) {
      label.value = valueMap[props.value].label
    }
  }
  catch (error) {
    console.warn(`Unable to load dictionary tag ${props.dictType}:`, error)
    // 發生錯誤時，顯示原始值或空字串
    label.value = props.value?.toString() || ''
  }
}

onMounted(() => {
  getLabel()
})
</script>

<template>
  <span>{{ label }}</span>
</template>

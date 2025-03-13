<script setup lang="ts">
interface Props {
  total?: number
  pageSize?: number
  currentPage?: number
}
const {
  total: propTotal = 0,
  pageSize: propPageSize = 10,
  currentPage: propCurrentPage = 1,
} = defineProps<Props>()

const emit = defineEmits<{
  change: [page: number, pageSize: number] // 具名元组语法
}>()

const page = ref(propCurrentPage)
const pageSize = ref(propPageSize)
const displayOrder: Array<'pages' | 'size-picker' | 'quick-jumper'> = ['size-picker', 'pages']
const pageSizeOptions = computed(() => {
  const arr = [10, 20, 30, 50]
  if (arr.includes(propPageSize)) {
    return arr
  }
  else {
    return [...arr, propPageSize].sort((a, b) => a - b)
  }
})

function changePage() {
  emit('change', page.value, pageSize.value)
}
</script>

<template>
  <n-pagination
    v-if="propTotal > 0"
    v-model:page="page"
    v-model:page-size="pageSize"
    :page-sizes="pageSizeOptions"
    :item-count="propTotal"
    :display-order="displayOrder"
    show-size-picker
    @update-page="changePage"
    @update-page-size="changePage"
  />
</template>

<style scoped></style>

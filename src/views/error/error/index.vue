<script setup lang="ts">
const query = useRoute().query

const tipText = decodeURIComponent(query.tipText as string) // 頁面中的提示文字
</script>

<template>
  <ErrorTip
    type="error"
    :tip-text="tipText"
  />
</template>

<style lang="scss" scoped></style>

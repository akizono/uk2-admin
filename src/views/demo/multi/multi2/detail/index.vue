<script setup lang="ts">
const { query } = useRoute()
</script>

<template>
  <n-space vertical>
    <n-alert title="目前可公開的情報" type="warning">
      這是詳情子頁，他不會出現在側邊欄,他其實是上個頁面的同級，並不是下級，這個要注意
    </n-alert>

    <n-h2>
      詳情頁id:{{ query.id }}
    </n-h2>
  </n-space>
</template>

<style scoped></style>

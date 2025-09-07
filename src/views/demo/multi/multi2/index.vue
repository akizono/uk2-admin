<script setup lang="ts">
import { $t } from '@/utils'

const router = useRouter()
</script>

<template>
  <n-card class="h-130vh">
    {{ $t('multi.noSidebarDetailPageDescription') }}
    <n-button @click="router.push({ path: '/multi/multi2/detail', query: { id: 1 } })">
      {{ $t('multi.jumpToDetailPage1') }}
    </n-button>
    <n-button @click="router.push({ path: '/multi/multi2/detail', query: { id: 2 } })">
      {{ $t('multi.jumpToDetailPage2') }}
    </n-button>
    <n-button @click="router.push({ path: '/multi/multi2/detail', query: { id: 3 } })">
      {{ $t('multi.jumpToDetailPage3') }}
    </n-button>
  </n-card>
</template>

<style scoped></style>

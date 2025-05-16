<script setup lang="ts">
defineProps<{
  /** 異常類型 403 404 500 */
  type: '403' | '404' | '500' | 'error'
  /** 提示文字 */
  tipText?: string
}>()
const router = useRouter()
</script>

<template>
  <div class="flex-col-center h-full">
    <img v-if="type === '403'" src="@/assets/svg/error-403.svg" class="w-1/3">
    <img v-else-if="type === '404'" src="@/assets/svg/error-404.svg" class="w-1/3">
    <img v-else-if="type === '500'" src="@/assets/svg/error-500.svg" class="w-1/3">
    <img v-else-if="type === 'error'" src="@/assets/imgs/error.png" class="w-1/3">

    <p v-if="tipText" class="mt-10 text-2xl font-bold" v-html="tipText" />

    <n-button
      type="primary"
      class="mt-10"
      @click="router.push('/')"
    >
      {{ $t('app.backHome') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { $t } from '@/utils'

const text = ref('UK2-Admin QR Code')
</script>

<template>
  <n-card title="二维码">
    <n-alert :show-icon="false" type="info">
      {{ $t('QRCode.qrCodeExample') }}
    </n-alert>
    <n-qr-code :value="text" />
    <n-input v-model:value="text" :maxlength="60" type="text" />
  </n-card>
</template>

<style scoped></style>

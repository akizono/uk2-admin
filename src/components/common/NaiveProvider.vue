<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'
import { setdialog } from '@/utils/dialog'

// 掛載naive元件的方法至window, 以便在路由鉤子函數和請求函數裡面調用
function registerNaiveTools() {
  window.$loadingBar = useLoadingBar()
  const dialog = useDialog()

  // 掛載 dialog 到全域變數
  window.$dialog = dialog

  // 設置 dialog 實例到 utils/dialog.ts 中
  setdialog(dialog)

  window.$message = useMessage()
  window.$notification = useNotification()
}

const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools()
  },
  render() {
    return h('div')
  },
})
</script>

<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <slot />
          <NaiveProviderContent />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<style scoped></style>

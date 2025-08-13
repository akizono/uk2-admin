<script setup lang="ts">
import { downloadFile } from '@/api/demo/test'

const emit = defineEmits<{
  update: [data: any]
}>()

const filePath = ref('https://images.unsplash.com/photo-1663529628961-80aa6ebcd157?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80')

// axios 版本的狀態管理
const downloading = ref({
  loaded: 0,
  total: 0,
})
const isDownloading = ref(false)
const data = ref<Blob | null>(null)

const downloadProcess = computed(() => {
  if (!downloading.value.loaded || !downloading.value.total)
    return 0
  return Math.floor(downloading.value.loaded / downloading.value.total * 100)
})

async function handleDownloadFile() {
  try {
    isDownloading.value = true
    downloading.value = { loaded: 0, total: 0 }

    // 進度回調函數
    const onDownloadProgress = (progressEvent: any) => {
      downloading.value = {
        loaded: progressEvent.loaded || 0,
        total: progressEvent.total || 0,
      }
    }

    const result = await downloadFile(filePath.value, onDownloadProgress)
    data.value = result as Blob

    emit('update', 'fileOk')
    downloadLink(data.value, 'fileOk')
  }
  catch (error) {
    console.error('下載失敗:', error)
  }
  finally {
    isDownloading.value = false
  }
}

function abort() {
  // axios 版本的中斷下載邏輯（簡化版）
  isDownloading.value = false
  downloading.value = { loaded: 0, total: 0 }
}

function downloadLink(data: Blob, name: string) {
  const link = URL.createObjectURL(data)
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.style.display = 'none'
  eleLink.href = link
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}
</script>

<template>
  <n-card title="帶進度的下載文件" size="small">
    <n-space vertical>
      <n-input v-model:value="filePath" />
      <div>檔案大小：{{ downloading.total }}B</div>
      <div>已下載：{{ downloading.loaded }}B</div>
      <n-progress type="line" indicator-placement="inside" :percentage="downloadProcess" />
      <n-space>
        <n-button strong secondary @click="handleDownloadFile">
          開始下載
        </n-button>
        <n-button strong secondary type="warning" @click="abort">
          中斷下載
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { downloadFile } from '@/api/demo/test'
import { $t } from '@/utils'

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
    console.error(`${$t('downLoad.downloadFailed')}:`, error)
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
  <n-card :title="$t('downLoad.downloadFileWithProgress')" size="small">
    <n-space vertical>
      <n-input v-model:value="filePath" />
      <div>{{ $t('downLoad.fileSize') }}：{{ downloading.total }}B</div>
      <div>{{ $t('downLoad.downloaded') }}：{{ downloading.loaded }}B</div>
      <n-progress type="line" indicator-placement="inside" :percentage="downloadProcess" />
      <n-space>
        <n-button strong secondary @click="handleDownloadFile">
          {{ $t('downLoad.startDownload') }}
        </n-button>
        <n-button strong secondary type="warning" @click="abort">
          {{ $t('downLoad.abortDownload') }}
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<style scoped>

</style>

<script setup lang="tsx">
import FileUpload from '@/components/common/FileUpload/index.vue'

defineOptions({
  name: 'File Upload Demo',
})

const fileList = ref([])

const fileType = ref<'img' | 'list'>('list')
function handleFileType(type: 'img' | 'list') {
  fileType.value = type
}
</script>

<template>
  <n-card title="檔案上傳案例">
    <FileUpload
      v-model="fileList"
      :max-file-count="5"
      :max-file-size="10"
      :filetype="fileType"
      :file-extension="['jpg', 'jpeg', 'png', 'gif', 'webp']"
      :auto-upload="true"
    />

    <n-divider />

    <n-button type="primary" :disabled="fileType === 'img'" class="m-r-10px" @click="handleFileType('img')">
      圖片模式
    </n-button>
    <n-button type="primary" :disabled="fileType === 'list'" @click="handleFileType('list')">
      列表模式
    </n-button>
  </n-card>
</template>

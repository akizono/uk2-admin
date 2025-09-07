<script setup lang="tsx">
import FileUpload from '@/components/common/FileUpload/index.vue'
import { $t } from '@/utils'

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
  <n-card :title="$t('fileUpload.fileUploadTitle')">
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
      {{ $t('fileUpload.imageMode') }}
    </n-button>
    <n-button type="primary" :disabled="fileType === 'list'" @click="handleFileType('list')">
      {{ $t('fileUpload.listMode') }}
    </n-button>
  </n-card>
</template>

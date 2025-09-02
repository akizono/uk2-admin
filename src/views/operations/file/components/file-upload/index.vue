<script setup lang="tsx">
import FileUpload from '@/components/common/FileUpload/index.vue'

const modalRef = ref()
const modalTitle = ref('上傳檔案')

const fileList = ref([])

defineExpose({
  openModal: () => {
    // 打開模態框
    modalRef.value.showModal()
  },
})
</script>

<template>
  <PageModal
    ref="modalRef"
    :title="modalTitle"
    width="700px"
  >
    <FileUpload
      v-model="fileList"
      :max-file-count="5"
      :max-file-size="10"
      filetype="list"
      :auto-upload="true"
    />
  </PageModal>
</template>

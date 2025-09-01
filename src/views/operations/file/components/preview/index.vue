<script setup lang="tsx">
import type { FileVO } from '@/api/operations/file'

const modalRef = ref()
const modalTitle = ref('')

const rowData = ref({} as FileVO)

defineExpose({
  openModal: (row: FileVO) => {
    // 設置模態框的標題
    modalTitle.value = row.name
    // 設置行數據
    rowData.value = row

    // 打開模態框
    modalRef.value.showModal()
  },
})
</script>

<template>
  <PageModal
    ref="modalRef"
    :title="`${modalTitle} - 預覽`"
    width="90%"
  >
    <div class="w-full h-full flex flex-col justify-center items-center">
      <div class="w-full flex">
        <n-descriptions class="m-r-10px w-full flex-1" label-placement="left" bordered :column="2">
          <n-descriptions-item label="ID" :span="2">
            {{ rowData.id }}
          </n-descriptions-item>
          <n-descriptions-item label="檔案名稱" :span="2">
            {{ rowData.name }}
          </n-descriptions-item>
          <n-descriptions-item label="檔案路徑" :span="2">
            {{ rowData.path }}
          </n-descriptions-item>
          <n-descriptions-item label="檔案URL" :span="2">
            {{ rowData.url }}
          </n-descriptions-item>
          <n-descriptions-item label="檔案類型" :span="2">
            {{ rowData.type }}
          </n-descriptions-item>
          <n-descriptions-item label="檔案大小" :span="2">
            {{ rowData.size }}
          </n-descriptions-item>

          <n-descriptions-item label="備註" :span="1">
            {{ rowData.remark }}
          </n-descriptions-item>
          <n-descriptions-item label="狀態" :span="1">
            {{ rowData.status }}
          </n-descriptions-item>
          <n-descriptions-item label="建立者ID" :span="1">
            {{ rowData.creator }}
          </n-descriptions-item>
          <n-descriptions-item label="建立時間" :span="1">
            {{ rowData.createTime }}
          </n-descriptions-item>
          <n-descriptions-item label="更新者ID" :span="1">
            {{ rowData.updater }}
          </n-descriptions-item>
          <n-descriptions-item label="更新時間" :span="1">
            {{ rowData.updateTime }}
          </n-descriptions-item>
        </n-descriptions>
        <n-image
          width="100%"
          :src="rowData.url"
        />
      </div>
    </div>
  </PageModal>
</template>

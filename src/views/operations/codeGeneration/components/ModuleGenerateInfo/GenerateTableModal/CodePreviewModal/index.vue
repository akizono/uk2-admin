<script setup lang="ts">
import type { TreeData } from '@/api/operations/codeGeneration'

import CodePreview from '@/components/common/CodePreview/index.vue'
import { useBoolean } from '@/hooks'

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

// 文件樹
const treeData = ref<TreeData[]>([])

/** 打開彈出視窗 */
async function openModal(data: TreeData[]) {
  treeData.value = data
  showModal()
}

/** 關閉彈出視窗 */
function closeModal() {
  hiddenModal()
}
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    title="代碼預覽"
    class="w-[93%]"
    :segmented="{
      content: true,
      action: true,
    }"
    style="max-width: 1900px; height: 80vh;"
  >
    <CodePreview :tree-data="treeData" />
    <template #action>
      <n-space justify="center">
        <n-button @click="closeModal">
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

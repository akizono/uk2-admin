<script setup lang="ts">
import { useBoolean } from '@/hooks'
import { NCode, NTree } from 'naive-ui'

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

// 當前選中的文件的key和完整label
const selectedFileKey = ref<string>('')
const selectedFileLabel = ref<string>('')

// 樹狀菜單數據
const treeData = ref([])

// 默認選中的key（用於NTree的selected-keys）
const defaultSelectedKeys = ref<string[]>([])

// 遞迴尋找文件代碼的函數
function findFileCode(nodes: any[], fileName: string): string | undefined {
  for (const node of nodes) {
    if (node.key === fileName && node.type === 'file') {
      return node.code
    }
    if (node.children) {
      const found = findFileCode(node.children, fileName)
      if (found)
        return found
    }
  }
  return undefined
}

// 遞迴尋找第一個文件
function findFirstFile(nodes: any[]): { key: string, label: string } | null {
  for (const node of nodes) {
    if (node.type === 'file') {
      return { key: node.key, label: node.label }
    }
    if (node.children) {
      const found = findFirstFile(node.children)
      if (found)
        return found
    }
  }
  return null
}

// 獲取文件語言類型
function getFileLanguage(fileName: string) {
  const extension = fileName.split('.').pop() || ''
  return extension.toLowerCase()
}

// 處理樹節點點擊
function handleTreeSelect(keys: string[], nodes: any[]) {
  if (keys.length > 0 && nodes.length > 0) {
    selectedFileKey.value = keys[0].split('/').pop() || ''
    selectedFileLabel.value = nodes[0].label || ''
    defaultSelectedKeys.value = keys // 更新選中的keys
  }
}

/** 打開彈出視窗 */
async function openModal(data) {
  treeData.value = data

  // 尋找並設置第一個文件
  const firstFile = findFirstFile(treeData.value)
  if (firstFile) {
    selectedFileKey.value = firstFile.key
    selectedFileLabel.value = firstFile.label
    defaultSelectedKeys.value = [firstFile.key] // 設置默認選中的key
  }

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
    <div class="flex h-full">
      <!-- 左側樹狀菜單 -->
      <div class="w-1/4 pr-4 border-r border-gray-200 overflow-y-auto h-[calc(80vh-120px)]">
        <NTree
          :data="treeData"
          selectable
          :default-expand-all="true"
          :selected-keys="defaultSelectedKeys"
          @update:selected-keys="handleTreeSelect"
        />
      </div>

      <!-- 右側代碼預覽 -->
      <div class="w-3/4 pl-4 overflow-y-auto h-[calc(80vh-120px)]">
        <NCode
          v-if="selectedFileKey"
          :code="findFileCode(treeData, selectedFileKey) || ''"
          :language="getFileLanguage(selectedFileLabel)"
          show-line-numbers
          word-wrap
        />
      </div>
    </div>

    <template #action>
      <n-space justify="center">
        <n-button @click="closeModal">
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped>
:deep(.n-code) {
  height: 100% !important;
}
</style>

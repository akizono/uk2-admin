<script setup lang="ts">
import { NCode, NTree } from 'naive-ui'

const props = defineProps<{
  treeData: any[] // 文件樹
  showDiffAlert?: boolean // 是否顯示diff的提示
}>()

// 當前選中的文件的key和完整label
const selectedFileKey = ref<string>('')
const selectedFileLabel = ref<string>('')

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

onMounted(() => {
  // 尋找並設置第一個文件
  const firstFile = findFirstFile(props.treeData)
  if (firstFile) {
    selectedFileKey.value = firstFile.key
    selectedFileLabel.value = firstFile.label
    defaultSelectedKeys.value = [firstFile.key] // 設置默認選中的key
  }
})
</script>

<template>
  <div class="flex h-full">
    <!-- 左側樹狀菜單 -->
    <div class="w-1/4 pr-4 border-r border-gray-200 overflow-y-auto h-[calc(80vh-120px)]">
      <n-alert v-if="showDiffAlert" class="mb-4px" type="info">
        .diff 是為了方便查看代碼差異。實際生成的代碼依然是.ts 文件。
      </n-alert>

      <NTree
        :data="treeData" selectable :default-expand-all="true" :selected-keys="defaultSelectedKeys"
        @update:selected-keys="handleTreeSelect"
      />
    </div>

    <!-- 右側代碼預覽 -->
    <div class="w-3/4 pl-4 overflow-y-auto h-[calc(80vh-120px)]">
      <NCode
        v-if="selectedFileKey" :code="findFileCode(treeData, selectedFileKey) || ''"
        :language="getFileLanguage(selectedFileLabel)" show-line-numbers word-wrap
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.n-code) {
  height: 100% !important;
}
</style>

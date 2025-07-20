<script setup lang="ts">
import type { CodeGenerateParamsVO, TreeData } from '@/api/operations/codeGeneration'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import CodePreview from '@/components/common/CodePreview/index.vue'
import { useBoolean } from '@/hooks'
import { delay } from '@/utils/delay'

const emit = defineEmits(['success'])

const dialog = useDialog()

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制"生成實體"的loading
const { bool: generateEntityLoading, setTrue: startGenerateEntityLoading, setFalse: endGenerateEntityLoading } = useBoolean(false)

// 文件樹
const treeData = ref<TreeData[]>([])

// 代碼生成參數
let codeGenerateParams = {} as CodeGenerateParamsVO

// 生成實體代碼
async function handleGenerateEntity() {
  startGenerateEntityLoading()
  try {
    await CodeGenerationApi.insertEntityCode(codeGenerateParams)
    await delay(3000) // 生成文件後，後端需要時間進行重啟，這裡延遲3秒

    window.$message.success('生成實體成功')
    emit('success')
    closeModal()
  }
  catch (error) {
    // @ts-expect-error neglect
    if (error.status === 400) {
      dialog.error({
        title: '系統錯誤',
        content: '文件已存在！如需生成代碼，請先刪除文件',
        positiveText: '確定',
      })
    }
  }
  finally {
    endGenerateEntityLoading()
  }
}

/** 打開彈出視窗 */
async function openModal(data: TreeData[], _codeGenerateParams: CodeGenerateParamsVO) {
  treeData.value = data
  codeGenerateParams = _codeGenerateParams
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
    <n-spin :show="generateEntityLoading" size="large">
      <CodePreview :tree-data="treeData" />
    </n-spin>
    <template #action>
      <n-space justify="center">
        <n-button type="primary" :loading="generateEntityLoading" @click="handleGenerateEntity">
          生成實體
        </n-button>
        <n-button :disabled="generateEntityLoading" @click="closeModal">
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

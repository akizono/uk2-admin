<script setup lang="ts">
import { useBoolean } from '@/hooks'

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal /* setFalse: hiddenModal */ } = useBoolean(false)

// const formData = ref({

// })

// 打開彈出視
async function openModal() {
  showModal()
}

// 關閉彈出視窗
// function closeModal() {
//   hiddenModal()
// }
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible"
      :mask-closable="false"
      preset="card"
      title="創建模組"
      class="w-[90%]"
      :segmented="{
        content: true,
        action: true,
      }"
    >
      111
    </n-modal>
  </div>
</template>

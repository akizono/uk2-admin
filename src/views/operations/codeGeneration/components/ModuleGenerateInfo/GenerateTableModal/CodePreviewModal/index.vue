<script setup lang="ts">
import type { TreeOption } from 'naive-ui'

import { useBoolean } from '@/hooks'
import { NCode, NTree } from 'naive-ui'

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

// 樹狀菜單數據
const treeData: TreeOption[] = [
  {
    label: 'src',
    key: 'src',
    children: [
      {
        label: 'components',
        key: 'components',
        children: [
          {
            label: 'ModalPreview.vue',
            key: 'ModalPreview.vue',
          },
          {
            label: 'Button.vue',
            key: 'Button.vue',
          },
        ],
      },
      {
        label: 'views',
        key: 'views',
        children: [
          {
            label: 'Home.vue',
            key: 'Home.vue',
          },
          {
            label: 'About.vue',
            key: 'About.vue',
          },
        ],
      },
      {
        label: 'App.vue',
        key: 'App.vue',
      },
    ],
  },
]

// 當前選中的文件
const selectedFile = ref<string>('ModalPreview.vue')

// 代碼內容映射
const codeMap: Record<string, string> = {
  'ModalPreview.vue': `<template>
  <div class="modal-preview">
    <h1>Modal Preview Component</h1>
    <n-button @click="showModal">Open Modal</n-button>
  </div>
</template>

<script setup>
import { useModal } from './useModal'

const { showModal } = useModal()
<\/script>

<style scoped>
.modal-preview {
  padding: 20px;
}
</style>`,
  'Button.vue': `<template>
  <n-button type="primary" @click="handleClick">
    <slot>Click Me</slot>
  </n-button>
</template>

<script setup>
const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
<\/script>`,
  'Home.vue': `<template>
  <div class="home">
    <h1>Welcome to Home Page</h1>
  </div>
</template>

<script setup>
// Home page logic here
<\/script>`,
  'About.vue': `<template>
  <div class="about">
    <h1>About Us</h1>
    <p>This is the about page</p>
  </div>
</template>`,
  'App.vue': `<template>
  <n-config-provider>
    <router-view />
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider } from 'naive-ui'
<\/script>`,
}

// 處理樹節點點擊
function handleTreeSelect(keys: string[]) {
  if (keys.length > 0) {
    selectedFile.value = keys[0].split('/').pop() || ''
  }
}

/** 打開彈出視窗 */
async function openModal() {
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
      <div class="w-1/4 pr-4 border-r border-gray-200 overflow-y-auto">
        <NTree
          :data="treeData"
          selectable
          :default-expand-all="true"
          @update:selected-keys="handleTreeSelect"
        />
      </div>

      <!-- 右側代碼預覽 -->
      <div class="w-3/4 pl-4 overflow-y-auto">
        <NCode
          :code="codeMap[selectedFile] || '// 請選擇一個文件'"
          language="html"
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
  height: calc(80vh - 100px) !important;
}
</style>

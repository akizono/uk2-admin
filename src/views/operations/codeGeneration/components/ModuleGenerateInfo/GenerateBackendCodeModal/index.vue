<script setup lang="tsx">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import { useBoolean } from '@/hooks'
import { hyphenToCamelCase, kebabToCamel } from '@/utils/string'

import CodePreviewModal from './CodePreviewModal/index.vue'

const props = defineProps<{
  row: CodeGenerationVO
}>()

const emit = defineEmits(['success'])

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制"查看預覽"的loading
const { bool: generatePreviewLoading, setTrue: startGeneratePreviewLoading, setFalse: endGeneratePreviewLoading } = useBoolean(false)

/** 表單映射 */
const formMap = ref<Record<string, { label: string, type: string, nullable: boolean }>>({})
const formRef = ref()
const formData = ref<Record<string, any>>({})
const formRules = ref<Record<string, any>>({})
const unitFormRef = ref()
const unitFormData = ref({
  unitName: '',
})
const unitFormRules = {
  unitName: {
    required: true,
    message: '請輸入單位名稱',
    trigger: ['input', 'blur'],
  },
}

async function getFormData() {
  const { data: result } = await CodeGenerationApi.getEntityCustomFields({
    splitName: JSON.stringify(props.row.code.split('-')),
  })

  // 設置表單映射
  formMap.value = result

  // 重設單位名稱
  unitFormData.value.unitName = ''

  // 設置表單規則
  for (const key in result) {
    formRules.value[key] = {
      required: true,
      message: `請填寫${result[key].label}範例值`,
      type: result[key].type,
      trigger: ['input', 'blur'],
    }
  }
}

/** 預覽後端代碼 */
const codePreviewModalRef = ref()
async function handleGeneratePreview() {
  // 驗證unitName表單
  try {
    await formRef.value?.validate()
    await unitFormRef.value?.validate()

    // 驗證通過，繼續處理
    startGeneratePreviewLoading()
    const codeGenerateParams = {
      timestamp: Date.now().toString(), // 時間戳記
      classNamePrefix: `${hyphenToCamelCase(props.row.code)}`, // Entit 的類名
      fileName: props.row.code,
      camelName: kebabToCamel(props.row.code),
      splitName: props.row.code.split('-'),
      exampleData: formData.value,
      unitName: unitFormData.value.unitName,
      columns: formMap.value,

    }
    const { data: result } = await CodeGenerationApi.previewBackendCode(codeGenerateParams)
    codePreviewModalRef.value?.openModal(result.treeData, codeGenerateParams)
  }
  finally {
    endGeneratePreviewLoading()
  }
}

/** 生成後端代碼成功 */
function handleGenerateSuccess() {
  closeModal()
  emit('success')
}

/** 打開彈出視窗 */
async function openModal() {
  getFormData()
  showModal()
}

/** 關閉彈出視窗 */
function closeModal() {
  hiddenModal()
}

onMounted(() => {
  setTimeout(() => {
    formData.value = {
      id: '10001',
      name: '香香',
      age: 14,
      idCard: '123456789012345678',
    }
    unitFormData.value.unitName = '學生'
  }, 1000)
})
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible" :mask-closable="false" preset="card" title="生成後端程式碼" class="w-[95%]" :segmented="{
        content: true,
        action: true,
      }" style="max-width: 2000px;"
    >
      <n-spin :show="generatePreviewLoading" size="large">
        <div class="overflow-y-auto" style="height: calc(100vh - 300px);">
          <NSpace vertical class="flex-1">
            <!-- 基本屬性卡片 -->
            <n-card>
              <template #header>
                <div class="flex items-center gap-1">
                  <span class="text-base font-medium">基本屬性</span>
                  <n-popover trigger="hover">
                    <template #trigger>
                      <icon-park-outline:help class="cursor-pointer" />
                    </template>
                    <span>提示：下方表單是系統根據實體自動生成的，輸入的數據僅作為範例，不會存入資料庫中，主要用於swagger文件的展示。</span>
                  </n-popover>
                </div>
              </template>
              <n-form
                ref="formRef"
                :rules="formRules"
                label-placement="left"
                :model="formData"
                label-align="left"
                :label-width="120"
              >
                <n-grid :cols="24" :x-gap="24" :y-gap="16">
                  <n-form-item-grid-item
                    v-for="(key) in Object.keys(formMap)" :key="key" :span="12"
                    :label="formMap[key].label"
                    :path="key"
                  >
                    <n-input v-if="formMap[key].type === 'string'" v-model:value="formData[key]" />
                    <n-input-number v-if="formMap[key].type === 'number'" v-model:value="formData[key]" />
                  </n-form-item-grid-item>
                </n-grid>
              </n-form>
            </n-card>

            <!-- 單位名稱卡片 -->
            <n-card>
              <template #header>
                <div class="flex items-center gap-1">
                  <span class="text-base font-medium">單位名稱設置</span>
                  <n-popover trigger="hover">
                    <template #trigger>
                      <icon-park-outline:help class="cursor-pointer" />
                    </template>
                    <span>設置單位的顯示名稱，這將用於展示和識別目的。</span>
                  </n-popover>
                </div>
              </template>
              <n-form
                ref="unitFormRef" :model="unitFormData" :rules="unitFormRules" label-placement="left"
                label-align="left" :label-width="120"
              >
                <n-form-item label="unit-name:" path="unitName">
                  <n-input v-model:value="unitFormData.unitName" placeholder="請輸入單位名稱" />
                </n-form-item>
              </n-form>
            </n-card>
          </NSpace>
        </div>
      </n-spin>

      <template #action>
        <n-space justify="center">
          <n-button type="primary" :loading="generatePreviewLoading" @click="handleGeneratePreview">
            查看預覽
          </n-button>
          <n-button :disabled="generatePreviewLoading" @click="closeModal">
            取消
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 預覽生成代碼的彈出視窗 -->
    <CodePreviewModal ref="codePreviewModalRef" @success="handleGenerateSuccess" />
  </div>
</template>

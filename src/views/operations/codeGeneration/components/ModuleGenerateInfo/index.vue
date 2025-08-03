<script setup lang="ts">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'

import { NButton, NCard, NSpace, NTag } from 'naive-ui'

import GenerateBackendCode from './GenerateBackendCodeModal/index.vue'
import GenerateEntityModal from './GenerateEntityModal/index.vue'
import GenerateWebCodeModal from './GenerateWebCodeModal/index.vue'

const props = defineProps<{
  row: CodeGenerationVO
}>()

const emit = defineEmits(['success'])

const generateEntityModalRef = ref()
function handleGenerateEntity() {
  generateEntityModalRef.value.openModal()
}
function handleGenerateEntitySuccess() {
  emit('success', 'isGenerateEntity')
}

const generateBackendCodeRef = ref()
function handleGenerateBackendCode() {
  generateBackendCodeRef.value.openModal()
}
function handleGenerateBackendCodeSuccess() {
  emit('success', 'isGenerateBackendCode')
}

const generateWebCodeModalRef = ref()
function handleGenerateWebCode() {
  generateWebCodeModalRef.value.openModal()
}
function handleGenerateWebCodeSuccess() {
  emit('success', 'isGenerateWebCode')
}
</script>

<template>
  <NCard embedded :bordered="false">
    <NSpace vertical size="large">
      <!-- 模組基本資訊 -->
      <div class="mb-10px">
        <h3 class="text-18px font-bold">
          {{ props.row.name }}
          <span class="text-14px font-normal">
            ({{ props.row.code }})
          </span>
        </h3>
      </div>

      <n-flex>
        <!-- 創建實體 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-database-setting />
              </n-icon>
              <span>創建實體</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="row.isGenerateEntity === 1 ? 'success' : 'error'" size="small">
                {{ row.isGenerateEntity === 1 ? '實體已創建' : '實體未創建' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" @click="handleGenerateEntity">
              創建實體
            </NButton>
          </div>
        </NCard>

        <!-- 生成後端代碼 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-code />
              </n-icon>
              <span>生成後端代碼</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="row.isGenerateBackendCode === 1 ? 'success' : 'error'" size="small">
                {{ row.isGenerateBackendCode === 1 ? '後端代碼已生成' : '後端代碼未生成' }}
              </NTag>
            </div>
            <NButton
              type="primary"
              size="small"
              class="action-button"
              :disabled="row.isGenerateEntity === 0"
              @click="handleGenerateBackendCode"
            >
              生成後端代碼
            </NButton>
          </div>
        </NCard>

        <!-- 生成前端代碼 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-code />
              </n-icon>
              <span>生成前端代碼</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="row.isGenerateWebCode === 1 ? 'success' : 'error'" size="small">
                {{ row.isGenerateWebCode === 1 ? '前端代碼已生成' : '前端代碼未生成' }}
              </NTag>
            </div>
            <NButton
              type="primary"
              size="small"
              class="action-button"
              :disabled="row.isGenerateBackendCode === 0"
              @click="handleGenerateWebCode"
            >
              生成前端代碼
            </NButton>
          </div>
        </NCard>

        <!-- 導入菜單 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-application-menu />
              </n-icon>
              <span>導入菜單和權限</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="row.isImportMenuAndPermission === 1 ? 'success' : 'error'" size="small">
                {{ row.isImportMenuAndPermission === 1 ? '菜單已導入' : '菜單未導入' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" :disabled="row.isGenerateWebCode === 0">
              導入菜單
            </NButton>
          </div>
        </NCard>
      </n-flex>
    </NSpace>

    <GenerateEntityModal ref="generateEntityModalRef" :row="props.row" @success="handleGenerateEntitySuccess" />
    <GenerateBackendCode ref="generateBackendCodeRef" :row="props.row" @success="handleGenerateBackendCodeSuccess" />
    <GenerateWebCodeModal ref="generateWebCodeModalRef" :row="props.row" @success="handleGenerateWebCodeSuccess" />
  </NCard>
</template>

<style scoped lang="scss">
.status-card {
  flex: 1;

  width: 100%;
  max-width: 220px;
  transition: all 0.3s ease;

  .card-header {
    display: flex;
    align-items: center;
    font-weight: 600;

    .n-icon {
      margin-right: 8px;
      color: #18a058;
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .status-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-button {
      width: 100%;
      margin-top: 4px;
    }
  }
}
</style>

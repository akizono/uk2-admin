<script setup lang="ts">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'

import { NButton, NCard, NSpace, NTag } from 'naive-ui'

import GenerateTableModal from './GenerateTableModal/index.vue'

const props = defineProps<{
  row: CodeGenerationVO
}>()

const GenerateTableModalRef = ref()
function handleGenerateTable() {
  GenerateTableModalRef.value.openModal()
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
        <!-- 創建資料表 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-database-setting />
              </n-icon>
              <span>創建資料表</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="row.isGenerateTable === 1 ? 'success' : 'error'" size="small">
                {{ row.isGenerateTable === 1 ? '資料表已創建' : '資料表未創建' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" @click="handleGenerateTable">
              創建資料表
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
            <NButton type="primary" size="small" class="action-button" :disabled="row.isGenerateTable === 0">
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
            <NButton type="primary" size="small" class="action-button" :disabled="row.isGenerateBackendCode === 0">
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

    <GenerateTableModal ref="GenerateTableModalRef" />
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

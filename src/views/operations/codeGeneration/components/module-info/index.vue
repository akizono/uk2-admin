<script setup lang="ts">
import type { TableRow } from '../../type'

import { NButton, NCard, NSpace, NTag } from 'naive-ui'

const props = defineProps<{
  row: TableRow
}>()

// 模擬狀態數據，實際應用中應該從 props.row 中獲取
const status = {
  database: false,
  backend: false,
  frontend: false,
  menu: false,
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
        <!-- 創建資料庫 -->
        <NCard class="status-card" size="small">
          <template #header>
            <div class="card-header">
              <n-icon>
                <icon-park-outline-database-setting />
              </n-icon>
              <span>創建資料庫</span>
            </div>
          </template>
          <div class="card-content">
            <div class="status-row">
              <span>狀態：</span>
              <NTag :type="status.database ? 'success' : 'error'" size="small">
                {{ status.database ? '資料庫已創建' : '資料庫未創建' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button">
              創建資料庫
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
              <NTag :type="status.backend ? 'success' : 'error'" size="small">
                {{ status.backend ? '後端代碼已生成' : '後端代碼未生成' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" :disabled="!status.database">
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
              <NTag :type="status.frontend ? 'success' : 'error'" size="small">
                {{ status.frontend ? '前端代碼已生成' : '前端代碼未生成' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" :disabled="!status.backend">
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
              <NTag :type="status.menu ? 'success' : 'error'" size="small">
                {{ status.menu ? '菜單已導入' : '菜單未導入' }}
              </NTag>
            </div>
            <NButton type="primary" size="small" class="action-button" :disabled="!status.frontend">
              導入菜單
            </NButton>
          </div>
        </NCard>
      </n-flex>
    </NSpace>
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

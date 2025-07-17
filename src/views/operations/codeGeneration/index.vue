<script setup lang="tsx">
import type { TableRow } from './type'
import type { DataTableColumns, FormInst, NDataTable } from 'naive-ui'

import { useBoolean } from '@/hooks'
import { delay } from '@/utils/delay'
import { NButton, NPopconfirm, NSpace } from 'naive-ui'

import ModuleInfo from './components/module-info/index.vue'
import ModuleModal from './components/module-modal/index.vue'

// 表格的載入狀態
const { bool: tableLoading, setTrue: startTableLoading, setFalse: endTableLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const delBtnLoadMap = ref<Record<string, boolean>>({})

/** 列表 */
const formRef = ref<FormInst | null>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const moduleModalRef = ref()
const total = ref(100)
const queryParams = ref<Record<string, any>>({})
const initQueryParams = {
  currentPage: 1,
  pageSize: 10,

  name: null,
  code: null,
}
const list = ref<TableRow[]>([])
const columns = ref<DataTableColumns<TableRow>>([
  {
    type: 'selection',
    key: 'selection',
  },
  {
    type: 'expand',
    // expandable: rowData => rowData.name !== 'Jim Green',
    renderExpand: (row: TableRow) => {
      return <ModuleInfo row={row} />
    },
  },
  {
    key: 'name',
    title: '模組名稱',
  },
  {
    key: 'code',
    title: '模組標識',
  },
  {
    key: 'actions',
    title: '操作',
    width: 250,
    align: 'center',
    render: (row: TableRow) => {
      return (
        <NSpace justify="center">
          <NButton
            size="small"
            onClick={() => {
              moduleModalRef.value.openModal('edit', row)
            }}
          >
            編輯
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row)}>
            {{
              default: () => '確認刪除本項?',
              trigger: () => (
                <NButton
                  size="small"
                  type="error"
                  loading={delBtnLoadMap.value[row.id!]}
                >
                  刪除
                </NButton>
              ),
            }}
          </NPopconfirm>
        </NSpace>
      )
    },
  },
])
async function getList() {
  startTableLoading()

  await delay(300)
  list.value.push({
    id: `${Date.now()}`,
    name: 'test',
    code: 'test',
  })
  endTableLoading()
}
async function handleResetSearch() {
  queryParams.value = { ...initQueryParams }
  await getList()
}

/** 模組彈出視窗成功 */
function moduleModalSuccess(data: TableRow & { modalType: ModalType }) {
  const { modalType, ...remain } = data

  if (modalType === 'add') {
    list.value.push(remain as TableRow)
  }
  else if (modalType === 'edit') {
    const index = list.value.findIndex(item => item.id === remain.id)
    if (index > -1) {
      list.value[index] = { ...list.value[index], ...remain }
    }
  }
}

/** 刪除 */
async function handleDelete(row: TableRow) {
  delBtnLoadMap.value[row.id!] = true

  // 後端刪除
  await delay(500)

  // 後端刪除成功後，再從前端移除
  const index = list.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    list.value.splice(index, 1)
  }

  window.$message.success(`已經刪除${row.name}`)

  delBtnLoadMap.value[row.id!] = false
}

/** 批次刪除 */
const showBatchDeleteModalRef = ref(false)
const batchDeleteLoading = ref(false)
const checkedRowKeys = ref<string[]>([])
function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) {
    window.$message.warning('請至少選擇一條紀錄')
    return
  }
  showBatchDeleteModalRef.value = true
}
function confirmBatchDelete() {
  try {
    batchDeleteLoading.value = true

    // 儲存已成功刪除的 ID 列表
    const successDeletedIds: string[] = []

    // 依序刪除選中的紀錄，先完成所有後端刪除請求
    for (const id of checkedRowKeys.value) {
      try {
        // await props.deleteFunction!(id)
        // 後端刪除成功，將 ID 添加到成功列表
        successDeletedIds.push(id)
      }
      catch (error) {
        console.error(`刪除 ID ${id} 失敗:`, error)
        window.$message.error(`刪除 ID ${id} 失敗`)
      }
    }

    // 後端刪除成功後，從前端移除這些項目
    for (const id of successDeletedIds) {
      // 先在最外層尋找
      const index = list.value.findIndex((item: TableRow) => item.id === id)
      if (index > -1) {
        list.value.splice(index, 1)
      }
    }

    if (successDeletedIds.length > 0) {
      window.$message.success(`已批次刪除 ${successDeletedIds.length} 條紀錄`)
    }

    // 只移除成功刪除的 ID
    checkedRowKeys.value = checkedRowKeys.value.filter(id => !successDeletedIds.includes(id))

    // 如果沒有剩餘選中項，關閉對話框
    if (checkedRowKeys.value.length === 0) {
      showBatchDeleteModalRef.value = false
    }
    else {
      // 如果有剩餘的未成功刪除的項目，顯示提示
      window.$message.warning(`有 ${checkedRowKeys.value.length} 條紀錄未能成功刪除`)
    }
  }
  catch {
    window.$message.error('批次刪除過程中發生錯誤')
  }
  finally {
    batchDeleteLoading.value = false
  }
}

/** 分頁器 */
function changePage(page: number, size: number) {
  queryParams.value.currentPage = page
  queryParams.value.pageSize = size
  getList()
}

onMounted(async () => {
  await getList()
})
</script>

<template>
  <NSpace vertical class="flex-1">
    <n-alert type="warning" closable>
      只有在該頁面創建的模組會顯示在這此處，請務必將流程跑完再手動修改或操作代碼。
    </n-alert>
    <n-card>
      <n-form ref="formRef" :model="queryParams" label-placement="left" inline :show-feedback="false">
        <n-flex>
          <n-form-item label="模組名" path="name">
            <n-input v-model:value="queryParams.name" placeholder="請輸入Name" />
          </n-form-item>
          <n-form-item label="模組標識" path="code">
            <n-input v-model:value="queryParams.code" placeholder="請輸入Code" />
          </n-form-item>
          <n-flex class="ml-auto">
            <NButton type="primary" @click="getList">
              <template #icon>
                <icon-park-outline-search />
              </template>
              搜索
            </NButton>
            <NButton strong secondary @click="handleResetSearch">
              <template #icon>
                <icon-park-outline-redo />
              </template>
              重設
            </NButton>
          </n-flex>
        </n-flex>
      </n-form>
    </n-card>

    <n-card class="flex-1">
      <template #header>
        <n-flex justify="space-between">
          <div>
            <NButton type="primary" strong @click="moduleModalRef.openModal('add')">
              <template #icon>
                <icon-park-outline-add-web />
              </template>
              創建模組
            </NButton>
            <NButton type="error" class="m-l-10px" :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete">
              <template #icon>
                <icon-park-outline-delete />
              </template>
              批次刪除
            </NButton>
          </div>
        </n-flex>
      </template>
      <NSpace vertical>
        <n-data-table ref="tableRef" v-model:checked-row-keys="checkedRowKeys" :data="list" :loading="tableLoading" :columns="columns" :row-key="row => row.id" />
        <Pagination
          :total="total" :page-size="queryParams.pageSize"
          :current-page="queryParams.currentPage" @change="changePage"
        />
      </NSpace>
    </n-card>

    <ModuleModal ref="moduleModalRef" @success="moduleModalSuccess" />

    <!-- 批次刪除確認 Modal -->
    <n-modal
      v-model:show="showBatchDeleteModalRef"
      preset="dialog"
      title="確認刪除"
      positive-text="確認"
      negative-text="取消"
      :loading="batchDeleteLoading"
      @positive-click="confirmBatchDelete"
      @negative-click="() => { showBatchDeleteModalRef = false }"
    >
      <template #default>
        確定要刪除選中的 {{ checkedRowKeys.length }} 條紀錄嗎？此操作無法復原！
      </template>
    </n-modal>
  </NSpace>
</template>

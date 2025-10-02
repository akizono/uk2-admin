<script setup lang="tsx">
import type { CodeGenerationVO } from '@/api/operations/codeGeneration'
import type { DataTableColumns, FormInst, NDataTable } from 'naive-ui'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import { useBoolean } from '@/hooks'
import { NButton, NPopconfirm, NSpace, useDialog } from 'naive-ui'

import ModuleGenerateInfo from './components/ModuleGenerateInfo/index.vue'
import TableModal from './components/TableModal/index.vue'

defineOptions({
  name: 'Code Generation',
})

const dialog = useDialog()

// 表格的載入狀態
const { bool: tableLoading, setTrue: startTableLoading, setFalse: endTableLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const delBtnLoadMap = ref<Record<string, boolean>>({})

/** 列表 */
const formRef = ref<FormInst | null>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const TableModalRef = ref()
const total = ref(100)
const initQueryParams = {
  currentPage: 1,
  pageSize: 10,

  name: null,
  code: null,
}
const queryParams = ref<Record<string, any>>({ ...initQueryParams })
const list = ref<CodeGenerationVO[]>([])
const columns = ref<DataTableColumns<CodeGenerationVO>>([
  {
    type: 'selection',
    key: 'selection',
  },
  {
    type: 'expand',
    expandable: (row: CodeGenerationVO) => row.status === 1,
    renderExpand: (row: CodeGenerationVO) => {
      return (
        <ModuleGenerateInfo
          row={row}
          onSuccess={
            (key: 'isGenerateBackendCode' | 'isGenerateWebCode' | 'isGenerateEntity' | 'isImportMenuAndPermission') =>
              handleModuleGenerateSuccess(row, key)
          }
        />
      )
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
    key: 'status',
    title: '狀態',
    render: (row: CodeGenerationVO) => {
      return (
        <n-switch
          value={row.status}
          checked-value={1}
          unchecked-value={0}
          onUpdateValue={(value: 0 | 1) => {
            handleStatusChange(row, value)
          }}
        >
          {{ checked: () => '啟用', unchecked: () => '鎖定' }}
        </n-switch>
      )
    },
  },
  {
    key: 'actions',
    title: '操作',
    width: 250,
    align: 'center',
    render: (row: CodeGenerationVO) => {
      const updatePermi = ['operations:code-generation:update']
      const deletePermi = ['operations:code-generation:delete']

      return (
        <NSpace justify="center">
          <NButton
            size="small"
            v-hasPermi={updatePermi}
            onClick={() => {
              TableModalRef.value.openModal('edit', row)
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
                  v-hasPermi={deletePermi}
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
  try {
    startTableLoading()

    const { data: result } = await CodeGenerationApi.getCodeGenerationList(queryParams.value)
    list.value = result.list
    total.value = result.total
  }
  finally {
    endTableLoading()
  }
}
async function handleResetSearch() {
  queryParams.value = { ...initQueryParams }
  await getList()
}
function handleStatusChange(row: CodeGenerationVO, value: 0 | 1) {
  const updateStatus = () => {
    const index = list.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      list.value[index].status = value
    }
  }

  if (value === 1) {
    dialog.warning({
      title: '警告',
      content: '生成的新代碼會覆蓋原有文件中的所有代碼，請確認是否繼續？',
      positiveText: '確認',
      negativeText: '取消',
      draggable: true,
      onPositiveClick: () => {
        CodeGenerationApi.unblockCodeGeneration(row.id!)
        updateStatus()
      },
    })
  }
  else {
    CodeGenerationApi.blockCodeGeneration(row.id!)
    updateStatus()
  }
}

/** 模組彈出視窗成功 */
function TableModalSuccess(data: CodeGenerationVO & { modalType: ModalType }) {
  const { modalType, ...remain } = data

  if (modalType === 'add') {
    list.value.push(remain as CodeGenerationVO)
  }
  else if (modalType === 'edit') {
    const index = list.value.findIndex(item => item.id === remain.id)
    if (index > -1) {
      list.value[index] = { ...list.value[index], ...remain }
    }
  }
}

/** 模組生成成功 */
function handleModuleGenerateSuccess(row: CodeGenerationVO, key: 'isGenerateBackendCode' | 'isGenerateWebCode' | 'isGenerateEntity' | 'isImportMenuAndPermission') {
  const index = list.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    list.value[index][key] = 1
  }
}

/** 刪除 */
async function handleDelete(row: CodeGenerationVO) {
  delBtnLoadMap.value[row.id!] = true

  // 後端刪除
  await CodeGenerationApi.deleteCodeGeneration(row.id!)

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
async function confirmBatchDelete() {
  try {
    batchDeleteLoading.value = true

    // 儲存已成功刪除的 ID 列表
    const successDeletedIds: string[] = []

    // 依序刪除選中的紀錄，先完成所有後端刪除請求
    for (const id of checkedRowKeys.value) {
      try {
        await CodeGenerationApi.deleteCodeGeneration(id)
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
      const index = list.value.findIndex((item: CodeGenerationVO) => item.id === id)
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
      <div>只有在該頁面創建的模組會顯示在本頁，請務必將流程跑完再手動修改或操作代碼;</div>
      <div>後端熱重載可能會導致生成代碼時無響應，建議操作前使用 <code>pnpm start:dev:no-watch</code> 啟動後端，而不是使用 <code>pnpm start:dev</code>;</div>
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
            <NButton
              v-hasPermi="['operations:code-generation:create']" type="primary" strong
              @click="TableModalRef.openModal('add')"
            >
              <template #icon>
                <icon-park-outline-add-web />
              </template>
              創建模組
            </NButton>
            <NButton
              v-hasPermi="['operations:code-generation:delete']" type="error" class="m-l-10px"
              :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete"
            >
              <template #icon>
                <icon-park-outline-delete />
              </template>
              批次刪除
            </NButton>
          </div>
        </n-flex>
      </template>
      <NSpace vertical>
        <n-data-table
          ref="tableRef" v-model:checked-row-keys="checkedRowKeys" :data="list" :loading="tableLoading"
          :columns="columns" :row-key="row => row.id"
        />
        <Pagination
          :total="total" :page-size="queryParams.pageSize" :current-page="queryParams.currentPage"
          @change="changePage"
        />
      </NSpace>
    </n-card>

    <TableModal ref="TableModalRef" @success="TableModalSuccess" />

    <!-- 批次刪除確認 Modal -->
    <n-modal
      v-model:show="showBatchDeleteModalRef" preset="dialog" title="確認刪除" positive-text="確認" negative-text="取消"
      :loading="batchDeleteLoading" @positive-click="confirmBatchDelete"
      @negative-click="() => { showBatchDeleteModalRef = false }"
    >
      <template #default>
        確定要刪除選中的 {{ checkedRowKeys.length }} 條紀錄嗎？此操作無法復原！
      </template>
    </n-modal>
  </NSpace>
</template>

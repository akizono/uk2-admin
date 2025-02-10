<script setup lang="tsx">
import type { DataTableColumns, FormInst } from 'naive-ui'
import { createCopyableDialog } from '@/utils/dialog'
import { useBoolean } from '@/hooks'

import { NButton, NPopconfirm, NSpace, NSwitch } from 'naive-ui'
import CopyText from '@/components/custom/CopyText.vue'
import TableModal from './components/TableModal.vue'

import type * as USER_DTO from '@/api/user/dto.type'
import type * as USER_RESPONSE from '@/api/user/response.type'
import { blockUser, deleteUser, getUserList, unblockUser } from '@/api/user'
import type { Success } from './components/TableModal.type'

// 列表的載入狀態
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const deleteButtonLoadingMap = ref<Record<string, boolean>>({})

// 查詢參數
const formRef = ref<FormInst | null>()
const total = ref(0)
const initQueryParams: USER_DTO.UserList = {
  pageSize: 10,
  currentPage: 1,

  username: '',
  nickname: '',
  age: undefined,
  sex: undefined,
  email: '',
  mobile: '',
  status: undefined,
}
const queryParams = ref({ ...initQueryParams })
function handleResetSearch() {
  queryParams.value = { ...initQueryParams }
}

// 列表
const modalRef = ref()
const list = ref<USER_RESPONSE.UserInfo[]>([])
const columns: DataTableColumns<USER_RESPONSE.UserInfo> = [
  {
    title: '使用者名稱',
    align: 'center',
    key: 'username',
    fixed: 'left',
  },
  {
    title: '暱稱',
    align: 'center',
    key: 'nickname',
  },
  {
    title: '年齡',
    align: 'center',
    key: 'age',
  },
  {
    title: '性別',
    align: 'center',
    key: 'sex',
    render: (row) => {
      if (row.sex)
        return row.sex === 1 ? '男' : '女'
      else
        return ''
    },
  },
  {
    title: '電子郵件',
    align: 'center',
    key: 'email',
  },
  {
    title: '手機號碼',
    align: 'center',
    key: 'tel',
    render: (row) => {
      return (
        <CopyText value={row.mobile} />
      )
    },
  },
  {
    title: '備註',
    align: 'center',
    key: 'remark',
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row) => {
      return (
        <NSwitch
          value={row.status}
          checked-value={1}
          unchecked-value={0}
          onUpdateValue={(value: 0 | 1) =>
            handleUpdateDisabled(value, row.id!)}
        >
          {{ checked: () => '啟用', unchecked: () => '禁用' }}
        </NSwitch>
      )
    },
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    width: 250,
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton
            size="small"
            onClick={() => modalRef.value.openModal('edit', row)}
          >
            編輯
          </NButton>
          <NPopconfirm onPositiveClick={() => delteteUser(row)}>
            {{
              default: () => '確認刪除',
              trigger: () => (
                <NButton
                  size="small"
                  type="error"
                  loading={deleteButtonLoadingMap.value[row.id!]}
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
]
async function getList() {
  try {
    startLoading()
    const { data: result } = await getUserList(queryParams.value)
    list.value = result.list.map(item => item.userInfo)
    total.value = result.total
  }

  finally {
    endLoading()
  }
}

/** 刪除用戶 */
async function delteteUser(row: USER_RESPONSE.UserInfo) {
  try {
    deleteButtonLoadingMap.value[row.id!] = true

    await deleteUser(row.id!)
    list.value = list.value.filter(item => item.id !== row.id)
    window.$message.success(`已經刪除使用者:${row.username}`)
  }
  finally {
    deleteButtonLoadingMap.value[row.id!] = false
  }
}

/** 更新用戶狀態 */
function handleUpdateDisabled(value: 0 | 1, id: string) {
  const index = list.value.findIndex(item => item.id === id)
  if (index > -1)
    list.value[index].status = value

  if (value === 1)
    unblockUser(id)
  else
    blockUser(id)
}

/** 分頁器 */
function changePage(page: number, size: number) {
  queryParams.value.currentPage = page
  queryParams.value.pageSize = size
  getList()
}

/**
 * 處理表單提交成功後的操作
 * 如果是新增使用者，則顯示帳號密碼提示框並將使用者加入列表
 * 如果是編輯使用者，則更新列表中對應使用者的資料
 */
function tableModalSuccess(params: Success) {
  const { type, password, ...remain } = params

  if (type === 'add') {
    const tips = `帳號：${remain.username}<br />密碼：${password}<br />請盡快登錄系統修改您的默認密碼。`
    createCopyableDialog({
      title: '新增使用者成功',
      content: tips,
      positiveText: '確認',
      negativeText: '複製資訊',
    })
    list.value.push(remain)
  }

  if (type === 'edit') {
    const index = list.value.findIndex(item => item.id === remain.id)
    if (index > -1)
      list.value[index] = { ...list.value[index], ...remain }
  }
}

onMounted(() => {
  getList()
})
</script>

<template>
  <NSpace vertical class="flex-1">
    <n-card>
      <n-form ref="formRef" :model="queryParams" label-placement="left" inline :show-feedback="false">
        <n-flex>
          <n-form-item label="使用者名稱" path="username" class="!w-64">
            <n-input v-model:value="queryParams.username" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="暱稱" path="nickname" class="!w-64">
            <n-input v-model:value="queryParams.nickname" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="年齡" path="age" class="!w-64">
            <n-input-number v-model:value="queryParams.age" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="性別" path="sex" class="!w-64">
            <n-select
              v-model:value="queryParams.sex"
              :options="[
                { label: '男', value: 1 },
                { label: '女', value: 2 },
              ]"
              placeholder="請選擇"
              clearable
              class="max-w-40 w-100"
            />
          </n-form-item>
          <n-form-item label="電子郵件" path="email" class="!w-64">
            <n-input v-model:value="queryParams.email" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="手機號碼" path="mobile" class="!w-64">
            <n-input v-model:value="queryParams.mobile" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="狀態" path="status" class="!w-64">
            <n-select
              v-model:value="queryParams.status"
              :options="[
                { label: '啟用', value: 1 },
                { label: '禁用', value: 0 },
              ]"
              placeholder="請選擇"
              clearable
              class="max-w-40 w-100"
            />
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
        <NButton type="primary" @click="modalRef.openModal('add')">
          <template #icon>
            <icon-park-outline-add-one />
          </template>
          新建使用者
        </NButton>
      </template>
      <NSpace vertical>
        <n-data-table :scroll-x="1300" :columns="columns" :data="list" :loading="loading" />
        <Pagination :total="total" :page-size="queryParams.pageSize" :current-page="queryParams.currentPage" @change="changePage" />
      </NSpace>

      <TableModal ref="modalRef" modal-name="使用者" @success="tableModalSuccess" />
    </n-card>
  </NSpace>
</template>

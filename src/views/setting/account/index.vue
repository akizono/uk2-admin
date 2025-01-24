<script setup lang="tsx">
import type { UserInfo } from '@/api/user/response.type'
import type { DataTableColumns, FormInst } from 'naive-ui'
import type { UserListDTO } from '@/api/user/dto.type'
import { filterObjEmptyValues } from '@/utils/tools/object'

import { NButton, NPopconfirm, NSpace, NSwitch } from 'naive-ui'
import CopyText from '@/components/custom/CopyText.vue'
import TableModal from './components/TableModal.vue'

import { useBoolean } from '@/hooks'
import { blockUser, deleteUser, getUserList, unblockUser } from '@/api/user'

// 加载的状态
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
// 刪除按鈕的 loading 狀態追蹤
const deleteButtonLoadingMap = ref<Record<string, boolean>>({})

// 查询参数
const formRef = ref<FormInst | null>()
const total = ref(0)
const initQueryParams: UserListDTO = {
  pageSize: 10,
  currentPage: 1,

  username: '',
  nickname: '',
}
const queryParams = ref({ ...initQueryParams })
function handleResetSearch() {
  queryParams.value = { ...initQueryParams }
}

// 列表
const modalRef = ref()
const list = ref<UserInfo[]>([])
const columns: DataTableColumns<UserInfo> = [
  {
    title: '使用者名稱',
    align: 'center',
    key: 'username',
    fixed: 'left',
  },
  {
    title: '昵称',
    align: 'center',
    key: 'nickname',
  },
  {
    title: '年齡',
    align: 'center',
    key: 'age',
  },
  {
    title: '性别',
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
    title: '备注',
    align: 'center',
    key: 'remark',
  },
  {
    title: '状态',
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
          {{ checked: () => '启用', unchecked: () => '禁用' }}
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
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => delteteUser(row)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton
                  size="small"
                  type="error"
                  loading={deleteButtonLoadingMap.value[row.id!]}
                >
                  删除
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
    const { data: result } = await getUserList(filterObjEmptyValues(queryParams.value))
    list.value = result.list.map(item => item.userInfo)
    total.value = result.total
  }

  finally {
    endLoading()
  }
}

/** 刪除用戶 */
async function delteteUser(row: UserInfo) {
  try {
    deleteButtonLoadingMap.value[row.id!] = true

    await deleteUser(row.id!)
    list.value = list.value.filter(item => item.id !== row.id)
    window.$message.success(`已經删除使用者:${row.username}`)
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

/** 分页器 */
function changePage(page: number, size: number) {
  queryParams.value.currentPage = page
  queryParams.value.pageSize = size
  getList()
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
          <n-form-item label="使用者名稱" path="username">
            <n-input v-model:value="queryParams.username" placeholder="请输入" />
          </n-form-item>
          <n-form-item label="暱稱" path="nickname">
            <n-input v-model:value="queryParams.nickname" placeholder="请输入" />
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
              重置
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

      <TableModal ref="modalRef" modal-name="使用者" />
    </n-card>
  </NSpace>
</template>

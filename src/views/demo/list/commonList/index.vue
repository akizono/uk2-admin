<script setup lang="tsx">
import type { User } from '@/api/demo/system'
import type { DataTableColumns, FormInst } from 'naive-ui'

import { fetchUserPage } from '@/api/demo/system'
import { Gender } from '@/constants'
import { useBoolean } from '@/hooks'
import { NButton, NPopconfirm, NSpace, NSwitch, NTag } from 'naive-ui'

import TableModal from './components/TableModal.vue'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)
const { bool: visible, setTrue: openModal } = useBoolean(false)

const initialModel = {
  condition_1: '',
  condition_2: '',
  condition_3: '',
  condition_4: '',
}
const model = ref({ ...initialModel })

const formRef = ref<FormInst | null>()
function sendMail(id?: number) {
  window.$message.success(`刪除用戶id:${id}`)
}
const columns: DataTableColumns<User> = [
  {
    title: '姓名',
    align: 'center',
    key: 'userName',
  },
  {
    title: '年齡',
    align: 'center',
    key: 'age',
  },
  {
    title: '性別',
    align: 'center',
    key: 'gender',
    render: (row: User) => {
      const tagType = {
        0: 'primary',
        1: 'success',
      } as const
      if (row.gender) {
        return (
          <NTag type={tagType[row.gender]}>
            {Gender[row.gender]}
          </NTag>
        )
      }
    },
  },
  {
    title: '信箱',
    align: 'center',
    key: 'email',
  },
  {
    title: '狀態',
    align: 'center',
    key: 'status',
    render: (row: User) => {
      return (
        <NSwitch
          value={row.status}
          checked-value={1}
          unchecked-value={0}
          onUpdateValue={(value: 0 | 1) =>
            handleStatusChange(value, row.id!)}
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
    render: (row: User) => {
      return (
        <NSpace justify="center">
          <NButton
            size="small"
            onClick={() => handleEditTable(row)}
          >
            編輯
          </NButton>
          <NPopconfirm onPositiveClick={() => sendMail(row.id)}>
            {{
              default: () => '確認刪除',
              trigger: () => <NButton size="small">刪除</NButton>,
            }}
          </NPopconfirm>
        </NSpace>
      )
    },
  },
]

const listData = ref<User[]>([])
function handleStatusChange(value: 0 | 1, id: number) {
  const index = listData.value.findIndex(item => item.id === id)
  if (index > -1)
    listData.value[index].status = value
}

onMounted(() => {
  getUserList()
})
async function getUserList() {
  startLoading()
  await fetchUserPage().then((res: any) => {
    listData.value = res.data.list
    endLoading()
  })
}
function changePage(page: number, size: number) {
  window.$message.success(`分頁器:${page},${size}`)
}
function handleResetSearch() {
  model.value = { ...initialModel }
}

  type ModalType = 'add' | 'edit'
const modalType = ref<ModalType>('add')
function setModalType(type: ModalType) {
  modalType.value = type
}

const editData = ref<User | null>(null)
function setEditData(data: User | null) {
  editData.value = data
}

function handleEditTable(row: User) {
  setEditData(row)
  setModalType('edit')
  openModal()
}
function handleAddTable() {
  openModal()
  setModalType('add')
}
</script>

<template>
  <NSpace vertical size="large">
    <n-card>
      <n-form ref="formRef" :model="model" label-placement="left" inline :show-feedback="false">
        <n-flex>
          <n-form-item label="姓名" path="condition_1">
            <n-input v-model:value="model.condition_1" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="年齡" path="condition_2">
            <n-input v-model:value="model.condition_2" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="性別" path="condition_3">
            <n-input v-model:value="model.condition_3" placeholder="請輸入" />
          </n-form-item>
          <n-form-item label="地址" path="condition_4">
            <n-input v-model:value="model.condition_4" placeholder="請輸入" />
          </n-form-item>
          <n-flex class="ml-auto">
            <NButton type="primary" @click="getUserList">
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
    <n-card>
      <NSpace vertical size="large">
        <div class="flex gap-4">
          <NButton type="primary" @click="handleAddTable">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            新建
          </NButton>
          <NButton strong secondary>
            <template #icon>
              <icon-park-outline-afferent />
            </template>
            批次導入
          </NButton>
          <NButton strong secondary class="ml-a">
            <template #icon>
              <icon-park-outline-download />
            </template>
            下載
          </NButton>
        </div>
        <n-data-table :columns="columns" :data="listData" :loading="loading" />
        <Pagination :count="100" @change="changePage" />
        <TableModal v-model:visible="visible" :type="modalType" :modal-data="editData" />
      </NSpace>
    </n-card>
  </NSpace>
</template>

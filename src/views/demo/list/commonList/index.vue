<script setup lang="tsx">
import type { User } from '@/api/demo/system'
import type { DataTableColumns, FormInst } from 'naive-ui'

import { NButton, NPopconfirm, NSpace, NSwitch, NTag } from 'naive-ui'

import { fetchUserPage } from '@/api/demo/system'
import { Gender } from '@/constants'
import { useBoolean } from '@/hooks'
import { $t } from '@/utils'

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
const columns: DataTableColumns<User> = [
  {
    title: $t('demoList.userNameField'),
    align: 'center',
    key: 'userName',
  },
  {
    title: $t('demoList.age'),
    align: 'center',
    key: 'age',
  },
  {
    title: $t('demoList.gender'),
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
    title: $t('demoList.email'),
    align: 'center',
    key: 'email',
  },
  {
    title: $t('demoList.status'),
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
          {{ checked: () => $t('demoList.start'), unchecked: () => $t('demoList.disabled') }}
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
            { $t('demoList.edit') }
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('demoList.confirmDelete'),
              trigger: () => <NButton size="small">{$t('demoList.delete')}</NButton>,
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
  window.$message.success(`${$t('demoList.pager')}:${page},${size}`)
}
function handleResetSearch() {
  model.value = { ...initialModel }
}
function handleDelete(id?: number) {
  listData.value = listData.value.filter(item => item.id !== id)
  window.$message.success(`${$t('demoList.deleteUserId')}:${id}`)
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
          <n-form-item :label="$t('demoList.userNameField')" path="condition_1">
            <n-input v-model:value="model.condition_1" :placeholder="$t('demoList.pleaseEnter')" />
          </n-form-item>
          <n-form-item :label="$t('demoList.age')" path="condition_2">
            <n-input v-model:value="model.condition_2" :placeholder="$t('demoList.pleaseEnter')" />
          </n-form-item>
          <n-form-item :label="$t('demoList.gender')" path="condition_3">
            <n-input v-model:value="model.condition_3" :placeholder="$t('demoList.pleaseEnter')" />
          </n-form-item>
          <n-form-item :label="$t('demoList.address')" path="condition_4">
            <n-input v-model:value="model.condition_4" :placeholder="$t('demoList.pleaseEnter')" />
          </n-form-item>
          <n-flex class="ml-auto">
            <NButton type="primary" @click="getUserList">
              <template #icon>
                <icon-park-outline-search />
              </template>
              {{ $t('demoList.search') }}
            </NButton>
            <NButton strong secondary @click="handleResetSearch">
              <template #icon>
                <icon-park-outline-redo />
              </template>
              {{ $t('demoList.reset') }}
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
            {{ $t('demoList.add') }}
          </NButton>
          <NButton strong secondary>
            <template #icon>
              <icon-park-outline-afferent />
            </template>
            {{ $t('demoList.batchImport') }}
          </NButton>
          <NButton strong secondary class="ml-a">
            <template #icon>
              <icon-park-outline-download />
            </template>
            {{ $t('demoList.download') }}
          </NButton>
        </div>
        <n-data-table :columns="columns" :data="listData" :loading="loading" />
        <Pagination :count="100" @change="changePage" />
        <TableModal v-model:visible="visible" :type="modalType" :modal-data="editData" />
      </NSpace>
    </n-card>
  </NSpace>
</template>

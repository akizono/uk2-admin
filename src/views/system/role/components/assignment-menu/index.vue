<script setup lang="ts">
import type { MenuVO } from '@/api/system/menu'
import type { RoleVO } from '@/api/system/role'

import { MenuApi } from '@/api/system/menu'
import { RoleMenuApi } from '@/api/system/role-menu'
import { useAppStore } from '@/store/'
import { arrayToTree, sortTreeData } from '@/utils/array'
import { ElTree } from 'element-plus'

const appStore = useAppStore()

const modalTitle = ref('')
const modalVisible = ref(false)
const rowData = ref({} as RoleVO)
const loading = ref(true)

/** 選項相關 */
const treeRef = ref()
const defaultProps = { children: 'children', label: 'title', value: 'id' }

const treeList = ref<MenuVO[]>([])
async function getTreeList() {
  const { data: result } = await MenuApi.getMenuPageByLang({
    pageSize: 0,
  })
  treeList.value = sortTreeData(arrayToTree(result.list))
}

/** 選中相關 */
const checkedKeys = ref<string[]>([]) // 選中的數據

async function setChecked() {
  const { data: result } = await RoleMenuApi.getRoleMenuPage({
    pageSize: 0,
    roleId: rowData.value.id,
  })
  checkedKeys.value = result.list.map(item => item.menuId)
  checkedKeys.value.forEach((menuId) => {
    treeRef.value.setChecked(menuId, true, false)
  })
}
function handleAllCheckedChange(value: boolean) {
  treeRef.value.setCheckedNodes(value ? treeList.value : [])
}
function handleMenuExpandChange(value: boolean) {
  const nodes = treeRef.value?.store.nodesMap
  for (const node in nodes) {
    if (nodes[node].expanded === value) {
      continue
    }
    nodes[node].expanded = value
  }
}

async function handleSubmit() {
  const roleId = rowData.value.id
  if (roleId === '1') {
    return window.$message.error('「超級管理員」的權限禁止修改')
  }

  try {
    loading.value = true
    const data = {
      roleId,
      menuIds: [
        ...(treeRef.value.getCheckedKeys(false) as unknown as Array<string>), // 獲得當前選中節點
        ...(treeRef.value.getHalfCheckedKeys() as unknown as Array<string>), // 獲得半選中的父節點
      ],
    }
    await RoleMenuApi.batchUpdate(data)
    window.$message.success('保存成功')
  }
  finally {
    loading.value = false
    modalVisible.value = false
  }
}

defineExpose({
  openModal: async (row: RoleVO) => {
    try {
      modalTitle.value = row.name // 設置模態框的標題
      modalVisible.value = true // 打開模態框

      rowData.value = row // 設置當前行數據

      treeList.value = []
      checkedKeys.value = []

      loading.value = true // 設置loading

      await getTreeList() // 獲取樹形結構
      await setChecked() // 獲取「選中」的數據
    }
    finally {
      loading.value = false
    }
  },
})
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    :title="`${modalTitle} - 菜單&權限`"
    class="max-w-680px w-100%"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <div class="flex justify-between ">
      <div class="w-180px">
        <n-space>
          <n-button-group size="small">
            <n-button type="primary" round @click="handleAllCheckedChange(true)">
              全部選中
            </n-button>
            <n-button type="warning" round @click="handleAllCheckedChange(false)">
              全部取消
            </n-button>
          </n-button-group>
          <n-button-group size="small">
            <n-button type="primary" secondary round @click="handleMenuExpandChange(true)">
              全部展開
            </n-button>
            <n-button type="warning" secondary round @click="handleMenuExpandChange(false)">
              全部折疊
            </n-button>
          </n-button-group>
        </n-space>
      </div>
      <n-scrollbar class="h-[calc(100vh-260px)] flex-1">
        <ElTree
          ref="treeRef"
          :data="treeList"
          :props="defaultProps"
          empty-text="載入中，請稍後..."
          node-key="id"
          show-checkbox
          :class="appStore.colorMode === 'dark' ? 'el-tree-dark' : 'el-tree-light'"
        />
      </n-scrollbar>
    </div>

    <template #action>
      <n-space justify="center">
        <n-button type="primary" :loading="loading" @click="handleSubmit">
          保存
        </n-button>
        <n-button :disabled="loading" @click="modalVisible = false">
          取消
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped lang="scss">

</style>

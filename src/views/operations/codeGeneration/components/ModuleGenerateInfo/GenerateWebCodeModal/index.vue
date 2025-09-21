<script setup lang="tsx">
import type { CodeGenerationVO, EntityAllFieldsVO } from '@/api/operations/codeGeneration'
import type { InitFormData, InitQueryParams } from '@/components/common/DataTable/type'
import type { DataTableColumns } from 'naive-ui'

import { CodeGenerationApi } from '@/api/operations/codeGeneration'
import { DictTypeApi } from '@/api/system/dict-type'
import { useBoolean } from '@/hooks'

const props = defineProps<{
  row: CodeGenerationVO
}>()

const dialog = useDialog()

// const emit = defineEmits(['success'])

defineExpose({
  openModal,
})

// 控制彈出視窗的顯示
const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
// 控制"查看預覽"的loading
const { bool: generatePreviewLoading, setTrue: _startGeneratePreviewLoading, setFalse: _endGeneratePreviewLoading } = useBoolean(false)

// 字典類型選項
const dictTypeOptions = ref<{ label: string, value: string }[]>([])
// 獲取字典類型選項
async function getDictTypeOptions() {
  const { data: result } = await DictTypeApi.getDictTypeList({})
  dictTypeOptions.value = result.list.map(item => ({
    label: item.type,
    value: item.type,
  }))
}

/** 表單數據 */
interface Column {
  title: string
  align: 'left' | 'center' | 'right'
  key: string
  multilingual?: boolean
  copy?: boolean
  fixed?: 'left' | 'right'
  dictType?: string
  render?: string
}
interface FormData {
  webProjectAddress?: string
  componentName?: string
  view: boolean
  edit: boolean
  del: boolean
  search: boolean
  add: boolean
  index: boolean
  pagination: boolean
  columns: Column[]
  initQueryParams: InitQueryParams[]
  initFormData: InitFormData[]
}
const formData = ref<FormData>({
  webProjectAddress: undefined,
  componentName: undefined,

  view: false,
  edit: false,
  del: false,
  search: false,
  add: false,
  index: false,
  pagination: false,

  columns: [],
  initQueryParams: [],
  initFormData: [],
})

/** 查詢參數相關 */
const initQueryParamsTableRef = ref()
const initQueryParamsColumns = ref<DataTableColumns<InitQueryParams>>([
  {
    key: 'name',
    title: '名稱',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-input v-model:value={row.name} />
        </div>
      )
    },
  },
  {
    key: 'value',
    title: '值',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          {/* 注意 提交後端的時候 如果是空字串 會被提前轉換為undefined  */}
          <n-input v-model:value={row.value} placeholder="默認：undefined" />
        </div>
      )
    },
  },
  {
    key: 'inputType',
    title: '輸入類型',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-select
            v-model:value={row.inputType}
            onUpdateValue={(val: string | null) => {
              if (val !== 'select')
                row.dictType = null
            }}
            options={[
              { label: 'pagination', value: 'pagination' },
              { label: 'input', value: 'input' },
              { label: 'input-number', value: 'input-number' },
              { label: 'select', value: 'select' },
            ]}
          />
        </div>
      )
    },
  },
  {
    key: 'label',
    title: 'label',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-input v-model:value={row.label} />
        </div>
      )
    },
  },
  {
    key: 'class',
    title: 'class',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-input v-model:value={row.class} />
        </div>
      )
    },
  },
  {
    key: 'placeholder',
    title: 'placeholder',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-input v-model:value={row.placeholder} />
        </div>
      )
    },
  },
  {
    key: 'multilingual',
    title: '是否開啟多語言',
    width: 150,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-switch v-model:value={row.multilingual} />
        </div>
      )
    },
  },
  {
    key: 'dictType',
    title: '字典類型',
    width: 180,
    render: (row: InitQueryParams) => {
      return (
        <div>
          <n-select
            v-model:value={row.dictType}
            options={dictTypeOptions.value}
            clearable
            disabled={row.inputType !== 'select'}
          />
        </div>
      )
    },
  },
])

/** columns 相關 */
// columns 表格列定義
const columns = ref<DataTableColumns<Column>>([
  {
    key: 'title',
    title: '列名稱',
    width: 150,
    render: (row: Column) => {
      return (
        <div>
          <n-input v-model:value={row.title} />
        </div>
      )
    },
  },
  {
    key: 'align',
    title: '對齊',
    width: 80,
    render: (row: EntityAllFieldsVO) => {
      return (
        <div>
          <n-select
            v-model:value={row.align}
            options={[
              {
                label: '左對齊',
                value: 'left',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右對齊',
                value: 'right',
              },
            ]}
          />
        </div>
      )
    },
  },
  {
    key: 'key',
    title: 'key',
    width: 100,
    render: (row: Column) => {
      return (
        <div>
          <n-input v-model:value={row.key} />
        </div>
      )
    },
  },
  {
    key: 'multilingual',
    title: '多語言',
    width: 60,
    render: (row: Column) => {
      return (
        <div>
          <n-switch v-model:value={row.multilingual} />
        </div>
      )
    },
  },
  {
    key: 'copy',
    title: '複製',
    width: 50,
    render: (row: Column) => {
      return (
        <div>
          <n-switch v-model:value={row.copy} />
        </div>
      )
    },
  },
  {
    key: 'fixed',
    title: '固定',
    width: 80,
    render: (row: Column) => {
      return (
        <div>
          <n-select
            v-model:value={row.fixed}
            clearable
            options={
              [
                {
                  label: 'left',
                  value: 'left',
                },
                {
                  label: 'right',
                  value: 'right',
                },
              ]
            }
          />
        </div>
      )
    },
  },
  {
    key: 'dictType',
    title: '字典類型',
    width: 200,
    render: (row: Column) => {
      return (
        <div>
          <n-select
            v-model:value={row.dictType}
            options={dictTypeOptions.value}
          />
        </div>
      )
    },
  },
  {
    key: 'render',
    title: 'render',
    width: 300,
    render: (row: Column) => {
      return (
        <div>
          <n-button onClick={() => {
            dialog.create({
              title: '編輯渲染函數',
              positiveText: '確定',
              content: () => (
                <div>
                  <div>{`render: (row: MenuVO) => {`}</div>
                  <n-input type="textarea" rows={10} v-model:value={row.render} />
                  <div>{`},`}</div>
                </div>
              ),
            })
          }}
          >
            編輯
          </n-button>
        </div>
      )
    },
  },
])

/** initFormData 相關 */
const initFormDataTableRef = ref()
const initFormDataColumns = ref<DataTableColumns<InitFormData>>([
  {
    key: 'name',
    title: 'name',
    width: 150,
  },
  {
    key: 'value',
    title: 'value',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.value} />
        </div>
      )
    },
  },
  {
    key: 'span',
    title: 'span',
    width: 30,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-select
            v-model:value={row.span}
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ]}
          />
        </div>
      )
    },
  },
  {
    key: 'label',
    title: 'label',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.label} />
        </div>
      )
    },
  },
  {
    key: 'type',
    title: '輸入框類型',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-select
            v-model:value={row.type}
            onUpdateValue={(val: string | null) => {
              if (val !== 'select') {
                // 切換為非 select，刪除 selectOptions 數據（包含本身）
                delete (row as any).selectOptions
              }
            }}
            options={[
              { label: 'input', value: 'input' },
              { label: 'textarea', value: 'textarea' },
              { label: 'input-number', value: 'input-number' },
              { label: 'switch', value: 'switch' },
              { label: 'select', value: 'select' },
            ]}
          />
        </div>
      )
    },
  },
  {
    key: 'inputPrefix',
    title: '輸入框前綴',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.inputPrefix} />
        </div>
      )
    },
  },
  {
    key: 'inputSuffix',
    title: '輸入框後綴',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.inputSuffix} />
        </div>
      )
    },
  },
  {
    key: 'helpInfo',
    title: '幫助提示',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.helpInfo} />
        </div>
      )
    },
  },
  {
    key: 'placeholder',
    title: '輸入框提示文字',
    width: 150,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-input v-model:value={row.placeholder} />
        </div>
      )
    },
  },
  {
    key: 'rulesType',
    title: 'rules.type',
    width: 120,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-select
            v-model:value={row.rulesType}
            options={[
              { label: 'string', value: 'string' },
              { label: 'number', value: 'number' },
              { label: 'boolean', value: 'boolean' },
              { label: 'array', value: 'array' },
              { label: 'object', value: 'object' },
            ]}
          />
        </div>
      )
    },
  },
  {
    key: 'selectOptions',
    title: 'select配置',
    width: 80,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-button
            onClick={() => {
              if (!row.selectOptions) {
                row.selectOptions = {
                  api: '',
                  selectParam: '',
                  itemMapping: {
                    label: '',
                    value: '',
                  },
                }
              }

              dialog.create({
                title: '編輯select配置',
                positiveText: '確定',
                content: () => (
                  <div>
                    <n-form-item label="api:">
                      <n-input v-model:value={row.selectOptions!.api} />
                    </n-form-item>
                    <n-form-item label="selectParam:">
                      <n-input v-model:value={row.selectOptions!.selectParam} />
                    </n-form-item>
                    <n-divider />
                    <n-form-item label="itemMapping:">
                      <n-flex class="w-full" vertical>
                        <div>
                          <span>label:</span>
                          <n-input v-model:value={row.selectOptions!.itemMapping!.label} />
                        </div>
                        <div>
                          <span>value:</span>
                          <n-input v-model:value={row.selectOptions!.itemMapping!.value} />
                        </div>
                      </n-flex>
                    </n-form-item>
                  </div>
                ),
              })
            }}
            disabled={row.type !== 'select'}
          >
            編輯
          </n-button>
        </div>
      )
    },
  },
  {
    key: 'dictType',
    title: '字典類型',
    width: 250,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-select
            v-model:value={row.dictType}
            options={dictTypeOptions.value}
          />
        </div>
      )
    },
  },
  {
    key: 'hidden',
    title: '隱藏',
    width: 60,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-switch v-model:value={row.hidden} />
        </div>
      )
    },
  },
  {
    key: 'multilingual',
    title: '開啟多語言',
    width: 80,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-switch v-model:value={row.multilingual} />
        </div>
      )
    },
  },
  {
    key: 'disableUpdate',
    title: '禁止該欄位進行更新',
    width: 80,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-switch v-model:value={row.disableUpdate} />
        </div>
      )
    },
  },
  {
    key: 'disableEditInput',
    title: '禁止該欄位進行編輯',
    width: 80,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-switch v-model:value={row.disableEditInput} />
        </div>
      )
    },
  },
  {
    key: 'disableAddInput',
    title: '禁止該欄位進行新增',
    width: 80,
    render: (row: InitFormData) => {
      return (
        <div>
          <n-switch v-model:value={row.disableAddInput} />
        </div>
      )
    },
  },
])

// 獲取欄位資料
async function getFields() {
  const { data: result } = await CodeGenerationApi.getEntityAllFields({
    splitName: JSON.stringify(props.row.code.split('-')),
  })

  Object.keys(result).forEach((key) => {
    formData.value.columns.push({
      title: result[key].label,
      align: 'center',
      key,
    })

    formData.value.initQueryParams.push({
      name: key,
      value: undefined,
      inputType: '',
      class: '!w-64',
    })

    formData.value.initFormData.push({
      name: key,
      value: undefined,
      span: 1,
    })
  })
}

/** 生成實體成功 */
// function handleGenerateSuccess() {
//   closeModal()
//   emit('success')
// }

/** 打開彈出視窗 */
async function openModal() {
  showModal()

  await getFields()
  await getDictTypeOptions()
}

/** 關閉彈出視窗 */
function closeModal() {
  hiddenModal()
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalVisible" :mask-closable="false" preset="card" title="生成前端程式碼" class="w-[95%]" :segmented="{
        content: true,
        action: true,
      }" style="max-width: 1800px;"
    >
      <n-spin :show="false" size="large">
        <div class="overflow-y-auto" style="height: calc(100vh - 300px);">
          <NSpace vertical class="flex-1">
            <div id="debug" class="mb-10px">
              <div v-for="key in (['webProjectAddress', 'componentName', 'view', 'edit', 'del', 'search', 'add', 'index', 'pagination'])" :key="key">
                {{ key }}: {{ formData[key as keyof FormData] }}
              </div>
            </div>

            <n-form
              ref="formRef"
              label-placement="left"
              label-align="left"
              :label-width="140"
            >
              <n-grid :cols="24" :x-gap="24" :y-gap="16">
                <n-form-item-grid-item :span="8" label="前端項目地址">
                  <n-input v-model:value="formData.webProjectAddress" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="元件名稱">
                  <n-input v-model:value="formData.componentName" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「查看」按鈕">
                  <n-switch v-model:value="formData.view" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「編輯」按鈕">
                  <n-switch v-model:value="formData.edit" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「刪除」按鈕">
                  <n-switch v-model:value="formData.del" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「搜尋框」">
                  <n-switch v-model:value="formData.search" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「新增」按鈕">
                  <n-switch v-model:value="formData.add" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「序號」">
                  <n-switch v-model:value="formData.index" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="8" label="顯示「分頁」">
                  <n-switch v-model:value="formData.pagination" />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="debug">
                  {{ formData.columns }}
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="columns">
                  <n-data-table ref="columnsTableRef" :data="formData.columns" :columns="columns" size="small" striped />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="debug">
                  {{ formData.initQueryParams }}
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="initQueryParams">
                  <n-data-table ref="initQueryParamsTableRef" :data="formData.initQueryParams" :columns="initQueryParamsColumns" size="small" striped />
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="debug">
                  {{ formData.initFormData }}
                </n-form-item-grid-item>
                <n-form-item-grid-item :span="24" label="initFormData">
                  <n-data-table ref="initFormDataTableRef" :data="formData.initFormData" :columns="initFormDataColumns" size="small" striped />
                </n-form-item-grid-item>
              </n-grid>
            </n-form>
          </NSpace>
        </div>
      </n-spin>

      <template #action>
        <n-space justify="center">
          <n-button type="primary" :loading="generatePreviewLoading">
            查看預覽
          </n-button>
          <n-button :disabled="generatePreviewLoading" @click="closeModal">
            取消
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">

</style>

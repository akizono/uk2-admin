<script setup lang="ts">
import { DictTypeApi } from '@/api/system/dict-type'
import { getValueMap as _getValueMap, getDictData, getDictEnum, getLabelMap as getDictLabelMap } from '@/utils/dict'

const dictKey = ref('')
const options = ref()
const subOptions = ref()
const loading = ref(false)

const data = ref()

async function getAlldict() {
  loading.value = true
  try {
    const { data: result } = await DictTypeApi.getDictTypePageByLang({
      currentPage: 1,
      pageSize: 5,
    })
    options.value = result.list.map((item) => {
      return {
        label: item.name,
        value: item.type,
      }
    })
  }
  finally {
    loading.value = false
  }
}

function changeSelect(type: string) {
  if (type) {
    subOptions.value = getDictData(type).value
    data.value = subOptions.value
  }
}

onMounted(() => {
  getAlldict()
})

function getDict() {
  if (!dictKey.value) {
    return window.$message.warning('請先選擇字典類型')
  }
  data.value = getDictData(dictKey.value).value
}

function getEnum() {
  if (!dictKey.value) {
    return window.$message.warning('請先選擇字典類型')
  }
  data.value = getDictEnum(dictKey.value).value
}

function getValueMap() {
  if (!dictKey.value) {
    return window.$message.warning('請先選擇字典類型')
  }
  data.value = _getValueMap(dictKey.value).value
}

function getLabelMap() {
  if (!dictKey.value) {
    return window.$message.warning('請先選擇字典類型')
  }
  data.value = getDictLabelMap(dictKey.value).value
}

const dictValue = ref()

const dictLabel = computed(() => {
  if (data.value && data.value[dictValue.value]) {
    return data.value[dictValue.value].label
  }
  return '--'
})

const enumValue = ref()

const enumLabel = computed(() => {
  if (data.value && data.value[enumValue.value]) {
    return data.value[enumValue.value]
  }
  return '--'
})
</script>

<template>
  <n-card title="字典範例">
    <n-flex vertical>
      <n-flex>
        <n-select v-model:value="dictKey" class="w-1/3" :options="options" :loading="loading" @update:value="changeSelect" />
        子字典下拉框
        <n-select class="w-1/3" :options="subOptions" />
      </n-flex>
      <n-flex>
        <n-button @click="getDict">
          獲取當前字典數據
        </n-button>
        <n-button @click="getEnum">
          獲取當前字典枚舉
        </n-button>
        <n-button @click="getValueMap">
          獲取當前字典ValueMap
        </n-button>
        <n-button @click="getLabelMap">
          獲取當前字典LabelMap
        </n-button>
      </n-flex>

      <div class="bg-#eee:30 p-10px">
        <NCode
          :code="JSON.stringify(data, null, 2) || ''"
          language="ts" show-line-numbers word-wrap
        />
      </div>

      <n-flex align="center">
        <n-input-number v-model:value="dictValue" :min="0" />
        <n-text type="info">
          Map回顯結果 {{ dictLabel }}
        </n-text>
      </n-flex>
      <n-flex align="center">
        <n-input-number v-model:value="enumValue" :min="0" />
        <n-text type="info">
          Enum回顯結果 {{ enumLabel }}
        </n-text>
      </n-flex>
    </n-flex>
  </n-card>
</template>

<style scoped></style>

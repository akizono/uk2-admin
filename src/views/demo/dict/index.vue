<script setup lang="ts">
import { DictTypeApi } from '@/api/system/dict-type'
import { useDictStore } from '@/store'

const { dict } = useDictStore()

const dictKey = ref('')
const options = ref()
const subOptions = ref()
const currentDict = ref()
const loading = ref(false)

async function getAlldict() {
  loading.value = true
  try {
    const { data: result } = await DictTypeApi.getDictTypePage({
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
  dict(type).then((data) => {
    currentDict.value = data
    subOptions.value = data.data()
  })
}

onMounted(() => {
  getAlldict()
})

const data = ref()

// 字典檢查
function withDictCheck(fn: (dict: any) => any) {
  return async function () {
    if (!currentDict.value) {
      return window.$message.warning('字典還未成功讀取，請稍候')
    }
    return fn(currentDict.value)
  }
}

const getDict = withDictCheck((dict) => {
  data.value = dict.data()
  console.log(data.value)
})

const getEnum = withDictCheck((dict) => {
  data.value = dict.enum()
})

const getValueMap = withDictCheck((dict) => {
  data.value = dict.valueMap()
})

const getLabelMap = withDictCheck((dict) => {
  data.value = dict.labelMap()
})

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

      <pre class="bg-#eee:30">
          {{ data }}
        </pre>

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

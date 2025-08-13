<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const {
  disabled = false,
} = defineProps<Props>()

interface IconList {
  prefix: string
  icons: string[]
  title: string
  total: number
  categories?: Record<string, string[]>
  uncategorized?: string[]
}
const value = defineModel('value', { type: String })

// 包含的圖示庫系列名，更多：https://icon-sets.iconify.design/
const nameList = ['icon-park-outline', 'carbon', 'ant-design']

// 獲取單個圖示庫數據
async function fetchIconList(name: string): Promise<IconList> {
  return await fetch(`https://api.iconify.design/collection?prefix=${name}`).then(res => res.json())
}

// 獲取所有圖示庫數據
async function fetchIconAllList(nameList: string[]) {
  // 並行請求所有圖示列表
  const targets = await Promise.all(nameList.map(fetchIconList))

  // 處理每個返回的圖示數據
  const iconList = targets.map((item) => {
    const icons = [
      ...(item.categories ? Object.values(item.categories).flat() : []),
      ...(item.uncategorized ? Object.values(item.uncategorized).flat() : []),
    ]
    return { ...item, icons }
  })

  // 處理本地圖標
  const svgNames = Object.keys(import.meta.glob('@/assets/svg-icons/*.svg')).map(
    path => path.split('/').pop()?.replace('.svg', ''),
  ).filter(Boolean) as string[] // 過濾掉 undefined 並斷言為 string[]

  // 在數組開頭添加
  iconList.unshift({
    prefix: 'local',
    title: 'Local Icons',
    icons: svgNames,
    total: svgNames.length,
    uncategorized: svgNames,
  })

  return iconList
}

const iconList = shallowRef<IconList[]>([])

onMounted(async () => {
  iconList.value = await fetchIconAllList(nameList)
})

// 當前tab
const currentTab = shallowRef(0)
// 當前tag
const currentTag = shallowRef('')

// 搜索圖示輸入框值
const searchValue = ref('')

// 當前頁數
const currentPage = shallowRef(1)

// 切換tab
function handleChangeTab(index: number) {
  currentTab.value = index
  currentTag.value = ''
  currentPage.value = 1
}

// 選擇分類tag
function handleSelectIconTag(icon: string) {
  currentTag.value = currentTag.value === icon ? '' : icon
  currentPage.value = 1
}

// 包含當前分類或所有圖示列表
const icons = computed(() => {
  if (!iconList.value[currentTab.value])
    return []
  const hasTag = !!currentTag.value
  return hasTag
    ? iconList.value[currentTab.value]?.categories?.[currentTag.value] || [] // 使用可選鏈
    : iconList.value[currentTab.value].icons || []
})

// 符合搜索條件的圖示列表
const filteredIcons = computed(() => {
  return icons.value?.filter(i => i.includes(searchValue.value)) || []
})

// 當前頁顯示的圖示
const visibleIcons = computed(() => {
  return filteredIcons.value.slice((currentPage.value - 1) * 200, currentPage.value * 200)
})

const showModal = ref(false)

// 選擇圖示
function handleSelectIcon(icon: string) {
  value.value = icon
  showModal.value = false
}

// 清除圖示
function clearIcon() {
  value.value = ''
  showModal.value = false
}
</script>

<template>
  <n-input-group disabled>
    <n-button v-if="value" :disabled="disabled" type="primary">
      <template #icon>
        <nova-icon :icon="value" />
      </template>
    </n-button>
    <n-input :value="value" readonly :placeholder="$t('components.iconSelector.inputPlaceholder')" />
    <n-button type="primary" ghost :disabled="disabled" @click="showModal = true">
      {{ $t('common.choose') }}
    </n-button>
  </n-input-group>
  <n-modal
    v-model:show="showModal" preset="card" :title="$t('components.iconSelector.selectorTitle')" size="small" class="w-800px" :bordered="false"
  >
    <template #header-extra>
      <n-button type="warning" size="small" ghost @click="clearIcon">
        {{ $t('components.iconSelector.clearIcon') }}
      </n-button>
    </template>

    <n-tabs :value="currentTab" type="line" animated placement="left" @update:value="handleChangeTab">
      <n-tab-pane v-for="(list, index) in iconList" :key="list.prefix" :name="index" :tab="list.title">
        <n-flex vertical>
          <n-flex size="small">
            <n-tag
              v-for="(_v, k) in list.categories" :key="k"
              :checked="currentTag === k" round checkable size="small"
              @update:checked="handleSelectIconTag(k)"
            >
              {{ k }}
            </n-tag>
          </n-flex>

          <n-input
            v-model:value="searchValue" type="text" clearable
            :placeholder="$t('components.iconSelector.searchPlaceholder')"
          />

          <div>
            <n-flex :size="2">
              <n-el
                v-for="(icon) in visibleIcons" :key="icon"
                class="hover:(text-[var(--primary-color)] ring-1) ring-[var(--primary-color)] p-1 rounded flex-center"
                :title="`${list.prefix}:${icon}`"
                @click="handleSelectIcon(`${list.prefix}:${icon}`)"
              >
                <nova-icon :icon="`${list.prefix}:${icon}`" :size="24" />
              </n-el>
              <n-empty v-if="visibleIcons.length === 0" class="w-full" />
            </n-flex>
          </div>

          <n-flex justify="center">
            <n-pagination
              v-model:page="currentPage"
              :item-count="filteredIcons.length"
              :page-size="200"
            />
          </n-flex>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

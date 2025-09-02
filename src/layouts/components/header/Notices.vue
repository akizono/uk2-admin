<script setup lang="ts">
import { group } from 'radash'

import NoticeList from '../common/NoticeList.vue'

const MassageData = ref<Entity.Message[]>([
  {
    id: 0,
    type: 0,
    title: '恭喜！您的「精鋼長劍」鍛造進度已達40%！',
    icon: 'icon-park-outline:whirlwind',
    tagTitle: '鍛造中',
    tagType: 'info',
    description: '鐵匠正在全力敲打中，即將誕生一把神兵利器！',
    date: '2025-7-15 14:30',
  },
  {
    id: 1,
    type: 0,
    title: '成功附魔！您的裝備獲得「烈焰之力」！',
    icon: 'icon-park-outline:magic',
    tagTitle: '已完成',
    tagType: 'success',
    description: '武器散發出灼熱的紅光，攻擊時有機率觸發火焰爆炸！',
    date: '2025-7-16 09:45',
  },
  {
    id: 2,
    type: 0,
    title: '警告！「龍鱗盔甲」鍛造出現裂痕！',
    icon: 'icon-park-outline:rectangle-tear',
    tagTitle: '緊急',
    tagType: 'warning',
    description: '工匠急需「星塵礦石」進行修復，否則裝備可能損毀！',
    date: '2025-7-17 16:20',
  },
  {
    id: 3,
    type: 0,
    title: '史詩成就！您成功打造出傳說級「諸神黃昏戰鎚」！',
    icon: 'icon-park-outline:crown',
    tagTitle: '傳說裝備',
    tagType: 'error',
    description: '這把戰鎚蘊含著雷霆之力，一擊便能撼動山河，恭喜您成為大師級鐵匠！',
    date: '2025-7-18 20:15',
  },
  {
    id: 4,
    type: 0,
    title: '您的「初學者鍛造工具組」已準備就緒！',
    icon: 'icon-park-outline:tool',
    tagTitle: '可領取',
    description: '快來工坊領取您的第一套工具，開始冒險者的打造之旅吧！',
    date: '2025-7-19 11:00',
  },
  {
    id: 5,
    type: 1,
    title: '來自鐵匠鋪老闆的訊息：兄弟，最近手頭有點緊...',
    icon: 'icon-park-outline:message',
    description: '如果您能資助500金幣，我願意傳授您獨門的「摺疊鍛造術」喔！',
    date: '2025-7-20 13:25',
  },
  {
    id: 6,
    type: 1,
    title: '公會「鋼鐵之心」邀請您參加鍛造大賽！',
    icon: 'icon-park-outline:mail',
    description: '年度競賽即將開始，優勝者可獲得神秘圖紙「永恆之火」！',
    date: '2025-7-21 15:40',
  },
  {
    id: 7,
    type: 2,
    title: '任務更新：收集「巨龍之鱗」x10',
    icon: 'icon-park-outline:flag',
    tagTitle: '進行中',
    description: '這些材料是打造龍鱗盾的關鍵，記得去龍之谷狩獵喔！',
    date: '2025-7-22 18:05',
  },
])
const currentTab = ref(0)
function handleRead(id: number) {
  const data = MassageData.value.find(i => i.id === id)
  if (data)
    data.isRead = true
  window.$message.success(`id: ${id}`)
}
const massageCount = computed(() => {
  return MassageData.value.filter(i => !i.isRead).length
})
const groupMessage = computed(() => {
  return group(MassageData.value, i => i.type)
})
</script>

<template>
  <n-popover placement="bottom" trigger="click" arrow-point-to-center class="!p-0">
    <template #trigger>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <CommonWrapper>
            <n-badge :value="massageCount" :max="99" style="color: unset">
              <icon-park-outline-remind />
            </n-badge>
          </CommonWrapper>
        </template>
        <span>{{ $t('app.notificationsTips') }}</span>
      </n-tooltip>
    </template>
    <n-tabs v-model:value="currentTab" type="line" animated justify-content="space-evenly" class="w-490px">
      <n-tab-pane :name="0">
        <template #tab>
          <n-space class="w-130px" justify="center">
            {{ $t('app.notifications') }}
            <n-badge type="info" :value="groupMessage[0]?.filter(i => !i.isRead).length" :max="99" />
          </n-space>
        </template>
        <NoticeList :list="groupMessage[0]" @read="handleRead" />
      </n-tab-pane>
      <n-tab-pane :name="1">
        <template #tab>
          <n-space class="w-130px" justify="center">
            {{ $t('app.messages') }}
            <n-badge type="warning" :value="groupMessage[1]?.filter(i => !i.isRead).length" :max="99" />
          </n-space>
        </template>
        <NoticeList :list="groupMessage[1]" @read="handleRead" />
      </n-tab-pane>
      <n-tab-pane :name="2">
        <template #tab>
          <n-space class="w-130px" justify="center">
            {{ $t('app.todos') }}
            <n-badge type="error" :value="groupMessage[2]?.filter(i => !i.isRead).length" :max="99" />
          </n-space>
        </template>
        <NoticeList :list="groupMessage[2]" @read="handleRead" />
      </n-tab-pane>
    </n-tabs>
  </n-popover>
</template>

<style scoped></style>

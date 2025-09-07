<script setup lang="ts">
import { group } from 'radash'

import { $t } from '@/utils'

import NoticeList from '../common/NoticeList.vue'

const MassageData = ref<Entity.Message[]>([
  {
    id: 0,
    type: 0,
    title: $t('notices.forgeProgress40Percent'),
    icon: 'icon-park-outline:whirlwind',
    tagTitle: $t('notices.forgeStatusInProgress'),
    tagType: 'info',
    description: $t('notices.forgeFlavorHammering'),
    date: '2025-7-15 14:30',
  },
  {
    id: 1,
    type: 0,
    title: $t('notices.enchantSuccessFire'),
    icon: 'icon-park-outline:magic',
    tagTitle: $t('notices.forgeStatusCompleted'),
    tagType: 'success',
    description: $t('notices.enchantEffectFireExplosion'),
    date: '2025-7-16 09:45',
  },
  {
    id: 2,
    type: 0,
    title: $t('notices.alertEquipmentCrack'),
    icon: 'icon-park-outline:rectangle-tear',
    tagTitle: $t('notices.alertLevelUrgent'),
    tagType: 'warning',
    description: $t('notices.alertRepairMaterial'),
    date: '2025-7-17 16:20',
  },
  {
    id: 3,
    type: 0,
    title: $t('notices.achievementLegendaryHammer'),
    icon: 'icon-park-outline:crown',
    tagTitle: $t('notices.rarityLegendary'),
    tagType: 'error',
    description: $t('notices.achievementFlavorThunder'),
    date: '2025-7-18 20:15',
  },
  {
    id: 4,
    type: 0,
    title: $t('notices.newbieToolkitReady'),
    icon: 'icon-park-outline:tool',
    tagTitle: $t('notices.statusClaimable'),
    description: $t('notices.newbieFlavorAdventure'),
    date: '2025-7-19 11:00',
  },
  {
    id: 5,
    type: 1,
    title: $t('notices.npcBlacksmithMessage'),
    icon: 'icon-park-outline:message',
    description: $t('notices.npcBargainFoldingTech'),
    date: '2025-7-20 13:25',
  },
  {
    id: 6,
    type: 1,
    title: $t('notices.guildEventInvitation'),
    icon: 'icon-park-outline:mail',
    description: $t('notices.eventRewardBlueprint'),
    date: '2025-7-21 15:40',
  },
  {
    id: 7,
    type: 2,
    title: $t('notices.questUpdateDragonScale'),
    icon: 'icon-park-outline:flag',
    tagTitle: $t('notices.questStatusOngoing'),
    description: $t('notices.questHintDragonValley'),
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

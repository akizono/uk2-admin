<script setup lang="ts">
import { useBoolean } from '@/hooks'
import { $t } from '@/utils'
import { NButton, NModal, NSpace } from 'naive-ui'

defineProps<{
  title: string
  width?: string
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)

defineExpose({
  showModal,
  hiddenModal,
})

function closeModal() {
  hiddenModal()
}
</script>

<template>
  <NModal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    :title="title"
    :style="{
      width: width || '700px',
    }"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <slot />

    <template #action>
      <NSpace justify="center">
        <slot name="action">
          <NButton @click="closeModal">
            {{ $t('common.close') }}
          </NButton>
        </slot>
      </NSpace>
    </template>
  </NModal>
</template>

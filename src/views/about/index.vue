<script setup lang="ts">
import lib from '@/../package.json'
import { $t } from '@/utils'

defineOptions({
  name: 'About',
})
</script>

<template>
  <n-space vertical>
    <n-card :title="$t('about.about')">
      UK2-admin是一款基於Vue3+vite+TypeScript+NaiveUI的後台管理模板，力求使用簡約的代碼實現完備功能，降低學習門檻和維護成本，讓大家能早點下班做自己的事情
    </n-card>
    <n-card :title="$t('about.information')">
      <n-descriptions
        label-placement="left"
        bordered
        :column="2"
      >
        <n-descriptions-item label="Github">
          <n-button
            text
            tag="a"
            href="https://github.com/chansee97/nova-admin"
            target="_blank"
            type="primary"
          >
            Github
          </n-button>
        </n-descriptions-item>
        <n-descriptions-item label="Github">
          <n-button
            text
            tag="a"
            href="https://gitee.com/chansee97/nova-admin"
            target="_blank"
            type="primary"
          >
            Gitee
          </n-button>
        </n-descriptions-item>
        <n-descriptions-item :label="$t('about.previewAddress')">
          <n-button
            text
            tag="a"
            href="https://admin-nova.vercel.app/"
            target="_blank"
            type="primary"
          >
            {{ $t('about.previewAddress') }}
          </n-button>
        </n-descriptions-item>
        <n-descriptions-item :label="$t('about.version')">
          <n-tag :bordered="false">
            {{ lib.version }}
          </n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card :title="$t('about.productionEnvironmentDependency')">
      <n-descriptions
        label-placement="left"
        bordered
        :column="4"
      >
        <n-descriptions-item
          v-for="(item, key, index) in lib.dependencies"
          :key="index"
          :label="key"
        >
          {{ item }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card :title="$t('about.developmentEnvironmentDependency')">
      <n-descriptions
        label-placement="left"
        bordered
        :column="4"
      >
        <n-descriptions-item
          v-for="(item, key, index) in lib.devDependencies"
          :key="index"
          :label="key"
        >
          {{ item }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </n-space>
</template>

<style scoped></style>

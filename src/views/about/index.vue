<script setup lang="ts">
import lib from '@/../package.json'

defineOptions({
  name: 'About',
})
</script>

<template>
  <n-space vertical>
    <n-card title="關於">
      UK2-admin是一款基於Vue3+vite+TypeScript+NaiveUI的後台管理模板，力求使用簡約的代碼實現完備功能，降低學習門檻和維護成本，讓大家能早點下班做自己的事情
    </n-card>
    <n-card title="資訊">
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
        <n-descriptions-item label="預覽地址">
          <n-button
            text
            tag="a"
            href="https://admin-nova.vercel.app/"
            target="_blank"
            type="primary"
          >
            預覽地址
          </n-button>
        </n-descriptions-item>
        <n-descriptions-item label="版本">
          <n-tag :bordered="false">
            {{ lib.version }}
          </n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card title="生產環境依賴">
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
    <n-card title="開發環境依賴">
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

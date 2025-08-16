<script setup lang="ts">
import { useAuthStore } from '@/store'

import Chart from './components/chart.vue'

const { user } = useAuthStore()
</script>

<template>
  <n-grid
    :x-gap="16"
    :y-gap="16"
    :cols="3"
    item-responsive
    responsive="screen"
  >
    <!-- 左側主要內容區 - 行動端全寬，桌面端2/3寬 -->
    <n-gi span="3 m:2">
      <n-space
        vertical
        :size="16"
      >
        <!-- 圖表區域 -->
        <n-card style="--n-padding-left: 0;">
          <Chart />
        </n-card>

        <!-- 統計卡片區域 -->
        <n-grid
          :x-gap="16"
          :y-gap="16"
          :cols="4"
          item-responsive
          responsive="screen"
        >
          <n-gi span="2 l:1">
            <n-card>
              <n-thing>
                <template #avatar>
                  <n-el>
                    <n-icon-wrapper :size="46" color="var(--primary-color)" :border-radius="999">
                      <nova-icon :size="26" icon="icon-park-outline:user" />
                    </n-icon-wrapper>
                  </n-el>
                </template>
                <template #header>
                  <n-statistic label="活躍用戶">
                    <n-number-animation show-separator :from="0" :to="12039" />
                  </n-statistic>
                </template>
              </n-thing>
            </n-card>
          </n-gi>
          <n-gi span="2 l:1">
            <n-card>
              <n-thing>
                <template #avatar>
                  <n-el>
                    <n-icon-wrapper :size="46" color="var(--primary-color)" :border-radius="999">
                      <nova-icon :size="26" icon="icon-park-outline:every-user" />
                    </n-icon-wrapper>
                  </n-el>
                </template>
                <template #header>
                  <n-statistic label="用戶">
                    <n-number-animation show-separator :from="0" :to="44039" />
                  </n-statistic>
                </template>
              </n-thing>
            </n-card>
          </n-gi>
          <n-gi span="2 l:1">
            <n-card>
              <n-thing>
                <template #avatar>
                  <n-el>
                    <n-icon-wrapper :size="46" color="var(--primary-color)" :border-radius="999">
                      <nova-icon :size="26" icon="icon-park-outline:preview-open" />
                    </n-icon-wrapper>
                  </n-el>
                </template>
                <template #header>
                  <n-statistic label="瀏覽量">
                    <n-number-animation show-separator :from="0" :to="551039" />
                  </n-statistic>
                </template>
              </n-thing>
            </n-card>
          </n-gi>
          <n-gi span="2 l:1">
            <n-card>
              <n-thing>
                <template #avatar>
                  <n-el>
                    <n-icon-wrapper :size="46" color="var(--primary-color)" :border-radius="999">
                      <nova-icon :size="26" icon="icon-park-outline:star" />
                    </n-icon-wrapper>
                  </n-el>
                </template>
                <template #header>
                  <n-statistic label="收藏數">
                    <n-number-animation show-separator :from="0" :to="7739" />
                  </n-statistic>
                </template>
              </n-thing>
            </n-card>
          </n-gi>
        </n-grid>
        <n-card title="動態">
          <template #header-extra>
            <n-button
              type="primary"
              quaternary
            >
              更多
            </n-button>
          </template>
          <n-list hoverable>
            <n-list-item>
              <template #prefix>
                <n-avatar
                  round
                  :size="48"
                  :src="user?.avatar"
                />
              </template>
              <n-thing
                title="沙發"
                title-extra="09/29/2022"
                description="論壇或帖子中第一個回復的網友，象徵“搶占最佳位置”。衍生詞“板凳”（第二回復）、“地板”（第三回復）。"
              />
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-avatar
                  round
                  :size="48"
                  :src="user?.avatar"
                />
              </template>
              <n-thing
                title="orz"
                title-extra="09/29/2022"
                description="象形文字，模擬人跪拜的姿勢，表示“服了”“崩潰”或“膜拜”。變體包括“OTL”“囧rz”。"
              />
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-avatar
                  round
                  :size="48"
                  :src="user?.avatar"
                />
              </template>
              <n-thing
                title="悲劇"
                title-extra="09/29/2022"
                description="諧音“悲劇”，用生活物品代指負面情緒，如“人生就像茶几，上面擺滿了悲劇”。"
              />
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-avatar
                  round
                  :size="48"
                  :src="user?.avatar"
                />
              </template>
              <n-thing
                title="醬紫"
                title-extra="09/29/2022"
                description="諧音“這樣子”，源自台灣腔普通話的變體發音，後成為賣萌用語。"
              />
            </n-list-item>
          </n-list>
        </n-card>
      </n-space>
    </n-gi>

    <!-- 右側邊欄 - 行動端全寬，桌面端1/3寬 -->
    <n-gi span="3 m:1">
      <n-space
        vertical
        :size="16"
      >
        <n-card title="公告">
          <template #header-extra>
            <n-button
              type="primary"
              quaternary
            >
              更多
            </n-button>
          </template>
          <n-list>
            <n-list-item>
              <template #prefix>
                <n-tag
                  :bordered="false"
                  type="info"
                  size="small"
                >
                  通知
                </n-tag>
              </template>
              <n-button text>
                全服維護中，預計14:00開服。
              </n-button>
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-tag
                  :bordered="false"
                  type="success"
                  size="small"
                >
                  消息
                </n-tag>
              </template>
              <n-button text>
                新版本上線，新增跨服戰場！
              </n-button>
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-tag
                  :bordered="false"
                  type="warning"
                  size="small"
                >
                  活動
                </n-tag>
              </template>
              <n-button text>
                限時雙倍經驗，今晚20:00開跑！
              </n-button>
            </n-list-item>
          </n-list>
        </n-card>
        <!-- 訂單和待辦統計 -->
        <n-grid
          :x-gap="16"
          :y-gap="16"
          :cols="2"
        >
          <!-- 行動端和桌面端都是每行2個 -->
          <n-gi :span="1">
            <n-card>
              <n-flex vertical align="center">
                <n-text depth="3">
                  訂單數
                </n-text>
                <n-icon-wrapper :size="46" :border-radius="999">
                  <nova-icon :size="26" icon="icon-park-outline:all-application" />
                </n-icon-wrapper>
                <n-text strong class="text-2xl">
                  1,234,123
                </n-text>
              </n-flex>
            </n-card>
          </n-gi>
          <n-gi :span="1">
            <n-card>
              <n-flex vertical align="center">
                <n-text depth="3">
                  待辦
                </n-text>
                <n-el>
                  <n-icon-wrapper :size="46" color="var(--warning-color)" :border-radius="999">
                    <nova-icon :size="26" icon="icon-park-outline:list-bottom" />
                  </n-icon-wrapper>
                </n-el>
                <n-text strong class="text-2xl">
                  78
                </n-text>
              </n-flex>
            </n-card>
          </n-gi>
        </n-grid>
        <n-card title="任務進度">
          <n-timeline>
            <n-timeline-item content="啊" />
            <n-timeline-item
              type="success"
              title="成功"
              content="哪裡成功"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="error"
              content="哪裡錯誤"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="warning"
              title="警告"
              content="哪裡警告"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="info"
              title="資訊"
              content="是的"
              time="2018-04-03 20:46"
              line-type="dashed"
            />
            <n-timeline-item content="啊" />
          </n-timeline>
        </n-card>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<style scoped></style>

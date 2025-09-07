<script setup lang="ts">
import { useAuthStore } from '@/store'
import { $t } from '@/utils'

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
                  <n-statistic :label="$t('workbench.activeUsers')">
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
                  <n-statistic :label="$t('workbench.user')">
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
                  <n-statistic :label="$t('workbench.viewCount')">
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
                  <n-statistic :label="$t('workbench.numberOfFavorites')">
                    <n-number-animation show-separator :from="0" :to="7739" />
                  </n-statistic>
                </template>
              </n-thing>
            </n-card>
          </n-gi>
        </n-grid>
        <n-card :title="$t('workbench.dynamic')">
          <template #header-extra>
            <n-button
              type="primary"
              quaternary
            >
              {{ $t('workbench.more') }}
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
                :title="$t('workbench.sofa')"
                title-extra="09/29/2022"
                :description="$t('workbench.forum')"
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
                :description="$t('workbench.orz')"
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
                :title="$t('workbench.tragedy')"
                title-extra="09/29/2022"
                :description="$t('workbench.tragedyPlace')"
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
                :title="$t('workbench.sauce')"
                title-extra="09/29/2022"
                :description="$t('workbench.thisWay')"
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
        <n-card :title="$t('workbench.announcement')">
          <template #header-extra>
            <n-button
              type="primary"
              quaternary
            >
              {{ $t('workbench.more') }}
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
                  {{ $t('workbench.notification') }}
                </n-tag>
              </template>
              <n-button text>
                {{ $t('workbench.maintenance') }}
              </n-button>
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-tag
                  :bordered="false"
                  type="success"
                  size="small"
                >
                  {{ $t('workbench.message') }}
                </n-tag>
              </template>
              <n-button text>
                {{ $t('workbench.newVersion') }}
              </n-button>
            </n-list-item>
            <n-list-item>
              <template #prefix>
                <n-tag
                  :bordered="false"
                  type="warning"
                  size="small"
                >
                  {{ $t('workbench.activity') }}
                </n-tag>
              </template>
              <n-button text>
                {{ $t('workbench.limitedTime') }}
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
                  {{ $t('workbench.orderCount') }}
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
                  {{ $t('workbench.todo') }}
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
        <n-card :title="$t('workbench.taskProgress')">
          <n-timeline>
            <n-timeline-item :content="$t('workbench.a')" />
            <n-timeline-item
              type="success"
              :title="$t('workbench.success')"
              :content="$t('workbench.successPlace')"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="error"
              :content="$t('workbench.error')"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="warning"
              :title="$t('workbench.warning')"
              :content="$t('workbench.warningPlace')"
              time="2018-04-03 20:46"
            />
            <n-timeline-item
              type="info"
              :title="$t('workbench.information')"
              :content="$t('workbench.yes')"
              time="2018-04-03 20:46"
              line-type="dashed"
            />
            <n-timeline-item :content="$t('workbench.a')" />
          </n-timeline>
        </n-card>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<style scoped></style>

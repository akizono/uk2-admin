<script setup lang="ts">
import { $t } from '@/utils'

import Delete from './components/Delete.vue'
import DownLoad from './components/DownLoad.vue'
import DownLoadWithProgress from './components/DownLoadWithProgress.vue'
import Env from './components/Env.vue'
import FailedRequest from './components/FailedRequest.vue'
import FormPost from './components/FormPost.vue'
import Get from './components/Get.vue'
import NoToken from './components/NoToken.vue'
import Post from './components/Post.vue'
import Put from './components/Put.vue'

const msg = ref()
function handleUpdate(data: any) {
  msg.value = data
}
</script>

<template>
  <n-card :title="$t('fetch.title')">
    <n-split direction="horizontal" :max="0.75" :min="0.25">
      <template #1>
        <div class="grid grid-cols-3 gap-2 p-2">
          <Env @update="handleUpdate" />
          <Get @update="handleUpdate" />
          <Post @update="handleUpdate" />
          <FormPost @update="handleUpdate" />
          <Delete @update="handleUpdate" />
          <Put @update="handleUpdate" />
          <NoToken @update="handleUpdate" />
          <DownLoad @update="handleUpdate" />
          <DownLoadWithProgress class="col-span-2" @update="handleUpdate" />
          <FailedRequest @update="handleUpdate" />
        </div>
      </template>
      <template #2>
        <div class="bg-#eee:30 p-10px">
          <NCode
            :code="JSON.stringify(msg, null, 2) || ''"
            language="ts" show-line-numbers word-wrap
          />
        </div>
      </template>
    </n-split>
  </n-card>
</template>

<style scoped></style>

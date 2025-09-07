import type { RouteRecordRaw } from 'vue-router'

import { $t } from '@/utils'

/* 頁面中的一些固定路由，錯誤頁等 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/appRoot',
    children: [
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'), // 注意這裡要帶上 文件後綴.vue
    meta: {
      title: `${$t('route.login')}`,
      withoutTab: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403/index.vue'),
    meta: {
      title: $t('route.userAsNoPermission'),
      withoutTab: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404/index.vue'),
    meta: {
      title: $t('route.notFound'),
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500/index.vue'),
    meta: {
      title: $t('route.serverError'),
      icon: 'icon-park-outline:close-wifi',
      withoutTab: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404/index.vue'),
    name: 'notFound',
    meta: {
      title: $t('route.notFound'),
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },
]

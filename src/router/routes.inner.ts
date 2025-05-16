import type { RouteRecordRaw } from 'vue-router'

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
      title: '登錄',
      withoutTab: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403/index.vue'),
    meta: {
      title: '用戶無權限',
      withoutTab: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404/index.vue'),
    meta: {
      title: '找不到頁面',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500/index.vue'),
    meta: {
      title: '伺服器錯誤',
      icon: 'icon-park-outline:close-wifi',
      withoutTab: true,
    },
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error/error/index.vue'),
    meta: {
      title: '錯誤頁面',
      icon: 'icon-park-outline:close-wifi',
      withoutTab: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404/index.vue'),
    name: '404',
    meta: {
      title: '找不到頁面',
      icon: 'icon-park-outline:ghost',
      withoutTab: true,
    },
  },

]

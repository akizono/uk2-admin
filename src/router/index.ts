import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { routes } from './routes.inner'

const { VITE_ROUTE_MODE = 'hash', VITE_BASE_PATH } = import.meta.env
export const router = createRouter({
  history: VITE_ROUTE_MODE === 'hash' ? createWebHashHistory(VITE_BASE_PATH) : createWebHistory(VITE_BASE_PATH),
  routes,
})
// 安裝vue路由
export async function installRouter(app: App) {
  // 添加路由守衛
  setupRouterGuard(router)
  app.use(router)
  await router.isReady() // https://router.vuejs.org/zh/api/index.html#isready
}

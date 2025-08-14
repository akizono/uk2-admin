import type { App } from 'vue'

import { installRouter } from '@/router'
import { installPinia } from '@/store'

import AppVue from './App.vue'
import AppLoading from './components/common/AppLoading.vue'

async function setupApp() {
  // 載入全局loading載入狀態
  const appLoading = createApp(AppLoading)
  appLoading.mount('#appLoading')

  // 創建vue實例
  const app = createApp(AppVue)

  // 註冊模組Pinia
  await installPinia(app)

  // 註冊模組 Vue-router
  await installRouter(app)

  /* 註冊模組 指令/靜態資源 */
  Object.values(
    import.meta.glob<{ install: (app: App) => void }>('./modules/*.ts', {
      eager: true,
    }),
  ).map(i => app.use(i))

  // 卸載載入動畫
  appLoading.unmount()

  // 掛載
  app.mount('#app')
}

setupApp()

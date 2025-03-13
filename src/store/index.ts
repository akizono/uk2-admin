import type { App } from 'vue'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export * from './app/index'
export * from './router'

export * from './model/auth/'
export * from './model/dict/'
export * from './model/tab/'

export function installPinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}

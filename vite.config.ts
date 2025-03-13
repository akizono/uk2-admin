import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'

import { createVitePlugins } from './build/plugins'
import { createViteProxy } from './build/proxy'
import { serviceConfig } from './service.config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根據當前工作目錄中的 `mode` 載入 .env 文件
  const env = loadEnv(mode, __dirname, '') as ImportMetaEnv
  const envConfig = serviceConfig[mode as ServiceEnvType]
  return {
    base: env.VITE_BASE_PATH,
    plugins: createVitePlugins(env),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      proxy:
        env.VITE_HTTP_PROXY === 'Y' ? createViteProxy(envConfig) : undefined,
    },
    build: {
      target: 'esnext',
      reportCompressedSize: false, // 啟用/禁用 gzip 壓縮大小報告
    },
    optimizeDeps: {
      include: ['echarts', 'md-editor-v3', 'quill'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  }
})

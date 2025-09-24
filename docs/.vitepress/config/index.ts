import { defineConfig } from 'vitepress'

import { enUSConfig } from './enUS'
import { zhTWConfig } from './zhTW'

export default defineConfig({
  srcDir: 'document',

  // 默認語言為 enUS
  ...enUSConfig,

  // 多語言配置
  locales: {
    enUS: {
      label: 'English',
      // lang: 'en-US',
      link: '/enUS/',
      ...enUSConfig,
    },
    zhTW: {
      label: '繁體中文',
      // lang: 'zh-TW',
      link: '/zhTW/',
      ...zhTWConfig,
    },
  },
})

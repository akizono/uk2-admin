import type { DefaultTheme } from 'vitepress'

import { shared } from './shared'

export const zhTWConfig = {
  ...shared,
  lang: 'zh-TW',

  themeConfig: {
    ...shared.themeConfig,

    nav: [
      { text: '首頁', link: '/zhTW/' },
      { text: '前端指南', link: '/zhTW/web-guide/guide/introduction' },
      { text: '開發配置', link: '/zhTW/dev/vc-plugins' },
    ],

    sidebar: {
      '/zhTW/web-guide/': [
        {
          text: '指南',
          items: [
            { text: '介紹', link: '/zhTW/web-guide/guide/introduction' },
          ],
        },
        {
          text: '基本配置',
          items: [
            { text: '請求服務配置', link: '/zhTW/web-guide/basic-config/service' },
            { text: '路由和選單', link: '/zhTW/web-guide/basic-config/routers-menus' },
            { text: '權限控制', link: '/zhTW/web-guide/basic-config/permission-control' },
            { text: '自訂主題', link: '/zhTW/web-guide/basic-config/custom-theme' },
            { text: '環境變數', link: '/zhTW/web-guide/basic-config/env-variable' },
          ],
        },
        {
          text: '擴展使用',
          items: [
            { text: '使用圖示', link: '/zhTW/web-guide/extended-use/use-icons' },
            { text: '國際化(i18n)', link: '/zhTW/web-guide/extended-use/i18n' },
            { text: 'UnoCSS', link: '/zhTW/web-guide/extended-use/unocss' },
          ],
        },
      ],
      '/zhTW/dev/': [
        {
          text: '開發工具',
          items: [
            { text: 'VSCode 插件推薦', link: '/zhTW/dev/vc-plugins' },
          ],
        },
        {
          text: '開發環境',
          items: [
            { text: 'Git', link: '/zhTW/dev/git' },
            { text: 'Node.js', link: '/zhTW/dev/nodejs' },
            { text: 'MySQL', link: '/zhTW/dev/mysql' },
          ],
        },
      ],
    },
  } as DefaultTheme.Config,
}
